import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
// import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import SimpleBackdrop from "./backdrop";
import { useState } from "react";

export default function Card({
  propertyid,
  name,
  price,
  image,
  totalStars,
  numberOfReviews,
}: {
  propertyid: string;
  name: string;
  price: string;
  image: string;
  totalStars: number;
  numberOfReviews: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      {loading && <SimpleBackdrop loading={loading} />}
      <Link
        href={{
          pathname: "/propertypage",
          query: {
            property: propertyid,
          },
        }}
      >
        <a
          onClick={() => {
            setLoading(true);
          }}
          className="card rounded-md w-[20rem] flex-shrink-0 bg-bgBase shadow-md my-3  max-w-5xl hover:opacity-90 hover:shadow-lg
    transition duration-200 ease-out
    cursor-pointer"
        >
          <figure className="relative h-48 flex-shrink-0">
            <Image src={image} alt={name} layout="fill" objectFit="cover" />
          </figure>
          <div className="card-body">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xl font-semibold">
                  {name.length < 23 ? name : name.slice(0, 23) + "..."}
                </div>
                {/* <Heart propertyid={propertyid} /> */}
              </div>

              <div className="flex justify-between items-center ">
                <div className="text-lg flex items-center">
                  {price}€/
                  <div className="text-md text-gray-500 ">night</div>
                </div>
                <div className="flex items-center ">
                  <div className="text-sm font-semibold mr-1">
                    {(totalStars / numberOfReviews
                      ? totalStars / numberOfReviews
                      : 0
                    ).toFixed(1)}
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
        </a>
      </Link>
    </>
  );
}
