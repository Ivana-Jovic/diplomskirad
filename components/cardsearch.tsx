import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";

export default function CardSearch({
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

  const goToPropertyPage = () => {
    if (router.pathname == "/search") {
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
  };
  return (
    <div
      onClick={goToPropertyPage}
      className="card rounded-md lg:card-side bg-base-100 shadow-md my-3  max-w-5xl hover:opacity-90 hover:shadow-lg
transition duration-200 ease-out
cursor-pointer"
    >
      <figure className="relative h-48 lg:h-auto lg:w-1/3 flex-shrink-0">
        {/* className="relative h-48 lg:h-fit lg:w-1/3" */}
        {/* <img src={"https://placeimg.com/200/280/arch"} alt="Movie" /> */}
        {/* <div className="relative "> */}
        {/* flex shrink 0???? */}
        {/* <div className="relative h-48 w-full lg:h-fit lg:w-36"> */}
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          // objectPosition="bottom"
        />
        {/* </div> */}

        {/* </div> */}
      </figure>
      <div className="card-body">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xl font-semibold">{name}</p>
            <Heart propertyid={propertyid} />
          </div>
          <p
            className="text-sm text-gray-600 flex-grow mb-5
          "
          >
            {description.length < 100
              ? description
              : description.slice(0, description.indexOf(" ", 100)) + "..."}
          </p>
          <div className="text-lg flex items-center  mb-2">
            {price}€/
            <p className="text-md text-gray-500 ">night</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm flex items-center text-gray-500 ">
              {parseInt(price) * numberOfNights}€/
              <p className="text-sm text-gray-500 ">total</p>
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
    </div>
  );
}
