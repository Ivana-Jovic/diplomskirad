import { Rating } from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import toast from "react-hot-toast";

export default function CommentCard({
  comment,
  propertyOwnerId,
}: {
  comment: QueryDocumentSnapshot<DocumentData>;
  propertyOwnerId: string;
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { user, myUser, hostModeHostC } = useContext(AuthContext);
  const [reported, setReported] = useState<boolean>(comment.data().reported);
  const report = async () => {
    const docRef = await addDoc(collection(db, "reports"), {
      guestId: comment.data().userId, //ko je komentarisao
      reservationId: comment.data().reservationId,
      propertyId: comment.data().propertyId,
      hostId: user?.uid ?? "",
      guestIsReporting: false,
      reportText: "comment",
      processed: false,
      commentId: comment.id,
      createdAt: Timestamp.now().toMillis(),
    });
    await updateDoc(doc(db, "reports", docRef.id), {
      id: docRef.id,
    });
    const propertiesRef = collection(
      db,
      "property",
      comment.data().propertyId,
      "comments"
    );
    const ref = doc(propertiesRef, comment.id);
    const docRef2 = await updateDoc(ref, {
      reported: true,
    });
    toast.success("Reported successfully");
    setReported(true);
  };
  return (
    <div className="my-5 p-2 border">
      <div>
        {comment.data().firstName} {comment.data().lastName}
      </div>
      <div className="text-xs">
        {months[new Date(comment.data().date).getMonth()]}
        &nbsp;
        {new Date(comment.data().date).getFullYear()}
      </div>
      <div>
        <Rating
          name="read-only"
          value={comment.data().stars}
          readOnly
          size="small"
        />
      </div>

      <div className="font-normal">{comment.data().comment}</div>
      {myUser &&
        myUser.host &&
        hostModeHostC &&
        !reported &&
        user &&
        user.uid === propertyOwnerId && ( // it has to be hosts property
          <div className="mt-3">
            <button
              className="btn"
              onClick={() => {
                report();
              }}
            >
              Do you want to report?
            </button>
          </div>
        )}
    </div>
  );
}
