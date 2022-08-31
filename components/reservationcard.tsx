import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "./button";
import { db } from "../firebase";
import Rating from "@mui/material/Rating";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

// const theme = createTheme({
//   components: {
//     MuiDatePicker: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "red",
//         },
//       },
//     },
//   },
// });

// const theme = createTheme({
//   components: {
//     Radio: {
//       '&$checked': {
//         color: '#4B8DF8'
//       }
//     },
//     checked: {}
//   },
// });

//TODO vidi svuda za srce klik u fav
export default function ReservationCard({
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
  isHost,
}: {
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
  timeCheckIn: string;
  timeCheckOut: string;
  title: string;
  total: number;
  user: string;
  leftFeedback: boolean;
  reservationId: string;
  isHost: boolean;
}) {
  const [leftFB, setLeftFB] = useState<boolean>(leftFeedback);
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number | null>(1);
  const [reportOpen, setReportOpen] = useState<boolean>(isHost ? true : false);
  const [reportReason, setReportReason] = useState<string>("");
  //todo pri reportu se ne brise  nista vec blikira prisup - yasivi se
  const leaveFeedback = async () => {
    const propertiesRef = collection(db, "property");
    // const docRef = await setDoc(
    //   doc(
    //     collection(
    //       db,
    //       "property/" + propertiesRef + "/" + propertyId + "/" + "comments"
    //     )
    //     // Timestamp.now().seconds
    //   ),

    //   {
    //     comment: comment,
    //     stars: stars ? stars : 1,
    //     userId: userId,
    //     firstName: firstName,
    //     lastName: lastName,
    //     date: to,
    //     reservationId: reservationId,
    //     createdAt: Timestamp.now(),
    //   }
    // );//TODO komentari hronoloski
    const docRef = await addDoc(
      collection(propertiesRef, propertyId, "comments"),
      {
        comment: comment,
        stars: stars ? stars : 1,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        date: to,
        reservationId: reservationId,
        createdAt: Timestamp.now(),
      }
    );
    // item.data().createdAt.seconds
    await updateDoc(doc(db, "property", propertyId), {
      numberOfReviews: increment(1),
      totalStars: increment(stars ? stars : 1),
      totalEarnings: increment(total),
      totalOccupancyDays: increment(
        Math.round(
          (new Date(to).getTime() - new Date(from).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),
    });

    await updateDoc(doc(db, "reservations", reservationId), {
      leftFeedback: true,
    });
    const docSnap = await getDoc(doc(db, "property", propertyId));
    //becoming a superhost
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

    if (reportOpen) {
      report();
    }
    setLeftFB(true);
    // setIsPopupOpen(false);
    setComment("");
    setStars(1);
    setReportReason("");
  };

  const report = async () => {
    const docRef = await addDoc(collection(db, "reports"), {
      guestId: userId,
      // guestFirstName: firstName,
      // guestLastName: lastName,
      reservationId: reservationId,
      hostId: hostId,
      // reportedFirstName: myUser.firstName,
      // reportedLastName: myUser.lastName,
      guestIsReporting: !isHost,
      reportText: reportReason,
      processed: false,
      createdAt: Timestamp.now(),
    });
    await updateDoc(doc(db, "reports", docRef.id), {
      id: docRef.id,
    });
  };

  return (
    <div
      className={
        `card rounded-md shadow-lg my-3  max-w-5xl h-96 ` +
        `${new Date(to) <= new Date() ? " bg-[#f1efef]" : " bg-[#eff5ef]"}`
      }
    >
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
            Reservation number: {reservationId}
          </div>
          <div className="text-center text-xs">Propertyid:{propertyId}</div>
          <div className="text-lg font-semibold text-center mb-5">
            {from} -{to}
          </div>
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
                    {timeCheckIn}-{timeCheckOut}
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
              <div className="text-center mt-5">
                {!leftFB && (
                  <>
                    <label
                      htmlFor="my-modal-3"
                      className="btn btn-active border-none
                      
                      shadow-md 
                      hover:shadow-lg active:scale-90 transition duration-150"
                    >
                      {isHost ? "Report" : "Leave feedback"}
                    </label>
                    <input
                      type="checkbox"
                      id="my-modal-3"
                      className="modal-toggle"
                    />
                    <label htmlFor="my-modal-3" className="modal cursor-pointe">
                      <label className="modal-box relative">
                        <label
                          htmlFor="my-modal-3"
                          className="btn btn-sm btn-circle absolute right-2 top-2"
                        >
                          ✕
                        </label>
                        <h3 className="text-lg font-bold mb-3">
                          {isHost ? "Report" : "Leave feedback"}
                        </h3>
                        <div className="w-full">
                          {!isHost && (
                            <>
                              <div className="flex">
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
                                className="outline-0 border bg-transparent text-lg text-gray-600 w-full"
                              />
                            </>
                          )}
                          <div className="flex flex-col">
                            {!isHost && (
                              // <Button
                              //   action={() => setReportOpen(!reportOpen)}
                              //   text="Do you want to report?"
                              //   type=""
                              // />
                              <button
                                className="btn mt-3"
                                onClick={() => setReportOpen(!reportOpen)}
                              >
                                Do you want to report?
                              </button>
                            )}
                            {/* <Button //ako je vlasnik onda ne ostavlja feedback vec samo reportuje
                            action={leaveFeedback}
                            text={isHost ? "Report" : "Leave feedback"}
                            type=""
                          /> */}
                            {reportOpen && (
                              <div className="mt-3">
                                <FormControl>
                                  <FormLabel
                                    id="demo-radio-buttons-group-label"
                                    className="text-text "
                                  >
                                    Please tell us the reason for filing a
                                    report
                                  </FormLabel>
                                  <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="behavior"
                                    name="radio-buttons-group"
                                    onChange={(e) => {
                                      setReportReason(e.target.value);
                                    }}
                                  >
                                    <FormControlLabel
                                      value="behavior"
                                      control={<Radio />}
                                      label="Inappropriate behavior"
                                      // checked
                                    />
                                    {isHost && (
                                      <FormControlLabel
                                        value="destruction"
                                        control={<Radio />}
                                        label="Destruction of property"
                                      />
                                    )}
                                    {!isHost && (
                                      <FormControlLabel
                                        value="description"
                                        control={<Radio />}
                                        label="Property does not match description"
                                      />
                                    )}
                                    <FormControlLabel
                                      value="other"
                                      control={<Radio />}
                                      label="Other"
                                    />
                                  </RadioGroup>
                                </FormControl>
                                {/* <Button action={report} text="Report" type="" /> */}
                              </div>
                            )}
                            <button
                              className="btn mt-3"
                              onClick={leaveFeedback}
                            >
                              {isHost ? "Report" : "Leave feedback"}
                            </button>
                          </div>
                        </div>
                      </label>
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
