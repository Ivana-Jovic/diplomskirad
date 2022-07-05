import Image from "next/image";
import ButtonBanner from "./buttonbanner";

export default function Banner() {
  return (
    <div
      className="relative h-[300px] sm:h-[400px] lg:h-[500px] 
    xl:h-[600px] 2xl:h-[600px]  "
    >
      {/**/}
      {/* <div className="w-full h-[50vh] bg-[url('/images/banner.jpg')] bg-center bg-no-repeat bg-cover"> */}
      <Image
        src="/images/banner.jpg"
        alt=""
        layout="fill"
        objectFit="cover"
      ></Image>
      <div className="absolute text-textFooter pl-7 top-1/4 w-fit">
        {/* <div className="absolute text-textFooter h-[50vh] bg-footer pt-[20vh] p-12 w-2/5"> */}
        <div className="bg-footer text-xl sm:text-3xl font-bold ">
          Accomodation around the world in one place
        </div>
        <br />
        <ButtonBanner text="Find your next stay"></ButtonBanner>
      </div>
    </div>
  );
}
