import { createClient } from "@/integrations/supabase/server";
import { appendToSheet } from "@/integrations/google-sheets/client";
import { NextResponse } from "next/server";

const TABLE_NAME = "consulting-batch1-26-27-submissions";
const SHEET_TAB = process.env.GOOGLE_SHEETS_CONSULTING_2627_TAB || "Consulting Cycle 1 Oprec";

// The checkbox list arrives comma separated. "Other" carries a free text answer
// in its own field, which is folded back in here so the whole answer lives in
// one column, readable as "Instagram, Other: campus expo".
function formatHearAboutUs(sources, other) {
  const selected = String(sources || "")
    .split(",")
    .map((source) => source.trim())
    .filter(Boolean);

  const otherText = String(other || "").trim();

  return selected
    .map((source) => (source === "Other" && otherText ? `Other: ${otherText}` : source))
    .join(", ");
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Initialize Supabase client
    const supabase = createClient();

    // Prepare submission data matching slide6 formData structure
    const submissionData = {
      // Personal Information
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      faculty: formData.get("faculty"),
      major: formData.get("major"),
      batch: formData.get("batch"),
      gpa: formData.get("gpa") ? Number.parseFloat(formData.get("gpa")) : null,
      activeStudent: formData.get("activeStudent") === "true",

      // Alumni Information
      is180DCAlumni: formData.get("is180DCAlumni") === "true",
      pastPosition: formData.get("pastPosition") || "",
      pastBatch: formData.get("pastBatch") || "",

      // How many positions the applicant asked for
      onePosition: formData.get("onePosition") === "true",
      twoPositions: formData.get("twoPositions") === "true",

      // Division choices (Consulting, Knowledge Team)
      firstChoice: formData.get("firstChoice"),
      secondChoice: formData.get("secondChoice") || "",

      // Role within each division. "openToAnalyst" is a Yes/No that only
      // Project Leader applicants are asked, so it is blank for everyone else.
      first_role: formData.get("first_role"),
      first_openToAnalyst: formData.get("first_openToAnalyst") || "",
      first_documentLink: formData.get("first_documentLink"),
      first_cvLink: formData.get("first_cvLink"),

      second_role: formData.get("second_role") || "",
      second_openToAnalyst: formData.get("second_openToAnalyst") || "",
      second_documentLink: formData.get("second_documentLink") || "",
      second_cvLink: formData.get("second_cvLink") || "",

      // Flat columns kept from before divisions existed, so the admin dashboard
      // and any existing exports keep working without knowing about them.
      firstChoicePosition: formData.get("first_role"),
      secondChoicePosition: formData.get("second_role") || "",
      documentLink: formData.get("first_documentLink"),
      cvLink: formData.get("first_cvLink"),

      // Social Media Requirements (matching slide6 field names)
      twibbonPost: formData.get("twibbonPost"),
      instagramProofLink: formData.get("instagramProofLink"),

      // Additional fields from slide6
      hearAboutUs: formatHearAboutUs(formData.get("hearAboutUs"), formData.get("hearAboutUsOther")),
      consentAgreed: formData.get("consentAgreed") === "true",

      // Meta Information
      user_agent: request.headers.get("user-agent"),
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        request.ip ||
        "unknown",
      submitted_at: new Date().toISOString(),
    };

    console.log("Submitting to table:", TABLE_NAME);
    console.log("Submission data:", submissionData);

    // Validate required fields based on slide6 validation
    if (
      !submissionData.name ||
      !submissionData.email ||
      !submissionData.batch ||
      !submissionData.phone ||
      !submissionData.faculty ||
      !submissionData.major ||
      !submissionData.gpa ||
      submissionData.activeStudent === undefined ||
      !submissionData.firstChoice ||
      !submissionData.first_role ||
      !submissionData.first_documentLink ||
      !submissionData.first_cvLink ||
      !submissionData.twibbonPost ||
      !submissionData.instagramProofLink ||
      !submissionData.hearAboutUs?.length ||
      !submissionData.consentAgreed
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields. Please complete all required information.",
        },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        {
          error: "Server configuration error",
        },
        { status: 500 }
      );
    }

    // Test Supabase connection
    try {
      const { data: testData, error: testError } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .limit(1);

      console.log("Supabase connection test - data:", testData, "error:", testError);

      if (testError) {
        console.error("Supabase connection test failed:", testError);
        return NextResponse.json(
          {
            error: `Database connection failed: ${testError.message}`,
            details: testError,
          },
          { status: 500 }
        );
      }
    } catch (connError) {
      console.error("Supabase connection error:", connError);
      return NextResponse.json(
        {
          error: `Database connection error: ${connError.message}`,
        },
        { status: 500 }
      );
    }

    console.log("Attempting insert with data:", JSON.stringify(submissionData, null, 2));

    const { data, error } = await supabase.from(TABLE_NAME).insert([submissionData]);

    console.log("Supabase response - data:", data);
    console.log("Supabase response - error:", error);

    if (error && Object.keys(error).length > 0) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: error.message || "Failed to save data",
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Mirror the row into Google Sheets so HR can follow applications live.
    // Runs after the insert, and never rethrows: Supabase is the source of
    // truth, so a Sheets outage must not fail a submission the applicant has
    // already completed.
    try {
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
      if (spreadsheetId) {
        const sheetRow = [
          submissionData.submitted_at,
          submissionData.name,
          submissionData.email,
          submissionData.batch,
          submissionData.phone,
          submissionData.faculty,
          submissionData.major,
          submissionData.gpa?.toString() || "",
          submissionData.activeStudent ? "Yes" : "No",
          submissionData.is180DCAlumni ? "Yes" : "No",
          submissionData.pastPosition || "",
          submissionData.pastBatch || "",
          submissionData.firstChoice,
          submissionData.first_role,
          submissionData.first_openToAnalyst || "N/A",
          submissionData.first_documentLink,
          submissionData.first_cvLink,
          submissionData.secondChoice || "No second choice",
          submissionData.second_role || "",
          submissionData.second_openToAnalyst || "N/A",
          submissionData.second_documentLink || "",
          submissionData.second_cvLink || "",
          submissionData.twibbonPost,
          submissionData.instagramProofLink,
          submissionData.hearAboutUs || "",
          submissionData.consentAgreed ? "Yes" : "No",
          submissionData.ip_address,
          submissionData.user_agent,
        ];

        await appendToSheet(spreadsheetId, `${SHEET_TAB}!A:AB`, [sheetRow]);
        console.log("Successfully submitted to Google Sheets");
      } else {
        console.warn("Google Sheets ID not configured, skipping Google Sheets submission");
      }
    } catch (sheetsError) {
      console.error("Failed to submit to Google Sheets:", sheetsError);
    }

    console.log("Form submitted successfully:", data);
    return NextResponse.json(
      { success: true, message: "Application submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "An internal server error occurred" },
      { status: 500 }
    );
  }
}
