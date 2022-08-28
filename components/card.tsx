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

//TODO vidi svuda za srce klik u fav
export default function Card({
  propertyid,
  name,
  description,
  price,
  image,
  // stars,
  totalStars,
  numberOfReviews,
  numberOfNights,
}: {
  propertyid: string;
  name: string;
  description: string;
  price: string;
  image: string;
  // stars: string;
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
        className="card rounded-md mx-auto  w-[17rem] flex-shrink-0 bg-base-100 shadow-md my-3  max-w-5xl hover:opacity-90 hover:shadow-lg
    transition duration-200 ease-out
    cursor-pointer" //TODO dodaj ostalima
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
            {/* className="flex flex-col flex-grow p-7" */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-semibold">{name}</p>
              <Heart propertyid={propertyid} />
            </div>
            {/* <p className="text-sm text-gray-600 flex-grow mb-5">{description}</p> */}
            {/* <div className="text-lg flex items-center  mb-2">
            {price}€/
            <p className="text-md text-gray-500 ">night</p>
          </div> */}
            <div className="flex justify-between items-center">
              {/* <div className="text-sm flex items-center text-gray-500 ">
              {parseInt(price) * numberOfNights}€/
              <p className="text-sm text-gray-500 ">total</p>
            </div> */}
              <div className="text-lg flex items-center ">
                {price}€/
                <p className="text-md text-gray-500 ">night</p>
              </div>
              <div className="flex">
                <p className="text-sm font-semibold">
                  {" "}
                  {(totalStars / numberOfReviews).toFixed(1)}
                </p>
                {/* <StarOutlineRoundedIcon sx={{ color: yellow[700] }} /> */}
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
