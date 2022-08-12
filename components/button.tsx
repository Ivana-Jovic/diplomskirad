export default function Button({
  text,
  action,
  type,
}: {
  text: string;
  action: any;
  type: string;
}) {
  const emptyFunc = () => {
    console.log("em");
  };
  return (
    <div className=" text-center  ">
      <button
        type={type == "submit" ? "submit" : "button"}
        onClick={action ? action : emptyFunc}
        // {action && onClick={action }}
        className="my-5 mx-auto  shadow-md  p-3
         hover:shadow-lg active:scale-90 transition duration-150
         text-lg sm:text-2xl font-semibold rounded-lg bg-background border"
      >
        {/* bg-grey-100  */}
        <h2>{text}</h2>
      </button>
    </div>
  );
}
