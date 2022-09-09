import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import ErrorPage from "./errorpage";
import { InputAdornment, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ImageForm from "../components/imageform";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/router";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import Link from "next/link";
import { isHost, removedByAdmin } from "../lib/hooks";
import SimpleBackdrop from "../components/backdrop";
import toast from "react-hot-toast";
import { AuthContext } from "../firebase-authProvider";

type IFormInput = {
  title: string;
  desc: string;
  priceN: number;
  addCosts: number;
  images: string[];
  picturesNEW: File[];
};

export default function PropertySettings({
  uid,
  propertyJSON,
  myUserJSON,
}: {
  uid: string;
  propertyJSON: string;
  myUserJSON: string;
}) {
  const {
    user,
    myUser: myUserContext,
    hostModeHostC,
    setHostModeHostC,
  } = useContext(AuthContext);

  useEffect(() => {
    if (myUser && myUser.host && !hostModeHostC) {
      //can access only if isHostModeHost, else change mod
      setHostModeHostC(true);
    }
  }, [myUserContext]);

  const property: DocumentData = JSON.parse(propertyJSON);
  const [urlArr, setUrlArr] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      title: property.title,
      desc: property.description,
      priceN: property.pricePerNight,
      addCosts: property.additionalCosts,
      images: property.images,
      picturesNEW: [],
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const myUser: DocumentData = JSON.parse(myUserJSON);
  const imgNew: File[] = Array.from(watch("picturesNEW"));

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    setError("");
    if (data.title.length > 50) {
      setError("Title must be shorter than 50 characters");
    } else if (data.desc.length > 500) {
      setError("Description must be shorter than 500 characters");
    } else if (data.priceN === 0 || data.addCosts === 0) {
      setError("Numerical fields must be grater than 0");
    } else if (data.priceN > 200 || data.addCosts > 200) {
      setError("Prices must be less then 200");
    } else if (
      data.picturesNEW &&
      data.picturesNEW.length > 0 &&
      // !data.picturesNEW ||
      ((data.picturesNEW && data.picturesNEW.length < 3) ||
        (data.picturesNEW && data.picturesNEW.length > 20))
    ) {
      setError("You must upload 3 to 10 picures at most");
    } else {
      const ret = await update(data);
      console.log(ret);
      if (ret) {
        toast.success("Update successful");
        setLoading(true);
        router.push({
          pathname: "/hostsboard",
        });
      } else {
        console.log("RETURNED FALSE subm");
        toast.error("Update not successful");
      }

      // update(data).then((ret) => {
      //   console.log(ret);
      //   if (ret) {
      //     router.push({
      //       pathname: "/hostsboard",
      //     });
      //     setLoading(true)
      //   } else console.log("RETURNED FALSE subm");
      // });
    }
  };

  const uploadPictures = async (data: IFormInput) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    var urlArr: string[] = [];
    const fileArr = data.picturesNEW ?? null;
    setUrlArr([]);

    for (let index = 0; index < fileArr.length; index++) {
      const selected: File = fileArr[index];
      if (selected && allowedTypes.includes(selected.type)) {
        const extension = selected.type.split("/")[1];
        const nnNEW: string = `uploads/${uid}/properties/${Date.now()}.${extension}`;
        const storageRef = ref(storage, nnNEW); //ref to file. file dosnt exist yet
        //when we upload using this ref this file should have that name
        const uploadTask = await uploadBytesResumable(storageRef, selected);
        const url: string = await getDownloadURL(uploadTask.ref);
        console.log("WWWWWWWWWWWWWWWWWWW");
        urlArr.push(url);
      } else {
        setError("Image must be png, jpeg or jpg");
        return null;
      }
    }
    for (let index = 0; index < property.images.length; index++) {
      await deleteObject(ref(storage, property.images[index]));
    }
    return urlArr;
  };

  const update = async (data: IFormInput): Promise<boolean> => {
    if (data.picturesNEW.length > 0) {
      const urlArr: string[] = await uploadPictures(data);
      if (urlArr === null) {
        console.log("RETURNED FALSE add");
        return false;
      }
      await updateDoc(doc(db, "property", property.id), {
        images: urlArr,
      });
    }

    await updateDoc(doc(db, "property", property.id), {
      title: data.title,
      description: data.desc,
      pricePerNight: data.priceN,
      additionalCosts: data.addCosts,
    });

    return true;
  };

  return (
    <>
      {myUser && myUser.numberOfProperties < 10 ? (
        <>
          <Layout>
            {loading && <SimpleBackdrop loading={loading} />}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="max-w-7xl px-5 mx-auto text-center">
                <div className="pt-7 pb-5 text-center text-3xl font-bold">
                  Update property
                </div>

                <TextField
                  {...register("title", {
                    required: "Please enter a title",
                    maxLength: {
                      value: 50,
                      message: "Title can have maximum 50 characters",
                    },
                  })}
                  className="w-full mb-2"
                  id="outlined-required"
                  label="Title"
                  helperText={errors.title ? errors.title.message : " "}
                />

                <TextField
                  {...register("desc", {
                    required: "Please enter  a description",
                    maxLength: {
                      value: 100,
                      message: "Description can have maximum 100 characters",
                    },
                  })}
                  className="w-full mb-2 "
                  id="outlined-required"
                  label="Description"
                  multiline
                  maxRows={15}
                  helperText={errors.desc ? errors.desc.message : " "}
                />

                <div className="grid sm:grid-cols-2 grid-cols-1 gap-0 sm:gap-4">
                  <Controller
                    name="priceN"
                    control={control}
                    rules={{ required: "Please enter a value" }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          className="mr-3  mb-2"
                          id="outlined-required"
                          label="Price per night"
                          value={value}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onChange={(e) => {
                            onChange(
                              e.target.value ? parseInt(e.target.value) : 0
                            );
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">€</InputAdornment>
                            ),
                          }}
                          helperText={
                            errors.priceN ? errors.priceN.message : " "
                          }
                        />
                      </>
                    )}
                  />

                  <Controller
                    name="addCosts"
                    control={control}
                    rules={{ required: "Please enter a value" }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          className="ml-3 mb-2"
                          id="outlined-required"
                          label="Additional costs"
                          value={value}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onChange={(e) => {
                            onChange(
                              e.target.value ? parseInt(e.target.value) : 0
                            );
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">€</InputAdornment>
                            ),
                          }}
                          helperText={
                            errors.addCosts ? errors.addCosts.message : " "
                          }
                        />
                      </>
                    )}
                  />
                </div>

                <div>
                  <label className="btn w-full mt-5">
                    Select property pictures
                    <input
                      {...register("picturesNEW")}
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </label>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {imgNew &&
                      imgNew.length > 0 &&
                      imgNew.map((item, index) => {
                        return (
                          <div key={item.name}>
                            <ImageForm
                              url={URL.createObjectURL(imgNew[index])}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="pt-7 pb-5 text-center text-sm font-thin">
                  {error}
                </div>

                <button
                  className="btn mx-auto text-center w-full"
                  type="submit"
                >
                  Update
                </button>

                <Link
                  href={{
                    pathname: "/hostsboard",
                  }}
                >
                  <a className="btn mx-auto text-center w-full mt-3">Cancel</a>
                </Link>
              </div>
            </form>
          </Layout>
        </>
      ) : (
        <>
          <ErrorPage />
        </>
      )}
    </>
  );
}
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    var myUser: DocumentData = null;
    var hasPermission: boolean = false;
    const queryUrl = context.query;
    // const docSnap2 = await getDoc(doc(db, "users", uid));
    const [docSnap2, docSnap] = await Promise.all([
      getDoc(doc(db, "users", uid)),
      getDoc(doc(db, "property", queryUrl.property)),
    ]);
    if (docSnap2.exists()) {
      myUser = docSnap2.data();
      if (isHost(myUser)) {
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

    var property: DocumentData = null;
    // const docSnap = await getDoc(doc(db, "property", queryUrl.property));
    if (docSnap.exists()) {
      property = docSnap.data();
    }

    return {
      props: {
        uid: uid,
        propertyJSON: JSON.stringify(property),
        myUserJSON: JSON.stringify(myUser),
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
