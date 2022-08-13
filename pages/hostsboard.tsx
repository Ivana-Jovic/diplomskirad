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
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";

// import Kal from "../components/kal";
// import Kk from "../components/kk";
import dynamic from "next/dynamic";
import FullCalendar from "@fullcalendar/react";
const Calendar = dynamic(() => import("../components/calendar"), {
  ssr: false,
});

export default function HostsBoard() {
  const calendarRef1 = useRef<FullCalendar>(null);
  const calendarRef2 = useRef<FullCalendar>(null);
  const { user, myUser } = useContext(AuthContext);
  const [arr, setArr] = useState<any[]>([]);

  const bljuc = useRef<string[]>([]);
  const getHostProperties = useCallback(async () => {
    bljuc.current = [];
    const arrData: any[] = [];
    const q = query(
      collection(db, "property"),
      where("ownerId", "==", user.uid)
      //?????????????
    );
    console.log("--------------");
    const querySnapshot = await getDocs(q);
    setArr([]);
    querySnapshot.forEach((doc) => {
      // console.log("\\\\\\\\\\\\]", doc.id);
      // arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      bljuc.current.push(doc.id);
      // console.log(doc.id + "---" + JSON.stringify(doc.data()));
      console.log("WWWWWWWWWWWW", bljuc.current.length);
      // setArr(arrData);

      setArr((prev) => [...prev, doc.id + "---" + JSON.stringify(doc.data())]);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (user) getHostProperties();
  }, [getHostProperties, user]);
  /////////////////// reservations
  // const [reserv, setReserv] = useState<any[]>([]);
  const reserv = useRef<any[]>([]);
  const q = query(
    collection(db, "reservations"),
    where("hostId", "==", "x18ohaIjc6ZDHW54IBqcwRERR4X2")
    // user ? user.uid : ""
  );
  // TODO: OVO TREBA SREDITI DA SE NE POZIVA ZILION PUTA!!!!!!!!!!!
  // MOZDA DA SE STALNO DOHVATAJU REZERVACIJE IZ BAZE, ALI KAKO ONDA REFRESH???
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const res: any[] = [];
    querySnapshot.forEach((doc) => {
      res.push(doc);

      console.log(
        "NEW RESRVATION",
        doc.data().propertyId,
        doc.data().from,
        doc.data().to
      );
    });
    reserv.current = res;
    // setReserv(res);// sa ovim poludi
  });
  return (
    <Layout>
      {/* THIS IS HOSTS BOARD */}
      <div className="pt-7 pb-5 text-center text-3xl font-bold">
        My properties
      </div>
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16 ">
        <section className=" w-full ">
          {/* <div className="hidden sm:inline-flex mb-5 space-x-3 text-gray-800">
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">more</p>
          </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {arr.map((item) => {
              const property = JSON.parse(item.split("---")[1]);
              const propertyid = item.split("---")[0];
              // { title, description, images, pricePerNight }
              return (
                <CardHostsProperty
                  key={propertyid}
                  propertyid={propertyid}
                  name={property.title}
                  description={property.description}
                  image={property.images[0]}
                  price={property.pricePerNight}
                  // stars="5"/
                  totalStars={property.totalStars}
                  numberOfReviews={property.numberOfReviews}
                />
              );
            })}
          </div>
        </section>
        <div className="pt-7 pb-5 text-center text-3xl font-bold">
          Reservations
        </div>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reserv.current.map((item) => {
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
        </div>
        {/* <div> */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          label="Week picker"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderDay={renderWeekPickerDay}
          renderInput={(params) => <TextField {...params} />}
          inputFormat="'Week of' MMM d"
        />
      </LocalizationProvider> */}
        {/* </div> */}
        {/* <Kal />
         */}
        {/* VISE KALENDARA */}
        {/* {arr.map((item) => {
          const property = JSON.parse(item.split("---")[1]);
          const propertyid = item.split("---")[0];
          // const calendarRef = useRef<FullCalendar>(null);
          return (
            <div
              id-={propertyid}
              key={propertyid}
              className=" flex flex-col max-w-3xl"
            >
              {propertyid}
              <Calendar propertyId={propertyid} />
            </div>
          );
        })} */}
        {/* JEDAN KALENDAR */}
        {bljuc.current && <Calendar propertyId={bljuc.current} />}
        {(!bljuc.current || bljuc.current.length == 0) && <div>NEMA</div>}
      </div>
    </Layout>
  );
}
