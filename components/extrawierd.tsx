import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Button from "./button";
import ButtonBanner from "./buttonbanner";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import type {} from "@mui/x-date-pickers/themeAugmentation";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Dropdown, Menu, Space } from "antd";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Wierder from "./wierder";
import { addDoc, collection, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";

export default function Extrawierd({
  rese,
  property,
}: {
  rese: boolean;
  property: DocumentData;
}) {
  //   const [location, setLocation] = useState<string>("");
  //   const [guests, setGuests] = useState<number>(1);
  //   const [rooms, setRooms] = useState<number>(1);
  //   const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  //   const [dateTo, setDateTo] = useState<Date | null>(new Date());
  //   const router = useRouter();

  //   const [total, setTotal] = useState<number>(0);
  //   //   const router = useRouter();
  //   const { property: propertyid } = router.query;

  //   const { user, myUser } = useContext(AuthContext);
  //   const reserve = async () => {
  //     const docRef = await addDoc(collection(db, "reservations"), {
  //       idProperty: propertyid,
  //       total: total,
  //       idUser: user.uid,
  //       from: dateFrom,
  //       to: dateTo,
  //       guests: guests,
  //       // timestamp
  //     });
  //   };

  return (
    <>
      {/* h-[300px] sm:h-[400px] lg:h-[500px] 
    xl:h-[600px] 2xl:h-[600px] */}
      <div
        className="relative h-[600px] sm:h-[600px] lg:h-[600px] 
    xl:h-[600px] 2xl:h-[700px]  grid place-items-center"
      >
        {/* {!rese && (
          <Image
            src="/images/banner.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
          ></Image>
        )} */}

        <div
          className={
            `absolute flex  flex-col  items-center rounded-3xl border-2 border-solid py-5  text-xl justify-around bg-background opacity-95 pr-5 mx-5 pl-5 ` +
            `${rese === false ? " lg:flex-row lg:rounded-full lg:pl-0 " : ""}`
          }
        >
          {rese && (
            <div className="w-full flex justify-between px-10 py-2 mb-7 text-sm">
              <div>34e night</div>
              <div> 4.45 * - 14 reviews</div>
            </div>
          )}
          <Wierder rese={rese} totall={rese ? 230 : 0} property={property} />
          {rese && (
            <div className="w-full mt-10 text-sm">
              <div className="flex justify-between px-10 my-2">
                <div>34e x 5 nights</div>
                <div>total 180e</div>
              </div>
              <div className="flex justify-between px-10 my-2">
                <div>Service fee</div>
                <div>50e</div>
              </div>
              <hr />
              <div className="flex justify-between px-10 my-3">
                <div>Total</div>
                <div> 230e</div>
              </div>
              <hr />
              <hr />
              <div className="flex justify-between px-10 my-3">
                {/* //TODO: polje postoji ako postoji u nekretnini garaza */}
                <div>Garage</div>
                <div> yes</div>
              </div>
              <div className="flex justify-between px-10 my-3">
                {/* TODO: ovo potencijalno promeniti malo da se olaksa */}
                <div>Exact time of check in/out</div>
                <div> 9:00 and 10:00</div>
              </div>
              <div className="flex justify-between px-10 my-3">
                <div>Special requests:</div>
                <div> crib</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
