import { useContext, useState } from "react";
import Layout from "../components/layout";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import Button from "../components/button";
import ErrorPage from "./errorpage";
import { AuthContext } from "../firebase-authProvider";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Map from "../components/map";
import ImageForm from "../components/imageform";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
type IFormInput = {
  title: string;
  desc: string;
  // state: string;
  // city: string;
  // mun: string;
  // street: string;
  // streetNum: string;
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

export default function AddProperty() {
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
      // state: "",
      // city: "",
      // mun: "",
      // street: "",
      // streetNum: "",
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
  const { user } = useContext(AuthContext);
  const imgNew: File[] = Array.from(watch("picturesNEW"));

  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    setError("");
    console.log("QQQQQQQQQ", data);
    if (data.title.length > 50) {
      setError("Title must be shorter than 50 characters");
    } else if (data.desc.length > 500) {
      setError("Description must be shorter than 500 characters");
    } else if (
      state == "" ||
      city == "" ||
      streetName == "" ||
      streetNum == ""
    ) {
      setError("Street name and number must be entered in map searchbox");
    } else if (
      data.numRoooms == 0 ||
      data.numPers == 0 ||
      data.priceN == 0 ||
      data.addCosts == 0
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
      add(data);
      router.push({
        pathname: "/",
      });
    }
  };

  const uploadPictures = async (data: IFormInput) => {
    var urlArr: string[] = [];
    const fileArr = data.picturesNEW ?? null;
    setUrlArr([]);

    for (let index = 0; index < fileArr.length; index++) {
      const selected: File = fileArr[index];
      if (
        selected
        // && allowedTypes.includes(selected.type)
      ) {
        const extension = selected.type.split("/")[1];
        const nnNEW: string = `uploads/${
          user.uid
        }/properties/${Date.now()}.${extension}`;
        // const nn: string = "ppp-" + selected.name;
        const storageRef = ref(storage, nnNEW); //ref to file. file dosnt exist yet
        //when we upload using this ref this file should have that name
        const uploadTask = await uploadBytesResumable(storageRef, selected);
        const url: string = await getDownloadURL(uploadTask.ref);
        console.log("WWWWWWWWWWWWWWWWWWW");
        urlArr.push(url);
        // setError("");
      } else {
        // setError("Please select an image file (png or jpeg)");
      }
    }
    return urlArr;
  };

  const add = async (data: IFormInput) => {
    //TODO mora da ima manje od 10 propertija
    uploadPictures(data).then(async (urlArr) => {
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
        image: "image",
        galery: "galery",
        pricePerNight: data.priceN,
        additionalPerPerson: data.addPers,
        additionalCosts: data.addCosts,
        garage: data.garage == "Yes" ? true : false,
        ownerId: user?.uid,
        images: urlArr,
        totalStars: 0,
        numberOfReview: 0,
        isSuperhost: false,
        loc: loc ?? ",",
        dateAddedProperty: new Date().toDateString(),
        created: Timestamp.now(),
      });
      console.log("lllll");
      //if state doesnt exist add
      const docSnap1 = await getDoc(doc(db, "locations", state));
      if (docSnap1.exists()) {
        //if city doesnt exist add
        const docSnap2 = await getDoc(doc(db, "locations", city + "," + state));
        if (!docSnap2.exists()) {
          await setDoc(doc(db, "locations", city + "," + state), {});
        }
      } else {
        await setDoc(doc(db, "locations", state), {});
        //add city
        await setDoc(doc(db, "locations", city + "," + state), {});
      }
    });
  };
  return (
    <>
      {user ? (
        <>
          <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="max-w-7xl px-5 mx-auto">
                <div className="pt-7 pb-5 text-center text-3xl font-bold">
                  New property
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
                    // maxLength: 2,
                  })}
                  className="w-full mb-2 "
                  id="outlined-required"
                  label="Description"
                  multiline
                  maxRows={15}
                  helperText={errors.desc ? errors.desc.message : " "}
                />

                <div className="grid grid-cols-3 ">
                  <div className="mr-3  mb-2">
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
                            id="outlined-select-currency"
                            select
                            label="Select a type"
                            value={value}
                            onChange={(e) => {
                              onChange(e.target.value);
                            }}
                            helperText={errors.type ? errors.type.message : " "}
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
                          className="mx-3 mb-2"
                          id="outlined-required"
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
                          className="ml-3  mb-2"
                          id="outlined-required"
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
                </div>
                <div className="grid grid-cols-3">
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
                  {/* <Controller
                    name="addPers"
                    control={control}
                    rules={{ required: "Please enter a value" }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          //  {...register("lastName", {
                          //   required: "Please enter your last name",
                          // })}
                          className="mx-3 mb-2"
                          id="outlined-required"
                          label="Additional price per person per night"
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
                            errors.addPers ? errors.addPers.message : " "
                          }
                        />
                      </>
                    )}
                  /> */}
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
                          className="ml-3 mb-2"
                          id="outlined-select-currency"
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
                {/* <div className="mb-2"></div> */}

                {!selectedStreet && (
                  <div className="pt-7 pb-5 text-center text-lg font-bold">
                    Please enter street name and number
                  </div>
                )}
                <div className="flex flex-col items-center justify-center mx-3">
                  <Map
                    setLoc={setLoc}
                    setState={setState}
                    setCity={setCity}
                    setStreetName={setStreetName}
                    setStreetNum={setStreetNum}
                    setSelectedStreet={setSelectedStreet}
                  />
                  {loc && (
                    <div>
                      {JSON.parse(loc.split("-")[0])}-
                      {JSON.parse(loc.split("-")[1])}
                    </div>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 mt-14">
                  <TextField
                    // {...register("state", {
                    //   required: "Please enter a state name",
                    // })}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    className="mx-3 mb-2"
                    id="outlined-required"
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
                    className="mx-3 mb-2"
                    id="outlined-required"
                    label="City"
                    value={city}
                    // helperText={errors.city ? errors.city.message : " "}
                  />

                  <div></div>
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1  ">
                  <TextField
                    disabled
                    // {...register("street", {
                    //   required: "Please enter a street name",
                    // })}
                    InputLabelProps={{ shrink: true }}
                    className="mx-3 mb-2"
                    id="outlined-required"
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
                    className="mx-3 mb-2"
                    id="outlined-required"
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
                  <label className="btn ">
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

                  {/* // ((item, index) => { */}
                  {/* //   return (
                  //     <div key={item.name}>
                  //       <ImageForm url={URL.createObjectURL(imgNew[index])} />
                  //     </div>
                  //   );
                  // })} */}
                </div>
                <div className="pt-7 pb-5 text-center text-sm font-thin">
                  {error}
                </div>
                <Button
                  action={() => {
                    // console.log("OOOOOOOOO");
                  }}
                  text="Add"
                  type="submit"
                />
              </div>{" "}
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
