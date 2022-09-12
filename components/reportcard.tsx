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
  increment,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import toast from "react-hot-toast";
import { deleteObject, ref } from "firebase/storage";
import PropertySettings from "../pages/propertysettings";

export default function ReportCard({ report }: { report: DocumentData }) {
  const [processed, setProcessed] = useState<boolean>(report.processed);

  const processReport = async () => {
    await updateDoc(doc(db, "reports", report.id), {
      processed: true,
    }).then(() => {
      setProcessed(true);
      toast.success("Report marked as seen");
    });
  };
  const deleteUser = async () => {
    // if the user is removed by admin he cannot See any content
    // if a property is rremoved it can no longer be reserved
    // but reservations already made stay there

    if (report.guestIsReporting) {
      //meaning host is beeing reported
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
    } else {
      await updateDoc(doc(db, "users", report.guestId), {
        removedByAdmin: true,
      });
    }
    processReport();
  };
  const deleteComment = async () => {
    await updateDoc(
      doc(db, "property", report.propertyId, "comments", report.commentId),
      {
        comment: "* removed because of  inappropriate vocabulary *",
      }
    );
    processReport();
  };

  const deleteProperty = async () => {
    const property = await (
      await getDoc(doc(db, "property", report.propertyId))
    ).data();
    console.log(property);
    for (let index = 0; index < property.images.length; index++) {
      console.log(property.images[index]);
      await deleteObject(ref(storage, property.images[index]));
    }
    await deleteDoc(doc(db, "property", report.propertyId));
    processReport();
  };

  const approveProperty = async () => {
    await updateDoc(doc(db, "property", report.propertyId), {
      adminApproved: true,
    });
    if (report.firstProperty) {
      await updateDoc(doc(db, "users", report.hostId), {
        numberOfProperties: increment(1),
        host: true,
      });
    } else {
      await updateDoc(doc(db, "users", report.hostId), {
        numberOfProperties: increment(1),
      });
    }

    processReport();
  };
  return (
    <>
      {report.reportText !== "wantsToAddProperty" && (
        <div className="card w-full bg-bgBase shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {report.guestIsReporting
                ? "Guest " + " is reporting: " + report.reportText
                : //+ item.data().hostId
                  "Host " +
                  // item.data().hostId +
                  " is reporting:  " +
                  report.reportText}
            </h2>
            <div>
              <div className="">
                Created at {new Date(report.createdAt).toDateString()}
              </div>
              <div className="">Report id: {report.id}</div>
              {/* Guest is Reporting:
              {report.guestIsReporting ? "yes" : "no"} */}
              {/* <div>{report.id}</div> */}
              <div className="">
                Guest: {report.guestId}
                {/* -{report.guestLastName}- */}
                {/* {report.guestId} */}
              </div>
              <div className="">Host: {report.hostId}</div>
              {/* <div className="">{report.reportText}</div> */}
              {/* <div className="">Reservation Id {report.reservationId}</div> */}
              <div className="">Reservation id: {report.reservationId}</div>
              {!processed && (
                <div>
                  {report.reportText !== "comment" && (
                    <button className="btn mt-3 w-full" onClick={deleteUser}>
                      Report processed - delete this user and his properties{" "}
                    </button>
                  )}
                  <div className="flex flex-col">
                    {report.reportText === "comment" && (
                      // <Button action={deleteComment} text="Delete comment" type="" />
                      <button className="btn mt-3" onClick={deleteComment}>
                        Delete comment
                      </button>
                    )}
                    <button className="btn mt-3" onClick={processReport}>
                      Report processed - false report
                    </button>
                  </div>
                </div>
              )}
              {processed && (
                <div className="badge mt-3 w-full">** PROCESSED **</div>
              )}
            </div>
          </div>
        </div>
      )}
      {report.reportText === "wantsToAddProperty" && (
        <div className="card w-full bg-bgBase shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Host wants to add a property</h2>
            <div>
              <div className="">
                Created at {new Date(report.createdAt).toDateString()}
              </div>
              <div className="">Report id: {report.id}</div>
              {/* <div className="">{report.reportText}</div> */}
              <div className="">Host: {report.hostId}</div>
              {!processed && (
                <div>
                  <button className="btn mt-3 w-full" onClick={deleteProperty}>
                    Report processed - delete property
                  </button>

                  <button
                    className="btn mt-3  w-full"
                    onClick={approveProperty}
                  >
                    Report processed - approve property
                  </button>
                </div>
              )}
              {processed && (
                <div className="badge mt-3 w-full">** PROCESSED **</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
