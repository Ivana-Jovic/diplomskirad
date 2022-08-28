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

export default function Heart({
  propertyid,
}: // inFavess,
{
  propertyid: string;
  // inFavess: boolean;
}) {
  const { user, myUser } = useContext(AuthContext);
  const [inFaves, setInFaves] = useState<boolean>(false);

  const checkIfInFaves = useCallback(() => {
    console.log("in heart checkifinfaves");
    //PROMENA POSLE PREKORACENJA FIREBASA//TODO PROVERI
    const pid: string = propertyid ? propertyid.toString() : "";
    // const docSnap = await getDoc(doc(db, "users", user?.uid)); //PROMENA POSLE PREKORACENJA FIREBASA

    if (myUser && myUser.faves) {
      //PROMENA POSLE PREKORACENJA FIREBASA
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
    console.log("in heart onHeart", propertyid);
    if (!inFaves) {
      //TODO: put in faves orr delete from SVUDA GDE JE SRCE
      await updateDoc(doc(db, "users", user?.uid), {
        faves: arrayUnion(propertyid),
      });
      setInFaves(true);
    } else {
      await updateDoc(doc(db, "users", user?.uid), {
        faves: arrayRemove(propertyid),
      });
      setInFaves(false);
    }
  };

  useEffect(() => {
    //TODO proveri uslove
    console.log("useEffect in heart");
    if (user && myUser != undefined) checkIfInFaves();
  }, [user, myUser, checkIfInFaves]); //myUser probaj zbog  //PROMENA POSLE PREKORACENJA FIREBASA//TODO PROVERI

  return (
    <>
      {user && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onHeart();
          }}
          // className="mr-10"
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
