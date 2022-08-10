// import { styled } from "@mui/material/styles";
// import TextField from "@mui/material/TextField";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
// import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
// import endOfWeek from "date-fns/endOfWeek";
// import isSameDay from "date-fns/isSameDay";
// import isWithinInterval from "date-fns/isWithinInterval";
// import startOfWeek from "date-fns/startOfWeek";
// import { ComponentType, useState } from "react";
// import { StyledEngineProvider } from "@mui/material/styles";
// import { createStyles } from "@mui/material/styles";

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
//     backgroundColor: theme.palette.primary.dark,
//     color: theme.palette.common.black,
//     "&:hover, &:focus ": {
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
// })) as ComponentType<CustomPickerDayProps>;

// export default function Kal() {
//   const [value, setValue] = useState<Date | null>(new Date());

//   const renderWeekPickerDay = (
//     date: Date,
//     selectedDates: Array<Date | null>,
//     pickersDayProps: PickersDayProps<Date>
//   ) => {
//     if (!value) {
//       return <PickersDay {...pickersDayProps} />;
//     }

//     const start = startOfWeek(value);
//     const end = endOfWeek(value);

//     const dayIsBetween = isWithinInterval(date, { start, end });
//     const isFirstDay = isSameDay(date, start);
//     const isLastDay = isSameDay(date, end);
//     console.log(".....", dayIsBetween, isFirstDay, isLastDay);
//     return (
//       <CustomPickersDay
//         {...pickersDayProps}
//         disableMargin
//         dayIsBetween={dayIsBetween}
//         isFirstDay={isFirstDay}
//         isLastDay={isLastDay}
//       />
//     );
//   };

//   return (
//     // <StyledEngineProvider injectFirst>
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <StaticDatePicker
//         displayStaticWrapperAs="desktop"
//         label="Week picker"
//         value={value}
//         onChange={(newValue) => {
//           setValue(newValue);
//         }}
//         renderDay={renderWeekPickerDay}
//         renderInput={(params) => <TextField {...params} />}
//         inputFormat="'Week of' MMM d"
//       />
//     </LocalizationProvider>

//     // {/* <Demo /> */}
//     // </StyledEngineProvider>
//   );
// }

// import Badge from "@mui/material/Badge";
// import TextField from "@mui/material/TextField";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { PickersDay } from "@mui/x-date-pickers/PickersDay";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { CalendarPickerSkeleton } from "@mui/x-date-pickers/CalendarPickerSkeleton";
// import getDaysInMonth from "date-fns/getDaysInMonth";
// import {
//   collection,
//   doc,
//   DocumentData,
//   DocumentSnapshot,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import { useEffect, useRef, useState } from "react";
// import { StaticDatePicker } from "@mui/x-date-pickers";

// function getRandomNumber(min: number, max: number) {
//   return Math.round(Math.random() * (max - min) + min);
// }

// /**
//  * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
//  * ⚠️ No IE11 support
//  */

// const arr = [1, 2, 3];

// function fakeFetch(
//   date: Date,
//   niz: Date[],
//   { signal }: { signal: AbortSignal }
// ) {
//   return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       const daysInMonth = getDaysInMonth(date);
//       const daysToHighlight = [1, 2, 3].map(
//         () => {
//           const kk = getRandomNumber(1, daysInMonth);
//           console.log("AAAAAAAAAAAAAAAAAAA", kk);
//           return kk;
//         }
//         // arr[item - 1]
//       );
//       // const daysToHighlight = [1, 2, 3].map(
//       //   (item) =>
//       //     // getRandomNumber(1, daysInMonth)
//       //     arr[item - 1]
//       // );
//       resolve({ daysToHighlight });
//     }, 500);

//     signal.onabort = () => {
//       clearTimeout(timeout);
//       reject(new DOMException("aborted", "AbortError"));
//     };
//   });
// }

// const initialValue = new Date();
// function getDates(startDate: Date, stopDate: Date) {
//   var dateArray = [];
//   var currentDate: Date = startDate;
//   while (currentDate <= stopDate) {
//     console.log(new Date(currentDate));
//     dateArray.push(new Date(currentDate));
//     currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
//   }

//   return dateArray;
// }
export default function Kal() {
  // // const bla = useRef<DocumentData>();
  // const niz = useRef<Date[]>([]);
  // const getRes = async (date: Date) => {
  //   const q = query(
  //     collection(db, "reservations"),
  //     where("propertyId", "==", "0GTCREHu5UT8FCN9Un78"),
  //     where("to", ">=", new Date(date.getFullYear(), date.getMonth(), 1)),
  //     orderBy("to")
  //   );
  //   //sklanjemo iz proslosti rezervacije-> to<A
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     //sklanjamo 6. slucaj tj from> od B
  //     if (
  //       doc.data().from <= new Date(date.getFullYear(), date.getMonth() + 1, 0)
  //     ) {
  //       niz.current?.concat(getDates(doc.data().from, doc.data().to));
  //     }
  //   });
  //   // bla.current = docSnap;
  // };
  // const requestAbortController = useRef<AbortController | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [highlightedDays, setHighlightedDays] = useState([1, 2, 15]);
  // const [value, setValue] = useState<Date | null>(initialValue);
  // const fetchHighlightedDays = (
  //   date: Date
  //   // bla: DocumentSnapshot<DocumentData>
  // ) => {
  //   const controller = new AbortController();
  //   fakeFetch(date, niz.current, {
  //     signal: controller.signal,
  //   })
  //     .then(({ daysToHighlight }) => {
  //       setHighlightedDays(daysToHighlight);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       // ignore the error if it's caused by `controller.abort`
  //       if (error.name !== "AbortError") {
  //         throw error;
  //       }
  //     });
  //   requestAbortController.current = controller;
  // };
  // useEffect(() => {
  //   getRes(initialValue);
  //   fetchHighlightedDays(initialValue);
  //   // abort request on unmount
  //   return () => requestAbortController.current?.abort();
  // }, []);
  // const handleMonthChange = (date: Date) => {
  //   if (requestAbortController.current) {
  //     // make sure that you are aborting useless requests
  //     // because it is possible to switch between months pretty quickly
  //     requestAbortController.current.abort();
  //   }
  //   setIsLoading(true);
  //   setHighlightedDays([]);
  //   getRes(date);
  //   fetchHighlightedDays(date);
  // };
  // return (
  //   <LocalizationProvider dateAdapter={AdapterDateFns}>
  //     <StaticDatePicker
  //       displayStaticWrapperAs="desktop"
  //       label="Week picker"
  //       inputFormat="'Week of' MMM d"
  //       value={value}
  //       loading={isLoading}
  //       onChange={(newValue) => {
  //         setValue(newValue);
  //       }}
  //       onMonthChange={handleMonthChange}
  //       renderInput={(params) => <TextField {...params} />}
  //       renderLoading={() => <CalendarPickerSkeleton />}
  //       renderDay={(day, _value, DayComponentProps) => {
  //         const isSelected =
  //           !DayComponentProps.outsideCurrentMonth &&
  //           highlightedDays.indexOf(day.getDate()) >= 0;
  //         return (
  //           // <Badge
  //           //   key={day.toString()}
  //           //   overlap="circular"
  //           //   badgeContent={isSelected ? <div>aaa</div> : undefined}
  //           // >
  //           //   <PickersDay {...DayComponentProps} />
  //           //   {/* </div> */}
  //           // </Badge>
  //           <div key={day.toString()}>
  //             {isSelected && <div className="bg-slate-400">&nbsp;</div>}{" "}
  //             <PickersDay {...DayComponentProps} />
  //           </div>
  //         );
  //       }}
  //     />
  //   </LocalizationProvider>
  // );
}

// import * as React from "react";
// import { styled } from "@mui/material/styles";
// import TextField from "@mui/material/TextField";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
// import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
// import endOfWeek from "date-fns/endOfWeek";
// import isSameDay from "date-fns/isSameDay";
// import isWithinInterval from "date-fns/isWithinInterval";
// import startOfWeek from "date-fns/startOfWeek";
// import { StyledEngineProvider } from "@mui/material/styles";

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
//     color: theme.palette.common.black,
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

// export default function CustomDay() {
//   const [value, setValue] = React.useState<Date | null>(new Date());

//   const renderWeekPickerDay = (
//     date: Date,
//     selectedDates: Array<Date | null>,
//     pickersDayProps: PickersDayProps<Date>
//   ) => {
//     if (!value) {
//       return <PickersDay {...pickersDayProps} />;
//     }

//     const start = startOfWeek(value);
//     const end = endOfWeek(value);

//     const dayIsBetween = isWithinInterval(date, { start, end });
//     const isFirstDay = isSameDay(date, start);
//     const isLastDay = isSameDay(date, end);

//     return (
//       <CustomPickersDay
//         {...pickersDayProps}
//         disableMargin
//         dayIsBetween={dayIsBetween}
//         isFirstDay={isFirstDay}
//         isLastDay={isLastDay}
//       />
//     );
//   };

//   return (
//     <StyledEngineProvider injectFirst>
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <StaticDatePicker
//           displayStaticWrapperAs="desktop"
//           label="Week picker"
//           value={value}
//           onChange={(newValue) => {
//             setValue(newValue);
//           }}
//           renderDay={renderWeekPickerDay}
//           renderInput={(params) => <TextField {...params} />}
//           inputFormat="'Week of' MMM d"
//         />
//       </LocalizationProvider>
//     </StyledEngineProvider>
//   );
// }
