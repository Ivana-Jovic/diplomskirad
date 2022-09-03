import { User } from "firebase/auth";
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

// export function isUnloggedUser( myUser: DocumentData) {
//   if (!user) return true;
//   else return false;
// }
export function isLoggedUser(myUser: DocumentData) {
  // console.log(myUser, myUser.host, myUser.isAdmin);
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
export function isHostModeHost(myUser: DocumentData) {
  if (myUser && myUser.host && myUser.modeIsHosting && !myUser.isAdmin)
    return true;
  else return false;
}
export function isHostModeTravel(myUser: DocumentData) {
  if (myUser && myUser.host && !myUser.modeIsHosting && !myUser.isAdmin)
    return true;
  else return false;
}
export function removedByAdmin(myUser: DocumentData) {
  if (myUser && myUser.removedByAdmin) return true;
  else return false;
}
// export function isUnloggedUser(user: User, myUser: DocumentData) {
//   if (!user) return true;
//   else return false;
// }
// export function isLoggedUser(user: User, myUser: DocumentData) {
//   if (user && myUser && !myUser.host && !myUser.isAdmin) return true;
//   else return false;
// }
// export function isAdmin(user: User, myUser: DocumentData) {
//   if (user && myUser && !myUser.host && myUser.isAdmin) return true;
//   else return false;
// }
// export function isHost(user: User, myUser: DocumentData) {
//   if (user && myUser && myUser.host && !myUser.isAdmin) return true;
//   else return false;
// }
// export function isHostModeHost(user: User, myUser: DocumentData) {
//   if (user && myUser && myUser.host && myUser.modeIsHosting && !myUser.isAdmin)
//     return true;
//   else return false;
// }
// export function isHostModeTravel(user: User, myUser: DocumentData) {
//   if (user && myUser && myUser.host && !myUser.modeIsHosting && !myUser.isAdmin)
//     return true;
//   else return false;
// }
