export default function Popup(props: any) {
  return (
    <div className="fixed bg-slate-200 w-full h-screen border rounded-xl">
      <div className="relative w-2/4 h-auto bg-slate-400 ">
        <div onClick={props.handleClose}>X</div>
        {props.content}
      </div>
    </div>
  );
}
