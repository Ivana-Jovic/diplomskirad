import Image from "next/image";

export default function ImageForm({ url }: { url: string }) {
  return (
    <div
      className="my-5 rounded-lg shadow-md cursor-pointer 
      transition transform duration-300 ease-out hover:scale-105 
      relative h-60 w-60"
    >
      <Image
        src={url}
        alt=""
        layout="fill"
        className="rounded-xl"
        objectFit="cover"
      />
    </div>
  );
}
