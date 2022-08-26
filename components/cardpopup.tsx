import Image from "next/image";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { yellow, red } from "@mui/material/colors";
import Heart from "./heart";
import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

//TODO vidi svuda za srce klik u fav
export default function CardPopup({
  //   propertyid,
  //   name,
  //   description,
  //   price,
  //   image,
  //   // stars,
  //   totalStars,
  //   numberOfReviews,
  //   numberOfNights,
  property,
}: {
  //   propertyid: string;
  //   name: string;
  //   description: string;
  //   price: string;
  //   image: string;
  //   // stars: string;
  //   totalStars: number;
  //   numberOfReviews: number;
  //   numberOfNights: number;
  property: QueryDocumentSnapshot<DocumentData>;
}) {
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
    <div
      // onClick={goToPropertyPage}
      className="card card-side  p-2 rounded-md  cursor-pointer bg-base-100 shadow-md hover:opacity-90 hover:shadow-lg"
      //       className="card rounded-md lg:card-side bg-base-100 shadow-md  max-w-5xl hover:opacity-90 hover:shadow-lg
      // transition duration-200 ease-out
      // cursor-pointer" //TODO dodaj ostalima
    >
      <figure className="relative h-auto w-1/3  flex-shrink-0">
        <Image
          src={property.data().images[0]}
          alt={property.id}
          layout="fill"
          objectFit="cover"
          // objectPosition="bottom"
        />
      </figure>
      <div className="card-body flex flex-col p-2">
        {/* <div className=""> */}
        <div className="flex justify-between items-center ">
          <div className="flex">
            <p className="text-sm ">
              {(
                property.data().totalStars / property.data().numberOfReviews
              ).toFixed(1)}
            </p>
            <Rating name="read-only" value={1} readOnly size="small" max={1} />
          </div>
          {/* <Heart propertyid={property.id} /> */}
        </div>
        <p className="">
          {property.data().title.length < 20
            ? property.data().title
            : property
                .data()
                .title.slice(0, property.data().title.indexOf(" ", 20)) + "..."}
        </p>
        <div className=" flex items-center ">
          {property.data().price}€/
          <p className="text-md text-gray-500 ">night</p>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
