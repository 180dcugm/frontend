import Button180 from "@/components/elements/Button180";
import Container from "@/components/layout/Container";
import Image from "next/image";

export function HomeJoinUs() {
  const clients = [
    {
      buttonTitle: "I'm a Business Owner",
      imageBG: "/img/homepage/owner.webp",
      icon: "/img/homepage/ownerIcon.webp",
    },
    {
      title: "I'm a Student",
      imageBG: "/img/homepage/student.webp",
      icon: "/img/homepage/studentIcon.webp",
    }
  ];
  return (
    <div className="bg-[#262626] relative z-10 flex h-fit w-full items-center py-16 md:py-24 px-[5%] sm:px-[10%] lg:h-screen lg:min-h-[50vw] lg:py-0 lg:px-[4%]">
      <Image
        src="/img/homepage/background2JoinUs.webp"
        alt="background"
        width={2000}
        height={2000}
        className="absolute inset-0 z-10 h-full w-full object-cover"
      />
      <Image
        src="/img/homepage/homeStar.webp"
        alt="background"
        width={2000}
        height={2000}
        className="absolute max-w-none w-[150vw] z-10 -translate-x-[40%] sm:-translate-x-[45%] -translate-y-[20%] lg:-translate-x-[40%] lg:-translate-y-[35%] object-contain"
      />
      <Image
        src="/img/bootcamp/180PlsFix.webp"
        alt="plsfix banner"
        width={500}
        height={150}
        className="absolute top-0 left-0 w-[40%] sm:w-[35%] md:w-[30%] lg:w-[20%] max-w-[500px] -translate-y-[10%] z-10 object-contain"
      />
      <Image
        src="/img/bootcamp/180dc_semicircle.webp"
        alt="180dc semi circle"
        width={500}
        height={150}
        className="absolute bottom-0 right-0 w-[50%] sm:w-[40%] md:w-[35%] lg:w-[30%] max-w-[500px] translate-x-[10%] translate-y-[30%] z-10 object-contain rotate-20"
      />
      <Container className="flex flex-col">
        <div className="relative z-30 flex flex-col items-center gap-4 md:gap-6 w-full">
          <div data-aos="fade-up" data-aos-duration="600" className="flex flex-col justify-center items-center text-center">
            <p className="font-avenir-black text-white text-[26px] md:text-[32px] lg:text-[52px] leading-tight">Join Us!</p>
            <p className="font-avenir-book text-white text-[16px] md:text-[20px] lg:text-[24px] mt-2">Connect with Indonesia's premier student consultancy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-10 w-full max-w-[800px] lg:max-w-[1100px] mx-auto mt-2 md:mt-4 lg:mt-8">
            {clients.map((client, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-duration="600"
                className="relative rounded-[20px] overflow-hidden aspect-[4/3] min-h-[200px] shadow-[0_24px_15px_rgba(0,0,0,0.31)] group"
              >
                <Image
                  src={client.imageBG}
                  alt={client.buttonTitle ?? client.title ?? ""}
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 w-[44px] h-[44px] md:w-[52px] md:h-[52px] bg-white/90 rounded-[12px] flex items-center justify-center shadow-md">
                  <Image
                    src={client.icon}
                    alt="icon"
                    width={32}
                    height={32}
                    className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] object-contain"
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] flex justify-center">
                  <Button180
                    size="sm"
                    color="green"
                    text={client.buttonTitle ?? client.title ?? ""}
                    addClass="w-full justify-center whitespace-nowrap"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}