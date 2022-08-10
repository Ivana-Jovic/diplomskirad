// import "../styles/global.css";
import FullCalendar, { EventApi, EventSourceApi } from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { LegacyRef, useEffect, useRef, useState } from "react";
import Popup from "./popup";
import { EventInput } from "@fullcalendar/react";

export default function Kk() {
  const calendarRef = useRef<FullCalendar>(null);
  //   const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  //   const [showDetails, setShowDetails] = useState<boolean>(false);
  const [eventInfo, setEventInfo] = useState<any>(null);

  //   const niz = useRef<Date[]>([]);
  const getRes = async () => {
    console.log("]]]]]");
    const q = query(
      collection(db, "reservations"),
      where("propertyId", "==", "0GTCREHu5UT8FCN9Un78")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      //   console.log("AAAAAAAAAAAAAA", new Date(doc.data().to).getHours());
      calendarRef.current
        ?.getApi()
        .getEventById(
          doc.data().firstName +
            " " +
            doc.data().lastName +
            " " +
            doc.data().from
        ) ??
        calendarRef.current?.getApi().addEvent({
          id:
            doc.data().firstName +
            " " +
            doc.data().lastName +
            " " +
            doc.data().from,
          // allDay: false,
          title: doc.data().firstName + " " + doc.data().lastName,
          start: new Date(doc.data().from).setHours(14),
          end: new Date(
            new Date(doc.data().to).getTime() + 24 * 60 * 60 * 1000
          ).setHours(10),
          extendedProps: {
            total: doc.data().total,
            timeCheckIn: doc.data().timeCheckIn,
            timeCheckOut: doc.data().timeCheckOut,
          },
        });
    });
  };
  useEffect(() => {
    console.log("JEDAN", calendarRef.current?.getApi().getEvents());
    calendarRef.current
      ?.getApi()
      .getEvents()
      .forEach((item: EventApi) => {
        //   EventInput
        item.remove();
        console.log("Dva");
      });
    //   calendarRef.current.getApi().fullCalendar(‘removeEventSources’)
    calendarRef.current?.getApi().removeAllEvents();
    calendarRef.current?.getApi().removeAllEventSources();
    calendarRef.current
      ?.getApi()
      .getEventSources()
      .forEach((item: EventSourceApi) => {
        //   EventInput
        item.remove();
        console.log("Tri");
      });
    // // var eventSources = calendarRef.current.getApi().getEventSources();
    // // var len = eventSources.length;
    // // for (var i = 0; i < len; i++) {
    // //   eventSources[i].remove();
    // // }
    // // setEventInfo(null);
    const proba = async () => {
      await getRes();
    };
    proba();
  }, []);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        // events={[
        //   { title: "event 1", start: "2022-08-01", end: "2022-08-03" },
        //   { title: "event 2", date: "2022-08-02" },
        // ]}
        displayEventEnd={true}
        eventColor={"#cfd2d4"}
        eventTextColor={"#0f172a"}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        // eventDisplay={"background"}
        // editable
        // selectable
        eventClick={function (info: any) {
          // alert("Event: " + info.event.title);
          //   info.el.style.borderColor = "red";
          //   setIsPopupOpen(true);
          info.el.style.borderColor = "red";
          setEventInfo(info);
          if (eventInfo) eventInfo.el.style.borderColor = "white";
          //   info.el.style.borderColor = "red";
        }}
      />
      {eventInfo && (
        <div>
          <div>aaaaa {eventInfo?.event.title}</div>
          <div> From:{eventInfo?.event.start.toDateString()}</div>
          <div> To:{eventInfo?.event.end.toDateString()}</div>
          <div>Total:{eventInfo?.event.extendedProps.total}</div>
          <div>Time check in:{eventInfo?.event.extendedProps.timeCheckIn}</div>

          <div>
            Time check out:{eventInfo?.event.extendedProps.timeCheckOut}
          </div>
        </div>
      )}
    </>
  );
}
