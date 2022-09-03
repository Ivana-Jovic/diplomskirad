import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  isAdmin,
  isHostModeHost,
  isHostModeTravel,
  isLoggedUser,
} from "../lib/hooks";

export default function Navbar({ placeholder }: { placeholder?: string }) {
  const { user, myUser } = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [numOfGuests, setNumOfGuests] = useState<number>(1);
  const router = useRouter();
  const resetSearch = () => {
    setSearchInput("");
  };

  const becomeAHost = async () => {
    await updateDoc(doc(db, "users", user?.uid), {
      host: true,
    });
  };

  const changeMod = async () => {
    if (myUser && myUser.modeIsHosting) {
      await updateDoc(doc(db, "users", user?.uid), {
        modeIsHosting: false,
      });
    }
    if (myUser && !myUser.modeIsHosting) {
      await updateDoc(doc(db, "users", user?.uid), {
        modeIsHosting: true,
      });
    }
    router.push({
      pathname: "/",
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  const menuHostModeHost = (
    <>
      <Menu
        items={[
          {
            key: "1",
            label: (
              <div className=" menuItem ">
                menuHostModeHost
                <LogoutNEW />
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <Link href="/profilesettings">
                <a className="menuItem">Profile</a>
              </Link>
            ),
          },

          {
            key: "4",
            label: (
              <Link href="/addproperty">
                <a className="menuItem">Add property</a>
              </Link>
            ),
          },
          {
            key: "5",
            label: (
              <Link href="/hostsboard">
                <a className="menuItem">Host board</a>
              </Link>
            ),
          },

          {
            key: "8",
            label: (
              <Link href="/faq">
                <a className="menuItem">FAQ</a>
              </Link>
            ),
          },

          {
            key: "10",
            label: (
              <Link href="/hostsreservations">
                <a className="menuItem">Host reservations</a>
              </Link>
            ),
          },
          {
            key: "11",
            label: (
              <div className="menuItem" onClick={changeMod}>
                Change mod
              </div>
            ),
          },
        ]}
      />
    </>
  );

  const menuHostModeTravel = (
    <>
      <Menu
        items={[
          {
            key: "1",
            label: (
              <>
                <div className=" menuItem ">
                  menuHostModeTravel
                  <LogoutNEW />
                </div>
              </>
            ),
          },
          {
            key: "2",
            label: (
              <Link href="/profilesettings">
                <a className="menuItem">Profile</a>
              </Link>
            ),
          },

          {
            key: "6",
            label: (
              <Link href="/guestboard">
                <a className="menuItem">Guest board</a>
              </Link>
            ),
          },

          {
            key: "8",
            label: (
              <Link href="/faq">
                <a className="menuItem">FAQ</a>
              </Link>
            ),
          },
          {
            key: "9",
            label: (
              <Link href="/wishlist">
                <a className="menuItem">Wishlist</a>
              </Link>
            ),
          },

          {
            key: "11",
            label: (
              <div className="menuItem" onClick={changeMod}>
                Change mod
              </div>
            ),
          },
        ]}
      />
    </>
  );
  ////////////////////////////////////////////////////////////////////////////////////////////
  const menu = (
    <>
      {isLoggedUser(myUser) && menuLoggedUser}
      {isAdmin(myUser) && menuAdmin}
      {isHostModeHost(myUser) && menuHostModeHost}
      {isHostModeTravel(myUser) && menuHostModeTravel}
    </>
  );

  return (
    <div
      className="py-5 shadow-xl bg-header flex flex-col
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

        {
          <div className="flex items-center space-x-4 justify-self-end col-span-2 pr-3">
            {((user && myUser) || user === null) &&
              router &&
              router.pathname !== "/" &&
              (isLoggedUser(myUser) || isHostModeTravel(myUser)) && (
                <button
                  onClick={() => {
                    setOpenSearch(!openSearch);
                  }}
                >
                  <SearchRoundedIcon />
                </button>
              )}
            {user && myUser && (
              <>
                <div>
                  <Dropdown overlay={menu}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        {myUser && myUser.photoURL && (
                          <Image
                            src={myUser?.photoURL}
                            height="25"
                            width="25"
                            alt=""
                            className="rounded-md"
                          />
                        )}
                        {(!myUser || !myUser.photoURL) && <AccountCircleIcon />}
                        <ExpandMoreRoundedIcon />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </>
            )}
            {/* {(!user || !myUser) && ( */}
            {/* //nije undefined ali jeste null? */}
            {user === null && (
              <>
                <SignInRegisterPopup />
              </>
            )}
          </div>
        }
      </div>

      {openSearch && router.pathname !== "/" && (
        // {searchInput && (
        <div className="flex flex-col w-screen col-span-2  mt-5 -mb-5">
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

const menuLoggedUser = (
  <>
    <Menu
      items={[
        {
          key: "1",
          label: (
            <>
              <div className=" menuItem">
                menuLoggedUser
                <LogoutNEW />
              </div>
            </>
          ),
        },
        {
          key: "2",
          label: (
            <Link href="/profilesettings">
              <a className="menuItem">Profile</a>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <Link href="/addproperty">
              <a className="menuItem">Become a host</a>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link href="/guestboard">
              <a className="menuItem">Guest board</a>
            </Link>
          ),
        },

        {
          key: "5",
          label: (
            <Link href="/faq">
              <a className="menuItem">FAQ</a>
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <Link href="/wishlist">
              <a className="menuItem">Wishlist</a>
            </Link>
          ),
        },
      ]}
    />
  </>
);
const menuAdmin = (
  <>
    <Menu
      items={[
        {
          key: "1",
          label: (
            <>
              <div className="menuItem">
                menuAdmin
                <LogoutNEW />
              </div>
            </>
          ),
        },
        {
          key: "2",
          label: (
            <Link href="/profilesettings">
              <a className="menuItem">Profile</a>
            </Link>
          ),
        },

        {
          key: "3",
          label: (
            <Link href="/adminboard">
              <a className="menuItem">Admin board</a>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link href="/faq">
              <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
                FAQ
              </a>
            </Link>
          ),
        },
      ]}
    />
  </>
);
/* <Menu
items={[
  {
    key: "1",
    label: (
      <>
        <div className=" hover:opacity-80  transition duration-200 ease-out  py-1 pl-1 ">
          <LogoutNEW />
        </div>
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
      <Link href="/addproperty">
        <a className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1">
          Become a host
        </a>
      </Link>
    ),
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
  {
    key: "11",
    label: (
      <div
        className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1"
        onClick={changeMod}
      >
        Change mod
      </div>
    ),
  },
]}
/>*/
