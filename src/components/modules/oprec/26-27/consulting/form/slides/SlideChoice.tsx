"use client";

import { useState } from "react";
import { Button } from "@/components/elements/Form/button";
import { ChevronRight } from "lucide-react";
import SlideConsulting from "./divisions/SlideConsulting";
import SlideKnowledge from "./divisions/SlideKnowledge";

// The first and second choice ask exactly the same questions, so one component
// serves both. `isSecondChoice` picks which set of prefixed formData keys it
// reads and writes. Form.tsx keys the two instances apart so the local state
// below is not carried over from the first choice into the second.
const SlideChoice = ({ formData, updateFormData, onNext, isSecondChoice = false }) => {
  const prefix = isSecondChoice ? "second" : "first";
  const division = isSecondChoice ? formData.secondChoice : formData.firstChoice;
  const stepNumber = isSecondChoice ? "6" : "5";

  // Roles and documents live in local state and are flushed on Continue, so the
  // division components only ever call the setters passed down to them.
  const [role, setRole] = useState(formData[`${prefix}_role`] || "");
  const [openToAnalyst, setOpenToAnalyst] = useState(formData[`${prefix}_openToAnalyst`] || "");
  const [documentLink, setDocumentLink] = useState(formData[`${prefix}_documentLink`] || "");
  const [cvLink, setCvLink] = useState(formData[`${prefix}_cvLink`] || "");

  // Knowledge Team has a single role, so it is filled in rather than asked.
  const resolvedRole = division === "Knowledge Team" ? "Knowledge Analyst" : role;

  const handleNext = () => {
    updateFormData({
      [`${prefix}_role`]: resolvedRole,
      // Only Project Leader applicants are ever asked this, so anything left in
      // state from a previous answer is dropped rather than submitted.
      [`${prefix}_openToAnalyst`]: resolvedRole === "Project Leader" ? openToAnalyst : "",
      [`${prefix}_documentLink`]: documentLink,
      [`${prefix}_cvLink`]: cvLink,
      // Mirror into the flat columns the table, the admin dashboard and the
      // success screen have always read, so nothing downstream has to learn
      // about divisions.
      ...(isSecondChoice
        ? { secondChoicePosition: resolvedRole }
        : { firstChoicePosition: resolvedRole, documentLink, cvLink }),
    });
    onNext();
  };

  // Project Leader is the only role that can be reassigned downward, so its
  // follow-up question is the only conditionally required field here.
  const needsAnalystAnswer = resolvedRole === "Project Leader" && !openToAnalyst;
  const isValid =
    Boolean(resolvedRole) && documentLink.trim() && cvLink.trim() && !needsAnalystAnswer;

  const commonProps = {
    isSecondChoice,
    stepNumber,
    documentLink,
    setDocumentLink,
    cvLink,
    setCvLink,
  };

  const renderDivisionForm = () => {
    switch (division) {
      case "Consulting":
        return (
          <SlideConsulting
            {...commonProps}
            role={role}
            setRole={setRole}
            openToAnalyst={openToAnalyst}
            setOpenToAnalyst={setOpenToAnalyst}
          />
        );
      case "Knowledge Team":
        return <SlideKnowledge {...commonProps} />;
      default:
        return null;
    }
  };

  if (!division) return null;

  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-300/10 px-4 py-2">
          <span className="text-sm font-medium text-green-300">
            {isSecondChoice ? "Second" : "First"} Choice Division:
          </span>
          <span className="font-semibold text-green-300">{division}</span>
        </div>
      </div>

      {renderDivisionForm()}

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="font-avenir-regular disabled:text-black-300 flex items-center gap-2 bg-green-300 text-white transition-all duration-200 hover:scale-105 hover:bg-green-300/90 disabled:opacity-50 disabled:hover:scale-100"
        >
          Continue to Next Step
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlideChoice;
