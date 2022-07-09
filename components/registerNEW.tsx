import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "./button";
import Inputs from "./inputs";

type PopupProps = {
  isSignUp: boolean;
  setIsSignUp: Dispatch<SetStateAction<boolean>>;
  handleClose: any;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export default function RegisterNEW({
  isSignUp,
  setIsSignUp,
  handleClose,
  setIsLoggedIn,
}: PopupProps) {
  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");

  // const registerForm = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault(); // Preventing the page from reloading
  //   createUserWithEmailAndPassword(auth, emailState, passwordState)
  //     .then((cred) => {
  //       console.log("User created:", cred.user);
  //       setEmailState("");
  //       setPasswordState("");
  //       setIsLoggedIn(true);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };
  return (
    <div></div>
    // <div>
    //   <form onSubmit={registerForm} name="submitFormName">
    //     <Inputs
    //       item={emailState}
    //       setItem={setEmailState}
    //       placeholder=""
    //       text="email"
    //       type="email"
    //     />
    //     <Inputs
    //       item={passwordState}
    //       setItem={setPasswordState}
    //       placeholder=""
    //       text="password"
    //       type="password"
    //     />
    //     <Button type="submit" text="Register" action="" />
    //   </form>
    //   <div>
    //     Already have an account? Sing in&nbsp;
    //     <button onClick={() => setIsSignUp(true)}>
    //       <u>here.</u>
    //     </button>
    //   </div>
    // </div>
  );
}
