import { Rating } from "@mui/material";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  DocumentData,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";

export default function CommentCard({
  comment,
}: {
  comment: QueryDocumentSnapshot<DocumentData>;
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

  const { user, myUser } = useContext(AuthContext);
  const [reported, setReported] = useState<boolean>(comment.data().reported);
  const report = async () => {
    //report comment
    const docRef = await addDoc(collection(db, "reports"), {
      guestId: comment.data().userId, //ko je komentarisao
      // guestFirstName: comment.data().firstName,
      // guestLastName: comment.data().lastName,
      reservationId: comment.data().reservationId,
      propertyId: comment.data().propertyId,
      hostId: user?.uid ?? "",
      // reportedFirstName: myUser.firstName,
      // reportedLastName: myUser.lastName,
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
    setReported(true);
  };
  return (
    <div className="my-5 p-2 border">
      <div>
        {comment.data().firstName}-{comment.data().lastName}
      </div>
      <div>{new Date(comment.data().createdAt).toDateString()}</div>
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
      {myUser && myUser.host && !reported && (
        <div className="mt-3">
          {myUser.host && (
            <button
              className="btn"
              onClick={() => {
                report();
              }}
            >
              Do you want to report?
            </button>
          )}
        </div>
      )}
    </div>
  );
}
