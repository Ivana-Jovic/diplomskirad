import { Dispatch, SetStateAction, useState } from "react";
import Popup from "./popup";
import RegisterNEW from "./registerNEW";
import SignInNEW from "./signInNEW";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Button from "./button";
import Inputs from "./inputs";

export default function SignInRegisterPopup({
  isLoggedIn,
  setIsLoggedIn,
}: {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(false); //SIgn in or Register popup

  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");

  const [emailState2, setEmailState2] = useState<string>("");
  const [passwordState2, setPasswordState2] = useState<string>("");

  const togglePopup = (RorS: string) => {
    //Register Or SignUp
    setIsPopupOpen(!isPopupOpen);
    if (RorS == "S") {
      setIsSignIn(true);
    } else if (RorS == "R") {
      setIsSignIn(false);
    }
  };

  const registerForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Preventing the page from reloading
    createUserWithEmailAndPassword(auth, emailState, passwordState)
      .then((cred) => {
        console.log("User created:", cred.user);
        setEmailState("");
        setPasswordState("");
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const signin = (event: React.FormEvent<HTMLFormElement>) => {
    // () => {
    // signinn
    console.log("khm");
    event.preventDefault(); // Preventing the page from reloading
    signInWithEmailAndPassword(auth, emailState2, passwordState2)
      .then((cred) => {
        console.log("User signedin:", cred.user);
        setEmailState2("");
        setPasswordState2("");
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="">
      <button
        onClick={() => {
          console.log("register clicked");
          togglePopup("R");
        }}
        className="hidden md:inline mr-3"
      >
        Register
      </button>
      <button
        onClick={() => {
          console.log("sign in clicked");
          togglePopup("S");
        }}
      >
        Sign in
      </button>
      {isPopupOpen && (
        <Popup
          content={
            <>
              {!isSignIn && (
                // <RegisterNEW
                //   isSignUp={isSignUp}
                //   setIsSignUp={setIsSignUp}
                //   handleClose={setIsPopupOpen}
                //   setIsLoggedIn={setIsLoggedIn}
                // />
                <div>
                  <form onSubmit={registerForm} name="submitFormName">
                    <Inputs
                      item={emailState}
                      setItem={setEmailState}
                      placeholder=""
                      text="email"
                      type="email"
                    />
                    <Inputs
                      item={passwordState}
                      setItem={setPasswordState}
                      placeholder=""
                      text="password"
                      type="password"
                    />
                    <Button type="submit" text="Register" action="" />
                  </form>
                  <div>
                    Already have an account? Sing in&nbsp;
                    <button onClick={() => setIsSignIn(true)}>
                      <u>here.</u>
                    </button>
                  </div>
                </div>
              )}
              {isSignIn && (
                // <SignInNEW
                //   isSignUp={isSignUp}
                //   setIsSignUp={setIsSignUp}
                //   setIsPopupOpen={setIsPopupOpen}
                //   setIsLoggedIn={setIsLoggedIn}
                // />
                <div>
                  <form onSubmit={signin} name="signin">
                    <Inputs
                      item={emailState2}
                      setItem={setEmailState2}
                      placeholder=""
                      text="email"
                      type="email"
                    />
                    <Inputs
                      item={passwordState2}
                      setItem={setPasswordState2}
                      placeholder=""
                      text="password"
                      type="password"
                    />
                    <Button type="submit" text="Sign in" action="" />
                    {/* <button
        onClick={() => {
          signin();
          setIsPopupOpen(false);
        }}
      >
        klk
      </button> */}
                  </form>
                  <div>
                    Don&apos;t have an account? Register&nbsp;
                    <button onClick={() => setIsSignIn(false)}>
                      <u>here.</u>
                    </button>
                  </div>
                </div>
              )}
            </>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  );
}
