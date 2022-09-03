import type { NextPage } from "next";
import Head from "next/head";
import Banner from "./banner";
import Card from "./card";
import Layout from "./layout";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  DocumentData,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useState } from "react";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  isAdmin,
  isHost,
  isHostModeHost,
  isHostModeTravel,
  isLoggedUser,
} from "../lib/hooks";
import ErrorPage from "../pages/errorpage";
import Link from "next/link";
import LogoutNEW from "./logoutNEW";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";

export default function IndexHostModeHost({}: {}) {
  const { user, myUser } = useContext(AuthContext);
  const router = useRouter();

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

  return (
    //relative h-full
    <div
      className="mt-20  flex  flex-col   mx-auto max-w-md  px-8 sm:px-16    text-center gap-4
       "
    >
      {/* items-center content-start self-center justify-items-center justify-center justify-self-center
    place-items-center place-self-center place-content-center */}
      {/* // className="absolute m-0 top-1/2 translate-y-1/2"> */}
      {/* <div className="absolute m-0 top-1/2 translate-y-1/2"> */}
      <Link href="/profilesettings">
        <a className="btn">Profile</a>
      </Link>
      <Link href="/addproperty">
        <a className=" btn">Add property</a>
      </Link>
      <Link href="/hostsboard">
        <a className=" btn">Host board</a>
      </Link>
      <Link href="/faq">
        <a className="btn">FAQ</a>
      </Link>
      <Link href="/hostsreservations">
        <a className="btn">Host reservations</a>
      </Link>
      <div className="btn" onClick={changeMod}>
        Change mod
      </div>
      {/* </div> */}
    </div>
  );
}
