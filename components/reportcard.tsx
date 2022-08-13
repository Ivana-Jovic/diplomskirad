import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  QueryDocumentSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../firebase";
import Button from "./button";

export default function ReportCard({
  item,
}: {
  item: QueryDocumentSnapshot<DocumentData>;
}) {
  const [processed, setProcessed] = useState<boolean>(item.data().processed);
  const reportedUser = useRef<string>(item.data().hostId); //TODO: promeni u zavisnosti ko koga reportuje

  const [arr, setArr] = useState<any[]>([]);
  const processReport = async () => {
    await updateDoc(doc(db, "reports", item.id), {
      processed: true,
    }).then(() => setProcessed(true));
  };
  const deleteUser = async () => {
    if (item.data().guestIsReporting) {
      //meaning host is beeing reported -> delete his properties
      //TODO proveri da li ovo brisanje negde remeti rezervacije,reportove
      const q = query(
        collection(db, "property"),
        where("ownerId", "==", "YSX0mxwY9CsRy4IJd8ft") // reportedUser.current //TODO VRATI OVO
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc1) => {
        // setArr((prev)=>[...prev,doc]);
        await deleteDoc(doc(db, "property", doc1.id));
      });
    }
    // reportedUser.current //TODO VRATI OVO
    await deleteDoc(doc(db, "users", "YSX0mxwY9CsRy4IJd8ft")); //Warning: Deleting a document does not delete its subcollections!

    // deleteUser(user)// TODO dodaj brisanje
    //   .then(() => {
    //     // User deleted.
    //   })
    //   .catch((error: any) => {
    //     // An error ocurred
    //     // ...
    //   });
    // Important: To delete a user, the user must have signed in recently. See Re-authenticate a user.
    processReport();
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {item.data().guestIsReporting
            ? "Guest " + item.data().guestFirstName + " is reporting a host"
            : //+ item.data().hostId
              "Host " +
              // item.data().hostId +
              " nis reporting guest" +
              item.data().guestFirstName}
        </h2>
        <div>
          <div className="">
            Guest -{item.data().guestFirstName}-{item.data().guestLastName}-
            {item.data().guestId}
          </div>
          <div className="">{item.data().reportText}</div>
          <div className="">
            guest is Reporting:
            {item.data().guestIsReporting ? "yes" : "no"}
          </div>
          <div className="">Host {item.data().hostId}</div>
          <div className="">Reservation Id {item.data().reservationId}</div>
          {!processed && (
            <div>
              <Button
                action={deleteUser}
                text="Report processed - delete this user and his properties"
                type=""
              />
              <Button
                action={processReport}
                // action={async () => {
                //   await updateDoc(doc(db, "reports", item.id), {
                //     processed: true,
                //   });
                //   return;
                // }}
                text="Report processed - false report"
                type=""
              />
            </div>
          )}
          {processed && <div>** PROCESSED **</div>}
        </div>
      </div>
    </div>
  );
}
