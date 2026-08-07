"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/elements/Form/button";
import { ChevronRight } from "lucide-react";

// Import division-specific slides
import SlideHR from "./divisions/SlideHR";
import SlideCE from "./divisions/SlideCE";
import SlideSG from "./divisions/SlideSG";
import SlideFinance from "./divisions/SlideFinance";
import SlideLegal from "./divisions/SlideLegal";
import SlideMKT from "./divisions/SlideMKT";
import SlideIT from "./divisions/SlideIT";

const Slide4 = ({ formData, updateFormData, onNext, onPrevious }) => {
  // Handle document and CV links for first choice
  // These are managed locally in Slide4 because they are specific to Slide4's inputs
  const [documentLink, setDocumentLink] = useState(formData.first_documentLink || "");
  const [cvLink, setCvLink] = useState(formData.first_cvLink || "");
  const [portfolioLink, setPortfolioLink] = useState(formData.first_portfolioLink || "");
  // These must read the same first_ prefixed keys handleNext writes below.
  // Reading unprefixed keys meant the checkboxes came back empty whenever this
  // slide remounted, and Continue then overwrote the saved roles with false.
  const [content, setContent] = useState(formData.first_content || false);
  const [graphicDesigner, setGraphicDesigner] = useState(formData.first_graphicDesigner || false);
  const [videographer, setVideographer] = useState(formData.first_videographer || false);
  const [partnership, setPartnership] = useState(formData.first_partnership || false);
  const [frontend, setFrontend] = useState(formData.first_frontend || false);
  const [backend, setBackend] = useState(formData.first_backend || false);
  const [uiux, setUiux] = useState(formData.first_uiux || false);
  const [sngCeoCC, setSngCeoCC] = useState(formData.first_sngCeoCC || false);
  const [sngAnalyst, setSngAnalyst] = useState(formData.first_sngAnalyst || false);

  const handleNext = () => {
    // Roles are held in local state here and flushed on Continue; the division
    // sub-components only call the setters, they never call updateFormData.
    updateFormData({
      first_documentLink: documentLink,
      first_cvLink: cvLink,
      first_portfolioLink: portfolioLink,
      first_content: content,
      first_graphicDesigner: graphicDesigner,
      first_videographer: videographer,
      first_partnership: partnership,
      first_frontend: frontend,
      first_backend: backend,
      first_uiux: uiux,
      first_sngCeoCC: sngCeoCC,
      first_sngAnalyst: sngAnalyst,
    });
    onNext();
  };

  // Get the selected first choice division from formData
  const firstChoice = formData.firstChoice;

  // Only these divisions offer role checkboxes. The rest must not be gated on a
  // selection they are never shown, or they could never continue.
  const rolesByDivision = {
    Marketing: [content, graphicDesigner, videographer, partnership],
    IT: [frontend, backend, uiux],
    "Strategy and Growth": [sngCeoCC, sngAnalyst],
  };
  const offeredRoles = rolesByDivision[firstChoice];
  const hasRequiredRole = !offeredRoles || offeredRoles.some(Boolean);

  // Check if form is valid (links filled, and a role picked where one is offered)
  const isValid = documentLink.trim() && cvLink.trim() && hasRequiredRole;

  // Render division-specific form for first choice
  const renderDivisionSpecificForm = (division) => {
    const commonProps = {
      formData,
      updateFormData, // Pass the main updateFormData function
      onNext: handleNext,
      onPrevious,
      isSecondChoice: false,
      divisionType: "first",
      // Pass document and CV link state (managed locally in Slide4)
      portfolioLink,
      setPortfolioLink,
      documentLink,
      setDocumentLink,
      cvLink,
      setCvLink,
      isValid,
      content,
      setContent,
      graphicDesigner,
      setGraphicDesigner,
      videographer,
      setVideographer,
      partnership,
      setPartnership,
      frontend,
      setFrontend,
      backend,
      setBackend,
      uiux,
      setUiux,
      sngCeoCC,
      setSngCeoCC,
      sngAnalyst,
      setSngAnalyst,
    };

    switch (division) {
      case "Human Resources":
        return <SlideHR {...commonProps} />;
      case "Client Engagement":
        return <SlideCE {...commonProps} />;
      case "Strategy and Growth":
        return <SlideSG {...commonProps} />;
      case "Finance":
        return <SlideFinance {...commonProps} />;
      case "Legal":
        return <SlideLegal {...commonProps} />;
      case "Marketing":
        return <SlideMKT {...commonProps} />;
      case "IT":
        return <SlideIT {...commonProps} />;
      default:
        return null;
    }
  };

  // If first choice division is selected, show the division-specific form
  if (firstChoice && firstChoice !== "") {
    return (
      <div className="space-y-6">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-300/10 px-4 py-2">
            <span className="text-sm font-medium text-green-300">First Choice Division:</span>
            <span className="font-semibold text-green-300">{firstChoice}</span>
          </div>
        </div>
        {renderDivisionSpecificForm(firstChoice)}
        {/* Centralized Next Button */}
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
  }
  return null;
};

export default Slide4;
