import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../firebase";
import Button from "./button";
//TODO become a host by adding property
//TODO
//if the user is removed by admin he cannot See any content
// make reservations
//  add new properties (and become a host)
//  report comments, users
// if a property is rremoved it can no longer be reserved
export default function ReportCard({ report }: { report: DocumentData }) {
  const [processed, setProcessed] = useState<boolean>(report.processed);

  const processReport = async () => {
    await updateDoc(doc(db, "reports", report.id), {
      processed: true,
    }).then(() => setProcessed(true));
  };
  const deleteUser = async () => {
    if (report.guestIsReporting) {
      //meaning host is beeing reported -> delete his properties

      const q = query(
        collection(db, "property"),
        where("ownerId", "==", report.hostId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc1) => {
        await updateDoc(doc(db, "property", doc1.id), {
          removedByAdmin: true,
        });
      });
      await updateDoc(doc(db, "users", report.hostId), {
        removedByAdmin: true,
      });
      // //meaning host is beeing reported -> delete his properties
      // // proveri da li ovo brisanje negde remeti rezervacije,reportove
      // const q = query(
      //   collection(db, "property"),
      //   where("ownerId", "==", "YSX0mxwY9CsRy4IJd8ft") // reportedUser.current  VRATI OVO
      // );
      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach(async (doc1) => {
      //   await deleteDoc(doc(db, "property", doc1.id));
      // });
    } else {
      await updateDoc(doc(db, "users", report.guestId), {
        removedByAdmin: true,
      });
    }
    // proveri da li ovo brisanje negde remeti rezervacije,reportove
    // reportedUser.current // VRATI OVO
    // await deleteDoc(doc(db, "users", "YSX0mxwY9CsRy4IJd8ft")); //Warning: Deleting a document does not delete its subcollections!
    // obrisi usera u auth tj disable

    // deleteUser(user)//  dodaj brisanje
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
    <div className="card w-full bg-base-100 shadow-xl">
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
        <div className="">
          Created at {new Date(report.createdAt).toDateString()}
        </div>
        <div className="">reportId {report.id}</div>
        <div>
          {/* <div>{report.id}</div> */}
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
          {/* <div className="">Reservation Id {report.reservationId}</div> */}
          <div className="">Reservation Id {report.reservationId}</div>
          {!processed && (
            <div>
              {report.reportText != "comment" && (
                // <Button
                //   action={deleteUser}
                //   text="Report processed - delete this user and his properties"
                //   type=""
                // />
                <button className="btn mt-3 w-full" onClick={deleteUser}>
                  Report processed - delete this user and his properties{" "}
                </button>
              )}
              <div className="flex flex-col">
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
            </div>
          )}
          {processed && <div>** PROCESSED **</div>}
        </div>
      </div>
    </div>
  );
}
