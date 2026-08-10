"use client";

import { Button } from "@/components/elements/Form/button";
import { ChevronRight, User, GraduationCap, Briefcase, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

const Slide6 = ({ formData, onSubmit, isSubmitting }) => {
  const isValid =
    formData.name &&
    formData.email &&
    formData.batch &&
    formData.phone &&
    formData.faculty &&
    formData.major &&
    formData.gpa &&
    formData.activeStudent !== undefined &&
    formData.firstChoice &&
    formData.first_role &&
    formData.first_documentLink &&
    formData.first_cvLink &&
    // Project Leader applicants must have answered whether they would accept
    // Project Analyst instead; every other role skips the question entirely.
    (formData.first_role !== "Project Leader" || formData.first_openToAnalyst) &&
    (!formData.secondChoice ||
      (formData.second_role &&
        formData.second_documentLink &&
        formData.second_cvLink &&
        (formData.second_role !== "Project Leader" || formData.second_openToAnalyst))) &&
    formData.twibbonPost &&
    formData.instagramProofLink &&
    formData.hearAboutUs?.length > 0 &&
    formData.consentAgreed;
  // formData.registrationProofLink &&
  // formData.consentConsultingAgreed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    // Call the parent's submit handler
    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="font-avenir-black mt-2 mb-1 text-2xl leading-snug text-green-300 lg:text-3xl">
          Review Your Application
        </h2>
        <p className="font-lato-regular text-gray-600">
          Please review all information before submitting your application
        </p>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <User className="h-3 w-3 text-white" />
            </div>
            Personal Information
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Full Name:
            </span>
            <p className="font-lato-regular text-gray-600">{formData.name || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Email:</span>
            <p className="font-lato-regular text-gray-600">{formData.email || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Batch:</span>
            <p className="font-lato-regular text-gray-600">{formData.batch || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Phone Number:
            </span>
            <p className="font-lato-regular text-gray-600">{formData.phone || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Faculty:</span>
            <p className="font-lato-regular text-gray-600">{formData.faculty || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Major:</span>
            <p className="font-lato-regular text-gray-600">{formData.major || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Current GPA:
            </span>
            <p className="font-lato-regular text-gray-600">{formData.gpa || "Not provided"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Active UGM Student:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.activeStudent ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Alumni Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <GraduationCap className="h-3 w-3 text-white" />
            </div>
            Alumni Information
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              180DC UGM Alumni:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.is180DCAlumni === true
                ? "Yes"
                : formData.is180DCAlumni === false
                  ? "No"
                  : "Not specified"}
            </p>
          </div>
          {formData.is180DCAlumni && (
            <>
              <div>
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Past Position:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.pastPosition || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Past Batch:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.pastBatch || "Not provided"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Position & Motivation */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <Briefcase className="h-3 w-3 text-white" />
            </div>
            Position & Motivation
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              First Choice Division:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.firstChoice || "Not provided"}
            </p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              First Choice Role:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.first_role || "Not provided"}
            </p>
          </div>
          {formData.first_role === "Project Leader" && (
            <div className="md:col-span-2">
              <span className="font-avenir-regular text-sm font-medium text-gray-700">
                Open to Project Analyst instead:
              </span>
              <p className="font-lato-regular text-gray-600">
                {formData.first_openToAnalyst || "Not provided"}
              </p>
            </div>
          )}
          <div className="md:col-span-1">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Motivation Document:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.first_documentLink ? (
                <Link
                  href={formData.first_documentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Document
                </Link>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
          <div className="md:col-span-1">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              CV (McKinsey Format):
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.first_cvLink ? (
                <Link
                  href={formData.first_cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View CV
                </Link>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
        </div>

        {/* Second choice, only for applicants who asked for two positions. */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          {formData.secondChoice ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Second Choice Division:
                </span>
                <p className="font-lato-regular text-gray-600">{formData.secondChoice}</p>
              </div>
              <div>
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Second Choice Role:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.second_role || "Not provided"}
                </p>
              </div>
              {formData.second_role === "Project Leader" && (
                <div className="md:col-span-2">
                  <span className="font-avenir-regular text-sm font-medium text-gray-700">
                    Open to Project Analyst instead:
                  </span>
                  <p className="font-lato-regular text-gray-600">
                    {formData.second_openToAnalyst || "Not provided"}
                  </p>
                </div>
              )}
              <div className="md:col-span-1">
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Motivation Document:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.second_documentLink ? (
                    <Link
                      href={formData.second_documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:underline"
                    >
                      View Document
                    </Link>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <div className="md:col-span-1">
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  CV (McKinsey Format):
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.second_cvLink ? (
                    <Link
                      href={formData.second_cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:underline"
                    >
                      View CV
                    </Link>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <span className="font-avenir-regular text-sm font-medium text-gray-700">
                Second Choice Division:
              </span>
              <p className="font-lato-regular text-gray-600">No second choice</p>
            </div>
          )}
        </div>
      </div>

      {/* Documents & Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <Upload className="h-3 w-3 text-white" />
            </div>
            Documents & Information
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Twibbon Post:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.twibbonPost ? (
                <Link
                  href={formData.twibbonPost}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Post
                </Link>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Instagram Story Proof:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.instagramProofLink ? (
                <Link
                  href={formData.instagramProofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Proof
                </Link>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
          {/* <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Consulting Day Registration Proof:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.registrationProofLink ? (
                <Link
                  href={formData.registrationProofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Registration Proof
                </Link>
              ) : (
                "Not provided"
              )}
            </p>
          </div> */}
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              How did you hear about us:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.hearAboutUs?.length > 0
                ? formData.hearAboutUs
                    .map((source) =>
                      source === "Other" && formData.hearAboutUsOther
                        ? `Other: ${formData.hearAboutUsOther}`
                        : source
                    )
                    .join(", ")
                : "Not provided"}
            </p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Consent Agreement:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.consentAgreed ? "Agreed" : "Not agreed"}
            </p>
          </div>
          {/* <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Consent Consulting Agreement:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.consentConsultingAgreed ? "Agreed" : "Not agreed"}
            </p>
          </div> */}
        </div>
      </div>

      {/* Validation Warning */}
      {!isValid && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600">
              <span className="text-xs font-bold text-white">!</span>
            </div>
            <p className="font-avenir-regular text-sm font-medium text-red-800">
              Please complete all required fields before submitting your application.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="font-avenir-regular disabled:text-black-300 flex items-center gap-2 bg-green-300 text-white transition-all duration-200 hover:scale-105 hover:bg-green-300/90 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Slide6;
