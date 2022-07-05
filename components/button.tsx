export default function Button({
  text,
  action,
}: {
  text: string;
  action: any;
}) {
  return (
    <div className=" text-center ">
      <button
        onClick={action}
        className="my-5 mx-auto bg-grey-100  shadow-md  p-3
         hover:shadow-xl active:scale-90 transition duration-150
         text-lg sm:text-2xl font-semibold rounded-lg "
      >
        <h2>{text}</h2>
      </button>
    </div>
  );
}
