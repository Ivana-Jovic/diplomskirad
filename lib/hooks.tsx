import { signOut, User } from "firebase/auth";
import { getDocs } from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import { useContext } from "react";
import { db, storage } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import { auth } from "../firebase";

import nookies from "nookies";

// export async function logout() {
//   //event: React.MouseEvent<HTMLButtonElement>
//   console.log("nnn");
//   // event.preventDefault(); // Preventing the page from reloading
//   try {
//     await signOut(auth);
//     // .then(() => {
//     console.log("the user signed out");
//     nookies.set(undefined, "token", "", {});
//     // setIsLoggedIn(false);sad
//     router.push({
//       pathname: "/",
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// }

export async function isAvailable(from: Date, to: Date, propertyId: string) {
  const querySnapshot6 = await getDocs(
    query(collection(db, "reservations"), where("propertyId", "==", propertyId))
  );
  for (let index = 0; index < querySnapshot6.docs.length; index++) {
    const doc = querySnapshot6.docs[index];
    console.log("KK ", propertyId, index, doc.id);

    //oni koji se potencijalno poklapaju
    if (new Date(doc.data().to) <= from || new Date(doc.data().from) >= to) {
      //ne poklapaju se
    } else {
      //poklapaju se kako god
      //ako je doc.to izmedju to i from poklapaju se sigurno
      //ako doc.to vece od to poklapaju se  ako je from iymedju ili pre from
      //
      console.log(
        "ELSE GRANA",
        propertyId,
        from.toDateString(),
        to.toDateString()
      );
      console.log("IS AVAILABLE JE FALSE", doc.id);
      return false;
    }
  }
  console.log("IS AVAILABLE JE TRUE");
  return true;
}

export function isFullyRegisteredUser(myUser: DocumentData) {
  if (
    myUser &&
    myUser.firstName &&
    myUser.lastName &&
    myUser.photoURL &&
    myUser.firstName !== "" &&
    myUser.lastName !== "" &&
    myUser.photoURL !== ""
  )
    return true;
  else return false;
}
export function isLoggedUser(myUser: DocumentData) {
  if (myUser && !myUser.host && !myUser.isAdmin) return true;
  else return false;
}
export function isAdmin(myUser: DocumentData) {
  if (myUser && !myUser.host && myUser.isAdmin) return true;
  else return false;
}
export function isHost(myUser: DocumentData) {
  if (myUser && myUser.host && !myUser.isAdmin) return true;
  else return false;
}
// export function isHostModeHost(myUser: DocumentData) {
//   if (myUser && myUser.host && myUser.modeIsHosting && !myUser.isAdmin)
//     return true;
//   else return false;
// }
// export function isHostModeTravel(myUser: DocumentData) {
//   if (myUser && myUser.host && !myUser.modeIsHosting && !myUser.isAdmin)
//     return true;
//   else return false;
// }
export function removedByAdmin(myUser: DocumentData) {
  if (myUser && myUser.removedByAdmin) return true;
  else return false;
}
