import type {} from "@mui/x-date-pickers/themeAugmentation";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { MenuItem, Rating, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthContext } from "../firebase-authProvider";
import { db } from "../firebase";
import { Dropdown, Menu, Space } from "antd";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { isAvailable } from "../lib/hooks";
import toast from "react-hot-toast";

type IFormInput = {
  garage: boolean;
  specialReq: string;
  timeFrom: Date;
  timeTo: Date;
};

export default function MakeAReservation({
  property,
}: {
  property: DocumentData;
}) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      garage: false,
      specialReq: "",
      timeFrom: new Date("2022-01-01 14:00"),
      timeTo: new Date("2022-01-01 11:00"),
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    console.log("QQQQQQQQQ", data);
    tryToReserve(data);
  };
  const router = useRouter();
  const { property: propertyid } = router.query;
  const from =
    router && router.query && router.query.from
      ? new Date(router.query.from as string)
      : new Date();
  const to =
    router && router.query && router.query.from
      ? new Date(router.query.to as string)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const numOfGuests = router.query.numOfGuests
    ? parseInt(router.query.numOfGuests as string)
    : 1;

  const [guests, setGuests] = useState<number>(numOfGuests);
  const [dateFrom, setDateFrom] = useState<Date | null>(from ?? new Date());
  const [dateTo, setDateTo] = useState<Date | null>(
    to ?? new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );

  const prId: string = propertyid?.toString() ?? "";
  const { user, myUser } = useContext(AuthContext);
  const [error, setError] = useState<string>("");
  const tryToReserve = async (data: IFormInput) => {
    const isAv = await isAvailable(dateFrom, dateTo, prId);
    if (!isAv) {
      console.log(" POKLAPAJU SE");
      setError("Not available, please select other dates");
    } else {
      console.log("NE POKLAPAJU SE");
      const re = await reserve(data);
      if (re) {
        toast.success("Reservation successful");
        return;
      }
    }
    toast.error("Reservation NOT successful");
    // isAvailable(dateFrom, dateTo, prId).then(async (isAv) => {
    //   if (!isAv) {
    //     console.log(" POKLAPAJU SE");
    //     setError("NOT AVAILABLE, please select other dates");
    //   } else {
    //     console.log("NE POKLAPAJU SE");
    //     await reserve(data);
    //   }
    // });
  };
  const reserve = async (data: IFormInput) => {
    if (dateFrom && dateTo && dateFrom >= dateTo) {
      setError("Check out date must be after check in date");
      return false;
    } else {
      const docSnap = await getDoc(doc(db, "property", prId));
      let title = "";
      console.log("++++++++++++++++++", prId);
      if (docSnap.exists()) {
        title = docSnap.data().title;
        console.log("--------------------!");
      } else {
        console.log("-------------No such document!");
        return false;
      }

      console.log(data.timeFrom, data.timeFrom.getHours());
      const docRef = await addDoc(collection(db, "reservations"), {
        propertyId: propertyid,
        title: title,
        total:
          dateTo && dateFrom
            ? property.pricePerNight *
                Math.round(
                  (dateTo?.getTime() - dateFrom?.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) +
              property.additionalCosts
            : 0,
        userId: user.uid,
        firstName: myUser.firstName,
        lastName: myUser.lastName,
        hostId: property.ownerId,
        from: dateFrom?.toDateString(),
        to: dateTo?.toDateString(),
        guests: guests,
        garage: data.garage,
        timeCheckIn:
          data.timeFrom.getHours() +
          ":" +
          (data.timeFrom.getMinutes() < 10 ? "0" : "") +
          data.timeFrom.getMinutes(),
        timeCheckOut:
          data.timeTo.getHours() +
          ":" +
          (data.timeFrom.getMinutes() < 10 ? "0" : "") +
          data.timeTo.getMinutes(),
        specialReq: data.specialReq,
        leftFeedback: false,
        hostLeftReport: false,
        createdAt: Timestamp.now().toMillis(),
      });

      await updateDoc(doc(db, "reservations", docRef.id), {
        id: docRef.id,
      });

      return true;
    }
  };
  const menu = (
    <Menu
      className="rounded-lg py-3"
      items={[
        {
          key: "1",
          label: (
            <>
              <div className="flex mb-2 lg:mb-0  items-center">
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
                    `${
                      guests === 20 || guests === property.numOfPersons
                        ? " roundButtonDisabled"
                        : "roundButton"
                    }`
                  }
                  onClick={() => {
                    if (guests + 1 <= 20 && guests + 1 <= property.numOfPersons)
                      setGuests(guests + 1);
                  }}
                >
                  {guests < 20 && <AddIcon fontSize="small" />}
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
      {/*  */}
      <div
        className="relative w-80 xs:w-96  h-[700px] sm:h-[700px] lg:h-[700px] 
    xl:h-[700px] 2xl:h-[700px] "
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`absolute flex  flex-col  items-center rounded-3xl border-2 border-solid py-5  text-xl justify-around bg-background opacity-95 pr-7 pl-7 `}
            >
              <div className="w-full flex justify-between px-10 py-2 mb-5 text-sm">
                <div>{property.pricePerNight}e night</div>
                <div className="flex  items-center">
                  {(property.totalStars / property.numberOfReviews).toFixed(1)}
                  <Rating
                    name="read-only"
                    value={1}
                    readOnly
                    size="small"
                    max={1}
                  />
                  - {property.numberOfReviews} reviews
                </div>
              </div>

              <Dropdown
                overlay={menu}
                onVisibleChange={handleVisibleChange}
                visible={visible}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <div className="flex lg:flex-col xl:flex-row">
                      <div>{guests} guests</div>
                    </div>
                    <ExpandMoreRoundedIcon />
                  </Space>
                </a>
              </Dropdown>
              <div className="flex justify-between w-full gap-3 mt-5 mb-3">
                <DatePicker
                  // disabled
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

              {property.garage && (
                <div className="w-full  my-3 ">
                  <Controller
                    name="garage"
                    control={control}
                    // rules={{ required: "Please enter a value" }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          // {...register("garage", {
                          //   required: "Please enter if you need a garage",
                          // })}
                          className="w-full"
                          id="outlined-select-currency"
                          select
                          label="Do you need a garage?"
                          value={value}
                          onChange={(e) => {
                            onChange(e.target.value === "true" ? true : false);
                          }}
                          InputLabelProps={{ shrink: true }}
                          // helperText={
                          //   errors.garage ? errors.garage.message : " "
                          // }
                        >
                          {["true", "false"].map((option) => (
                            <MenuItem key={option} value={option}>
                              {option === "true" ? "Yes" : "No"}
                            </MenuItem>
                          ))}
                        </TextField>
                      </>
                    )}
                  />
                </div>
              )}
              <div className="flex justify-between gap-3 w-full  my-3">
                <Controller
                  name="timeFrom"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <MobileTimePicker
                        renderInput={(params) => <TextField {...params} />}
                        label="Time of check in"
                        value={value}
                        onChange={(newValue) => {
                          onChange(newValue);
                        }}
                        minTime={new Date(2020, 1, 1, 14)}
                      />
                    </>
                  )}
                />
                <Controller
                  name="timeTo"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <MobileTimePicker
                        className="w-full"
                        renderInput={(params) => <TextField {...params} />}
                        label="Time of check out"
                        value={value}
                        onChange={(newValue) => {
                          onChange(newValue);
                        }}
                        maxTime={new Date(2023, 1, 1, 11)}
                      />
                    </>
                  )}
                />
              </div>
              <div className="w-full  my-3">
                <TextField
                  {...register("specialReq", {
                    maxLength: {
                      value: 20,
                      message: "Request can have maximum 20 characters",
                    },
                  })}
                  className="w-full"
                  id="outlined-required"
                  label="Special requests"
                  multiline
                  // maxRows={15}
                  rows={5}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="w-full mt-5 text-sm">
                <div className="flex justify-between px-10 ">
                  <div>
                    {property.pricePerNight}€ x
                    {dateTo && dateFrom
                      ? Math.round(
                          (dateTo?.getTime() - dateFrom?.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0}
                    nights
                  </div>
                  <div>
                    {dateTo && dateFrom
                      ? property.pricePerNight *
                        Math.round(
                          (dateTo?.getTime() - dateFrom?.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0}
                    €
                  </div>
                </div>
                <div className="flex justify-between px-10 my-2">
                  <div>Service fee</div>
                  <div>{property.additionalCosts}€</div>
                </div>
                <hr />
                <div className="flex justify-between px-10 my-3">
                  <div>Total</div>
                  <div>
                    {dateTo && dateFrom
                      ? property.pricePerNight *
                          Math.round(
                            (dateTo?.getTime() - dateFrom?.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) +
                        property.additionalCosts
                      : 0}
                    €
                  </div>
                </div>
                <hr />
                <hr />
              </div>
              <button className="btn mt-5" type="submit">
                Reserve
              </button>
              <div className="text-center mt-3">{error}</div>
            </div>
          </form>
        </LocalizationProvider>
      </div>
    </>
  );
}
