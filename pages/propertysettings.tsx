import { useContext, useState } from "react";
import Layout from "../components/layout";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import ErrorPage from "./errorpage";
import { AuthContext } from "../firebase-authProvider";
import { InputAdornment, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ImageForm from "../components/imageform";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { isHostModeHost, removedByAdmin } from "../lib/hooks";
import RemovedByAdmin from "../components/removedbyadmin";

type IFormInput = {
  title: string;
  desc: string;
  priceN: number;
  addCosts: number;
  images: string[];
  picturesNEW: File[];
};
// propertysettings
export default function PropertySettings({
  uid,
  propertyJSON,
  myUserJSON,
}: // isRemovedByAdmin,
{
  uid: string;
  propertyJSON: string;
  myUserJSON: string;
  // isRemovedByAdmin: boolean;
}) {
  const property: DocumentData = JSON.parse(propertyJSON);
  const [urlArr, setUrlArr] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const {
    control,
    watch,
    handleSubmit,
    register,
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
  // if (isRemovedByAdmin) return <RemovedByAdmin />;

  const myUser: DocumentData = JSON.parse(myUserJSON);
  // const { user, myUser } = useContext(AuthContext);
  const imgNew: File[] = Array.from(watch("picturesNEW"));

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
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
      update(data).then((ret) => {
        console.log(ret);
        if (ret) {
          router.push({
            pathname: "/hostsboard",
          });
        } else console.log("RETURNED FALSE subm");
      });
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
        const nnNEW: string = `uploads/${
          uid
          // user.uid
        }/properties/${Date.now()}.${extension}`;
        const storageRef = ref(storage, nnNEW); //ref to file. file dosnt exist yet
        //when we upload using this ref this file should have that name
        const uploadTask = await uploadBytesResumable(storageRef, selected);
        const url: string = await getDownloadURL(uploadTask.ref);
        console.log("WWWWWWWWWWWWWWWWWWW");
        urlArr.push(url);
        // setError("");
      } else {
        setError("Image must be png, jpeg or jpg");
        return null;
      }
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
      // images: urlArr,
    });

    return true;
  };

  return (
    <>
      {
        // user &&
        myUser && myUser.numberOfProperties < 10 ? (
          <>
            <Layout>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-7xl px-5 mx-auto text-center">
                  <div className="pt-7 pb-5 text-center text-3xl font-bold">
                    Update property
                  </div>

                  <TextField
                    {...register("title", {
                      required: "Please enter your last name",
                    })}
                    className="w-full mb-2"
                    id="outlined-required"
                    label="Title"
                    helperText={errors.title ? errors.title.message : " "}
                  />

                  <TextField
                    {...register("desc", {
                      required: "Please enter  a description",
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
                                <InputAdornment position="end">
                                  €
                                </InputAdornment>
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
                                <InputAdornment position="end">
                                  €
                                </InputAdornment>
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
                  {/* <button
                  className="btn mx-auto text-center w-full mt-3"
                  onClick={() => {
                    router.push({
                      pathname: "/hostsboard",
                    });
                  }}
                >
                  Cancel
                </button> */}
                  <Link
                    href={{
                      pathname: "/hostsboard",
                    }}
                  >
                    <a className="btn mx-auto text-center w-full mt-3">
                      Cancel
                    </a>
                  </Link>
                </div>
              </form>
            </Layout>
          </>
        ) : (
          <>
            <ErrorPage />
          </>
        )
      }
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
    // var isRemovedByAdmin: boolean = false;
    const docSnap2 = await getDoc(doc(db, "users", uid));

    if (docSnap2.exists()) {
      myUser = docSnap2.data();
      if (isHostModeHost(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          // isRemovedByAdmin = true;
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
    const queryUrl = context.query;
    var property: DocumentData = null;
    const docSnap = await getDoc(doc(db, "property", queryUrl.property));
    if (docSnap.exists()) {
      property = docSnap.data();
    }

    return {
      props: {
        uid: uid,
        propertyJSON: JSON.stringify(property),
        myUserJSON: JSON.stringify(myUser),
        // isRemovedByAdmin: isRemovedByAdmin,
      },
    };
  } catch (err) {
    // context.res.writeHead(302, { location: "/" });
    // context.res.end();
    // return { props: [] };
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
