import { CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const SubmitSlide = ({ formData }) => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-300/10">
          <CheckCircle className="h-10 w-10 text-green-300" />
        </div>
        <h2 className="font-avenir-black mb-2 text-2xl leading-snug text-green-300 lg:text-3xl">
          Thank You for Submitting!
        </h2>
        <p className="font-lato-regular text-gray-600">
          Your application has been successfully received
        </p>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <h3 className="font-avenir-black mb-6 flex items-center gap-2 text-xl text-gray-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
            <span className="text-sm font-bold text-white">6</span>
          </div>
          Next Steps
        </h3>

        <div className="space-y-6">
          {/* Confirm with HR Team */}
          <div className="mb-4">
            <h2 className="font-avenir-regular font-bold">Confirm with HR Team</h2>
            <p className="font-lato-regular mb-3 text-gray-600">
              Please kindly confirm with our HR Team regarding your submission.
            </p>
            <p className="font-lato-bold underline">Haidar: +62 822-4302-7654</p>
            <p className="font-lato-bold underline">Moody: +62 895-3970-75008</p>
          </div>

          {/* Join Recruitment Group */}
          <div className="mb-4">
            <h2 className="font-avenir-regular font-bold">Join Our Groups</h2>
            <p className="font-lato-regular mb-3 text-gray-600">
              Kindly join our Recruitment Group and 180DC&apos;s Community Group
            </p>
            <div className="space-y-2">
              <Link
                href="https://180dcugm.com/180DCCommunity"
                target="_blank"
                className="font-avenir-regular mr-2 inline-flex items-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-cyan-700"
              >
                <ExternalLink className="h-4 w-4" />
                180dcugm.com/180DCCommunity
              </Link>
              <Link
                href="https://180dcugm.com/FARecruitmentGroup-2627"
                target="_blank"
                className="font-avenir-regular inline-flex items-center gap-2 rounded-md bg-green-300 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-cyan-800"
              >
                <ExternalLink className="h-4 w-4" />
                180dcugm.com/FARecruitmentGroup-2627
              </Link>
            </div>
          </div>

          {/* Email Results */}
          <div className="mb-4">
            <h2 className="font-avenir-regular font-bold">Monitor Your Email</h2>
            <p className="font-lato-regular mb-3 text-gray-600">
              Please monitor your email regularly, as we will further announce our decision via
              email. We wish you the best of luck!
            </p>
          </div>
        </div>
      </div>

      {/* Application Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <h3 className="font-avenir-black mb-6 flex items-center gap-2 text-xl text-gray-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
            <span className="text-sm font-bold text-white">7</span>
          </div>
          Application Summary
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Name:</span>
            <p className="font-lato-regular text-gray-600">{formData.name || "N/A"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Email:</span>
            <p className="font-lato-regular text-gray-600">{formData.email || "N/A"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Faculty:</span>
            <p className="font-lato-regular text-gray-600">{formData.faculty || "N/A"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">Major:</span>
            <p className="font-lato-regular text-gray-600">{formData.major || "N/A"}</p>
          </div>
          <div>
            <span className="font-avenir-regular text-sm font-medium text-gray-700">
              First Choice Position:
            </span>
            <p className="font-lato-regular text-gray-600">{formData.firstChoice || "N/A"}</p>
          </div>
          {formData.secondChoice && (
            <div>
              <span className="font-avenir-regular text-sm font-medium text-gray-700">
                Second Choice Position:
              </span>
              <p className="font-lato-regular text-gray-600">{formData.secondChoice}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitSlide;
