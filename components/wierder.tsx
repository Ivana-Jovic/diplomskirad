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
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";

export default function Wierder({
  rese,
  totall,
  property,
}: {
  rese: boolean;
  totall: number;
  property: DocumentData;
}) {
  const [location, setLocation] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const router = useRouter();

  const search = () => {
    router.push({
      pathname: "/search",
      query: {
        location: location,
        // startdate i end... 1;31 day3
        from: dateFrom?.toDateString(),
        to: dateTo?.toDateString(),
        //  `${dateTo?.getDate()}-${
        //   dateTo?.getMonth() ? dateTo?.getMonth() : 0 + 1
        // }-${dateTo?.getFullYear()}`,
        numOfGuests: guests,
        rooms: rooms,
        //TODO add other
      },
    });
  };
  const [total, setTotal] = useState<number>(totall ? totall : 0);
  //   const router = useRouter();
  const { property: propertyid } = router.query;
  const prId: string = propertyid?.toString() ? propertyid?.toString() : ""; //TODO: da li ima elegantniji  nacin
  //TODO: na dosta mesta u ostalim je bilo na slican fazon - popravi!
  const { user, myUser } = useContext(AuthContext);
  const reserve = async () => {
    // const querySnapshot = await getDocs(query(collection(db, "property"), where("propertyid", "==", true)));
    const docSnap = await getDoc(doc(db, "property", prId)); //TODO: da li je moguce ovo uraditi kod deklaracije propId
    let title = ""; //TODO: ispravi svuda gde je let
    console.log("++++++++++++++++++", prId);
    if (docSnap.exists()) {
      title = docSnap.data().title;
      console.log("--------------------!");
    } else {
      console.log("-------------No such document!");
    }

    const docRef = await addDoc(collection(db, "reservations"), {
      propertyId: propertyid,
      title: title,
      total: total,
      userId: user.uid,
      firstName: myUser.firstName,
      lastName: myUser.lastName,
      user: myUser.username,
      hostId: property.ownerId,
      from: dateFrom?.toDateString(),
      to: dateTo?.toDateString(),
      guests: guests,
      garage: true,
      timeCheckIn: 17,
      timeCheckOut: 10,
      specialReq: "crib",
      leftFeedback: false,
      // timestamp
    });
  };

  // const khm=()=>{
  //   reserve().then(()=>{})
  // }
  const menu = (
    <Menu
      className="rounded-lg py-3"
      items={[
        {
          key: "1",
          label: (
            <>
              <div className="flex mb-2 lg:mb-0">
                <label className="mx-5">guests</label>
                <button
                  className="roundButton"
                  onClick={() => {
                    if (guests - 1 > 0) setGuests(guests - 1);
                  }}
                >
                  -
                </button>
                <div className="mx-3">{guests}</div>
                <button
                  className="roundButton"
                  onClick={() => {
                    if (guests + 1 <= 20)
                      //TODO check if this matches other min and maxs
                      setGuests(guests + 1);
                  }}
                >
                  +
                </button>
              </div>
            </>
          ),
        },
        {
          key: "2",
          label: (
            <>
              {!rese && (
                <div className="flex lg:mr-7">
                  <label className="mx-5">rooms</label>
                  <button
                    className="roundButton"
                    onClick={() => {
                      if (rooms - 1 > 0) setRooms(rooms - 1);
                    }}
                  >
                    -
                  </button>
                  <div className="mx-3">{rooms}</div>
                  <button
                    className="roundButton"
                    onClick={() => {
                      if (rooms + 1 <= 20)
                        //TODO check if this matches other min and maxs
                        setRooms(rooms + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className=" ">
          {/* //TODO nije u istoj liniji nekako */}
          <div
            className={
              `flex  flex-col items-center text-xl justify-around bg-background opacity-95 pr-5 mx-5 pl-5 ` +
              `${rese === false ? " lg:flex-row lg:pl-0" : ""}`
            }
          >
            {!rese && (
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                type="text"
                placeholder="Where do you want to go?"
                className="outline-0  bg-transparent 
              placeholder:text-text p-3
              w-80  text-center mb-3 lg:mb-0"
              />
            )}

            <div className="flex mb-3 lg:mb-0 lg:mr-7 mr-2">
              <div className="mr-3">
                <DatePicker
                  disablePast
                  label="Check in"
                  inputFormat="dd/MM/yyyy"
                  // views={["year", "month", "day"]}
                  value={dateFrom}
                  onChange={(newValue) => {
                    setDateFrom(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>

              <DatePicker
                disablePast
                label="Check out"
                inputFormat="dd/MM/yyyy"
                value={dateTo}
                onChange={(newValue) => {
                  setDateTo(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <Dropdown
              overlay={menu}
              onVisibleChange={handleVisibleChange}
              visible={visible}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <div className="flex lg:flex-col xl:flex-row">
                    <div>
                      {guests} guests {!rese && <p>|&nbsp;</p>}
                    </div>
                    {!rese && <div>{rooms} rooms</div>}
                  </div>
                  <ExpandMoreRoundedIcon />
                </Space>
              </a>
            </Dropdown>
            <div className="-mt-3 -mb-5 lg:-mt-0 lg:mb-3 ml-3">
              {!rese && <Button action={search} text="search" type="" />}
              {rese && <Button action={reserve} text="Reserve" type="" />}
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}
