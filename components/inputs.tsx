export default function Inputs({
  text,
  placeholder,
  item,
  type,
  setItem = () => {},
}: {
  text: string;
  placeholder: string;
  item: any;
  type: string;
  setItem: any;
}) {
  return (
    <div
      className="mx-auto bg-grey-100 border shadow-md p-1.5
     text-lg sm:text-2xl font-semibold rounded-lg 
     flex flex-col pl-6 w-full "
    >
      <div className="text-sm text-gray-600">{text}</div>
      <input
        value={item}
        onChange={(e) => {
          setItem(e.target.value);
        }}
        type={type}
        placeholder={placeholder}
        // defaultValue={type == "number" ? "0" : ""}
        className="outline-0  bg-transparent text-lg text-gray-600"
      />
    </div>
  );
}
