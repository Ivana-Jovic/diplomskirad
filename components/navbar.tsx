import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useContext, useState } from "react";
import LogoutNEW from "./logout";
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
  isFullyRegisteredUser,
  isHost,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import SimpleBackdrop from "./backdrop";

export default function Navbar({ placeholder }: { placeholder?: string }) {
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);
  function changeMod() {
    setHostModeHostC(!hostModeHostC);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  const menuLoggedUser = (
    <>
      <Menu
        items={[
          {
            key: "1",
            label: (
              <>
                <div className=" menuItem">
                  menu logged user
                  <LogoutNEW />
                </div>
              </>
            ),
          },
          {
            key: "2",
            label: (
              <Link href="/profilesettings">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/profilesettings")
                      setLoading(true);
                  }}
                >
                  Profile
                </a>
              </Link>
            ),
          },
          {
            key: "3",
            label: (
              <Link href="/guestboard">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/guestboard") setLoading(true);
                  }}
                >
                  Guest board
                </a>
              </Link>
            ),
          },
          {
            key: "4",
            label: (
              <Link href="/wishlist">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/wishlist") setLoading(true);
                  }}
                >
                  Wishlist
                </a>
              </Link>
            ),
          },
          {
            key: "5",
            label: (
              <Link href="/addproperty">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/addproperty") setLoading(true);
                  }}
                >
                  Become a host
                </a>
              </Link>
            ),
          },

          {
            key: "6",
            label: (
              <Link href="/faq">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/faq") setLoading(true);
                  }}
                >
                  FAQ
                </a>
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
                  menu admin
                  <LogoutNEW />
                </div>
              </>
            ),
          },
          {
            key: "2",
            label: (
              <Link href="/profilesettings">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/profilesettings")
                      setLoading(true);
                  }}
                >
                  Profile
                </a>
              </Link>
            ),
          },

          {
            key: "3",
            label: (
              <Link href="/adminboard">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/adminboard") setLoading(true);
                  }}
                >
                  Admin board
                </a>
              </Link>
            ),
          },
          {
            key: "4",
            label: (
              <Link href="/faq">
                <a
                  className="hover:opacity-80  transition duration-200 ease-out  py-1 pl-1"
                  onClick={() => {
                    if (router.pathname !== "/faq") setLoading(true);
                  }}
                >
                  FAQ
                </a>
              </Link>
            ),
          },
        ]}
      />
    </>
  );
  const menuHostModeHost = (
    <>
      <Menu
        items={[
          {
            key: "1",
            label: (
              <div className=" menuItem ">
                menu host mode host
                <LogoutNEW />
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <Link href="/profilesettings">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/profilesettings")
                      setLoading(true);
                  }}
                >
                  Profile
                </a>
              </Link>
            ),
          },

          {
            key: "3",
            label: (
              <Link href="/addproperty">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/addproperty") setLoading(true);
                  }}
                >
                  Add property
                </a>
              </Link>
            ),
          },
          {
            key: "4",
            label: (
              <Link href="/hostsboard">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/hostsboard") setLoading(true);
                  }}
                >
                  Host board
                </a>
              </Link>
            ),
          },
          {
            key: "5",
            label: (
              <Link href="/hostsreservations">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/hostsreservations")
                      setLoading(true);
                  }}
                >
                  Host reservations
                </a>
              </Link>
            ),
          },
          {
            key: "6",
            label: (
              <div
                className="menuItem"
                onClick={() => {
                  changeMod();
                }}
              >
                Change mod
              </div>
            ),
          },
          {
            key: "7",
            label: (
              <Link href="/faq">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/faq") setLoading(true);
                  }}
                >
                  FAQ
                </a>
              </Link>
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
                  menu host mode travel
                  <LogoutNEW />
                </div>
              </>
            ),
          },
          {
            key: "2",
            label: (
              <Link href="/profilesettings">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/profilesettings")
                      setLoading(true);
                  }}
                >
                  Profile
                </a>
              </Link>
            ),
          },

          {
            key: "3",
            label: (
              <Link href="/guestboard">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/guestboard") setLoading(true);
                  }}
                >
                  Guest board
                </a>
              </Link>
            ),
          },

          {
            key: "4",
            label: (
              <Link href="/wishlist">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/wishlist") setLoading(true);
                  }}
                >
                  Wishlist
                </a>
              </Link>
            ),
          },

          {
            key: "5",
            label: (
              <div
                className="menuItem"
                onClick={() => {
                  changeMod();
                }}
              >
                Change mod
              </div>
            ),
          },
          {
            key: "6",
            label: (
              <Link href="/faq">
                <a
                  className="menuItem"
                  onClick={() => {
                    if (router.pathname !== "/faq") setLoading(true);
                  }}
                >
                  FAQ
                </a>
              </Link>
            ),
          },
        ]}
      />
    </>
  );
  const menuNotFullyReg = (
    <>
      <Menu
        items={[
          {
            key: "1",
            label: (
              <Link href="/profilesettings">
                <a className="menuItem">Profile</a>
              </Link>
            ),
          },
        ]}
      />
    </>
  );
  const menuRemovedByAdmin = (
    <>
      <Menu
        items={[
          {
            key: "1",
            label: (
              <div className=" menuItem ">
                menuRemovedByAdmin
                <LogoutNEW />
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
      {!removedByAdmin(myUser) &&
        isLoggedUser(myUser) &&
        isFullyRegisteredUser(myUser) &&
        menuLoggedUser}
      {isAdmin(myUser) && isFullyRegisteredUser(myUser) && menuAdmin}
      {!removedByAdmin(myUser) &&
        isHost(myUser) &&
        hostModeHostC &&
        isFullyRegisteredUser(myUser) &&
        menuHostModeHost}
      {!removedByAdmin(myUser) &&
        isHost(myUser) &&
        !hostModeHostC &&
        isFullyRegisteredUser(myUser) &&
        menuHostModeTravel}
      {!removedByAdmin(myUser) &&
        !isFullyRegisteredUser(myUser) &&
        menuNotFullyReg}

      {removedByAdmin(myUser) && menuRemovedByAdmin}
    </>
  );

  return (
    <>
      {loading && <SimpleBackdrop loading={loading} />}
      <div
        className="py-5 shadow-xl bg-header flex flex-col
       w-full sticky top-0 z-[100]"
      >
        <div
          className="sm:px-5  md:px-10 grid grid-cols-3
         items-center"
        >
          <Link href="/">
            <a
              onClick={() => {
                if (
                  router.pathname !== "/" &&
                  router.pathname !== "/indexadmin" &&
                  isFullyRegisteredUser(myUser)
                )
                  setLoading(true);
              }}
              className=" text-2xl !text-darkGreen  font-logo
         font-semibold mr-2 cursor-pointer pl-3 "
            >
              <LocationCityIcon fontSize="large" />
            </a>
          </Link>

          {
            <div
              className="flex items-center space-x-4 justify-self-end col-span-2 pr-3
"
            >
              {((user && myUser) || user === null) &&
                router &&
                router.pathname !== "/" &&
                router.pathname !== "/profilesettings" &&
                (isLoggedUser(myUser) ||
                  (isHost(myUser) && !hostModeHostC)) && (
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
                          {(!myUser || !myUser.photoURL) && (
                            <AccountCircleIcon />
                          )}
                          <ExpandMoreRoundedIcon />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                </>
              )}
              {user === null && (
                <>
                  <SignInRegisterPopup />
                </>
              )}
            </div>
          }
        </div>

        {openSearch && router.pathname !== "/" && (
          <div className="flex flex-col w-screen col-span-2  mt-5 -mb-5">
            <Banner setOpenSearch={setOpenSearch} />
          </div>
        )}
      </div>
    </>
  );
}
