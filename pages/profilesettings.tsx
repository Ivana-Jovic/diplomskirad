import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import ImageForm from "../components/imageform";
import Layout from "../components/layout";
import { db, storage } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";

import { useForm, SubmitHandler } from "react-hook-form";
import ErrorPage from "./errorpage";
import { isAdmin, isHost, isLoggedUser } from "../lib/hooks";

type IFormInput = {
  title: string;
  email: string;
  passwordNew: string;
  passwordOld: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  profilePictureNEW: File[];
};

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
      passwordNew: "",
      passwordOld: myUser?.passwordState,
      firstName: myUser?.firstName,
      lastName: myUser?.lastName,
      profilePictureNEW: [],
    },
  });
  const imgNew = watch("profilePictureNEW");
  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    console.log(data);
    setError("");
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const fileArr = data.profilePictureNEW ?? null;
    const file = fileArr.length > 0 ? fileArr[0] : null;

    if (file && !allowedTypes.includes(file.type)) {
      setError("Image must be png, jpeg or jpg");
    } else {
      changeProfile(data);
      router.push({
        pathname: "/",
      });
    }
  };

  const router = useRouter();

  const [error, setError] = useState<string>(""); //any
  const [url, setUrl] = useState<string>("");
  const [wantToChangePass, setWantToChangePass] = useState<boolean>(false);

  // ------------------NE BRISI-----------------!!!!!!!!!!!!!!
  // useEffect(() => {
  //   reset({
  //     email: user?.email ?? "",
  //     passwordNew: "",
  //     passwordOld: myUser?.passwordState,
  //     firstName: myUser?.firstName,
  //     lastName: myUser?.lastName,
  //   });
  // }, [user, myUser, reset]);
  // ------------------NE BRISI-----------------!!!!!!!!!!!!!!

  const changeProfile = async (data: IFormInput) => {
    const fileArr = data.profilePictureNEW ?? null;
    const file = fileArr.length > 0 ? fileArr[0] : null;

    if (
      user &&
      myUser.profilePicture != data.profilePictureNEW &&
      data.profilePictureNEW &&
      file
    ) {
      const extension = file.type.split("/")[1];
      const nnNEW: string = `uploads/${
        user.uid
      }/profile/${Date.now()}.${extension}`;
      const storageRef = ref(storage, nnNEW); //ref to file. file dosnt exist yet
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
            setError(err + "");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                setUrl(downloadURL);
                // update profile pic
                if (user && myUser.photoURL != downloadURL) {
                  const docRef = await updateDoc(doc(db, "users", user.uid), {
                    photoURL: downloadURL,
                  }).catch((err) => {
                    console.log("ERROR ", err.message);
                  });
                }
              }
            );
          }
        );
      }
    }
    //TODOp promena sifre plus da i spojiti updatove

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
    return true;
  };

  // const { user, myUser } = useContext(AuthContext);
  if (
    isLoggedUser(user, myUser) ||
    isHost(user, myUser) ||
    isAdmin(user, myUser)
  )
    return (
      <Layout>
        <div className="max-w-7xl px-8 sm:px-16 text-center   ">
          <div>hello {user?.email}</div>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-3">
            <div className="flex flex-col">
              <TextField
                disabled={true}
                {...register("email")}
                className=" mb-2"
                id="outlined-required3"
                label="email"
                type="email"
                InputLabelProps={getValues("email") ? { shrink: true } : {}}
                helperText=" "
              />
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 ">
                <TextField
                  {...register("firstName", {
                    required: "Please enter your first name",
                  })}
                  className=" "
                  id="outlined-required1"
                  label="first name"
                  InputLabelProps={
                    getValues("firstName") ? { shrink: true } : {}
                  }
                  helperText={errors.firstName ? errors.firstName.message : " "}
                />

                <TextField
                  {...register("lastName", {
                    required: "Please enter your last name",
                  })}
                  className=" mb-2"
                  id="outlined-required2"
                  label="last name"
                  InputLabelProps={
                    getValues("lastName") ? { shrink: true } : {}
                  }
                  helperText={errors.lastName ? errors.lastName.message : " "}
                />
              </div>
              <button
                className="btn mb-3 "
                onClick={() => {
                  setWantToChangePass(!wantToChangePass);
                }}
              >
                Change password
              </button>
              {wantToChangePass && (
                <>
                  <TextField
                    {...register("passwordNew")}
                    className="mb-2"
                    id="outlined-required3"
                    label="enter new password"
                    type="password"
                    InputLabelProps={
                      getValues("passwordNew") ? { shrink: true } : {}
                    }
                    helperText={
                      errors.passwordNew ? errors.passwordNew.message : " "
                    }
                  />
                  <TextField
                    {...register("passwordOld")}
                    className="mb-2"
                    id="outlined-required3"
                    label="enter new password"
                    type="password"
                    InputLabelProps={
                      getValues("passwordOld") ? { shrink: true } : {}
                    }
                    helperText={
                      errors.passwordOld ? errors.passwordOld.message : " "
                    }
                  />
                </>
              )}
            </div>
            {/* <div className="mx-3"> */}
            <label className="btn w-full">
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
            {/* </div> */}

            {error && (
              <div className="pt-7 pb-5 text-center text-sm font-thin">
                {error}
              </div>
            )}

            <button className="btn w-full mt-10" type="submit">
              Update
            </button>
          </form>
        </div>
      </Layout>
    );
  else
    return (
      <>
        <ErrorPage />
      </>
    );
}
