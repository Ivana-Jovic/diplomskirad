import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function LogoutNEW({}: // setIsLoggedIn,sad
{
  // setIsLoggedIn: Dispatch<SetStateAction<boolean>>;sad
}) {
  const router = useRouter();

  const logout = //() => {
    (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("nnn");
      // event.preventDefault(); // Preventing the page from reloading
      signOut(auth) //uvezeno iz druge bibl!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        .then(() => {
          console.log("the user signed out");
          // setIsLoggedIn(false);sad
          router.push({
            pathname: "/",
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
  return (
    <div>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
