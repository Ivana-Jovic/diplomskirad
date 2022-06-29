// import React from "react";
import Image from "next/image";

export default function Card({ name, description, price, image }) {
  return (
    <div
      className="my-5 mr-5 rounded-lg shadow-md cursor-pointer 
      transition transform duration-300 ease-out hover:scale-105 "
    >
      {/* relative//???? */}
      {/* vidi stavi drugaaciji shadow */}
      <div className="relative h-80 w-80 ">
        {/* imageContainer */}
        <Image
          src={image}
          alt={name}
          layout="fill"
          className="rounded-xl"
          objectFit="cover"
          // image
          // objectFit="contain" // pazi na ovo za slike moze i object position left
        />
      </div>
      <div className="p-5 -mt-3">
        <h4>{name}</h4>
        <h6>{description}</h6>
        <h5>{price}€/night</h5>
      </div>
    </div>
  );
}

// hover:bg-gray-100 plus scale itd!!!!!!!!!!!!!!!!
