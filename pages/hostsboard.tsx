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

import * as React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import startOfWeek from "date-fns/startOfWeek";
// import Kal from "../components/kal";
// import Kk from "../components/kk";
import dynamic from "next/dynamic";
const Kk = dynamic(() => import("../components/kk"), {
  ssr: false,
});
// type CustomPickerDayProps = PickersDayProps<Date> & {
//   dayIsBetween: boolean;
//   isFirstDay: boolean;
//   isLastDay: boolean;
// };

// const CustomPickersDay = styled(PickersDay, {
//   shouldForwardProp: (prop) =>
//     prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
// })<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
//   ...(dayIsBetween && {
//     borderRadius: 0,
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     "&:hover, &:focus": {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   }),
//   ...(isFirstDay && {
//     borderTopLeftRadius: "50%",
//     borderBottomLeftRadius: "50%",
//   }),
//   ...(isLastDay && {
//     borderTopRightRadius: "50%",
//     borderBottomRightRadius: "50%",
//   }),
// })) as React.ComponentType<CustomPickerDayProps>;

export default function HostsBoard() {
  const { user, myUser } = useContext(AuthContext);
  const [arr, setArr] = useState<any[]>([]);

  const getHostProperties = async () => {
    const arrData: any[] = [];
    const q = query(
      collection(db, "property"),
      where("ownerId", "==", user?.uid)
      //?????????????
    );
    const querySnapshot = await getDocs(q);
    // console.log("size", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      // if (querySnapshot.size == arr.length) {
      //   setArr([]);
      // }
      arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      console.log(doc.id + "---" + JSON.stringify(doc.data()));
      console.log(doc.data());
      setArr(arrData);
      // console.log(arr.length);
    });
  };

  useEffect(() => {
    if (user) getHostProperties();
  }, [user]);
  /////////////////// reservations
  // const [reserv, setReserv] = useState<any[]>([]);
  const reserv = useRef<any[]>([]);
  const q = query(
    collection(db, "reservations"),
    where("hostId", "==", "x18ohaIjc6ZDHW54IBqcwRERR4X2")
    // user ? user.uid : ""
  );
  //TODO: OVO TREBA SREDITI DA SE NE POZIVA ZILION PUTA!!!!!!!!!!!
  // MOZDA DA SE STALNO DOHVATAJU REZERVACIJE IZ BAZE, ALI KAKO ONDA REFRESH???
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const res: any[] = [];
  //     querySnapshot.forEach((doc) => {
  //       res.push(doc);

  //       console.log(
  //         "NEW RESRVATION",
  //         doc.data().propertyId,
  //         doc.data().from,
  //         doc.data().to
  //       );
  //     });
  //     reserv.current = res;
  //     // setReserv(res);// sa ovim poludi
  //   });
  // ;

  return (
    <Layout>
      THIS IS HOSTS BOARD
      {/* <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16"> */}
      {/* <section className="  px-10 py-10 w-full ">
          <div className="hidden sm:inline-flex mb-5 space-x-3 text-gray-800">
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">more</p>
          </div>
          <div className="flex flex-col ">
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
        </section> */}
      {/* <div>
          <div className="flex flex-col ">
            {reserv.current.map((item) => {
              return (
                <div key={item.id}>
                  <ReservationCard item={item} />
                </div>
              );
            })}
          </div>
        </div> */}
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
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        {" "}
        <Kk />{" "}
      </div>
      {/* </div> */}
    </Layout>
  );
}
