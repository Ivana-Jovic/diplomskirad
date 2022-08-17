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
  report,
}: {
  report: QueryDocumentSnapshot<DocumentData>;
}) {
  const [processed, setProcessed] = useState<boolean>(report.data().processed);
  const reportedUser = useRef<string>(report.data().hostId); //TODO: promeni u zavisnosti ko koga reportuje

  const [arr, setArr] = useState<any[]>([]);
  const processReport = async () => {
    await updateDoc(doc(db, "reports", report.id), {
      processed: true,
    }).then(() => setProcessed(true));
  };
  const deleteUser = async () => {
    if (report.data().guestIsReporting) {
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
  const deleteComment = async () => {
    const docSnap = await getDoc(
      doc(db, "reservations", report.data().reservationId)
    );

    if (docSnap.exists()) {
      console.log(docSnap.data().propertyId, report.id);
      await updateDoc(
        doc(
          db,
          "property",
          docSnap.data().propertyId,
          "comments",
          report.data().commentId
        ),
        {
          comment: "* removed because of  inappropriate vocabulary *",
        }
      ).then(() => setProcessed(true));
    }
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {report.data().guestIsReporting
            ? "Guest " + report.data().guestFirstName + " is reporting a host"
            : //+ item.data().hostId
              "Host " +
              // item.data().hostId +
              " nis reporting guest" +
              report.data().guestFirstName}
        </h2>
        <div>
          <div className="">
            Guest -{report.data().guestFirstName}-{report.data().guestLastName}-
            {report.data().guestId}
          </div>
          <div className="">{report.data().reportText}</div>
          <div className="">
            guest is Reporting:
            {report.data().guestIsReporting ? "yes" : "no"}
          </div>
          <div className="">Host {report.data().hostId}</div>
          <div className="">Reservation Id {report.data().reservationId}</div>
          {!processed && (
            <div>
              {report.data().reportText != "comment" && (
                <Button
                  action={deleteUser}
                  text="Report processed - delete this user and his properties"
                  type=""
                />
              )}
              {report.data().reportText == "comment" && (
                <Button action={deleteComment} text="Delete comment" type="" />
              )}
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
