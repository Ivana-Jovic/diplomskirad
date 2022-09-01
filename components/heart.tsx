import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { yellow, red } from "@mui/material/colors";
import toast from "react-hot-toast";

export default function Heart({ propertyid }: { propertyid: string }) {
  const { user, myUser } = useContext(AuthContext);
  const [inFaves, setInFaves] = useState<boolean>(false);

  const checkIfInFaves = useCallback(() => {
    const pid: string = propertyid ? propertyid.toString() : "";
    if (myUser && myUser.faves) {
      if (myUser.faves.includes(pid)) {
        setInFaves(true);
      } else {
        setInFaves(false);
      }
    } else {
      console.log("No such document!");
    }
  }, [myUser, propertyid]);

  const onHeart = async () => {
    if (!inFaves) {
      if (myUser.faves.length < 10) {
        await updateDoc(doc(db, "users", user?.uid), {
          faves: arrayUnion(propertyid),
        });
        setInFaves(true);
      } else {
        toast.error("Maximum for adding to favourites is is 10!");
      }
    } else {
      await updateDoc(doc(db, "users", user?.uid), {
        faves: arrayRemove(propertyid),
      });
      setInFaves(false);
    }
  };

  useEffect(() => {
    if (user && myUser != undefined) checkIfInFaves();
  }, [user, myUser, checkIfInFaves]);

  return (
    <>
      {user && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onHeart();
          }}
        >
          {inFaves && (
            <FavoriteRoundedIcon
              sx={{ color: red[700] }}
              className="active:scale-90  transition duration-150"
            />
          )}
          {!inFaves && (
            <FavoriteRoundedIcon className="active:scale-90 transition duration-150" />
          )}
        </div>
      )}
    </>
  );
}
