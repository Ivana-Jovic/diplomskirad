import Image from "next/image";

export default function ImageForm({ url }: { url: string }) {
  return (
    <div
      className="my-5 rounded-md shadow-md 
      relative h-60 w-60"
    >
      <Image
        src={url}
        alt=""
        layout="fill"
        className="rounded-md"
        objectFit="cover"
      />
    </div>
  );
}
