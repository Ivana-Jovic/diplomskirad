import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useState } from "react";

//proveri upitnik kod placeholder
export default function Navbar({ placeholder }: { placeholder?: string }) {
  const [searchInput, setSearchInput] = useState("");
  const [numOfGuests, setNumOfGuests] = useState(1);
  const resetSearch = () => {
    setSearchInput("");
  };
  // ovaj dole nacinje oristan jer ovako mozemo da sharujemo nekom link da vidi nase reyultate
  const search = () => {
    router.push({
      pathname: "/search",
      query: {
        location: searchInput,
        // startdate i end... 1;31 day3
        numOfGuests,
      },
    });
  };
  const router = useRouter();
  return (
    //header tag??
    <div
      className="p-5 shadow-xl bg-header grid grid-cols-2
       w-full sticky top-0 z-[100] md:px-10"
    >
      {/*    flex justify-between items-center  */}
      {/* treba li padding ovde, ja ga dodala */}
      <div
        onClick={() => router.push("/")}
        className=" text-2xl text-logo font-logo font-semibold mr-2 cursor-pointer"
      >
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
      <div className="flex items-center space-x-4 justify-self-end">
        {/* width i mr  justify-between*/}
        <div
          className="flex items-center
         rounded-full border-2 border-solid py-2
         "
        >
          {/* md:shadow-sm */}
          {/* //max wid  i height */}
          {/* border none za input i (width) padding */}
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            type="text"
            placeholder={placeholder || "Search..."}
            className="outline-0 pl-2 bg-transparent text-sm text-gray-600"
          />
          <div className="hidden md:inline-flex pr-0.5  cursor-pointer">
            {/* namesti da se i klikom na ikonicu ide u search */}
            <Image
              src="/images/search.png"
              height="20"
              width="20"
              alt="search icon"
            />
          </div>
        </div>
        <div className="hidden md:inline">Register</div>
        <div className="">Sign in</div>
      </div>
      {searchInput && (
        <div className="flex flex-col mx-auto col-span-2">
          <div className="flex items-center border-b ">
            <h3 className="flex-grow mr-10">Number of guests</h3>
            <Image src="/images/search.png" height="10" width="10" alt="" />
            <input
              value={numOfGuests}
              onChange={(event) => setNumOfGuests(event.target.value)}
              min={1}
              max={15}
              type="number"
              className="w-12 pl-2 text-lg outline-none"
            />
          </div>
          <div className="flex">
            <button onClick={resetSearch} className="flex-grow cursor-pointer">
              Cancel
            </button>
            <button onClick={search} className="flex-grow cursor-pointer">
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
