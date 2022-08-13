import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";
import CardSearch from "../components/cardsearch";

export default function GuestBoard() {
  const { user, myUser } = useContext(AuthContext);
  const [arr, setArr] = useState<any[]>([]);
  const [faves, setFaves] = useState<any[]>([]);

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
  const getFaves = async () => {
    //TODO potencijalnbo da postoji subkolekcija fave poperty
    console.log("\\\\\\\\\\\\\\\n");
    const arrData: any[] = [];
    myUser.faves.forEach(async (item: any) => {
      const docSnap = await getDoc(doc(db, "property", item));

      if (docSnap.exists()) {
        arrData.push(docSnap);
      }
      setFaves(arrData);
    });
  };
  useEffect(() => {
    if (user) {
      getGuestReservations();
    }
    if (myUser) getFaves();
  }, [user, myUser]);

  return (
    <Layout>
      {/* THIS IS Guest BOARD */}
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            My reservations
          </div>
          <div className="flex flex-col ">
            {arr.map((item) => {
              return (
                <div key={item.id}>
                  <ReservationCard
                    {...item.data()}
                    reservationId={item.id}
                    isHost={myUser.host}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col mt-10 ">
            <div className="pt-7 pb-5 text-center text-3xl font-bold">
              Wishlist
            </div>
            {faves.map((property: any) => {
              return (
                <div key={property.id}>
                  <CardSearch
                    key={property.id}
                    propertyid={property.id}
                    name={property.data().title}
                    description={property.data().description}
                    image={property.data().images[0]}
                    price={property.data().pricePerNight}
                    // stars="5"
                    totalStars={property.data().totalStars}
                    numberOfReviews={property.data().numberOfReviews}
                    numberOfNights={0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
