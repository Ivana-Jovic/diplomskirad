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
import { db } from "../firebase";
import Rating from "@mui/material/Rating";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import toast from "react-hot-toast";
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
  createdAt,
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
  createdAt: number;
}) {
  const len: number = 15;
  const [leftFB, setLeftFB] = useState<boolean>(leftFeedback);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [stars, setStars] = useState<number | null>(1);
  const [reportOpen, setReportOpen] = useState<boolean>(isHost ? true : false);
  const [reportReason, setReportReason] = useState<string>("");

  const leaveFeedback = async () => {
    if (!isHost && comment === "") {
      setError("Please enter a comment.");
      return;
    }
    if (!isHost && comment.length > 50) {
      setError("Coment too long(max is 50 chars).");
      return;
    }

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
        reservationId: reservationId,
        createdAt: Timestamp.now().toMillis(),
        propertyId: propertyId,
        reported: false,
      }
    );
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
    toast.success("Left feedback successfully");
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
      reservationId: reservationId,
      propertyId: propertyId,
      hostId: hostId,
      guestIsReporting: !isHost,
      reportText: reportReason,
      processed: false,
      createdAt: Timestamp.now().toMillis(),
    });
    await updateDoc(doc(db, "reports", docRef.id), {
      id: docRef.id,
    });
    toast.success("Reported successfully");
  };

  return (
    <div
      className={
        `card rounded-md shadow-lg my-3  max-w-5xl h-[400px] ` +
        `${new Date(to) <= new Date() ? " bg-[#f1efef]" : " bg-[#eff5ef]"}`
      }
    >
      <div className="card-body">
        <div>
          {/* <div className="text-lg font-semibold text-center mb-5">
            {from} -{to}
          </div>
          <div className="flex text-center text-xs">
            <div className="text-md font-semibold"> Reservation number:</div>
            {reservationId}
          </div>
          <div className="flex text-center text-xs">
            <div className="text-md font-semibold">Created at:</div>
            {new Date(createdAt).toDateString()}
          </div>
          <div className="flex ">
            <div className="text-md font-semibold">{user}</div>
            {userId}
          </div>
          <div className="flex text-center text-xs">
            <div className="text-md font-semibold">Propertyid:</div>
            {propertyId}
          </div> */}
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-md font-semibold">Reservation number:</td>
                  <td>
                    {reservationId?.length < len
                      ? reservationId
                      : reservationId?.slice(0, len) + "..."}
                  </td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Property id:</td>
                  <td>
                    {propertyId?.length < len
                      ? propertyId
                      : propertyId?.slice(0, len) + "..."}
                  </td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">User id:</td>
                  <td>
                    {userId?.length < len
                      ? userId
                      : userId?.slice(0, len) + "..."}
                  </td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Created at:</td>
                  <td> {new Date(createdAt).toDateString()}</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">From:</td>
                  <td>{from}</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">To:</td>
                  <td>{to}</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Total:</td>
                  <td>{total}€</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Total:</td>
                  <td>{total}€</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Guests:</td>
                  <td> {guests}</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Garage:</td>
                  <td>{garage ? "YES" : "NO"}</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">
                    Time of check in/out:
                  </td>
                  <td>
                    {timeCheckIn}-{timeCheckOut}
                  </td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Special request:</td>
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
                    shadow-md  w-full
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
                                  setError("");
                                }}
                                className="outline-0 border bg-transparent text-lg text-gray-600 w-full"
                              />
                            </>
                          )}
                          <div className="flex flex-col">
                            {!isHost && (
                              <button
                                className="btn mt-3"
                                onClick={() => setReportOpen(!reportOpen)}
                              >
                                Do you want to report?
                              </button>
                            )}

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
                              </div>
                            )}
                            <button
                              className="btn mt-3"
                              onClick={leaveFeedback}
                            >
                              {isHost ? "Report" : "Leave feedback"}
                            </button>
                            <div className="text-center mt-2">{error}</div>
                          </div>
                        </div>
                      </label>
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="text-center  text-xl font-semibold mt-5 ">
            {new Date(to) <= new Date() ? (
              ""
            ) : (
              <div className="badge !p-5  bg-footer w-full">** UPCOMING **</div>
            )}
          </div>
          <div className="text-center  text-xl font-semibold mt-5 ">
            {leftFB && (
              <div className="badge !p-5  bg-footer w-full">
                ** LEFT FEEDBACK **
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
