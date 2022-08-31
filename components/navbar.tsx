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
import Link from "next/link";
//proveri upitnik kod placeholder
export default function Navbar({ placeholder }: { placeholder?: string }) {
  const { user, myUser } = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [numOfGuests, setNumOfGuests] = useState<number>(1);
  const router = useRouter();
  const resetSearch = () => {
    setSearchInput("");
  };

  // ovaj dole nacinje oristan jer ovako mozemo da sharujemo nekom link da vidi nase reyultate
  // const search = () => {
  //   router.push({
  //     pathname: "/search",
  //     query: {
  //       location: searchInput,
  //       // startdate i end... 1;31 day3
  //       numOfGuests,
  //     },
  //   });
  // };

  const becomeAHost = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      //TODO ovdetreba update a ne add
      // userId: session?.user?.name,<-GOOGLE
      userId: user?.uid,
      host: true,
    });
  };

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <>
              <div
                className=" hover:opacity-80  transition duration-200 ease-out  py-1 pl-1 "

                // className="hover:bg-slate-50 transition py-1 pl-1 duration-200 ease-out  hover:shadow-lg"
              >
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
            <Link href="/profilesettings">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Profile
              </a>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <div
              onClick={becomeAHost}
              className=" hover:opacity-80  transition duration-200 ease-out  py-1 pl-1 "

              // className="hover:bg-slate-50 py-1 pl-1 transition duration-200 ease-out hover:shadow-lg"
            >
              Become a host
            </div>
          ),
          // disabled: true,
        },
        {
          key: "4",
          label: (
            <Link href="/addproperty">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Add property
              </a>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link href="/hostsboard">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Host board
              </a>
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <Link href="/guestboard">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Guest board
              </a>
            </Link>
          ),
        },

        {
          key: "7",
          label: (
            <Link href="/adminboard">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Admin board
              </a>
            </Link>
          ),
        },
        {
          key: "8",
          label: (
            <Link href="/faq">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                FAQ
              </a>
            </Link>
          ),
        },
        {
          key: "9",
          label: (
            <Link href="/wishlist">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Wishlist
              </a>
            </Link>
          ),
        },
        {
          key: "10",
          label: (
            <Link href="/hostsreservations">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                Host reservations
              </a>
            </Link>
          ),
        },
      ]}
    />
  );

  return (
    <div
      className="py-5  shadow-xl bg-header flex flex-col
       w-full sticky top-0 z-[100]"
    >
      <div className="sm:px-5  md:px-10 grid grid-cols-3">
        <Link href="/">
          <a
            className=" text-2xl text-darkGreen  font-logo
         font-semibold mr-2 cursor-pointer pl-3 "
          >
            <LocationCityIcon fontSize="large" />
          </a>
        </Link>

        <div className="flex items-center space-x-4 justify-self-end col-span-2 pr-3">
          <button
            onClick={() => {
              setOpenSearch(!openSearch);
            }}
          >
            <SearchRoundedIcon />
          </button>

          {myUser != undefined && user && myUser ? (
            <>
              <div>
                <Dropdown overlay={menu}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Image
                        src={myUser?.photoURL}
                        height="25"
                        width="25"
                        alt=""
                        className="rounded-md"
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

      {openSearch && router.pathname != "/" && (
        // {searchInput && (
        <div className="flex flex-col w-screen col-span-2">
          <Banner />
          {/* <div className="flex">
            <button onClick={resetSearch} className="flex-grow cursor-pointer">
              Cancel
            </button>
            <button onClick={search} className="flex-grow cursor-pointer">
              Search
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}
