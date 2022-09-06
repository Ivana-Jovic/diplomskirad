import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function CardPopup({ property }: { property: DocumentData }) {
  const router = useRouter();
  return (
    <div className="card card-side  p-2 rounded-md  cursor-pointer bg-base-100 shadow-md hover:opacity-90 hover:shadow-lg">
      <figure className="relative h-auto w-1/3  flex-shrink-0">
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
              {(property.totalStars / property.numberOfReviews).toFixed(1)}
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
          {property.price}€/
          <div className="text-md text-gray-500 ">night</div>
        </div>
      </div>
    </div>
  );
}
