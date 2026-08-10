"use client";
import { Label } from "@/components/elements/Form/label";
import { Input } from "@/components/elements/Form/input";
import { RadioGroup, RadioGroupItem } from "@/components/elements/Form/radioGroup";

const SlideConsulting = ({
  isSecondChoice = false,
  stepNumber,
  role,
  setRole,
  openToAnalyst,
  setOpenToAnalyst,
  documentLink,
  setDocumentLink,
  cvLink,
  setCvLink,
}) => {
  const choiceText = isSecondChoice ? "Second Choice" : "First Choice";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="font-avenir-black mt-2 mb-1 text-2xl leading-snug text-green-300 lg:text-3xl">
          Consulting Division
        </h2>
        <p className="font-lato-regular text-gray-600">
          Tell us which consulting role you are aiming for and why you want to join.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
            <span className="text-sm font-bold text-white">{stepNumber}</span>
          </div>
          <h3 className="font-avenir-black text-xl text-gray-800">
            Consulting Division ({choiceText})
          </h3>
        </div>

        <p className="font-lato-regular mb-4 text-gray-600">
          Please answer all the questions below specifically and thoroughly to ensure a
          comprehensive and effective recruitment process. Your detailed responses will greatly
          assist us in evaluating the best candidates for the position.
        </p>

        <div className="space-y-6">
          <div>
            <Label className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700">
              Desired Role in Consulting *
            </Label>
            <p className="font-lato-regular mb-3 text-sm text-gray-500">
              You can only choose 1 role.
            </p>
            <RadioGroup
              value={role}
              onValueChange={setRole}
              className={`gap-2 rounded-lg p-3 ${
                role ? "border border-gray-200" : "border-2 border-red-300 bg-red-50"
              }`}
            >
              <div className="flex flex-row items-center gap-2">
                <RadioGroupItem value="Project Leader" id={`${choiceText}-projectLeader`} />
                <Label htmlFor={`${choiceText}-projectLeader`}>
                  <p className="font-lato-regular text-gray-600">Project Leader</p>
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <RadioGroupItem value="Project Analyst" id={`${choiceText}-projectAnalyst`} />
                <Label htmlFor={`${choiceText}-projectAnalyst`}>
                  <p className="font-lato-regular text-gray-600">Project Analyst</p>
                </Label>
              </div>
            </RadioGroup>
            {!role && (
              <p className="font-lato-regular mt-2 text-sm text-red-600">
                Please select the role you are applying for.
              </p>
            )}
          </div>

          {/* Only Project Leader applicants can be moved down to Project Analyst,
              so this question is asked exactly when that outcome is possible. */}
          {role === "Project Leader" && (
            <div>
              <Label className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700">
                Should the selection committee determine that your qualifications and experience are
                better aligned with the Project Analyst role, would you be willing to be considered
                for that position instead? *
              </Label>
              <RadioGroup value={openToAnalyst} onValueChange={setOpenToAnalyst} className="mt-3">
                <div className="flex flex-row items-center gap-2">
                  <RadioGroupItem value="Yes" id={`${choiceText}-openToAnalyst-yes`} />
                  <Label htmlFor={`${choiceText}-openToAnalyst-yes`}>
                    <p className="font-lato-regular text-gray-600">Yes</p>
                  </Label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <RadioGroupItem value="No" id={`${choiceText}-openToAnalyst-no`} />
                  <Label htmlFor={`${choiceText}-openToAnalyst-no`}>
                    <p className="font-lato-regular text-gray-600">No</p>
                  </Label>
                </div>
              </RadioGroup>
              {!openToAnalyst && (
                <p className="font-lato-regular mt-2 text-sm text-red-600">
                  Please answer this question.
                </p>
              )}
            </div>
          )}

          <div>
            <Label className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700">
              Motivation Document *
            </Label>
            <p className="font-lato-regular mb-3 text-sm text-gray-500">
              Please prepare a document that answers the following questions (max. 500 words) :
              <span className="font-lato-bold text-black-300">
                <br />
                1. Why do you want to be a part of 180DC UGM?
                <br />
                2. Why are you applying for this position?
              </span>
              <br />
              <br />
              Once completed, upload your document to Google Drive, ensure the access settings are
              set to{" "}
              <span className="font-lato-bold text-black-300">
                &quot;Anyone with the link can view,&quot;
              </span>{" "}
              and paste the link in the space provided below.
            </p>
            <Input
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
              placeholder="https://drive.google.com/your-document-link"
              className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50 ${
                documentLink && !documentLink.includes("drive.google.com")
                  ? "border-red-300 focus:ring-red-200"
                  : ""
              }`}
            />
            {documentLink && !documentLink.includes("drive.google.com") && (
              <p className="mt-1 text-sm text-red-600">Please use a Google Drive link</p>
            )}
          </div>

          <div>
            <Label className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700">
              Please Insert your CV! *
            </Label>
            <p className="font-lato-regular mb-3 text-sm text-gray-500">
              Please do make sure you use McKinsey ATS Template{" "}
              <span className="font-lato-bold text-black-300">
                (180dcugm.com/McKinseyATS-Example)
              </span>
              <br />
              <br />
              <span className="font-lato-bold text-black-300">
                Format: FullName_FirstChoice_SecondChoice
              </span>
              <br />
              <br />
              Then, upload your document to a Google Drive, ensure the access settings are set to{" "}
              <span className="font-lato-bold text-black-300">
                &quot;Anyone with the link can view,&quot;
              </span>{" "}
              and paste the link in the space provided below.
            </p>
            <Input
              value={cvLink}
              onChange={(e) => setCvLink(e.target.value)}
              placeholder="https://drive.google.com/your-document-link"
              className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50 ${
                cvLink && !cvLink.includes("drive.google.com")
                  ? "border-red-300 focus:ring-red-200"
                  : ""
              }`}
            />
            {cvLink && !cvLink.includes("drive.google.com") && (
              <p className="mt-1 text-sm text-red-600">Please use a Google Drive link</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideConsulting;
