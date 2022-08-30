// // import React from "react";
// import Image from "next/image";

// export default function Card({ name, description, price, image }) {
//   return (
//     <div
//       className="my-5 mr-5 rounded-md shadow-md cursor-pointer
//       transition transform duration-300 ease-out hover:scale-105 "
//     >
//       {/* relative//???? */}
//       {/* vidi stavi drugaaciji shadow */}
//       <div className="relative h-80 w-80 ">
//         {/* imageContainer */}
//         <Image
//           src={image}
//           alt={name}
//           layout="fill"
//           className="rounded-t-md"
//           objectFit="cover"
//           // image
//           // objectFit="contain" // pazi na ovo za slike moze i object position left
//         />
//       </div>
//       <div className="p-5 -mt-3">
//         <h4>{name}</h4>
//         <h6>{description}</h6>
//         <h5>{price}€/night</h5>
//       </div>
//     </div>
//   );
// }
import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Card({
  propertyid,
  name,
  description,
  price,
  image,
  totalStars,
  numberOfReviews,
  numberOfNights,
}: {
  propertyid: string;
  name: string;
  description: string;
  price: string;
  image: string;
  totalStars: number;
  numberOfReviews: number;
  numberOfNights: number;
}) {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/propertypage",
        query: {
          property: propertyid,
        },
      }}
    >
      <a
        className="card rounded-md mx-auto  w-[20rem] flex-shrink-0 bg-base-100 shadow-md my-3  max-w-5xl hover:opacity-90 hover:shadow-lg
    transition duration-200 ease-out
    cursor-pointer"
      >
        <figure className="relative h-48 flex-shrink-0">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            // objectPosition="bottom"
          />
        </figure>
        <div className="card-body">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-semibold">
                {/* {name} */}
                {name.length < 23 ? name : name.slice(0, 23) + "..."}
              </p>
              {/* <Heart propertyid={propertyid} /> */}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg flex items-center ">
                {price}€/
                <p className="text-md text-gray-500 ">night</p>
              </div>
              <div className="flex">
                <p className="text-sm font-semibold">
                  {(totalStars / numberOfReviews).toFixed(1)}
                </p>
                <Rating
                  name="read-only"
                  value={totalStars / numberOfReviews}
                  readOnly
                  size="small"
                  precision={0.1}
                />
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
