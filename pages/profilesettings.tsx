import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import Button from "../components/button";
import ImageForm from "../components/imageform";
import Inputs from "../components/inputs";
import Layout from "../components/layout";
import { db, storage } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Image from "next/image";

type IFormInput = {
  title: string;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  profilePictureNEW: File[];
};
//TODO proveri svuda za  auth.currentUser da li ostaje ili na neki drugi nacin
export default function ProfileSettings() {
  const { user, myUser } = useContext(AuthContext);

  console.log("88888888888888888888888888", myUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    getValues,
    watch,
  } = useForm<IFormInput>({
    defaultValues: {
      email: user?.email ?? "",
      password: myUser?.passwordState,
      username: myUser?.username,
      firstName: myUser?.firstName,
      lastName: myUser?.lastName,
      profilePictureNEW: [],
    },
  });
  const imgNew = watch("profilePictureNEW");
  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    console.log(data);
    router.push({
      pathname: "/",
    });
    changeProfile(data);
  };

  const router = useRouter();

  const [error, setError] = useState<any>("");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    reset({
      email: user?.email ?? "",
      password: myUser?.passwordState,
      username: myUser?.username,
      firstName: myUser?.firstName,
      lastName: myUser?.lastName,
    });
  }, [user, myUser, reset]); //TODO VIDI DA LI OVOR Radi

  useEffect(() => {
    //MOZDA JE VSIAK
    if (url) {
      // setFile(null);
      // console.log("klll");
    }
  }, [url]);

  const changeProfile = async (data: IFormInput) => {
    // const changeProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault();
    //TODO update email, password and other
    // if (auth.currentUser && auth.currentUser?.email != emailState) {
    //   updateEmail(auth.currentUser, emailState)
    //     .then(() => {
    //       console.log("email updated");
    //     })
    //     .catch((error) => {
    //       console.log("ERROR in email updated ", error.message);
    //       const credential = promptForCredentials();
    //       if (auth.currentUser)
    //       reauthenticateWithCredential(auth.currentUser, credential)
    //         .then(() => {
    //           // User re-authenticated.
    //         })
    //         .catch((error) => {
    //           console.log("ERROR in email updated reauth ", error.message);
    //         });
    //     });
    // }
    // if (auth.currentUser && auth.currentUser?.displayName != usernameState) {
    // updateProfile(auth.currentUser, {
    //   displayName: usernameState,
    // })
    //   .then(() => {
    //     console.log("username updated");
    //   })
    //   .catch((error) => {
    //     console.log("ERROR in username updated ", error.message);
    //   });
    // }
    // if (auth.currentUser && auth.currentUser?.photoURL != url) {//NEMA NACINA DA VIDIM U BAZI
    //   updateProfile(auth.currentUser, {
    //     photoURL: url,
    //   })
    //     .then(() => {
    //       console.log("photo updated");
    //     })
    //     .catch((error) => {
    //       console.log("ERROR in photo updated ", error.message);
    //     });
    const fileArr = data.profilePictureNEW ?? null;
    const file = fileArr.length > 0 ? fileArr[0] : null;
    const nn: string = "ppp-" + file?.name;
    const storageRef = ref(storage, nn); //ref to file. file dosnt exist yet
    //when we upload using this ref this file should have that name
    if (file) {
      console.log("BBBBBBBBBBBBBB", file);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(
            "zdravo"
            // +(snapshot.bytesTransferred / snapshot.totalBytes) * 100 +"%"
          );
        },
        (err) => {
          console.log("ovo je greska");
          setError(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setUrl(downloadURL);
            // update profile pic
            if (user && myUser.photoURL != downloadURL) {
              const docRef = await updateDoc(doc(db, "users", user.uid), {
                photoURL: downloadURL,
              }).catch((err) => {
                console.log("ERROR ", err.message);
              });
            }
          });
        }
      );
    }
    // update username
    if (user && myUser.username != data.username) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        username: data.username,
      }).catch((err) => {
        console.log("ERROR ", err.message);
      });
    }

    // update first name
    if (user && myUser.firstName != data.firstName) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        firstName: data.firstName,
      }).catch((err) => {
        console.log("ERROR ", err.message);
      });
    }

    // update last name
    if (user && myUser.lastName != data.lastName) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        lastName: data.lastName,
      }).catch((err) => {
        console.log("ERROR ", err.message);
      });
    }
  };

  //TODO AKO SE NESTO UPDAATUJE DOVUCI PONOVO MY USER IZ KONTEKSTA
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 sm:px-16  ">
        <div>hello {user?.email}</div>
        {/* <form onSubmit={changeProfile} name="submitFormName"> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <TextField
              disabled={true}
              {...register("email")}
              className="mx-3 mb-2"
              id="outlined-required3"
              label="email"
              type="email"
              InputLabelProps={getValues("email") ? { shrink: true } : {}} //TODO ubaci watch
              helperText=" "
            />
            {/* <Controller
              name="firstName"
              control={control}
              rules={{ required: "Please enter your first name" }}
              render={({ field: { onChange, value } }) => ( */}
            <TextField
              {...register("firstName", {
                required: "Please enter your first name",
              })}
              className="mx-3 mb-2"
              // required
              id="outlined-required1"
              label="first name"
              // defaultValue={myUser?.firstName ?? " "}
              // value={value}
              // onChange={(e) => {
              //   onChange(e.target.value);
              // }}
              InputLabelProps={getValues("firstName") ? { shrink: true } : {}} //TODO ubaci watch
              helperText={errors.firstName ? errors.firstName.message : " "}
            />
            {/* )}
            /> */}
            {/* <Controller
              name="lastName"
              control={control}
              rules={{ required: "Please enter your last name" }}
              render={({ field: { onChange, value } }) => (*/}
            <TextField
              {...register("lastName", {
                required: "Please enter your last name",
              })}
              className="mx-3 mb-2"
              // required
              id="outlined-required2"
              label="last name"
              // value={value}
              // onChange={(e) => {
              //   onChange(e.target.value);
              // }}
              InputLabelProps={getValues("lastName") ? { shrink: true } : {}} //TODO ubaci watch
              helperText={errors.lastName ? errors.lastName.message : " "}
            />
            {/* )}
            />*/}
            {/* 
          
            {/* <Controller
              name="passwordState"
              control={control}
              rules={{ required: "Please enter a password" }}
              render={({ field: { onChange, value } }) => (*/}
            <TextField
              {...register("password")}
              className="mx-3 mb-2"
              // required
              id="outlined-required3"
              label="enter new password"
              type="password"
              // value={value}
              // onChange={(e) => {
              //   onChange(e.target.value);
              // }}
              InputLabelProps={getValues("password") ? { shrink: true } : {}} //TODO ubaci watch
              helperText={errors.password ? errors.password.message : " "}
            />
            {/*    )}
            />*/}
            {/*  <Controller //TODO: remove username from everywhere
              name="usernameState"
              control={control}
              rules={{ required: "Please enter a username" }}
              render={({ field: { onChange, value } }) => (*/}
            <TextField
              {...register("username", { required: "Please enter a username" })}
              className="mx-3 mb-2"
              // required
              id="outlined-required4"
              label="username"
              // value={value}
              // onChange={(e) => {
              //   onChange(e.target.value);
              // }}
              InputLabelProps={getValues("username") ? { shrink: true } : {}} //TODO ubaci watch
              helperText={errors.username ? errors.username.message : " "}
            />
            {/*   )}
            /> */}
          </div>
          <div className=" text-center">
            <label className="btn ">
              Select profile picture
              <input
                {...register("profilePictureNEW")}
                type="file"
                // onChange={changeHandler}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
              />
            </label>
            <div className="grid justify-items-center  mx-auto">
              <div>New:</div>
              {((myUser && myUser?.photoURL) ||
                (imgNew && imgNew.length > 0)) && (
                <ImageForm
                  url={
                    imgNew && imgNew.length > 0
                      ? URL.createObjectURL(imgNew[0])
                      : myUser?.photoURL
                  }
                />
              )}
            </div>
          </div>

          {/* {file && <p>Storing image...</p>} */}
          {error && <div>{error}</div>}

          {/* <div>
            {(!emailState ||
              !passwordState ||
              !usernameState ||
              !url ||
              !firstName ||
              !lastName) && ( // hover:shadow-xl
              <div
                className="my-5 mx-auto  text-center shadow-md  p-3
          
              text-lg sm:text-2xl font-semibold rounded-lg "
              >
                Please fillout every field.
              </div>
            )}
            {emailState &&
              passwordState &&
              usernameState &&
              url &&
              firstName &&
              lastName && (
                <Button
                  type="submit"
                  text="Update info"
                  action={() => {
                    router.push({
                      pathname: "/",
                    });
                  }}
                />
              )} </div> */}

          <Button action={() => {}} text="Update" type="submit" />
        </form>
      </div>
    </Layout>
  );
}
