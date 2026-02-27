import Image from "next/image";
import Container from "@/components/layout/Container";

export function VisitSpotify() {
    const podcastLink = "https://open.spotify.com/episode/3LRLqk6d9B7XkSA5zekYC8?si=c122ebff6e664062";

    return (
        <div className="w-full relative bg-[#73B743] py-16 md:py-24">
            <Image
                src="/img/bootcamp/plsfix.webp"
                alt="plsfix banner"
                width={500}
                height={150}
                className="absolute top-0 right-0 w-[40%] lg:w-[35%] max-w-[500px] -translate-y-[50%] z-10 object-contain"
            />
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-20 px-[4%] sm:px-[6%] md:px-0">
                    <div className="shrink-0 font-avenir-black text-black leading-[1.05]">
                        <div className="flex md:hidden flex-row items-center justify-center gap-2 sm:gap-3 text-[32px] sm:text-[48px] flex-wrap">
                            <span>Visit</span>
                            <span>Our</span>
                            <div className="relative w-[44px] h-[44px] sm:w-[60px] sm:h-[60px] flex-shrink-0">
                                <Image
                                    src="/img/bootcamp/180DCCircle.webp"
                                    alt="180DC Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span>Spotify</span>
                        </div>
                        <div className="hidden md:flex flex-col text-[80px] lg:text-[96.1px]">
                            <div className="flex flex-row items-center">
                                <div className="flex flex-col">
                                    <p>Visit</p>
                                    <p>Our</p>
                                </div>
                                <div className="relative ml-4 w-[134px] h-[134px] lg:w-[161px] lg:h-[161px] flex-shrink-0">
                                    <Image
                                        src="/img/bootcamp/180DCCircle.webp"
                                        alt="180DC Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <p>Spotify</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[55%] md:pt-[60px] lg:flex-1 lg:min-w-0 max-w-[620px]">
                        <iframe
                            title="Spotify Web Player"
                            src={`https://open.spotify.com/embed${new URL(podcastLink).pathname}`}
                            className="w-full mt-[5px] block rounded-[12px] h-[calc(3*1.05*clamp(48px,8.5vw,96.1px))]"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}