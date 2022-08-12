import type {} from "@mui/x-date-pickers/themeAugmentation";

import Wierder from "./wierder";
import { DocumentData } from "firebase/firestore";
import { Rating } from "@mui/material";
import { useState } from "react";

export default function Extrawierd({
  rese,
  property,
}: {
  rese: boolean;
  property: DocumentData;
}) {
  const [guests, setGuests] = useState<number>(1); //this is sent to component wierder
  const [rooms, setRooms] = useState<number>(1);
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
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
              <div>{property.pricePerNight}e night</div>
              <div className="flex  items-center">
                {(property.totalStars / property.numberOfReviews).toFixed(1)}
                <Rating
                  name="read-only"
                  value={1}
                  readOnly
                  size="small"
                  max={1}
                />{" "}
                - {property.numberOfReviews} reviews
              </div>
            </div>
          )}
          <Wierder
            rese={rese}
            totall={rese ? 230 : 0}
            property={property}
            setGuests={setGuests}
            setRooms={setRooms}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            dateTo={dateTo}
            dateFrom={dateFrom}
            rooms={rooms}
            guests={guests}
          />
          {rese && (
            <div className="w-full mt-10 text-sm">
              <div className="flex justify-between px-10 my-2">
                <div>
                  {property.pricePerNight}e x
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
                  e
                </div>
              </div>
              <div className="flex justify-between px-10 my-2">
                <div>Service fee</div>
                <div>{property.additionalCosts}e</div>
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
                  e
                </div>
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
