import Button180 from "@/components/elements/Button180";
import Container from "@/components/layout/Container";
import Image from "next/image";

const storeItems = [
  {
    title: "Casebook",
    description: "The ultimate e-book you need to learn about consulting! Get in bundles!",
    image: "/img/homepage/caseBook.webp",
  },
  {
    title: "Merch",
    description: "#PLSFIX is an initiative by 180DC UGM to offer merchandise. Wear #PLSFIX and contributing to society while becoming #TheBestofYOUth",
    image: "/img/homepage/merch.webp",
  },
  {
    title: "Framework Bank",
    description: "Your Shortcut to 21+ effective consulting frameworks! Discover our Case Study and MAny More!",
    image: "/img/homepage/frameworkBank.webp",
  }
];

export function HomeStore() {
  return (
    <>
      <div className="bg-[#A6CED1] relative flex h-fit w-full items-center px-[5%] sm:px-[10%] lg:h-[50vw] lg:px-[4%]">
        <Image
          src="/img/homepage/splash.webp"
          alt="background"
          width={2000}
          height={2000}
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/img/homepage/homeLeftEllipse.webp"
            alt="background"
            width={2000}
            height={2000}
            className="absolute inset-0 z-0 w-[80vw] left-0 bottom-0 -translate-x-[65%] -translate-y-[10%]"
          />
          <Image
            src="/img/homepage/homeRightEllipse.webp"
            alt="background"
            width={2000}
            height={2000}
            className="absolute inset-0 z-0 w-[60vw] right-0 bottom-0 translate-x-[65%] translate-y-[10%] blur-[50px]"
          />
        </div>
        <Image
          src="/img/bootcamp/cincin.webp"
          alt="background"
          width={2000}
          height={2000}
          className="absolute z-20 w-[40vw] md:w-[25vw] left-0 bottom-0 -translate-x-[35%] translate-y-[15%] rotate-25"
        />
        <Image
          src="/img/bootcamp/cincin.webp"
          alt="background"
          width={2000}
          height={2000}
          className="absolute z-20 w-[40vw] md:w-[25vw] right-0 top-0 translate-x-[10%] -translate-y-[50%] rotate-3"
        />
        <Image
          src="/img/bootcamp/downTree.webp"
          alt="background"
          width={2000}
          height={2000}
          className="absolute z-20 w-[20vw] md:w-[15vw] lg:w-[10vw] right-0 top-0 translate-y-[90%] sm:translate-y-[30%] md:translate-x-[10%] md:translate-y-[70%] lg:translate-x-[10%] lg:translate-y-[80%] rotate-3"
        />
        <div className="relative z-30 w-full">
          <Container>
            <div className="flex flex-col ">
              <div data-aos="fade-up" data-aos-duration="600" className="flex flex-wrap justify-center w-fit mx-auto px-6 py-2 md:px-10 md:py-2 font-avenir-black text-[20px] md:text-[28px] lg:text-[38.98px] items-center shadow-[3px_6px_4px_rgba(0,0,0,0.18)] backdrop-blur-[13.8px] bg-[#C5C5C5]/23 border-1 border-white/37 rounded-[20px] lg:rounded-[41px] text-center">
                <p className="text-white">Shop at&nbsp;</p>
                <p className="text-[#73B743]">180DC UGM&nbsp;</p>
                <p className="text-white">Store</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6 mt-16 md:mt-24 w-full relative z-20">
                {storeItems.map((item, index) => (
                  <div
                    key={index}
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay={index * 300}
                    className="flex flex-col items-center px-6 pb-6 md:pb-4 pt-0 bg-[#7FF7DD]/12 backdrop-blur-[18px] border border-white/81 rounded-[17px] shadow-[8px_12px_8px_rgba(0,0,0,0.11)]"
                  >
                    <div className="relative w-full -mt-12 md:-mt-10 mb-6 md:mb-12 drop-shadow-2xl flex justify-center pointer-events-none">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={1000}
                        height={1000}
                        className="w-[45%] md:w-[60%] lg:w-[50%] h-auto object-contain"
                      />
                    </div>
                    <h3 className="font-avenir-black text-black text-[24px] lg:text-[30.41px] text-center">
                      {item.title}
                    </h3>
                    <p className="font-avenir-regular text-center text-black text-[14px] lg:text-[13.41px] leading-relaxed mt-2 md:mt-0">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
              <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="450" className="flex justify-center w-fit mx-auto mt-12 mb-10 md:mb-0 relative z-40">
                <Button180
                  size="md"
                  color="green"
                  text="Check Out the Store!"
                  href="/store"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}