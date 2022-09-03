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
import { TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

type IFormInput = {
  email: string;
  password: string;
};

export default function SignInRegisterPopup() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(false); //SIgn in or Register popup

  // const [emailState, setEmailState] = useState<string>("");
  // const [passwordState, setPasswordState] = useState<string>("");

  // const [emailState2, setEmailState2] = useState<string>("");
  // const [passwordState2, setPasswordState2] = useState<string>("");

  const togglePopup = (RorS: string) => {
    //Register Or SignUp
    setError("");
    reset({
      email: "",
      password: "",
    });
    setIsPopupOpen(!isPopupOpen);
    if (RorS === "S") {
      setIsSignIn(true);
    } else if (RorS === "R") {
      setIsSignIn(false);
    }
  };

  const reg = (data: IFormInput) => {
    setError("");
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (cred) => {
        console.log("User created:", cred.user);
        // setIsLoggedIn(true);//sad
        const docRef = await setDoc(doc(db, "users", cred.user.uid), {
          userId: cred.user.uid,
          host: false,
          isSuperhost: false,
          numberOfProperties: 0,
          faves: [],
          removedByAdmin: false,
          modeIsHosting: false,
        });
        router.push({
          pathname: "/profilesettings",
        });
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          setError("Can't register - email already in use");
        } else if (err.code === "auth/weak-password") {
          setError("Can't register - weak password");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests - try again later");
        } else {
          setError("Can't register - wrong data");
        }
        console.log(err.message, err.code);
      });
  };
  const sig = (data: IFormInput) => {
    setError("");
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((cred) => {
        console.log("User signedin:", cred.user);
        router.push({
          pathname: "/",
        });
      })
      .catch((err) => {
        //TODOpp DA li ima jos neka sifra ili bolji nacin,
        //TODOpp sta raditi sa POST ispisom u konzoli crveno

        if (err.code === "auth/user-not-found") {
          setError("Can't sign in  - user not found");
        } else if (err.code === "auth/wrong-password") {
          setError("Can't sign in  - wrong password");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests - try again later");
        } else {
          setError("Can't sign in  - wrong data ");
        }
        console.log(err.message, err.code);
      });
  };
  const onSubmitRegister: SubmitHandler<IFormInput> = (data: IFormInput) => {
    reg(data);
  };
  const onSubmitSignIn: SubmitHandler<IFormInput> = (data: IFormInput) => {
    sig(data);
  };
  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    if (isSignIn) {
      sig(data);
    } else {
      reg(data);
    }
  };
  // const registerForm = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault(); // Preventing the page from reloading
  //   createUserWithEmailAndPassword(auth, emailState, passwordState)
  //     .then(async (cred) => {
  //       console.log("User created:", cred.user);
  //       setEmailState("");
  //       setPasswordState("");
  //       // setIsLoggedIn(true);//sad
  //       const docRef = await setDoc(doc(db, "users", cred.user.uid), {
  //         userId: cred.user.uid,
  //         host: false,
  //         isSuperhost: false,
  //         numberOfProperties: 0,
  //         faves: [],
  //         removedByAdmin: false,
  //       });
  //       router.push({
  //         pathname: "/profilesettings",
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  // const signin = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault(); // Preventing the page from reloading
  //   signInWithEmailAndPassword(auth, emailState2, passwordState2)
  //     .then((cred) => {
  //       console.log("User signedin:", cred.user);
  //       setEmailState2("");
  //       setPasswordState2("");
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };
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
              <div className="text-center mx-6 mb-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    {...register("email", {
                      required: "Please enter your email",
                    })}
                    className="mb-2 w-full"
                    id="outlined-required3"
                    label="Email"
                    type="email"
                    // InputLabelProps={{ shrink: true }}
                    helperText={errors.email ? errors.email.message : " "}
                  />
                  <TextField
                    {...register("password", {
                      required: "Please enter your password",
                      // pattern: {//TODO vrati ovo
                      //   value:
                      //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#$@!%&*?]).{8,15}$/,
                      //   // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/,
                      //   message:
                      //     "Password must be 8 to 15 characters long, contain at least one number, both lower and uppercase letters and special characters",
                      //  },
                    })}
                    className="mb-2  w-full"
                    id="outlined-required3"
                    label="Password"
                    type="password"
                    // InputLabelProps={{ shrink: true }}
                    helperText={errors.password ? errors.password.message : " "}
                  />
                  {!isSignIn && (
                    <button className="btn my-3 w-full" type="submit">
                      Register
                    </button>
                  )}

                  {isSignIn && (
                    <button className="btn my-3 w-full" type="submit">
                      Sign in
                    </button>
                  )}
                </form>
                {!isSignIn && (
                  <div className="text-center">
                    Already have an account? Sign in&nbsp;
                    <button onClick={() => setIsSignIn(true)}>
                      <u>here.</u>
                    </button>
                  </div>
                )}

                {isSignIn && (
                  <div className="text-center">
                    Don&apos;t have an account? Register&nbsp;
                    <button onClick={() => setIsSignIn(false)}>
                      <u>here.</u>
                    </button>
                  </div>
                )}
                {error}
              </div>
              {/*              
              {isSignIn && (
                <div className="text-center">
                  <form onSubmit={handleSubmit(onSubmitSignIn)}>
                    <TextField
                      {...register("email", {
                        required: "Please enter your email",
                      })}
                      className="mb-2  w-full"
                      id="outlined-required3"
                      label="email"
                      type="email"
                      InputLabelProps={{ shrink: true }}
                      helperText={errors.email ? errors.email.message : " "}
                    />
                    <TextField
                      {...register("password", {
                        required: "Please enter your password",
                      })}
                      className="mb-2  w-full"
                      id="outlined-required3"
                      label="enter password"
                      type="password"
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errors.password ? errors.password.message : " "
                      }
                    />
                    <button className="btn my-3 w-full" type="submit">
                      Sign in
                    </button>
                  </form>
                  <div className="text-center">
                    Don&apos;t have an account? Register&nbsp;
                    <button onClick={() => setIsSignIn(false)}>
                      <u>here.</u>
                    </button>
                  </div>
                  {error}
                </div>
              )} */}

              {/* {!isSignIn && (
                <div className="text-center">
                  <form onSubmit={handleSubmit(onSubmitRegister)}>
                    <TextField
                      {...register("email", {
                        required: "Please enter your email",
                      })}
                      className="mb-2 w-full"
                      id="outlined-required3"
                      label="email"
                      type="email"
                      InputLabelProps={{ shrink: true }}
                      helperText={errors.email ? errors.email.message : " "}
                    />
                    <TextField
                      {...register("password", {
                        required: "Please enter your password",
                      })}
                      className="mb-2  w-full"
                      id="outlined-required3"
                      label="enter password"
                      type="password"
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errors.password ? errors.password.message : " "
                      }
                    />
                    <button className="btn my-3 w-full" type="submit">
                      Register
                    </button>
                  </form>
                  <div className="text-center">
                    Already have an account? Sign in&nbsp;
                    <button onClick={() => setIsSignIn(true)}>
                      <u>here.</u>
                    </button>
                  </div>{" "}
                  {error}
                </div>
              )}
              {isSignIn && (
                <div className="text-center">
                  <form onSubmit={handleSubmit(onSubmitSignIn)}>
                    <TextField
                      {...register("email", {
                        required: "Please enter your email",
                      })}
                      className="mb-2  w-full"
                      id="outlined-required3"
                      label="email"
                      type="email"
                      InputLabelProps={{ shrink: true }}
                      helperText={errors.email ? errors.email.message : " "}
                    />
                    <TextField
                      {...register("password", {
                        required: "Please enter your password",
                      })}
                      className="mb-2  w-full"
                      id="outlined-required3"
                      label="enter password"
                      type="password"
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errors.password ? errors.password.message : " "
                      }
                    />
                    <button className="btn my-3 w-full" type="submit">
                      Sign in
                    </button>
                  </form>
                  <div className="text-center">
                    Don&apos;t have an account? Register&nbsp;
                    <button onClick={() => setIsSignIn(false)}>
                      <u>here.</u>
                    </button>
                  </div>
                  {error}
                </div>
              )} */}
            </>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  );
}
