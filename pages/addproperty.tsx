import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import ErrorPage from "./errorpage";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Map from "../components/map";
import ImageForm from "../components/imageform";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/router";
import {
  isFullyRegisteredUser,
  isHost,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";

import toast from "react-hot-toast";
import SimpleBackdrop from "../components/backdrop";
import { AuthContext } from "../firebase-authProvider";

type IFormInput = {
  title: string;
  desc: string;
  type: string;
  numRoooms: number;
  numPers: number;

  priceN: number;
  addPers: number;
  addCosts: number;
  garage: string;
  images: string[];
  picturesNEW: File[];
};

export default function AddProperty({
  uid,
  myUserJSON,
}: {
  myUserJSON: string;
  uid: string;
}) {
  const {
    user,
    myUser: myUserContext,
    hostModeHostC,
    setHostModeHostC,
  } = useContext(AuthContext);

  useEffect(() => {
    if (myUserContext && myUserContext.host && !hostModeHostC) {
      //can access only if isHostModeHost, else change mod
      setHostModeHostC(true);
    }
  }, [myUserContext]);

  const [loc, setLoc] = useState<any>();
  const [urlArr, setUrlArr] = useState<string[]>([]);
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [streetName, setStreetName] = useState<string>("");
  const [streetNum, setStreetNum] = useState<string>("");
  const [selectedStreet, setSelectedStreet] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const {
    control,
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      desc: "",
      type: "",
      numRoooms: 0,
      numPers: 0,

      priceN: 0,
      addPers: 0,
      addCosts: 0,
      garage: "",
      images: [],
      picturesNEW: [],
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const myUser: DocumentData = JSON.parse(myUserJSON);
  const imgNew: File[] = Array.from(watch("picturesNEW"));

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    setError("");
    console.log("QQQQQQQQQ", data);
    if (data.title.length > 50) {
      setError("Title must be shorter than 50 characters");
    } else if (data.desc.length > 500) {
      setError("Description must be shorter than 500 characters");
    } else if (
      state === "" ||
      city === "" ||
      streetName === "" ||
      streetNum === ""
    ) {
      setError("Street name and number must be entered in map searchbox");
    } else if (
      data.numRoooms === 0 ||
      data.numPers === 0 ||
      data.priceN === 0 ||
      data.addCosts === 0
    ) {
      setError("Numerical fields must be grater than 0");
    } else if (data.numRoooms > 20 || data.numPers > 20) {
      setError("Number of rooms and/or number of persons must be less then 20");
    } else if (data.priceN > 200 || data.addCosts > 200) {
      setError("Prices must be less then 200");
    } else if (
      !data.picturesNEW ||
      (data.picturesNEW && data.picturesNEW.length < 3) ||
      (data.picturesNEW && data.picturesNEW.length > 20)
    ) {
      setError("You must upload 3 to 10 picures at most");
    } else {
      const ret = add(data);
      console.log(ret);
      if (ret) {
        toast.success("Property added successfully");
        setLoading(true);
        router.push({
          pathname: "/",
        });
      } else {
        console.log("RETURNED FALSE subm");
        toast.error("Property not added successfully");
      }

      // add(data).then((ret) => {
      //   console.log(ret);
      //   if (ret) {
      //     toast.success("Reservation successful");
      //     router.push({
      //       pathname: "/",
      //     });
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
        const nnNEW: string = `uploads/${
          uid
          // user.uid
        }/properties/${Date.now()}.${extension}`;
        const storageRef = ref(storage, nnNEW); //ref to file. file dosnt exist yet
        //when we upload using this ref this file should have that name
        const uploadTask = await uploadBytes(storageRef, selected);
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

  const add = async (data: IFormInput): Promise<boolean> => {
    const urlArr: string[] = await uploadPictures(data);
    // uploadPictures(data).then(async (urlArr) => {
    if (urlArr === null) {
      console.log("RETURNED FALSE add");
      return false;
    }
    console.log("LLLLLLLLLLLLLLL", urlArr.length);

    const docRef = await addDoc(collection(db, "property"), {
      title: data.title,
      description: data.desc,
      state: state,
      city: city,
      street: streetName,
      streetNum: streetNum,
      type: data.type,
      numOfRooms: data.numRoooms,
      numOfPersons: data.numPers,
      pricePerNight: data.priceN,
      additionalCosts: data.addCosts,
      garage: data.garage === "Yes" ? true : false,
      ownerId: uid,
      // user?.uid,
      images: urlArr,
      totalStars: 0,
      numberOfReviews: 0,
      isSuperhost: false,
      loc: loc,
      // dateAddedProperty: new Date().toDateString(),
      createdAt: Timestamp.now().toMillis(),
      adminApproved: false,
    });
    await updateDoc(doc(db, "property", docRef.id), {
      id: docRef.id,
    });
    console.log("lllll");
    //if state doesnt exist add
    const docSnap1 = await getDoc(doc(db, "locations", state));
    if (docSnap1.exists()) {
      //if city doesnt exist add
      const docSnap2 = await getDoc(doc(db, "locations", city + ", " + state));
      if (!docSnap2.exists()) {
        await setDoc(doc(db, "locations", city + ", " + state), {});
      }
    } else {
      await setDoc(doc(db, "locations", state), {});
      //add city
      await setDoc(doc(db, "locations", city + ", " + state), {});
    }
    //incrementing numberOfProperties is done in admin

    const docRef2 = await addDoc(collection(db, "reports"), {
      hostId: uid,
      // user?.uid,
      reportText: "wantsToAddProperty",
      processed: false,
      createdAt: Timestamp.now().toMillis(),
      propertyId: docRef.id,
      firstProperty: myUser.numberOfProperties === 0,
    });
    await updateDoc(doc(db, "reports", docRef2.id), {
      id: docRef2.id,
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
              {loading && <SimpleBackdrop loading={loading} />}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-7xl px-5 mx-auto text-center gap-4">
                  <div className="pt-7 pb-5 text-center text-3xl font-bold">
                    New property
                  </div>
                  {/* <div className="grid gap-y-4"> */}
                  <TextField
                    {...register("title", {
                      required: "Please enter your last name",
                      maxLength: {
                        value: 50,
                        message: "Title can have maximum 50 characters",
                      },
                    })}
                    className="w-full "
                    id="title"
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
                    className="w-full "
                    id="desc"
                    label="Description"
                    multiline
                    maxRows={15}
                    helperText={errors.desc ? errors.desc.message : " "}
                  />
                  {/* </div> */}

                  <div className="grid sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-1 sm:gap-x-4 sm:gap-y-1">
                    <div className="">
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Please enter a value" }}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <TextField
                              // {...register("type", {
                              //   required: "Please enter a value",
                              // })}
                              className="w-full"
                              id="type"
                              select
                              label="Select a type"
                              value={value}
                              onChange={(e) => {
                                onChange(e.target.value);
                              }}
                              helperText={
                                errors.type ? errors.type.message : " "
                              }
                            >
                              {["apartment", "house"].map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </>
                        )}
                      />
                    </div>

                    <Controller
                      name="numRoooms"
                      control={control}
                      rules={{ required: "Please enter a value" }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextField
                            // {...register("numRoooms", {
                            //   required: "Please enter your last name",
                            // })}
                            className=""
                            id="numRoooms"
                            label="Number of Rooms"
                            value={value}
                            // type="number"
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                            onChange={(e) => {
                              onChange(
                                e.target.value ? parseInt(e.target.value) : 0
                              );
                            }}
                            helperText={
                              errors.numRoooms ? errors.numRoooms.message : " "
                            }
                          />
                        </>
                      )}
                    />
                    <Controller
                      name="numPers"
                      control={control}
                      rules={{ required: "Please enter a value" }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextField
                            //  {...register("lastName", {
                            //   required: "Please enter your last name",
                            // })}
                            className=""
                            id="numPers"
                            label="Number of Persons"
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
                            helperText={
                              errors.numPers ? errors.numPers.message : " "
                            }
                          />
                        </>
                      )}
                    />
                    {/* </div> */}
                    {/* <div className="grid sm:grid-cols-3 grid-cols-1 gap-0 sm:gap-4"> */}
                    <Controller
                      name="priceN"
                      control={control}
                      rules={{ required: "Please enter a value" }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextField
                            // {...register("lastName", {
                            //   required: "Please enter your last name",
                            // })}

                            className=""
                            id="priceN"
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
                            //  {...register("lastName", {
                            //   required: "Please enter your last name",
                            // })}
                            className=""
                            id="addCosts"
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
                    <Controller
                      name="garage"
                      control={control}
                      rules={{ required: "Please enter a value" }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextField
                            //  {...register("lastName", {
                            //   required: "Please enter your last name",
                            // })}
                            // className="w-full"
                            className=""
                            id="garage"
                            select
                            label="Is there any parking spot"
                            value={value}
                            onChange={(e) => {
                              onChange(e.target.value);
                            }}
                            helperText={
                              errors.garage ? errors.garage.message : " "
                            }
                          >
                            {["Yes", "No"].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        </>
                      )}
                    />
                  </div>

                  {!selectedStreet && (
                    <div className="pt-7 pb-5 text-center text-lg font-bold">
                      Please enter street name and number
                    </div>
                  )}
                  <div className="flex flex-col items-start justify-start text-start">
                    <Map
                      setLoc={setLoc}
                      setState={setState}
                      setCity={setCity}
                      setStreetName={setStreetName}
                      setStreetNum={setStreetNum}
                      setSelectedStreet={setSelectedStreet}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-3 grid-cols-1 mt-14">
                    <TextField
                      // {...register("state", {
                      //   required: "Please enter a state name",
                      // })}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      // className="mb-2"
                      id="state"
                      label="State"
                      value={state}
                      // helperText={errors.state ? errors.state.message : " "}
                    />

                    <TextField
                      // {...register("city", {
                      //   required: "Please enter a city name",
                      // })}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      // className="mb-2"
                      id="city"
                      label="City"
                      value={city}
                      // helperText={errors.city ? errors.city.message : " "}
                    />

                    {/* </div> */}
                    {/* <div className="grid sm:grid-cols-2 gap-3 grid-cols-1  sm:gap-3"> */}
                    <TextField
                      disabled
                      // {...register("street", {
                      //   required: "Please enter a street name",
                      // })}
                      InputLabelProps={{ shrink: true }}
                      // className="mb-2"
                      id="streetName"
                      label="Street"
                      value={streetName}
                      // helperText={errors.street ? errors.street.message : " "}
                    />

                    <TextField
                      disabled
                      // {...register("streetNum", {
                      //   required: "Please entera value",
                      // })}
                      InputLabelProps={{ shrink: true }}
                      // className=" mb-2"
                      id="streetNum"
                      label="StreetNum"
                      value={streetNum}
                      // onChange={(e) => {
                      //   set(e.target.value);
                      // }}
                      // helperText={
                      //   errors.streetNum ? errors.streetNum.message : " "
                      // }
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
                    Add
                  </button>
                </div>
              </form>
            </Layout>
          </>
        ) : (
          <>
            <ErrorPage />
            {myUser && myUser.numberOfProperties >= 10 && (
              <div>Maximum number of properties is 10</div>
            )}
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
    const { uid } = token;

    var myUser: DocumentData = null;
    var hasPermission: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      myUser = docSnap.data();
      if (!isFullyRegisteredUser(myUser)) {
        return {
          redirect: {
            destination: "/profilesettings",
          },
          props: [],
        };
      }
      if (isHost(myUser) || isLoggedUser(myUser)) {
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
    // context.res.writeHead(302, { location: "/" });
    // context.res.end();
    // return { props: [] };
  }
}
