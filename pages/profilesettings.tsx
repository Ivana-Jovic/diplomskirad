import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import ImageForm from "../components/imageform";
import Layout from "../components/layout";
import { db, storage } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";
import { auth } from "../firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorPage from "./errorpage";
import {
  isAdmin,
  isFullyRegisteredUser,
  isHost,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import RemovedByAdmin from "../components/removedbyadmin";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import SimpleBackdrop from "../components/backdrop";

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

export default function ProfileSettings({
  uid,
  userEmail,
  myUserJSON,
}: {
  myUserJSON: string;
  uid: string;
  userEmail: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const myUser: DocumentData = JSON.parse(myUserJSON);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [error, setError] = useState<string>(""); //any
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [wantToChangePass, setWantToChangePass] = useState<boolean>(false);

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
      email: userEmail,
      passwordNew: "",
      passwordOld: myUser?.passwordState,
      firstName: myUser?.firstName,
      lastName: myUser?.lastName,
      profilePictureNEW: [],
    },
  });

  const imgNew = watch("profilePictureNEW");

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
      myUser.photoURL !== data.profilePictureNEW &&
      data.profilePictureNEW &&
      file
    ) {
      const extension = file.type.split("/")[1];
      const nnNEW: string = `uploads/${uid}/profile/${Date.now()}.${extension}`;
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
                if (myUser.photoURL !== downloadURL) {
                  const docRef = await updateDoc(doc(db, "users", uid), {
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

    if (wantToChangePass) {
      try {
        const credential = EmailAuthProvider.credential(
          userEmail,
          data.passwordOld
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, data.passwordNew);

        await signOut(auth);
        console.log("the user signed out");
        nookies.set(undefined, "token", "", {});
        router.push({
          pathname: "/",
        });
      } catch (err) {
        if (err.code === "auth/weak-password") {
          setErrorPassword("Can't update password - weak password"); //
        } else if (err.code === "auth/too-many-requests") {
          setErrorPassword("Too many requests - try again later");
        } else if (err.code === "auth/wrong-password") {
          setErrorPassword("Can't update password - wrong password"); //
        } else {
          setErrorPassword("Can't update password - wrong data ");
        }
        console.log(err.message, err.code);
        return false;
      }
    }
    // update first name
    if (myUser.firstName !== data.firstName) {
      const docRef = await updateDoc(doc(db, "users", uid), {
        firstName: data.firstName,
      }).catch((err) => {
        console.log("ERROR ", err.message);
      });
    }

    // update last name
    if (myUser.lastName !== data.lastName) {
      const docRef = await updateDoc(doc(db, "users", uid), {
        lastName: data.lastName,
      }).catch((err) => {
        console.log("ERROR ", err.message);
      });
    }
    return true;
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    setError("");
    setErrorPassword("");
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const fileArr = data.profilePictureNEW ?? null;
    const file = fileArr.length > 0 ? fileArr[0] : null;
    if (!myUser.photoURL && !file) {
      setError("Please select a profile picture");
      return;
    }
    if (file && !allowedTypes.includes(file.type)) {
      setError("Image must be png, jpeg or jpg");
    } else {
      const res: boolean = await changeProfile(data);
      if (res) {
        console.log("res is true");
        toast.success("Update successful");
        setLoading(true);
        router.push({
          pathname: "/",
        });

        return;
      } else {
        console.log("res is false");
        toast.error("Update not successful");
      }
    }
  };
  return (
    <Layout>
      <div className="max-w-3xl px-8 sm:px-16 text-center  mx-auto  mt-5 ">
        {loading && <SimpleBackdrop loading={loading} />}
        <form onSubmit={handleSubmit(onSubmit)} className="">
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
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-0 sm:gap-4">
              <TextField
                {...register("firstName", {
                  required: "Please enter your first name",
                  maxLength: {
                    value: 10,
                    message: "First name can have maximum 10 characters",
                  },
                })}
                className=" "
                id="outlined-required1"
                label="first name"
                InputLabelProps={getValues("firstName") ? { shrink: true } : {}}
                helperText={errors.firstName ? errors.firstName.message : " "}
              />

              <TextField
                {...register("lastName", {
                  required: "Please enter your last name",
                  maxLength: {
                    value: 10,
                    message: "Last name can have maximum 10 characters",
                  },
                })}
                className=" mb-2"
                id="outlined-required2"
                label="last name"
                InputLabelProps={getValues("lastName") ? { shrink: true } : {}}
                helperText={errors.lastName ? errors.lastName.message : " "}
              />
            </div>

            <button
              type="button"
              className="btn mb-3 "
              onClick={() => {
                setWantToChangePass(!wantToChangePass);
                reset({
                  passwordOld: "",
                  passwordNew: "",
                });
              }}
            >
              {!wantToChangePass && <div>Change password</div>}
              {wantToChangePass && <div>Cancel change password</div>}
            </button>
            {wantToChangePass && (
              <>
                <TextField
                  {...register("passwordOld")}
                  className="mb-2"
                  id="outlined-required3"
                  label="enter old password"
                  type="password"
                  InputLabelProps={
                    getValues("passwordOld") ? { shrink: true } : {}
                  }
                  helperText={
                    errors.passwordOld ? errors.passwordOld.message : " "
                  }
                />
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
                {errorPassword && <div>{errorPassword}</div>}
              </>
            )}
          </div>
          <label className="btn w-full">
            Select profile picture
            <input
              {...register("profilePictureNEW")}
              type="file"
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
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    var myUser: DocumentData = null;
    var hasPermission: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      myUser = docSnap.data();
      if (isLoggedUser(myUser) || isHost(myUser) || isAdmin(myUser)) {
        //JEDINO OVDE NE MORA BITI FULLY REGISTERED USER
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          return {
            redirect: {
              destination: "/removedbyadmin",
            },
            props: [],
          };
        }
      }
    }
    if (!hasPermission) {
      return {
        redirect: {
          destination: "/",
        },
        props: [],
      };
    }
    return {
      props: {
        uid: uid,
        userEmail: email,
        myUserJSON: JSON.stringify(myUser),
      },
    };
  } catch (err) {
    console.log("---", "no user");
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
