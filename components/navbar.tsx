import { addDoc, collection } from "firebase/firestore";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useState } from "react";
import { db } from "../firebase";
import Button from "./button";
import Popup from "./popup";
import SignInNEW from "./signInNEW";

//proveri upitnik kod placeholder
export default function Navbar({ placeholder }: { placeholder?: string }) {
  const [searchInput, setSearchInput] = useState("");
  const [numOfGuests, setNumOfGuests] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const resetSearch = () => {
    setSearchInput("");
  };
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
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

  const { data: session, status } = useSession(); //ovo session je renamovano za data// const session=useSession();
  // const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [onSub, setOnSub] = useState(false);
  // const [activeMenu, setActiveMenu] = useState("main");

  const becomeAHost = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      // userId: session ? (session.user ? (session.user?["uid"] : 1) : 1) : 1,
      userId: session?.user?.name,
      host: true,
    });
  };
  const addproperty = () => {
    router.push({
      pathname: "/addproperty",
    });
  };

  return (
    //header tag??
    <div
      className="p-5 shadow-xl bg-header grid grid-cols-2
       w-full sticky top-0 z-[100] md:px-10"
    >
      <div
        onClick={() => router.push("/")}
        className=" text-2xl text-logo font-logo font-semibold mr-2 cursor-pointer"
      >
        mybnb
      </div>

      <div className="flex items-center space-x-4 justify-self-end">
        {/* width i mr  justify-between*/}
        <div
          className="flex items-center
         rounded-full border-2 border-solid py-2
         "
        >
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

        {session ? (
          <>
            {/* ///////////// DROPDOWN TODO:popravi ga ////////////////////////////////////////////*/}
            <div>
              <div
                className="ml-7"
                onMouseEnter={() => setOpen(!open)} //t
                onMouseLeave={() => {
                  onSub ? "" : setOpen(!open); //f
                }}
                // onClick={() => setOpen(!open)} //
              >
                <Image
                  src={session.user?.image}
                  height="20"
                  width="20"
                  alt=""
                  className="rounded-sm"
                />
              </div>
              {open && (
                <div
                  onMouseEnter={() => setOnSub(true)} //t
                  onMouseLeave={() => {
                    setOpen(!open); //
                    setOnSub(false); //f
                  }}
                  className="absolute w-36 bg-slate-100 -translate-x-2/4 p-1 overflow-hidden rounded-md"
                >
                  <div
                    onClick={signOut}
                    className="hover:bg-slate-50 py-1  pl-1 transition duration-200 ease-out  hover:shadow-lg"
                  >
                    Sign out
                  </div>
                  <div className=" hover:bg-slate-50 hover:opacity-80 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg">
                    Profile
                  </div>
                  <div
                    onClick={becomeAHost}
                    className="hover:bg-slate-50 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
                  >
                    Become a host
                  </div>
                  <div
                    onClick={addproperty}
                    className="hover:bg-slate-50 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
                  >
                    Add property
                  </div>
                  <div className=" hover:bg-slate-50 hover:opacity-80 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg">
                    Host board
                  </div>
                </div>
              )}
            </div>
            {/* /////////////////////////////////////////////////////////////////// */}
          </>
        ) : (
          <>
            <div className="hidden md:inline">Register</div>
            {/* zasto se crveni onClick */}
            <button onClick={signIn} className="">
              Sign in
            </button>
          </>
        )}
      </div>
      <div>
        <input
          type="button"
          value="Click to Open Popup"
          onClick={togglePopup}
        />
        {isPopupOpen && (
          <Popup content={<SignInNEW />} handleClose={togglePopup} />
        )}
      </div>
      {searchInput && (
        <div className="flex flex-col mx-auto col-span-2">
          <div className="flex items-center border-b  my-3">
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
