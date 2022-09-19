import FullCalendar, { EventApi, EventSourceApi } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useRef, useState, useCallback } from "react";
import ReservationCard from "./reservationcard";
const arrColour = [
  "#FFB6A3",
  "#F5D1C3",
  "#C4D7D1",
  "#5F9595",
  "#F0BC68",
  "#8990B3",
  "#FFD3C4",
  "#DEE3FF",
  "#DEFFC4",
  "#d0e8c8",
];
const arrColour3 = [
  `bg-[#FFB6A3]`,
  `bg-[#F5D1C3]`,
  `bg-[#C4D7D1]`,
  `bg-[#5F9595]`,
  `bg-[#F0BC68]`,
  `bg-[#8990B3]`,
  `bg-[#FFD3C4]`,
  `bg-[#DEE3FF]`,
  `bg-[#DEFFC4]`,
  `bg-[#A0B392]`,
];
const arrColour2 = ["logo", "logo"];

export default function Calendar({ propertyId }: { propertyId: string[] }) {
  const calendarRef = useRef<FullCalendar>(null);
  const [eventInfo, setEventInfo] = useState<any>(null);

  const getRes = useCallback(async () => {
    console.log("]]]]]");
    const q = query(
      collection(db, "reservations"),
      where("propertyId", "in", propertyId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log("AAAAAAAAAAAAAA", doc.data().leftFeedback, propertyId.length);
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
            garage: doc.data().garage as boolean,
            guests: doc.data().guests,
            specialReq: doc.data().specialReq,
            userId: doc.data().userId,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            user: doc.data().user,
            leftFeedback: doc.data().leftFeedback as boolean,
            hostLeftReport: doc.data().hostLeftReport as boolean,
            reservationId: doc.data().id,
            createdAt: doc.data().createdAt,
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
        item.remove();
        console.log("Dva");
      });

    calendarRef.current?.getApi().removeAllEvents();
    calendarRef.current?.getApi().removeAllEventSources();
    calendarRef.current
      ?.getApi()
      .getEventSources()
      .forEach((item: EventSourceApi) => {
        item.remove();
        console.log("Tri");
      });
    if (propertyId && propertyId.length > 0) getRes();
  }, [getRes, propertyId, propertyId.length]);

  return (
    <div className="flex lg:flex-row flex-col mt-7">
      <div className="lg:w-2/3 ">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          showNonCurrentDates={false}
          fixedWeekCount={false}
          displayEventEnd={true}
          eventColor={"#cfd2d4"}
          eventTextColor={"#0f172a"}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventClick={function (info: any) {
            info.el.style.borderColor = "red";
            setEventInfo(info);
            if (eventInfo) eventInfo.el.style.borderColor = "white";
          }}
        />
      </div>

      <div className="lg:w-1/3 mt-5 lg:mt-0 self-center ">
        {eventInfo && (
          <div className="grid place-items-center ">
            <div
              className={
                arrColour3[
                  propertyId.indexOf(eventInfo?.event.extendedProps.propertyId)
                ] + ` rounded-full `
              }
            >
              <div className="p-5"></div>
            </div>
            <ReservationCard
              userId={eventInfo?.event.extendedProps.userId}
              firstName={eventInfo?.event.extendedProps.firstName}
              lastName={eventInfo?.event.extendedProps.lastName}
              to={eventInfo?.event.end.toDateString()}
              from={eventInfo?.event.start.toDateString()}
              propertyId={eventInfo?.event.extendedProps.propertyId}
              hostId={eventInfo?.event.extendedProps.hostId}
              garage={eventInfo?.event.extendedProps.garage as boolean}
              guests={eventInfo?.event.extendedProps.guests}
              specialReq={eventInfo?.event.extendedProps.specialReq}
              timeCheckIn={eventInfo?.event.extendedProps.timeCheckIn}
              timeCheckOut={eventInfo?.event.extendedProps.timeCheckOut}
              title={eventInfo?.event.title}
              total={eventInfo?.event.extendedProps.total}
              user={eventInfo?.event.extendedProps.user}
              leftFeedback={
                eventInfo?.event.extendedProps.leftFeedback as boolean
              }
              hostLeftReport={
                eventInfo?.event.extendedProps.hostLeftReport as boolean
              }
              reservationId={eventInfo?.event.extendedProps.reservationId}
              isHost={true}
              createdAt={eventInfo?.event.extendedProps.createdAt}
            />
          </div>
        )}
      </div>
    </div>
  );
}
