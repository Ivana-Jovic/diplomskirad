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
import { db } from "../firebase";

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
