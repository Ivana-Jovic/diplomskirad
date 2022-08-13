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
import {
  LegacyRef,
  RefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Popup from "./popup";
import { EventInput } from "@fullcalendar/react";
import ReservationCard from "./reservationcard";
const arrColour = ["#f7cbc8", "#c9eef0", "#d0e8c8", "#e8dcc1"];
const arrColour3 = ["bg-[#f7cbc8]", "bg-[#c9eef0]"];
const arrColour2 = ["logo", "logo"];
//TDOD: add colours

export default function Calendar({
  propertyId,
}: // reff,
{
  propertyId: string[];
  // reff: RefObject<FullCalendar>;
}) {
  const calendarRef = useRef<FullCalendar>(null);
  //   const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  //   const [showDetails, setShowDetails] = useState<boolean>(false);
  const [eventInfo, setEventInfo] = useState<any>(null);

  //   const niz = useRef<Date[]>([]);
  const getRes = useCallback(async () => {
    console.log("]]]]]");
    const q = query(
      collection(db, "reservations"),
      where("propertyId", "in", propertyId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log("AAAAAAAAAAAAAA", propertyId.length);
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
            propertyId: doc.data().propertyId,
            hostId: doc.data().hostId,
            garage: doc.data().garage,
            guests: doc.data().guests,
            specialReq: doc.data().specialReq,
            userId: doc.data().userId,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            user: doc.data().user,
            leftFeedback: doc.data().leftFeedback,
            reservationId: doc.data().reservationId,
          },
          color: arrColour[propertyId.indexOf(doc.data().propertyId)],
        });
    });
  }, [propertyId]);

  useEffect(() => {
    console.log("JEDAN", propertyId, calendarRef.current?.getApi().getEvents());
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
    // // setEventInfo(null);
    // const proba = async () => {
    //   if (propertyId) await getRes();
    // };
    // proba();
    if (propertyId && propertyId.length > 0) getRes();
  }, [getRes, propertyId, propertyId.length]);
  // ,propertyId[0], propertyId[1]
  // [JSON.stringify(propertyId)] https://stackoverflow.com/questions/59467758/passing-array-to-useeffect-dependency-list

  return (
    <>
      <FullCalendar
        // key={propertyId}

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
        <div className="mt-10 ">
          <div className="grid place-items-center ">
            <div
              className={
                arrColour3[
                  propertyId.indexOf(eventInfo?.event.extendedProps.propertyId)
                ]
              }
            >
              <ReservationCard
                userId={eventInfo?.event.extendedProps.userId}
                firstName={eventInfo?.event.extendedProps.firstName}
                lastName={eventInfo?.event.extendedProps.lastName}
                to={eventInfo?.event.end.toDateString()}
                from={eventInfo?.event.start.toDateString()}
                propertyId={eventInfo?.event.extendedProps.propertyId}
                hostId={eventInfo?.event.extendedProps.hostId}
                garage={eventInfo?.event.extendedProps.garage}
                guests={eventInfo?.event.extendedProps.guests}
                specialReq={eventInfo?.event.extendedProps.specialReq}
                timeCheckIn={eventInfo?.event.extendedProps.timeCheckIn}
                timeCheckOut={eventInfo?.event.extendedProps.timeCheckOut}
                title={eventInfo?.event.title}
                total={eventInfo?.event.extendedProps.total}
                user={eventInfo?.event.extendedProps.user}
                leftFeedback={eventInfo?.event.extendedProps.leftFeedback}
                reservationId={eventInfo?.event.extendedProps.reservationId}
                isHost={true}
              />
            </div>
          </div>

          {/* <div
            className={
              // "bg-[" + arrColour2[1] + "]"
              // "bg-" + arrColour2[1]
              arrColour3[
                propertyId.indexOf(eventInfo?.event.extendedProps.propertyId)
              ]
            }
          >
            aaaaa {eventInfo?.event.title}
          </div>
          <div> From:{eventInfo?.event.start.toDateString()}</div>
          <div> To:{eventInfo?.event.end.toDateString()}</div>
          <div>Total:{eventInfo?.event.extendedProps.total}</div>
          <div>Time check in:{eventInfo?.event.extendedProps.timeCheckIn}</div>

          <div>
            Time check out:{eventInfo?.event.extendedProps.timeCheckOut}
          </div>*/}
        </div>
      )}
    </>
  );
}
