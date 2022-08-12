import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useContext, useState } from "react";
import { db } from "../firebase";
import LogoutNEW from "./logoutNEW";
import { Dropdown, Menu, Space } from "antd";
import SignInRegisterPopup from "./signInRegisterPopup";
import { AuthContext } from "../firebase-authProvider";
import Banner from "./banner";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationCityIcon from "@mui/icons-material/LocationCity";
//proveri upitnik kod placeholder
export default function Navbar({ placeholder }: { placeholder?: string }) {
  const { user, myUser } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState("");
  const [numOfGuests, setNumOfGuests] = useState(1);
  const router = useRouter();

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

  const becomeAHost = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      // userId: session?.user?.name,<-GOOGLE
      userId: user.uid,
      host: true,
    });
  };
  const addProperty = () => {
    router.push({
      pathname: "/addproperty",
    });
  };
  const hostsBoard = () => {
    router.push({
      pathname: "/hostsboard",
    });
  };
  const guestBoard = () => {
    router.push({
      pathname: "/guestboard",
    });
  };
  const profileSettings = () => {
    router.push({
      pathname: "/profilesettings",
    });
  };
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <>
              <div className="hover:bg-slate-50 transition py-1 pl-1 duration-200 ease-out  hover:shadow-lg">
                <LogoutNEW />
              </div>
              {/* <div<-GOOGLE
                    onClick={signOut}
                    className="hover:bg-slate-50 py-1  pl-1 transition duration-200 ease-out  hover:shadow-lg"
                  >
                    Sign out
                  </div> */}
            </>
          ),
        },
        {
          key: "2",
          label: (
            <div
              onClick={profileSettings}
              className=" hover:bg-slate-50 hover:opacity-80 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
            >
              Profile
            </div>
          ),
        },
        {
          key: "3",
          label: (
            <div
              onClick={becomeAHost}
              className="hover:bg-slate-50 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
            >
              Become a host
            </div>
          ),
          // disabled: true,
        },
        {
          key: "4",
          label: (
            <div
              onClick={addProperty}
              className="hover:bg-slate-50 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
            >
              Add property
            </div>
          ),
        },
        {
          key: "5",
          label: (
            <div
              onClick={hostsBoard}
              className=" hover:bg-slate-50 hover:opacity-80 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
            >
              Host board
            </div>
          ),
        },
        {
          key: "6",
          label: (
            <div
              onClick={guestBoard}
              className=" hover:bg-slate-50 hover:opacity-80 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
            >
              Guest board
            </div>
          ),
        },
      ]}
    />
  );

  return (
    //header tag??
    <div
      className="py-5  shadow-xl bg-header flex flex-col
       w-full sticky top-0 z-[100]"
    >
      <div className="sm:px-5  md:px-10 grid grid-cols-3">
        <div
          onClick={() => router.push("/")}
          className=" text-2xl text-logo  font-logo
         font-semibold mr-2 cursor-pointer pl-3 "
        >
          {/* mybnb */}
          <LocationCityIcon fontSize="large" />
        </div>

        <div className="flex items-center space-x-4 justify-self-end col-span-2 pr-3">
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
              placeholder={placeholder || "Where are you going?"}
              className="outline-0 pl-2 bg-transparent text-sm text-gray-600"
            />
            <div className="hidden sm:inline-flex pr-0.5  cursor-pointer">
              {/* namesti da se i klikom na ikonicu ide u search */}
              <SearchRoundedIcon />
            </div>
          </div>
          {/* session ||  <-GOOGLE*/}
          {user ? (
            <>
              <div>
                <Dropdown overlay={menu}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Image
                        // src={session.user?.image}<-GOOGLE
                        src="/images/app3.jpg"
                        height="20"
                        width="20"
                        alt=""
                        className="rounded-sm"
                      />
                      <ExpandMoreRoundedIcon />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </>
          ) : (
            <>
              <SignInRegisterPopup />
            </>
          )}
        </div>
      </div>

      {searchInput && (
        <div className="flex flex-col w-screen col-span-2">
          <Banner />
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
