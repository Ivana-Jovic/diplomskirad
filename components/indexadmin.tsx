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
import Link from "next/link";
export default function IndexAdmin({}: {}) {
  return (
    <div className="mt-20 flex flex-col mx-auto max-w-md  px-8 sm:px-16  text-center gap-4 ">
      <Link href="/profilesettings">
        <a className="btn">Profile</a>
      </Link>

      <Link href="/adminboard">
        <a className="btn">Admin board</a>
      </Link>

      <Link href="/faq">
        <a className="btn">FAQ</a>
      </Link>
    </div>
  );
}
