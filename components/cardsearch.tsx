import Image from "next/image";
export default function CardSearch({ name, description, price, image, stars }) {
  return (
    <div className="flex bg-gray-200 my-3 rounded-xl">
      <div className="relative h-24 w-40 md:h-52 md:w-80">
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
        {/*  */}
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">{name}</p>
          {/* srce */}
          <Image src="/images/search.png" height="20" width="20" alt="" />
        </div>
        <p className="text-sm text-gray-600 flex-grow">{description}</p>
        <p className="text-lg flex items-center">
          {price}€/
          <p className="text-md text-gray-500 ">night</p>
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm flex items-center text-gray-500 ">
            245€/
            <p className="text-sm text-gray-500 ">total</p>
          </p>
          <div className="flex">
            <p className="text-sm font-semibold">{stars}</p>
            {/* zvezdica */}
            <Image src="/images/search.png" height="10" width="10" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
