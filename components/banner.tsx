import Image from "next/image";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import TextField from "@mui/material/TextField";
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
//TODOppp na firebasu uslovi

//TODOpp kad se registruje zabrani sve dok ne popuni formu

//TODOp vercel
//TODOpp mozda spineri svuda

//TODO paginacija sortiranje panela po is seen i created at
//TODO probaj ako si hostmodehost na indexu da menjas modove, da li se refreshuje
//TODO provere
//- za dugacke titlove i descriptione svuda da li izgleda ok
//- na raznim velicinama ekrana
//- provere za sve pristupe plus pri promeni moda
//- dugme za search
//- slicno (search na search stranici yanimljivo se desava) i npr ako se admin izloguje ostace se na index admin stranici
//- nadji gde se jos desavaju ove stvari tipa kad se admin izlogovao nije se vratilo n aindex itd

export default function Banner({
  setOpenSearch,
}: {
  setOpenSearch?: Dispatch<SetStateAction<boolean>>;
}) {
  const [location, setLocation] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [locations, setLocations] = useState<string[]>([]); //any

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

  const search = () => {
    if (location === null || location === "") {
      setError("Please choose a location");
    } else if (dateFrom && dateTo && dateFrom >= dateTo) {
      setError("Check out date must be after check in date");
    } else {
      setOpenSearch(false);
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
                    ` ` +
                    `${guests === 1 ? " roundButtonDisabled " : "roundButton"}`
                  }
                  onClick={() => {
                    if (guests - 1 > 0) setGuests(guests - 1);
                  }}
                >
                  {guests > 1 && <RemoveIcon fontSize="small" />}
                </button>
                <div className="mx-3">{guests}</div>
                <button
                  className={
                    ` ` +
                    `${guests === 20 ? " roundButtonDisabled " : "roundButton"}`
                  }
                  onClick={() => {
                    if (guests + 1 <= 20) setGuests(guests + 1);
                  }}
                >
                  {guests < 20 && <AddIcon fontSize="small" />}
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
                  className={`${
                    rooms === 1 ? " roundButtonDisabled " : "roundButton"
                  }`}
                  onClick={() => {
                    if (rooms - 1 > 0) setRooms(rooms - 1);
                  }}
                >
                  {rooms > 1 && <RemoveIcon fontSize="small" />}
                </button>
                <div className="mx-3">{rooms}</div>
                <button
                  className={`${
                    rooms === 20 ? " roundButtonDisabled " : "roundButton"
                  }`}
                  onClick={() => {
                    if (rooms + 1 <= 20) setRooms(rooms + 1);
                  }}
                >
                  {rooms < 20 && <AddIcon fontSize="small" />}
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
            <div className=" mb-5 xl:mb-0 xl:mr-7 xl:ml-7 mr-2">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={locations}
                sx={{ width: 300 }}
                inputValue={location}
                onInputChange={(event, newInputValue) => {
                  setLocation(newInputValue);
                  setError("");
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
                    <div> {guests} guests |&nbsp;</div>
                    <div>{rooms} rooms</div>
                  </div>
                  <ExpandMoreRoundedIcon />
                </Space>
              </a>
            </Dropdown>
            {!error && (
              <button className="btn xl:ml-5 mt-5 xl:mt-0 " onClick={search}>
                search
              </button>
            )}
            {error && (
              <button className="btn xl:ml-5 mt-5 xl:mt-0 cursor-default ">
                {error}
              </button>
            )}
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}
