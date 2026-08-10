"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/elements/Form/progress";
import { Button } from "@/components/elements/Form/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import Slide1 from "../form/slides/Slide1";
import Slide2 from "../form/slides/Slide2";
import Slide3 from "../form/slides/Slide3";
import SlideChoice from "../form/slides/SlideChoice";
import Slide4 from "../form/slides/Slide4";
// import Slide5 from "../form/slides/Slide5"; // Consulting Day step, disabled
import Slide6 from "../form/slides/Slide6";
import SubmitSlide from "../form/slides/SubmitSlide";

// Bumped when division/role selection replaced the flat position dropdown:
// progress saved under the old key points at slide numbers and position values
// that no longer mean the same thing.
const STORAGE_KEY = "180DC-consulting-26-27-cycle-1-v2";
const API_ENDPOINT = "/api/oprec/26-27/consulting/cycle1/submit";

export default function Form() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formData, setFormData] = useState({});
  const [slideHistory, setSlideHistory] = useState([1]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSlides = 7;
  const REVIEW_SLIDE = 7;
  const SUBMITTED_SLIDE = 8;

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const {
          formData: savedFormData,
          currentSlide: savedSlide,
          slideHistory: savedHistory,
          isSubmitted: savedIsSubmitted,
        } = JSON.parse(savedProgress);

        setFormData(savedFormData || {});
        setSlideHistory(savedHistory || [1]);

        // If user has already submitted, always direct to submit slide
        if (savedIsSubmitted) {
          setIsSubmitted(true);
          setCurrentSlide(SUBMITTED_SLIDE);
        } else {
          setCurrentSlide(savedSlide || 1);
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
        // If there's an error, clear the corrupted data
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const progressData = {
      formData,
      currentSlide,
      slideHistory,
      isSubmitted, // Include submission status
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  }, [formData, currentSlide, slideHistory, isSubmitted]);

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = (nextSlide) => {
    // Applicants who only want one position never see the second choice slide.
    if (currentSlide === 4 && !("secondChoice" in formData && formData.secondChoice)) {
      nextSlide = 6;
    }
    const targetSlide = nextSlide || currentSlide + 1;
    setSlideHistory((prev) => [...prev, targetSlide]);
    setCurrentSlide(targetSlide);
  };

  const handlePrevious = () => {
    // If user has submitted, don't allow navigation away from success slide
    if (isSubmitted && currentSlide === SUBMITTED_SLIDE) {
      return;
    }

    if (slideHistory.length > 1) {
      const newHistory = [...slideHistory];
      newHistory.pop();
      const previousSlide = newHistory[newHistory.length - 1];
      setSlideHistory(newHistory);
      setCurrentSlide(previousSlide);
    }
  };

  const getProgressPercentage = () => {
    if (currentSlide === SUBMITTED_SLIDE) return 100;
    return (currentSlide / totalSlides) * 100;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert the formData object to FormData
      const submitFormData = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "string" || value instanceof Blob) {
            submitFormData.append(key, value);
          } else {
            // Konversi ke string jika bukan string/Blob
            submitFormData.append(key, String(value));
          }
        }
      });

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: submitFormData, // Send as FormData, not JSON
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form via API");
      }

      console.log("Form submitted successfully via API:", result.message);
      setIsSubmitted(true);
      setCurrentSlide(SUBMITTED_SLIDE); // SubmitSlide

      toast("Success!", {
        description: result.message || "Your application has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Error", {
        description: error.message || "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSlide = () => {
    const slideProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSubmit: handleSubmit,
      isSubmitting,
    };

    switch (currentSlide) {
      case 1:
        return <Slide1 {...slideProps} />;
      case 2:
        return <Slide2 {...slideProps} />;
      case 3:
        return <Slide3 {...slideProps} />;
      // Keyed so the second choice does not inherit the first choice's answers.
      case 4:
        return <SlideChoice key="first" {...slideProps} />;
      case 5:
        return <SlideChoice key="second" {...slideProps} isSecondChoice />;
      case 6:
        return <Slide4 {...slideProps} />;
      // Consulting Day step, disabled
      // case 7:
      //   return <Slide5 {...slideProps} />;
      case 7:
        return <Slide6 {...slideProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case 8:
        return <SubmitSlide formData={formData} /*onBack={handlePrevious}*/ />;
      default:
        return <Slide1 {...slideProps} />;
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-linear-to-b from-black to-green-300/90 p-4">
      <div className="w-full max-w-4xl py-20">
        <div className="rounded-lg border-0 bg-white/90 p-6 shadow-2xl backdrop-blur-xs">
          <div className="pb-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">
                {currentSlide === REVIEW_SLIDE
                  ? "Review"
                  : currentSlide === SUBMITTED_SLIDE
                    ? "Complete"
                    : `Step ${currentSlide} of ${totalSlides}`}
              </div>
            </div>
            <Progress value={getProgressPercentage()} className="h-2 w-full bg-gray-200" />
          </div>
          <div className="pb-8">
            <div className="flex min-h-[400px] flex-col">
              <div className="mb-6 flex-1">{renderSlide()}</div>
              {currentSlide !== SUBMITTED_SLIDE && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={slideHistory.length <= 1}
                    className="flex items-center gap-2 bg-transparent transition-colors hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalSlides }, (_, i) => (
                      <div
                        key={i + 1}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i + 1 === currentSlide
                            ? "bg-green-300"
                            : i + 1 < currentSlide || slideHistory.includes(i + 1)
                              ? "bg-green-300/50"
                              : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="w-20" /> {/* Spacer for alignment */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
