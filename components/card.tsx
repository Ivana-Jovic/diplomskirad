// import React from "react";
import Image from "next/image";

export default function Card({ src, title, description, price }) {
  return (
    <div
      className="m-5 rounded-lg shadow-md cursor-pointer 
      transition transform duration-100 ease-in hover:scale-105 "
    >
      {/* relative//???? */}
      {/* vidi stavi drugaaciji shadow */}
      <div className="imageContainer">
        <Image src={src} alt={title} layout="fill" className="image"></Image>
      </div>
      <div className="p-5  -mt-3">
        {/* negativna margina */}
        <h3>{title}</h3>
        <h5>{description}</h5>
        <h4>{price}€/night</h4>
      </div>
    </div>
  );
}
