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
import Rating from "@mui/material/Rating";

//TODO vidi svuda za srce klik u fav
export default function ReservationCard({
  // item: reservation, //reservation

  userId,
  firstName,
  lastName,
  to,
  from,
  propertyId,

  hostId,
  garage,
  guests,
  specialReq,
  timeCheckIn,
  timeCheckOut,
  title,
  total,
  user,
  leftFeedback,
  reservationId,
}: {
  // item: QueryDocumentSnapshot<DocumentData>;

  userId: string;
  firstName: string;
  lastName: string;
  to: string;
  from: string;
  propertyId: string;

  hostId: string;
  garage: boolean;
  guests: number;
  specialReq: string;
  timeCheckIn: number;
  timeCheckOut: number;
  title: string;
  total: number;
  user: string;
  leftFeedback: boolean;
  reservationId: string;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [leftFB, setLeftFB] = useState<boolean>(leftFeedback);
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number | null>(1);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const leaveFeedback = async () => {
    //TODO:
    //racunanje za superhosta

    const propertiesRef = collection(db, "property");
    const docRef = await addDoc(
      collection(propertiesRef, propertyId, "comments"),
      {
        comment: comment,
        stars: stars ? stars : 1,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        date: to,
      }
    );

    await updateDoc(doc(db, "property", propertyId), {
      numberOfReviews: increment(1),
      totalStars: increment(stars ? stars : 1),

      //TODO timestamp
      //TODO: when I need avg just divide
      // delete field stars in property
    });
    await updateDoc(doc(db, "reservations", reservationId), {
      leftFeedback: true,
    });

    const docSnap = await getDoc(doc(db, "property", propertyId));

    if (docSnap.exists()) {
      if (
        docSnap.data().numberOfReviews >= 5 &&
        docSnap.data().totalStars / docSnap.data().numberOfReviews > 4.8
      ) {
        await updateDoc(doc(db, "users", hostId), {
          isSuperhost: true,
        });
        //update every property- held by superhost
        const q = query(
          collection(db, "property"),
          where("ownerId", "==", hostId)
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
    //     <div
    //       className="flex my-3 border rounded-md cursor-pointer
    // hover:shadow-lg
    // transition duration-200 ease-out"
    //     >
    //       <div
    //         className={`${
    //           new Date(to) <= new Date()
    //             ? " bg-red-50"
    //             : "bg-green-50"
    //         }`}
    //       >
    //         <div>
    //           {new Date(to) <= new Date() ? "" : "**UPCOMING**"}
    //         </div>
    //         <div className="text-xl font-semibold">{title}</div>
    //         {/* <div>{item.data().propertyId}</div> */}
    //         <div className="text-lg font-semibold">
    //           {user}-{userId}
    //         </div>
    //         <div className="text-lg font-semibold">
    //           {from} - {to}
    //         </div>
    //         <div>Total: {total}e</div>
    //         <div>Guests: {guests}</div>
    //         <div>Garage: {garage ? "YES" : "NO"}</div>
    //         {/* TODO */}
    //         <div>
    //           Time of check in/out: {timeCheckIn}:00 /{" "}
    //           {timeCheckOut}:00
    //         </div>
    //         {/* TODO */}
    //         <div>
    //           Special request:
    //           {specialReq
    //             ? specialReq
    //             : "none"}
    //         </div>
    //         {/* TODO */}

    //         <div>
    //           {new Date(to) <= new Date() && (
    //             <div>
    //               {!leftFB && (
    //                 <button
    //                   onClick={() => {
    //                     togglePopup();
    //                   }}
    //                 >
    //                   Leave feedback
    //                 </button>
    //               )}
    //               {isPopupOpen && (
    //                 <Popup
    //                   content={
    //                     <>
    //                       Leave feedback:
    //                       <div className="flex">
    //                         {/* <input
    //                           value={stars}
    //                           onChange={(e) => {
    //                             setStars(parseInt(e.target.value));
    //                           }}
    //                           type="number"
    //                           placeholder="1"
    //                           min={1}
    //                           max={5}
    //                           className="outline-0  bg-transparent text-lg text-gray-600"
    //                         />
    //                         <StarOutlineRoundedIcon /> */}
    //                         <Rating
    //                           name="simple-controlled"
    //                           value={stars}
    //                           onChange={(event, newValue) => {
    //                             setStars(newValue);
    //                           }}
    //                         />
    //                       </div>
    //                       <textarea
    //                         value={comment}
    //                         onChange={(e) => {
    //                           setComment(e.target.value);
    //                         }}
    //                         className="outline-0 border bg-transparent text-lg text-gray-600"
    //                       />
    //                       <Button
    //                         action={leaveFeedback} //TODO: zasto ako je lambda ovde se poyove vise puta
    //                         text="Leave feedback"
    //                         type=""
    //                       />
    //                     </>
    //                   }
    //                   handleClose={togglePopup}
    //                 />
    //               )}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    <div
      className={
        `card shadow-lg my-3  max-w-5xl h-96 ` +
        `${new Date(to) <= new Date() ? " bg-[#f1efef]" : " bg-[#eff5ef]"}`
      }
    >
      {/* <div className="indicator">
  <span className="indicator-item indicator-center badge badge-secondary"></span>
  <div className="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div> */}

      <div className="card-body">
        <div>
          <div className="text-center  text-xl font-semibold">
            {new Date(to) <= new Date() ? (
              ""
            ) : (
              <div className="badge p-4 mb-3 bg-footer">** UPCOMING **</div>
            )}
          </div>
          <div className="text-xl font-semibold text-center  mb-3">{title}</div>
          {/* <div>{item.data().propertyId}</div> */}
          <div className="flex text-lg font-semibold justify-center text-center items-center mb-2">
            <div>{user}</div>
            <div className="text-xs">-{userId}</div>
          </div>
          <div className="text-center text-xs">
            Reservation number:{reservationId}
          </div>
          <div className="text-lg font-semibold text-center mb-5">
            {from} -{to}
          </div>
          {/* <div>Total: {total}e</div>
          <div>Guests: {guests}</div>
          <div>Garage: {garage ? "YES" : "NO"}</div>
          {/* TODO */}
          {/* <div>
            Time of check in/out: {timeCheckIn}:00 /{" "}
            {timeCheckOut}:00
          </div>
          {/* TODO */}
          {/*<div>
            Special request:
            {specialReq
              ? specialReq
              : "none"}
          </div> */}
          {/* TODO */}
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr>
                  <td>Total:</td>
                  <td>{total}e</td>
                </tr>
                <tr>
                  <td>Guests:</td>
                  <td> {guests}</td>
                </tr>
                <tr>
                  <td>Garage:</td>
                  <td>{garage ? "YES" : "NO"}</td>
                </tr>
                <tr>
                  <td> Time of check in/out:</td>
                  <td>
                    {timeCheckIn}:00 / {timeCheckOut}:00
                  </td>
                </tr>
                <tr>
                  <td>Special request:</td>
                  <td>{specialReq ? specialReq : "none"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {new Date(to) <= new Date() && (
              <div>
                {!leftFB && (
                  <Button
                    action={togglePopup} //TODO: zasto ako je lambda ovde se poyove vise puta
                    text="Leave feedback"
                    type=""
                  />
                )}
                {isPopupOpen && (
                  <Popup
                    content={
                      <>
                        Leave feedback:
                        <div className="flex">
                          {/* <input
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
                        <StarOutlineRoundedIcon /> */}
                          <Rating
                            name="simple-controlled"
                            value={stars}
                            onChange={(event, newValue) => {
                              setStars(newValue);
                            }}
                          />
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                          className="outline-0 border bg-transparent text-lg text-gray-600"
                        />
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
    </div>
  );
}
