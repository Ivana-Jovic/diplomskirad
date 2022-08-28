import Image from "next/image";
import { useRouter } from "next/router";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
import Heart from "./heart";
import { Rating } from "@mui/material";
import Link from "next/link";
export default function CardHostsProperty({
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
        className="card rounded-md bg-base-100 shadow-lg my-3  max-w-5xl hover:opacity-90 hover:shadow-lg
  transition duration-200 ease-out"
      >
        <figure className="relative h-48 flex-shrink-0">
          {image && (
            <Image src={image} alt={name} layout="fill" objectFit="cover" />
          )}
        </figure>
        <div className="card-body">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-semibold">{name}</p>
              <Heart propertyid={propertyid} />
            </div>
            <p className="text-sm text-gray-600 flex-grow mb-5">
              {description.length < 100
                ? description
                : description.slice(0, description.indexOf(" ", 100)) + "..."}
            </p>

            <div className="flex justify-between items-center">
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
              <div className="text-lg flex items-center  mb-2">
                {price}€/
                <p className="text-md text-gray-500 ">night</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
