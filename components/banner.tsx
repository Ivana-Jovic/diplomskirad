import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "./button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Dropdown, Menu, Space } from "antd";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Autocomplete } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
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

//TODO check if div, label, p..... instead of many many divs
//TODO svudagde su dugmici proveriti d ali je sve popunjeno plus ok formati
export default function Banner() {
  const [location, setLocation] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [error, setError] = useState<string>("");
  const router = useRouter();
  ///
  const [locations, setLocations] = useState<any[]>([]);
  const getLocations = async () => {
    const querySnapshot = await getDocs(collection(db, "locations"));
    setLocations([]);
    querySnapshot.forEach((doc) => {
      setLocations((prev) => [...prev, doc.id]);
    });
  };
  useEffect(() => {
    getLocations();
  }, []);
  ///
  const search = () => {
    if (location == null || location == "") {
      setError("Please choose a location");
    } else if (dateFrom && dateTo && dateFrom >= dateTo) {
      setError("Check out date must be after check in date");
    } else {
      router.push({
        pathname: "/search",
        query: {
          location: location,
          from: dateFrom?.toDateString(),
          to: dateTo?.toDateString(),
          numOfGuests: guests,
          rooms: rooms,
        },
      });
    }
  };
  const menu = (
    <Menu
      className="rounded-xl py-3"
      items={[
        {
          key: "1",
          label: (
            <>
              <div className="flex mb-2 xl:mb-0  items-center">
                <label className="mx-5">guests</label>
                <button
                  className={
                    `roundButton ` + `${guests == 1 ? "  bg-red-600" : ""}`
                  }
                  onClick={() => {
                    if (guests - 1 > 0) setGuests(guests - 1);
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </button>
                <div className="mx-3">{guests}</div>
                <button
                  className={
                    `roundButton ` + `${guests == 20 ? "  bg-red-600" : ""}`
                  }
                  onClick={() => {
                    if (guests + 1 <= 20)
                      //TODO check if this matches other min and maxs
                      setGuests(guests + 1);
                  }}
                >
                  <AddIcon fontSize="small" />
                </button>
              </div>
            </>
          ),
        },
        {
          key: "2",
          label: (
            <>
              <div className="flex xl:mr-7  items-center">
                <label className="mx-5">rooms</label>
                <button
                  className="roundButton"
                  onClick={() => {
                    if (rooms - 1 > 0) setRooms(rooms - 1);
                  }}
                >
                  <RemoveIcon fontSize="small" />
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
                  <AddIcon fontSize="small" />
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
          <Image
            src="/images/banner3.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />

          <div
            className="absolute flex  flex-col xl:flex-row items-center
         rounded-xl xl:rounded-full border-2 border-solid py-5  text-xl
         justify-around bg-background opacity-95 pr-5 mx-5 pl-5 xl:pl-0
       "
          >
            {/* <input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              type="text"
              placeholder="Where do you want to go?"
              className="outline-0  bg-transparent 
              placeholder:text-text p-3 items-center text-center
              w-80   mb-3 lg:mb-0"
            /> */}
            <div className=" mb-5 xl:mb-0 xl:mr-7 xl:ml-7 mr-2">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={locations}
                sx={{ width: 300 }}
                // value={location}
                // onChange={(e) => {
                //   setLocation(e.target.value);
                // }}
                inputValue={location}
                onInputChange={(event, newInputValue) => {
                  setLocation(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Where do you want to go?"
                    className="outline-0  bg-transparent 
              placeholder:text-text  items-center text-center
             "
                  />
                )}
              />
            </div>

            <div className="flex mb-3 xl:mb-0 xl:mr-7 mr-2">
              <div className="mr-3">
                <DatePicker
                  disablePast
                  label="Check in"
                  inputFormat="dd/MM/yyyy"
                  // views={["year", "month", "day"]}
                  value={dateFrom}
                  onChange={(newValue) => {
                    setDateFrom(newValue);
                    if (newValue && dateTo && newValue < dateTo) {
                      setError("");
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>

              <DatePicker
                disablePast
                shouldDisableDate={(date: Date) => {
                  if (dateTo && dateFrom && date <= dateFrom) {
                    return true;
                  } else return false;
                }}
                label="Check out"
                inputFormat="dd/MM/yyyy"
                value={dateTo}
                onChange={(newValue) => {
                  setDateTo(newValue);
                  if (dateFrom && newValue && dateFrom < newValue) {
                    setError("");
                  }
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
                  <div className="flex">
                    {/* xl:flex-col xl:flex-row */}
                    <div> {guests} guests |&nbsp;</div>
                    <div>{rooms} rooms</div>
                  </div>
                  <ExpandMoreRoundedIcon />
                </Space>
              </a>
            </Dropdown>
            <div className="-mt-3 -mb-5 xl:-mt-0 xl:mb-3 ml-3">
              <Button action={search} text="search" type="" />
            </div>
            {error}
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}
