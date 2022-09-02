import CloseIcon from "@mui/icons-material/Close";
export default function Popup({
  content,
  handleClose,
}: {
  content: JSX.Element;
  handleClose: any;
}) {
  //props:any
  return (
    <div className="grid place-items-center fixed bg-slate-200  bg-opacity-60 w-full h-screen top-0 left-0">
      <div
        className="relative w-3/4 md:w-2/4 max-w-xl h-auto border rounded-xl
        bg-header shadow-md  p-3
      hover:shadow-xl transition duration-150
      text-lg sm:text-2xl font-semibold 
      flex flex-col"
      >
        {/*//mx-auto */}
        <div
          onClick={handleClose}
          // onClick={props.handleClose}
          className="self-end cursor-pointer bg-footer text-header rounded-3xl
           w-8 h-8 text-center mb-3"
        >
          <CloseIcon />
        </div>
        {/* {props.content} */}
        {content}
      </div>
    </div>
  );
}
