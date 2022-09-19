import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../firebase-authProvider";
import SimpleBackdrop from "./backdrop";

export default function IndexHostModeHost({}: {}) {
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  function changeMod() {
    setHostModeHostC(!hostModeHostC);
  }

  return (
    <div className="mt-20 flex  flex-col  mx-auto max-w-md  px-8 sm:px-16    text-center gap-4">
      {loading && <SimpleBackdrop loading={loading} />}
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
      <Link href="/hostsreservations">
        <a className="btn">Host reservations</a>
      </Link>
      <Link href="/faq">
        <a className="btn" onClick={() => setLoading(true)}>
          FAQ
        </a>
      </Link>
      <div
        className="btn"
        onClick={() => {
          changeMod();
        }}
      >
        Change mod
      </div>
    </div>
  );
}
