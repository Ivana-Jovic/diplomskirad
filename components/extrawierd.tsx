import type {} from "@mui/x-date-pickers/themeAugmentation";

import Wierder from "./wierder";
import { DocumentData } from "firebase/firestore";

export default function Extrawierd({
  rese,
  property,
}: {
  rese: boolean;
  property: DocumentData;
}) {
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
              <div>34e night</div>
              <div> 4.45 * - 14 reviews</div>
            </div>
          )}
          <Wierder rese={rese} totall={rese ? 230 : 0} property={property} />
          {rese && (
            <div className="w-full mt-10 text-sm">
              <div className="flex justify-between px-10 my-2">
                <div>34e x 5 nights</div>
                <div>total 180e</div>
              </div>
              <div className="flex justify-between px-10 my-2">
                <div>Service fee</div>
                <div>50e</div>
              </div>
              <hr />
              <div className="flex justify-between px-10 my-3">
                <div>Total</div>
                <div> 230e</div>
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
