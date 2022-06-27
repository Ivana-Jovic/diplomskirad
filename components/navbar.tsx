import Image from "next/image";

export default function Navbar() {
  return (
    <div className="py-5 shadow-xl bg-header flex justify-between w-full items-center sticky top-0 z-[100]">
      {/* treba li padding ovde, ja ga dodala */}
      <div className=" text-2xl text-[#FF5A5F] font-logo font-semibold ml-10 ">
        mybnb
      </div>
      {/* <div className="flex items-center">
        {/* //max wid padd i heigh border i border radious */}
      {/* border none za input i (width) padding i outline-width!!!!!! */}
      {/* <input type="text" placeholder="Search..." className="outline-0" />
        <Image
          src="/images/profile.jpg"
          height="20"
          width="20"
          alt="search icon"
        />
      </div> */}
      <div className="flex items-center">
        {/* width i mr  justify-between*/}
        <div
          className="flex items-center mr-5
         p-1.5 rounded-full border-2 border-solid border-textHover"
        >
          {/* //max wid  i height */}
          {/* border none za input i (width) padding */}
          <input
            type="text"
            // placeholder="Search..."
            className="outline-0 bg-header "
          />
          <Image
            src="/images/search.png"
            height="20"
            width="20"
            alt="search icon"
          />
        </div>
        <div className="mr-5">Register</div>
        <div className="mr-7">Sign in</div>
      </div>
    </div>
  );
}
