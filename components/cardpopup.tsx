import Image from "next/image";
import { Rating } from "@mui/material";
import { DocumentData } from "firebase/firestore";

export default function CardPopup({ property }: { property: DocumentData }) {
  return (
    <div className="card card-side  p-2 rounded-md  cursor-pointer bg-bgBase hover:opacity-90 hover:shadow-lg">
      <figure className="relative h-auto w-1/3  flex-shrink-0 !mb-0">
        <Image
          src={property.images[0]}
          alt={property.id}
          layout="fill"
          objectFit="cover"
        />
      </figure>
      <div className="card-body flex flex-col p-2">
        <div className="flex justify-between items-center ">
          <div className="flex items-center">
            <div className="text-sm ">
              {(property.totalStars / property.numberOfReviews
                ? property.totalStars / property.numberOfReviews
                : 0
              ).toFixed(1)}
            </div>
            <Rating name="read-only" value={1} readOnly size="small" max={1} />
          </div>
        </div>
        <div className="">
          {property.title.length < 20
            ? property.title
            : property.title.slice(0, property.title.indexOf(" ", 20)) + "..."}
        </div>
        <div className=" flex items-center ">
          {property.pricePerNight}€/
          <div className="text-md text-gray-500 ">night</div>
        </div>
      </div>
    </div>
  );
}
