import { useRouter } from "next/router";
import CardHostsProperty from "../components/cardhostsproperty";
import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";

export default function GuestBoard() {
  const { user, myUser } = useContext(AuthContext);
  const [arr, setArr] = useState<any[]>([]);

  const getGuestReservations = async () => {
    const arrData: any[] = [];
    const q = query(
      collection(db, "reservations"),
      where("userId", "==", user?.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      arrData.push(doc);
      // console.log(doc.id + "---" + JSON.stringify(doc.data()));
      //   console.log("||||||", doc.data());
      setArr(arrData);
    });
  };

  useEffect(() => {
    if (user) getGuestReservations();
  }, [user]);

  return (
    <Layout>
      THIS IS Guest BOARD
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="flex flex-col ">
            {arr.map((item) => {
              return (
                <div key={item.id}>
                  <ReservationCard item={item} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
