import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";
import SimpleBackdrop from "./backdrop";
import toast from "react-hot-toast";

export default function IndexHostModeHost({}: {}) {
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  function changeMod() {
    setHostModeHostC(!hostModeHostC);
    // toast.success(hostModeHostC ? "Mode: host" : "Mode: travel");
    // if (myUser && myUser.modeIsHosting) {
    //   await updateDoc(doc(db, "users", user?.uid), {
    //     modeIsHosting: false,
    //   });
    // }
    // if (myUser && !myUser.modeIsHosting) {
    //   await updateDoc(doc(db, "users", user?.uid), {
    //     modeIsHosting: true,
    //   });
    // }
    // router.push({
    //   pathname: "/",
    // });
  }

  return (
    //relative h-full
    <div className="mt-20  flex  flex-col   mx-auto max-w-md  px-8 sm:px-16    text-center gap-4">
      {loading && <SimpleBackdrop loading={loading} />}
      {/* items-center content-start self-center justify-items-center justify-center justify-self-center
    place-items-center place-self-center place-content-center */}
      {/* // className="absolute m-0 top-1/2 translate-y-1/2"> */}
      {/* <div className="absolute m-0 top-1/2 translate-y-1/2"> */}
      <Link href="/profilesettings">
        <a className="btn" onClick={() => setLoading(true)}>
          Profile
        </a>
      </Link>
      <Link href="/addproperty">
        <a className=" btn" onClick={() => setLoading(true)}>
          Add property
        </a>
      </Link>
      <Link href="/hostsboard">
        <a className=" btn" onClick={() => setLoading(true)}>
          Host board
        </a>
      </Link>
      <Link href="/faq">
        <a className="btn" onClick={() => setLoading(true)}>
          FAQ
        </a>
      </Link>
      <Link href="/hostsreservations">
        <a className="btn">Host reservations</a>
      </Link>
      <div
        className="btn"
        onClick={() => {
          changeMod();
          // setLoading(true);
        }}
      >
        Change mod
      </div>
    </div>
  );
}
