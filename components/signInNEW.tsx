import { getProviders, signIn as si } from "next-auth/react";
import Layout from "../components/layout";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRef, useState } from "react";
import { DEFAULT_MAX_VERSION } from "tls";

export default function SignInNEW() {
  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [emailState2, setEmailState2] = useState<string>("");
  const [passwordState2, setPasswordState2] = useState<string>("");
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Preventing the page from reloading
    createUserWithEmailAndPassword(auth, emailState, passwordState)
      .then((cred) => {
        console.log("User created:", cred.user);
        setEmailState("");
        setPasswordState("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const signin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Preventing the page from reloading
    signInWithEmailAndPassword(auth, emailState2, passwordState2)
      .then((cred) => {
        console.log("User signedin:", cred.user);
        setEmailState2("");
        setPasswordState2("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const logout = //() => {
    (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("nnn");
      // event.preventDefault(); // Preventing the page from reloading
      signOut(auth) //uvezeno iz druge bibl!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        .then(() => {
          console.log("the user signed out");
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
  return (
    <div>
      haiii
      <br />
      <form onSubmit={submitForm} name="submitFormName">
        <label htmlFor="emaill">email:</label>
        <input
          value={emailState}
          onChange={(e) => {
            setEmailState(e.target.value);
          }}
          type="email"
          className="outline-0  bg-transparent text-lg text-gray-600"
        />
        <label htmlFor="password">password:</label>
        <input
          value={passwordState}
          onChange={(e) => {
            setPasswordState(e.target.value);
          }}
          type="password"
          className="outline-0  bg-transparent text-lg text-gray-600"
        />
        <button type="submit">Su</button>
      </form>
      <br />
      <form onSubmit={signin} name="signin">
        <label htmlFor="email">email:</label>
        <input
          value={emailState2}
          onChange={(e) => {
            setEmailState2(e.target.value);
          }}
          type="email"
          className="outline-0  bg-transparent text-lg text-gray-600"
        />
        <label htmlFor="password">password:</label>
        <input
          value={passwordState2}
          onChange={(e) => {
            setPasswordState2(e.target.value);
          }}
          type="password"
          className="outline-0  bg-transparent text-lg text-gray-600"
        />
        <button type="submit">Su</button>
      </form>
      <button
        onClick={logout}
        // {() => {
        //   console.log("nnn");

        // signOut()
        //   .then(() => {
        //     console.log("the user signed out");
        //   })
        //   .catch((err) => {
        //     console.log(err.message);
        //   });
        // }}
      >
        out
      </button>
    </div>
  );
}
