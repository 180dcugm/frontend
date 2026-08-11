import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

export default function HeroPage() {
  return (
    <section className="relative">
      <Image
        src="/img/opreccycle/bgHeroOprec.png"
        alt="Open Recruitment Background"
        width={2000}
        height={2000}
        className="absolute inset-0 z-10 h-screen w-full object-cover"
      />

      <div className="relative z-30 flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center text-center">
          {/* Portrait artwork, unlike the landscape banner it replaced, so it is
              sized by height and left to find its own width. Capped by max-w so
              it can never outgrow a short, wide viewport. */}
          <Image
            alt="180DC Open Recruitment Title"
            src="/img/oprec/caoprec2627.webp"
            width={1143}
            height={1422}
            priority
            className="h-[66vh] w-auto max-w-[90vw] object-contain max-lg:hidden"
          />
          <Image
            alt="180DC Open Recruitment Title Mobile"
            src="/img/oprec/caoprec2627.webp"
            width={1143}
            height={1422}
            priority
            className="h-[48vh] w-auto max-w-[90vw] object-contain lg:hidden"
          />

          <div className="mt-8 max-lg:hidden">
            <p className="font-lato-semibold max-w-2xl text-xl text-white lg:text-2xl">
              Calling all aspiring consultants and changemakers!
              <br />
              Join 180DC UGM and leave your mark.
            </p>
          </div>

          <div className="mt-6 lg:hidden">
            <p className="font-lato-semibold max-w-sm text-base text-white">
              Calling all aspiring consultants and changemakers!
              <br />
              Join 180DC UGM and leave your mark.
            </p>
          </div>
          {/* Scroll Down [DESKTOP] */}
          <div className="flex flex-col items-center outline-0">
            <h2 className="font-lato-bold mt-[1.4vw] text-[12px] text-gray-100">
              {"SCROLL DOWN TO ACCESS GUIDEBOOK AND REGISTRATION"}
            </h2>
            <FaChevronDown className="animate-moving-pointer text-[1.4vw] text-gray-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
