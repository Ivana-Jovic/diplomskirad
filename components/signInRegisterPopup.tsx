import { useContext, useState } from "react";
import Popup from "./popup";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Button from "./button";
import Inputs from "./inputs";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";

export default function SignInRegisterPopup({}: // isLoggedIn,//sad
// setIsLoggedIn,sad
{
  // isLoggedIn: boolean;sad
  // setIsLoggedIn: Dispatch<SetStateAction<boolean>>;sad
}) {
  const { user } = useContext(AuthContext); //!NOVO
  const router = useRouter();

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
      .then(async (cred) => {
        console.log("User created:", cred.user);
        setEmailState("");
        setPasswordState("");
        // setIsLoggedIn(true);//sad
        const docRef = await setDoc(doc(db, "users", cred.user.uid), {
          userId: cred.user.uid,
          host: false,
          isSuperhost: false,
        });
        router.push({
          pathname: "/profilesettings",
          // query: {

          // },
        });
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
        // setIsLoggedIn(true);//sad
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  //TODO: on x delecte polja
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
