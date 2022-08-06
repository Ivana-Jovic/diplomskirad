import { NestCamWiredStandTwoTone } from "@mui/icons-material";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useState } from "react";
import Popup from "./popup";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import Button from "./button";

//TODO vidi svuda za srce klik u fav
export default function ReservationCard({
  item,
}: {
  item: QueryDocumentSnapshot<DocumentData>;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(1);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const leaveFeedback = () => {
    // updatecomm and stars in database
    //TODO: trigger functions like update avg stars on property
    // and zabraniti da isti korisnik komentarise ponovo
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
          new Date(item.data().to) <= new Date() ? " bg-red-50" : "bg-green-50"
        }`}
      >
        <div>
          {new Date(item.data().to) <= new Date() ? "" : "**UPCOMING**"}
        </div>
        <div className="text-xl font-semibold">{item.data().title}</div>
        {/* <div>{item.data().propertyId}</div> */}
        <div className="text-lg font-semibold">
          {item.data().user}-{item.data().userId}
        </div>
        <div className="text-lg font-semibold">
          {item.data().from} - {item.data().to}
        </div>
        <div>Total: {item.data().total}e</div>
        <div>Guests: {item.data().guests}</div>
        <div>Garage: {item.data().garage ? "YES" : "NO"}</div>
        {/* TODO */}
        <div>
          Time of check in/out: {item.data().timeCheckIn}:00 /{" "}
          {item.data().timeCheckOut}:00
        </div>
        {/* TODO */}
        <div>
          Special request:
          {item.data().specialReq ? item.data().specialReq : "none"}
        </div>
        {/* TODO */}

        <div>
          {/* //TODO: i uslov ako vec nije dat komentar */}
          {new Date(item.data().to) <= new Date() && (
            <div>
              <button
                onClick={() => {
                  togglePopup();
                }}
              >
                Leave feedback
              </button>
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
                        action={leaveFeedback()}
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
