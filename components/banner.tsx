import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
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

//TODO check String vs string num vs Num idt
//TODO check if div, label, p..... instead of many many divs
//TODO svudagde su dugmici proveriti d ali je sve popunjeno plus ok formati
export default function Banner() {
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
        <div
          className="relative h-[300px] sm:h-[400px] lg:h-[500px] 
    xl:h-[600px] 2xl:h-[600px]  grid place-items-center"
        >
          {/* <div className="w-full h-[50vh] bg-[url('/images/banner.jpg')] bg-center bg-no-repeat bg-cover"> */}
          <Image
            src="/images/banner.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
          ></Image>
          {/* <div className="absolute text-textFooter pl-7 top-1/4 w-fit">
          {/* <div className="absolute text-textFooter h-[50vh] bg-footer pt-[20vh] p-12 w-2/5"> */}
          {/* <div className="bg-footer text-xl sm:text-3xl font-bold ">
            Accomodation around the world in one place
          </div>
          <br />
          <ButtonBanner text="Find your next stay"></ButtonBanner>
        </div> */}

          {/* //TODO nije u istoj liniji nekako */}
          <div
            className="absolute flex  flex-col lg:flex-row items-center
         rounded-3xl lg:rounded-full border-2 border-solid py-5  text-xl
         justify-around bg-background opacity-95 pr-5 mx-5 pl-5 lg:pl-0
       "
          >
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
                    <div> {guests} guests |&nbsp;</div>
                    <div>{rooms} rooms</div>
                  </div>
                  <ExpandMoreRoundedIcon />
                </Space>
              </a>
            </Dropdown>
            <div className="-mt-3 -mb-5 lg:-mt-0 lg:mb-3 ml-3">
              <Button action={search} text="search" type="" />
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}
