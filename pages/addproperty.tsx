import { useContext, useState } from "react";
import Layout from "../components/layout";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";
import Button from "../components/button";
import Inputs from "../components/inputs";
import FileForm from "../components/fileform";
import ErrorPage from "./errorpage";
import { AuthContext } from "../firebase-authProvider";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import { FileForm } from "../components/fileform";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Map from "../components/map";
import ImageForm from "../components/imageform";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
type IFormInput = {
  title: string;
  desc: string;
  state: string;
  city: string;
  mun: string;
  street: string;
  streetNum: string;
  type: string;
  numRoooms: number;
  numPers: number;

  priceN: number;
  addPers: number;
  addCosts: number;
  garage: boolean;
  images: string[];
  picturesNEW: File[];
};

export default function AddProperty() {
  const [loc, setLoc] = useState<any>();
  const [urlArr, setUrlArr] = useState<string[]>([]);
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
      state: "",
      city: "",
      mun: "",
      street: "",
      streetNum: "",
      type: "",
      numRoooms: 0,
      numPers: 0,

      priceN: 0,
      addPers: 0,
      addCosts: 0,
      garage: false,
      images: [],
      picturesNEW: [],
    },
  });
  const { user } = useContext(AuthContext);
  const imgNew: File[] = Array.from(watch("picturesNEW"));
  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    console.log("QQQQQQQQQ", data);
    add(data);
  };

  // const [images, setImages] = useState<string[]>([]);
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
        const nn: string = "ppp-" + selected.name;
        const storageRef = ref(storage, nn); //ref to file. file dosnt exist yet
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
  //tTODO router replace umest puh sign//role

  // ovaj dole nacinje oristan jer ovako mozemo da sharujemo nekom link da vidi nase reyultate
  const add = async (data: IFormInput) => {
    uploadPictures(data).then(async (urlArr) => {
      console.log("LLLLLLLLLLLLLLL", urlArr.length);
      //PROVERI OVO treba .value a ne ovo sa zagradama
      // if (titleRef.current && !titleRef.current["value"]) return;
      //TODO dodati ove gore provere ya sve i ako nije nesto napisano poruka
      const docRef = await addDoc(collection(db, "property"), {
        title: data.title,
        description: data.desc,
        state: data.state,
        city: data.city,
        municipality: data.mun,
        street: data.street,
        streetNum: data.streetNum,
        type: data.type,
        numOfRooms: data.numRoooms,
        numOfPersons: data.numPers,
        image: "image",
        galery: "galery",
        pricePerNight: data.priceN,
        additionalPerPerson: data.addPers,
        additionalCosts: data.addCosts,
        garage: data.garage,
        // ownerId: session?.user?.name,<-GOOGLE
        ownerId: user?.uid,
        // promeni ovo!!!!!!!!!!!!!!!!!!!!!
        images: urlArr,
        // images: data.picturesNEW,
        // images: data.images,
        // stars: 0,
        totalStars: 0,
        numberOfReview: 0,
        isSuperhost: false,
        loc: loc ?? ",",
        dateAddedProperty: new Date().toDateString(),
        // lng: loc ? JSON.parse(loc.split("-")[0]) : "",
        // lat: loc ? JSON.parse(loc.split("-")[1]) : "",
      });
      console.log("lllll");
      // console.log(titleRef.current ? titleRef.current.value"] : "");
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
                {/* <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Please enter a title" }}
                  render={({ field: { onChange, value } }) => (
                    <> */}
                <TextField
                  {...register("title", {
                    required: "Please enter your last name",
                  })} //
                  className="mx-3 mb-2"
                  id="outlined-required"
                  label="Title"
                  // value={value}
                  // onChange={(e) => {
                  //   onChange(e.target.value);
                  // }}
                  helperText={errors.title ? errors.title.message : " "}
                />
                {/* </>
                  )}
                /> */}
                <div className="mx-3 mb-2">
                  {/* <Controller
  name="desc"
  control={control}
  rules={{ required: "Please enter a description" }}
  render={({ field: { onChange, value } }) => (
    <> */}
                  <TextField
                    {...register("desc", {
                      required: "Please enter  a description",
                    })}
                    className="w-full"
                    id="outlined-required"
                    label="Description"
                    multiline
                    maxRows={15}
                    // value={value}
                    // onChange={(e) => {
                    //   onChange(e.target.value);
                    // }}
                    helperText={errors.desc ? errors.desc.message : " "}
                  />
                  {/* </>
  )}
/> */}
                </div>
                <div className="grid sm:grid-cols-3 grid-cols-1">
                  {/* <Controller
  name="state"
  control={control}
  rules={{ required: "Please enter a state name" }}
  render={({ field: { onChange, value } }) => (
    <> */}
                  <TextField
                    {...register("state", {
                      required: "Please enter a state name",
                    })}
                    className="mx-3 mb-2"
                    id="outlined-required"
                    label="State"
                    // value={value}
                    // onChange={(e) => {
                    //   onChange(e.target.value);
                    // }}
                    helperText={errors.state ? errors.state.message : " "}
                  />
                  {/* </>
  )}
/> */}

                  {/* <Controller
  name="city"
  control={control}
  rules={{ required: "Please enter a city name" }}
  render={({ field: { onChange, value } }) => (
    <> */}
                  <TextField
                    {...register("city", {
                      required: "Please enter a city name",
                    })}
                    className="mx-3 mb-2"
                    id="outlined-required"
                    label="City"
                    // value={value}
                    // onChange={(e) => {
                    //   onChange(e.target.value);
                    // }}
                    helperText={errors.city ? errors.city.message : " "}
                  />
                  {/* </>
  )}
/> */}
                  <div></div>
                </div>
                <div className="grid sm:grid-cols-3 grid-cols-1  ">
                  {/* <Controller
  name="mun"
  control={control}
  rules={{ required: "Please enter a municipality" }}
  render={({ field: { onChange, value } }) => (
    <> */}
                  <TextField //TODO: remove municipality
                    {...register("mun", {
                      required: "Please enter a municipality",
                    })}
                    className="mx-3 mb-2"
                    id="outlined-required"
                    label="Municipality"
                    // value={value}
                    // onChange={(e) => {
                    //   onChange(e.target.value);
                    // }}
                    helperText={errors.mun ? errors.mun.message : " "}
                  />
                  {/* </>
  )}
/> */}

                  {/* <Controller
  name="street"
  control={control}
  rules={{ required: "Please enter a street name" }}
  render={({ field: { onChange, value } }) => (
    <> */}
                  <TextField
                    {...register("street", {
                      required: "Please enter a street name",
                    })}
                    className="mx-3 mb-2"
                    id="outlined-required"
                    label="Street"
                    // value={value}
                    // onChange={(e) => {
                    //   onChange(e.target.value);
                    // }}
                    helperText={errors.street ? errors.street.message : " "}
                  />
                  {/* </>
  )}
/> */}
                  {/* <Controller
  name="streetNum"
  control={control}
  rules={{ required: "Please enter a value" }}
  render={({ field: { onChange, value } }) => (
    <> */}
                  <TextField
                    {...register("streetNum", {
                      required: "Please entera value",
                    })}
                    className="mx-3 mb-2"
                    id="outlined-required"
                    label="StreetNum"
                    // value={value}
                    // onChange={(e) => {
                    //   onChange(e.target.value);
                    // }}
                    helperText={
                      errors.streetNum ? errors.streetNum.message : " "
                    }
                  />
                  {/* </>
  )}
/> */}
                </div>
                <div className="grid grid-cols-3 ">
                  <div className="mx-3  mb-2">
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
                          className="mx-3  mb-2"
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
                          className="mx-3  mb-2"
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
                          className="mx-3 mb-2"
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
                <div className="mx-3  mb-2">
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
                          className="w-full"
                          id="outlined-select-currency"
                          select
                          label="Is there any parking spot"
                          value={value}
                          onChange={(e) => {
                            onChange(e.target.value == "true" ? true : false);
                          }}
                          helperText={
                            errors.garage ? errors.garage.message : " "
                          }
                        >
                          {["true", "false"].map((option) => (
                            <MenuItem key={option} value={option}>
                              {option == "true" ? "Yes" : "No"}
                            </MenuItem>
                          ))}
                        </TextField>
                      </>
                    )}
                  />
                </div>
                {/* </div> */}
                {/* Img and galery */}
                <label>
                  {/* <Controller
                    name="images"
                    control={control}
                    rules={{ required: "Please enter a image" }}
                    render={({ field: { onChange, value } }) => ( */}
                  {/* <FileForm images={images} setImages={setImages} /> */}
                  {/* <FileForm images={value} setImages={onChange} /> */}
                  {/* // <FileForm /> */}
                  {/* )}
                  /> */}
                </label>
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
                  <div className="flex flex-wrap gap-4 ">
                    {imgNew &&
                      imgNew.length > 0 &&
                      imgNew.map((item, index) => {
                        return (
                          <div key={item.name}>
                            {/* <button
                              type="button"
                              onClick={() => {
                                imgNew.splice(index);
                              }}
                            >
                              x
                            </button> */}
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
                {/* <button type="submit">Add</button> */}
                {/* <Button action={() => {}} text="Update" type="submit" /> */}
              </div>{" "}
              <div className="flex flex-col items-center justify-center">
                <Map setLoc={setLoc} />
                {loc && (
                  <div>
                    {JSON.parse(loc.split("-")[0])}-
                    {JSON.parse(loc.split("-")[1])}
                  </div>
                )}
              </div>
              <Button
                action={() => {
                  // console.log("OOOOOOOOO");
                }}
                text="Add"
                type="submit"
              />
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
