import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import nookies from "nookies";

export default function Logout({}: {}) {
  const router = useRouter();

  const logout = async () => {
    //event: React.MouseEvent<HTMLButtonElement>
    console.log("nnn");
    // event.preventDefault(); // Preventing the page from reloading
    try {
      await signOut(auth);
      // .then(() => {
      console.log("the user signed out");
      nookies.set(undefined, "token", "", {});
      // setIsLoggedIn(false);sad
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
