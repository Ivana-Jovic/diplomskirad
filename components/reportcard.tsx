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

export default function ReportCard({ report }: { report: DocumentData }) {
  const [processed, setProcessed] = useState<boolean>(report.processed);
  const reportedUser = useRef<string>(report.hostId); //TODO: promeni u zavisnosti ko koga reportuje

  const processReport = async () => {
    await updateDoc(doc(db, "reports", report.id), {
      processed: true,
    }).then(() => setProcessed(true));
  };
  const deleteUser = async () => {
    if (report.guestIsReporting) {
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
    //TODO obrisi usera u auth tj disable

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
    const docSnap = await getDoc(doc(db, "reservations", report.reservationId));

    if (docSnap.exists()) {
      console.log(docSnap.data().propertyId, report.id);
      await updateDoc(
        doc(
          db,
          "property",
          docSnap.data().propertyId,
          "comments",
          report.commentId
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
          {report.guestIsReporting
            ? "Guest " + report.guestId + " is reporting a host"
            : //+ item.data().hostId
              "Host " +
              // item.data().hostId +
              " is reporting guest" +
              report.guestId}
        </h2>
        <div>
          <div>{new Date(report.createdAt.seconds * 1000).toDateString()}</div>
          <div className="">
            Guest -{report.guestId}
            {/* -{report.guestLastName}- */}
            {/* {report.guestId} */}
          </div>
          <div className="">{report.reportText}</div>
          <div className="">
            guest is Reporting:
            {report.guestIsReporting ? "yes" : "no"}
          </div>
          <div className="">Host {report.hostId}</div>
          <div className="">Reservation Id {report.reservationId}</div>
          {!processed && (
            <div>
              {report.reportText != "comment" && (
                // <Button
                //   action={deleteUser}
                //   text="Report processed - delete this user and his properties"
                //   type=""
                // />
                <button className="btn mt-3" onClick={deleteUser}>
                  Report processed - delete this user and his properties{" "}
                </button>
              )}
              {report.reportText == "comment" && (
                // <Button action={deleteComment} text="Delete comment" type="" />
                <button className="btn mt-3" onClick={deleteComment}>
                  Delete comment
                </button>
              )}
              {/* <Button
                action={processReport}
                text="Report processed - false report"
                type=""
              /> */}
              <button className="btn mt-3" onClick={processReport}>
                Report processed - false report
              </button>
            </div>
          )}
          {processed && <div>** PROCESSED **</div>}
        </div>
      </div>
    </div>
  );
}
