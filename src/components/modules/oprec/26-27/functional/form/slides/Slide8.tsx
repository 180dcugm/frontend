"use client";

import { Button } from "@/components/elements/Form/button";
import { ChevronRight, User, GraduationCap, Briefcase, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

const Slide8 = ({ formData, onSubmit, isSubmitting }) => {
  // Updated validation to match exact formData structure
  const isValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.faculty &&
    formData.major &&
    formData.batch &&
    formData.gpa &&
    formData.firstChoice &&
    formData.first_cvLink &&
    formData.first_documentLink &&
    formData.twibbonPostLink &&
    formData.twibbonProofLink &&
    formData.hearAboutUs?.length > 0 &&
    // formData.unlockedAcknowledged &&  // 180UNLOCKED step disabled
    formData.consentAgreed;

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
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Batch:</span>
            <p className="font-lato-regular text-gray-600">{formData.batch || "Not provided"}</p>
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
              <User className="h-3 w-3 text-white" />
            </div>
            180DC Alumni Information
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              180DC Alumni Status:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.is180DCAlumni === true
                ? "Yes, former member"
                : formData.is180DCAlumni === false
                  ? "No, not a former member"
                  : "No, not a former member"}
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
                  Past Batch/Year:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.pastBatch || "Not provided"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Position Preferences */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <GraduationCap className="h-3 w-3 text-white" />
            </div>
            Position Preferences
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              First Choice:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.firstChoice || "Not provided"}
            </p>
          </div>

          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Second Choice:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.secondChoice || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* First Choice Documents */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <Briefcase className="h-3 w-3 text-white" />
            </div>
            First Choice: {formData.firstChoice || "Not selected"}
          </h3>
        </div>
        <div className="space-y-4">
          {/* Division and Role Information */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-avenir-regular mb-3 text-sm font-medium text-gray-700">
              Selected Division & Roles:
            </h4>
            <div className="space-y-2">
              <p className="font-lato-regular text-gray-800">
                <span className="font-medium">Division:</span>{" "}
                {formData.firstChoice || "Not selected"}
              </p>
              {(formData.firstChoice === "Marketing" ||
                formData.firstChoice === "IT" ||
                formData.firstChoice === "Strategy and Growth") && (
                <div>
                  <span className="font-medium text-gray-700">Role Preferences:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.firstChoice === "Marketing" && (
                      <>
                        {formData.first_content && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            Content
                          </span>
                        )}
                        {formData.first_graphicDesigner && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            Graphic Designer
                          </span>
                        )}
                        {formData.first_videographer && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            Videographer
                          </span>
                        )}
                        {formData.first_partnership && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            Partnership
                          </span>
                        )}
                      </>
                    )}
                    {formData.firstChoice === "IT" && (
                      <>
                        {formData.first_frontend && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            Frontend Developer
                          </span>
                        )}
                        {formData.first_backend && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            Backend Developer
                          </span>
                        )}
                        {formData.first_uiux && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            UI/UX Designer
                          </span>
                        )}
                      </>
                    )}
                    {formData.firstChoice === "Strategy and Growth" && (
                      <>
                        {formData.first_sngCeoCC && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            CEO of 180DC Case Competition 2027 Track
                          </span>
                        )}
                        {formData.first_sngAnalyst && (
                          <span className="inline-block rounded-full bg-green-300/10 px-3 py-1 text-sm text-green-300">
                            S&G Functional Analyst Track
                          </span>
                        )}
                      </>
                    )}
                    {((formData.firstChoice === "Marketing" &&
                      !formData.first_content &&
                      !formData.first_graphicDesigner &&
                      !formData.first_videographer &&
                      !formData.first_partnership) ||
                      (formData.firstChoice === "IT" &&
                        !formData.first_frontend &&
                        !formData.first_backend &&
                        !formData.first_uiux) ||
                      (formData.firstChoice === "Strategy and Growth" &&
                        !formData.first_sngCeoCC &&
                        !formData.first_sngAnalyst)) && (
                      <span className="text-gray-400 italic">No specific roles selected</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <span className="font-avenir-regular text-sm font-medium text-gray-700">
                CV/Resume:
              </span>
              <p className="font-lato-regular text-gray-600">
                {formData.first_cvLink ? (
                  <Link
                    href={formData.first_cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:underline"
                  >
                    View CV ({formData.first_cvLink})
                  </Link>
                ) : (
                  <span className="text-red-500">Not provided (Required)</span>
                )}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="font-avenir-regular text-sm font-medium text-gray-700">
                Additional Document:
              </span>
              <p className="font-lato-regular text-gray-600">
                {formData.first_documentLink ? (
                  <Link
                    href={formData.first_documentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:underline"
                  >
                    View Document ({formData.first_documentLink})
                  </Link>
                ) : (
                  <span className="text-red-500">Not provided (Required)</span>
                )}
              </p>
            </div>
            {formData.first_portfolioLink && (
              <div className="md:col-span-2">
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Portfolio:
                </span>
                <p className="font-lato-regular text-gray-600">
                  <Link
                    href={formData.first_portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:underline"
                  >
                    View Portfolio ({formData.first_portfolioLink})
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Choice Documents */}
      {formData.secondChoice && formData.secondChoice !== "No second choice" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
                <Upload className="h-3 w-3 text-white" />
              </div>
              Second Choice: {formData.secondChoice || "Not selected"}
            </h3>
          </div>
          <div className="space-y-4">
            {/* Division and Role Information */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-avenir-regular mb-3 text-sm font-medium text-gray-700">
                Selected Division & Roles:
              </h4>
              <div className="space-y-2">
                <p className="font-lato-regular text-gray-800">
                  <span className="font-medium">Division:</span>{" "}
                  {formData.secondChoice || "Not selected"}
                </p>
                {(formData.secondChoice === "Marketing" ||
                  formData.secondChoice === "IT" ||
                  formData.secondChoice === "Strategy and Growth") && (
                  <div>
                    <span className="font-medium text-gray-700">Role Preferences:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.secondChoice === "Marketing" && (
                        <>
                          {formData.second_content && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              Content
                            </span>
                          )}
                          {formData.second_graphicDesigner && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              Graphic Designer
                            </span>
                          )}
                          {formData.second_videographer && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              Videographer
                            </span>
                          )}
                          {formData.second_partnership && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              Partnership
                            </span>
                          )}
                        </>
                      )}
                      {formData.secondChoice === "IT" && (
                        <>
                          {formData.second_frontend && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              Frontend Developer
                            </span>
                          )}
                          {formData.second_backend && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              Backend Developer
                            </span>
                          )}
                          {formData.second_uiux && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              UI/UX Designer
                            </span>
                          )}
                        </>
                      )}
                      {formData.secondChoice === "Strategy and Growth" && (
                        <>
                          {formData.second_sngCeoCC && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              CEO of 180DC Case Competition 2027 Track
                            </span>
                          )}
                          {formData.second_sngAnalyst && (
                            <span className="inline-block rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-300">
                              S&G Functional Analyst Track
                            </span>
                          )}
                        </>
                      )}
                      {((formData.secondChoice === "Marketing" &&
                        !formData.second_content &&
                        !formData.second_graphicDesigner &&
                        !formData.second_videographer &&
                        !formData.second_partnership) ||
                        (formData.secondChoice === "IT" &&
                          !formData.second_frontend &&
                          !formData.second_backend &&
                          !formData.second_uiux) ||
                        (formData.secondChoice === "Strategy and Growth" &&
                          !formData.second_sngCeoCC &&
                          !formData.second_sngAnalyst)) && (
                        <span className="text-gray-400 italic">No specific roles selected</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  CV/Resume:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.second_cvLink ? (
                    <Link
                      href={formData.second_cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:underline"
                    >
                      View CV ({formData.second_cvLink})
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="font-avenir-regular text-sm font-medium text-gray-700">
                  Additional Document:
                </span>
                <p className="font-lato-regular text-gray-600">
                  {formData.second_documentLink ? (
                    <Link
                      href={formData.second_documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:underline"
                    >
                      View Document ({formData.second_documentLink})
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </p>
              </div>
              {formData.second_portfolioLink && (
                <div className="md:col-span-2">
                  <span className="font-avenir-regular text-sm font-medium text-gray-700">
                    Portfolio:
                  </span>
                  <p className="font-lato-regular text-gray-600">
                    <Link
                      href={formData.second_portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:underline"
                    >
                      View Portfolio ({formData.second_portfolioLink})
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social Media Requirements */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-avenir-black flex items-center gap-2 text-xl text-gray-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
              <Upload className="h-3 w-3 text-white" />
            </div>
            Social Media Requirements
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Twibbon Post Link:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.twibbonPostLink ? (
                <Link
                  href={formData.twibbonPostLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Post ({formData.twibbonPostLink})
                </Link>
              ) : (
                <span className="text-red-500">Not provided (Required)</span>
              )}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Instagram Story Proof:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.twibbonProofLink ? (
                <Link
                  href={formData.twibbonProofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Proof ({formData.twibbonProofLink})
                </Link>
              ) : (
                <span className="text-red-500">Not provided (Required)</span>
              )}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              How you first heard about us:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.hearAboutUs && formData.hearAboutUs.length > 0 ? (
                formData.hearAboutUs
                  .map((source) =>
                    source === "Other" && formData.hearAboutUsOther
                      ? `Other: ${formData.hearAboutUsOther}`
                      : source
                  )
                  .join(", ")
              ) : (
                <span className="text-red-500">Not provided (Required)</span>
              )}
            </p>
          </div>
          {/* 180UNLOCKED step disabled
          <div className="md:col-span-2">
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              180UNLOCKED Registration Proof:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.unlockedProofLink ? (
                <Link
                  href={formData.unlockedProofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:underline"
                >
                  View Proof ({formData.unlockedProofLink})
                </Link>
              ) : (
                <span className="text-gray-400 italic">Not provided (Optional)</span>
              )}
            </p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              180UNLOCKED Acknowledgement:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.unlockedAcknowledged ? (
                <span className="font-medium text-green-300">Acknowledged</span>
              ) : (
                <span className="text-red-500">Not acknowledged</span>
              )}
            </p>
          </div>
          */}
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              Consent Agreement:
            </span>
            <p className="font-lato-regular text-gray-600">
              {formData.consentAgreed ? (
                <span className="font-medium text-green-300">Agreed</span>
              ) : (
                <span className="text-red-500">Not agreed</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="font-avenir-black text-xl text-gray-800">Application Status</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${formData.name ? "bg-green-300" : "bg-red-500"}`}
            ></div>
            <span className="font-avenir-regular text-sm">
              Personal Information:{" "}
              {formData.name &&
              formData.email &&
              formData.phone &&
              formData.faculty &&
              formData.major &&
              formData.batch &&
              formData.gpa
                ? "Complete"
                : "Incomplete"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${formData.firstChoice && formData.first_cvLink && formData.first_documentLink ? "bg-green-300" : "bg-red-500"}`}
            />
            <span className="font-avenir-regular text-sm">
              First Choice Documents:{" "}
              {formData.first_cvLink && formData.first_documentLink ? "Complete" : "Incomplete"}
            </span>
          </div>
          {formData.secondChoice && (
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${formData.second_cvLink && formData.second_documentLink ? "bg-green-300" : "bg-red-500"}`}
              />
              <span className="font-avenir-regular text-sm">
                Second Choice Documents:{" "}
                {formData.second_cvLink && formData.second_documentLink ? "Complete" : "Incomplete"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${formData.twibbonPostLink && formData.twibbonProofLink ? "bg-green-300" : "bg-red-500"}`}
            ></div>
            <span className="font-avenir-regular text-sm">
              Social Media Requirements:{" "}
              {formData.twibbonPostLink && formData.twibbonProofLink ? "Complete" : "Incomplete"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${formData.consentAgreed ? "bg-green-300" : "bg-red-500"}`}
            ></div>
            <span className="font-avenir-regular text-sm">
              Consent Agreement: {formData.consentAgreed ? "Agreed" : "Not Agreed"}
            </span>
          </div>
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

export default Slide8;
