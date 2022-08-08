import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { yellow, red } from "@mui/material/colors";
import { useCallback, useContext, useEffect, useState } from "react";
import Heart from "./heart";
import { AuthContext } from "../firebase-authProvider";

//TODO vidi svuda za srce klik u fav
export default function CardSearch({
  propertyid,
  name,
  description,
  price,
  image,
  // stars,
  totalStars,
  numberOfReviews,
}: {
  propertyid: string;
  name: string;
  description: string;
  price: string;
  image: string;
  // stars: string;
  totalStars: number;
  numberOfReviews: number;
}) {
  return (
    <div
      className="flex my-3 border rounded-xl cursor-pointer
    hover:opacity-80 hover:shadow-lg
    transition duration-200 ease-out"
    >
      <div className="relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0">
        {/* flex shrink 0???? */}
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col flex-grow p-7">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">{name}</p>
          <Heart propertyid={propertyid} />
        </div>
        <p className="text-sm text-gray-600 flex-grow">{description}</p>
        <div className="text-lg flex items-center">
          {price}€/
          <p className="text-md text-gray-500 ">night</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm flex items-center text-gray-500 ">
            245€/
            <p className="text-sm text-gray-500 ">total</p>
          </div>
          <div className="flex">
            <p className="text-sm font-semibold">
              {" "}
              {(totalStars / numberOfReviews).toFixed(1)}
            </p>
            <StarOutlineRoundedIcon sx={{ color: yellow[700] }} />
          </div>
        </div>
      </div>
    </div>
  );
}
