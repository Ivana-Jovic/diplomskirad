import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import nookies from "nookies";

export default function Logout({}: {}) {
  const router = useRouter();

  const logout = async () => {
    console.log("nnn");
    try {
      await signOut(auth);
      console.log("the user signed out");
      nookies.set(undefined, "token", "", {});
      router.push({
        pathname: "/",
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
