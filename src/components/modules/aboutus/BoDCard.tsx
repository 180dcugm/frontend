import Image from "next/image";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

export default function BoDCard({ item }) {
  const pos_role = item.role.split(" of ");
  return (
    <Link
      href={item.linkedin || "#team"}
      target={item.linkedin ? "_blank" : "_self"}
      className="group relative flex aspect-320/507 w-[27%] flex-col transition-all duration-500 md:w-[20%]"
    >
      <div className="relative aspect-square w-full transition-all duration-500 group-hover:scale-[1.1]">
        <div className="absolute top-0 left-0 flex aspect-square w-full">
          <Image alt={item.role} src={item.src} className="h-full w-full" fill />
          <div className="absolute bottom-0 z-10 h-[16%] w-full bg-linear-to-t from-white via-white via-60% to-white/5" />
        </div>
      </div>
      <div className="group relative flex w-full flex-col text-center">
        <div className="font-avenir-black relative flex flex-row flex-wrap justify-center gap-[3%] text-[55%] text-[#73B743] transition-all duration-500 hover:text-[#5DA236] sm:text-[60%] md:text-[85%] lg:text-[80%] xl:text-[110%] 2xl:text-[118%]">
          {item.name}
          <GoArrowUpRight className="w-[8.5%]" />
          <div className="absolute right-0 bottom-[-0.1em] left-0 mx-auto h-[2px] w-0 bg-[#5DA236] transition-all duration-500 group-hover:w-[80%]" />
        </div>
        <p className="relative w-full text-center text-[50%] text-[#58B9D1] transition-all duration-500 group-hover:font-semibold md:text-[80%] lg:text-[75%] xl:text-[110%]">
          {pos_role.length > 1 ? (
            <>
              {pos_role[0]} of <br />
              {pos_role[1]}
            </>
          ) : (
            <>{pos_role[0]}</>
          )}
        </p>
      </div>
    </Link>
  );
}
