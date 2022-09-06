import Image from "next/image";
import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import SimpleBackdrop from "./backdrop";
import { useState } from "react";

export default function CardSearch({
  propertyid,
  name,
  description,
  price,
  image,
  totalStars,
  numberOfReviews,
  numberOfNights,
  avgPricePerNight,
}: {
  propertyid: string;
  name: string;
  description: string;
  price: string;
  image: string;
  totalStars: number;
  numberOfReviews: number;
  numberOfNights: number;
  avgPricePerNight: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const goToPropertyPage = () => {
    if (router.pathname === "/search") {
      router.push({
        pathname: "/propertypage",
        query: {
          property: propertyid,
          from: router.query.from,
          numOfGuests: router.query.numOfGuests,
          to: router.query.to,
        },
      });
    } else {
      router.push({
        pathname: "/propertypage",
        query: {
          property: propertyid,
        },
      });
    }
    setLoading(true);
  };
  return (
    <>
      {loading && <SimpleBackdrop loading={loading} />}
      <div
        onClick={goToPropertyPage}
        className="card rounded-md lg:card-side bg-base-100 shadow-md my-3   hover:opacity-90 hover:shadow-lg
transition duration-200 ease-out
cursor-pointer"
      >
        <div className="flex flex-col  h-48 lg:h-auto lg:w-1/3">
          {avgPricePerNight > parseFloat(price) && (
            <div
              className="text-center self-center lg:hidden font-semibold 
            text-md "
            >
              ** Great deal **
            </div>
          )}
          <figure className="relative h-48 lg:h-full  flex-shrink-0">
            <Image src={image} alt={name} layout="fill" objectFit="cover" />
          </figure>
        </div>

        <div className="card-body">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xl font-semibold">{name}</div>
              <div className="flex">
                {avgPricePerNight > parseFloat(price) && (
                  <div className="text-center hidden lg:badge lg:!p-3 mr-3 !bg-footer">
                    **Great deal**
                  </div>
                )}
                <Heart propertyid={propertyid} />
              </div>
            </div>
            <div
              className="text-sm text-gray-600 flex-grow mb-5
        "
            >
              {description.length < 100
                ? description
                : description.slice(0, description.indexOf(" ", 100)) + "..."}
            </div>
            <div className="text-lg flex items-center  mb-2">
              {price}€/
              <div className="text-md text-gray-500 ">night</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm flex items-center text-gray-500 ">
                <div>{parseInt(price) * numberOfNights}€/</div>
                <div className="text-sm text-gray-500 ">total</div>
              </div>
              <div className="flex items-center">
                <div className="text-sm font-semibold">
                  {(totalStars / numberOfReviews).toFixed(1)}
                </div>
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
      </div>
    </>
  );
}
