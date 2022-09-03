import { db } from "../firebase";
import { useContext } from "react";

import Link from "next/link";
import LogoutNEW from "./logoutNEW";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";

export default function RemovedByAdmin() {
  return (
    <div className="h-screen bg-background flex items-center justify-center">
      ** You are removed by admin **
    </div>
  );
}
