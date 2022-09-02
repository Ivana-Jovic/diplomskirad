import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function CardPopup({ property }: { property: DocumentData }) {
  const router = useRouter();

  // const goToPropertyPage = () => {
  //   if (router && router.pathname == "/search") {
  //     router.push({
  //       pathname: "/propertypage",
  //       query: {
  //         property: property.id,
  //         from: router.query.from,
  //         numOfGuests: router.query.numOfGuests,
  //         to: router.query.to,
  //       },
  //     });
  //   } else {
  //     router.push({
  //       pathname: "/propertypage",
  //       query: {
  //         property: property.id,
  //       },
  //     });
  //   }
  // };
  return (
    <div className="card card-side  p-2 rounded-md  cursor-pointer bg-base-100 shadow-md hover:opacity-90 hover:shadow-lg">
      <figure className="relative h-auto w-1/3  flex-shrink-0">
        <Image
          src={property.images[0]}
          alt={property.id}
          layout="fill"
          objectFit="cover"
          // objectPosition="bottom"
        />
      </figure>
      <div className="card-body flex flex-col p-2">
        <div className="flex justify-between items-center ">
          <div className="flex">
            <p className="text-sm ">
              {(property.totalStars / property.numberOfReviews).toFixed(1)}
            </p>
            <Rating name="read-only" value={1} readOnly size="small" max={1} />
          </div>
          {/* <Heart propertyid={property.id} /> */}
        </div>
        <p className="">
          {property.title.length < 20
            ? property.title
            : property.title.slice(0, property.title.indexOf(" ", 20)) + "..."}
        </p>
        <div className=" flex items-center ">
          {property.price}€/
          <p className="text-md text-gray-500 ">night</p>
        </div>
      </div>
    </div>
  );
}
