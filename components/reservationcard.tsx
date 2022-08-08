import { NestCamWiredStandTwoTone } from "@mui/icons-material";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import Popup from "./popup";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import Button from "./button";
import { db } from "../firebase";

//TODO vidi svuda za srce klik u fav
export default function ReservationCard({
  item: reservation, //reservation
}: {
  item: QueryDocumentSnapshot<DocumentData>;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [leftFB, setLeftFB] = useState<boolean>(
    reservation.data().leftFeedback
  );
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(1);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const leaveFeedback = async () => {
    //TODO:
    //racunanje za superhosta

    const propertiesRef = collection(db, "property");
    const docRef = await addDoc(
      collection(propertiesRef, reservation.data().propertyId, "comments"),
      {
        comment: comment,
        stars: stars,
        userId: reservation.data().userId,
        firstName: reservation.data().firstName,
        lastName: reservation.data().lastName,
        date: reservation.data().to,
      }
    );

    await updateDoc(doc(db, "property", reservation.data().propertyId), {
      numberOfReviews: increment(1),
      totalStars: increment(stars),

      //TODO timestamp
      //TODO: when I need avg just divide
      // delete field stars in property
    });
    await updateDoc(doc(db, "reservations", reservation.id), {
      leftFeedback: true,
    });

    const docSnap = await getDoc(
      doc(db, "property", reservation.data().propertyId)
    );

    if (docSnap.exists()) {
      if (
        docSnap.data().numberOfReviews >= 5 &&
        docSnap.data().totalStars / docSnap.data().numberOfReviews > 4.8
      ) {
        await updateDoc(doc(db, "users", reservation.data().hostId), {
          isSuperhost: true,
        });
        //update every property- held by superhost
        const q = query(
          collection(db, "property"),
          where("ownerId", "==", reservation.data().hostId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (property) => {
          await updateDoc(doc(db, "property", property.id), {
            isSuperhost: true,
          });
        });
      }
    }
    setLeftFB(true);
    setIsPopupOpen(false);
    setComment("");
    setStars(1);
  };
  return (
    // hover:opacity-80
    <div
      className="flex my-3 border rounded-xl cursor-pointer
hover:shadow-lg
transition duration-200 ease-out"
    >
      <div
        className={`${
          new Date(reservation.data().to) <= new Date()
            ? " bg-red-50"
            : "bg-green-50"
        }`}
      >
        <div>
          {new Date(reservation.data().to) <= new Date() ? "" : "**UPCOMING**"}
        </div>
        <div className="text-xl font-semibold">{reservation.data().title}</div>
        {/* <div>{item.data().propertyId}</div> */}
        <div className="text-lg font-semibold">
          {reservation.data().user}-{reservation.data().userId}
        </div>
        <div className="text-lg font-semibold">
          {reservation.data().from} - {reservation.data().to}
        </div>
        <div>Total: {reservation.data().total}e</div>
        <div>Guests: {reservation.data().guests}</div>
        <div>Garage: {reservation.data().garage ? "YES" : "NO"}</div>
        {/* TODO */}
        <div>
          Time of check in/out: {reservation.data().timeCheckIn}:00 /{" "}
          {reservation.data().timeCheckOut}:00
        </div>
        {/* TODO */}
        <div>
          Special request:
          {reservation.data().specialReq
            ? reservation.data().specialReq
            : "none"}
        </div>
        {/* TODO */}

        <div>
          {new Date(reservation.data().to) <= new Date() && (
            <div>
              {!leftFB && (
                <button
                  onClick={() => {
                    togglePopup();
                  }}
                >
                  Leave feedback
                </button>
              )}
              {isPopupOpen && (
                <Popup
                  content={
                    <>
                      Leave feedback:
                      <textarea
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                        className="outline-0 border bg-transparent text-lg text-gray-600"
                      />
                      <div className="flex">
                        <input
                          value={stars}
                          onChange={(e) => {
                            setStars(parseInt(e.target.value));
                          }}
                          type="number"
                          placeholder="1"
                          min={1}
                          max={5}
                          className="outline-0  bg-transparent text-lg text-gray-600"
                        />
                        <StarOutlineRoundedIcon />
                      </div>
                      <Button
                        action={leaveFeedback} //TODO: zasto ako je lambda ovde se poyove vise puta
                        text="Leave feedback"
                        type=""
                      />
                    </>
                  }
                  handleClose={togglePopup}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
