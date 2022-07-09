import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "./button";
import Inputs from "./inputs";

type PopupProps = {
  isSignUp: boolean;
  setIsSignUp: Dispatch<SetStateAction<boolean>>;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export default function SignInNEW({
  isSignUp,
  setIsSignUp,
  setIsPopupOpen,
  setIsLoggedIn,
}: PopupProps) {
  const [emailState2, setEmailState2] = useState<string>("");
  const [passwordState2, setPasswordState2] = useState<string>("");

  // const signin = (event: React.FormEvent<HTMLFormElement>) => {
  //   // () => {
  //   // signinn
  //   console.log("khm");
  //   event.preventDefault(); // Preventing the page from reloading
  //   signInWithEmailAndPassword(auth, emailState2, passwordState2)
  //     .then((cred) => {
  //       console.log("User signedin:", cred.user);
  //       setEmailState2("");
  //       setPasswordState2("");
  //       setIsLoggedIn(true);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  return (
    <div></div>
    // <div>
    //   <form onSubmit={signin} name="signin">
    //     <Inputs
    //       item={emailState2}
    //       setItem={setEmailState2}
    //       placeholder=""
    //       text="email"
    //       type="email"
    //     />
    //     <Inputs
    //       item={passwordState2}
    //       setItem={setPasswordState2}
    //       placeholder=""
    //       text="password"
    //       type="password"
    //     />
    //     <Button type="submit" text="Sign in" action="" />
    //     {/* <button
    //     onClick={() => {
    //       signin();
    //       setIsPopupOpen(false);
    //     }}
    //   >
    //     klk
    //   </button> */}
    //   </form>
    //   <div>
    //     Don&apos;t have an account? Register&nbsp;
    //     <button onClick={() => setIsSignUp(false)}>
    //       <u>here.</u>
    //     </button>
    //   </div>
    // </div>
  );
}
