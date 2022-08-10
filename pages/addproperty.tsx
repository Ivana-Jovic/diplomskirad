import { useContext, useState } from "react";
import Layout from "../components/layout";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Button from "../components/button";
import Inputs from "../components/inputs";
import FileForm from "../components/fileform";
import ErrorPage from "./errorpage";
import { AuthContext } from "../firebase-authProvider";
// import { FileForm } from "../components/fileform";

export default function AddProperty() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [mun, setMun] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [streetNum, setStreetNum] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [numRoooms, setNumRoooms] = useState<Number>(0);
  const [numPers, setNumPers] = useState<Number>(0);
  const [priceN, setPriceN] = useState<Number>(0);
  const [addPers, setAddPers] = useState<Number>(0);
  const [addCosts, setAddCosts] = useState<Number>(0);
  const [garage, setGarage] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  //tTODO router replace umest puh sign//role

  // ovaj dole nacinje oristan jer ovako mozemo da sharujemo nekom link da vidi nase reyultate
  const add = async () => {
    //PROVERI OVO treba .value a ne ovo sa zagradama
    // if (titleRef.current && !titleRef.current["value"]) return;
    //TODO dodati ove gore provere ya sve i ako nije nesto napisano poruka
    const docRef = await addDoc(collection(db, "property"), {
      title: title,
      description: desc,
      state: state,
      city: city,
      municipality: mun,
      street: street,
      streetNum: streetNum,
      type: type,
      numOfRooms: numRoooms,
      numOfPersons: numPers,
      image: "image",
      galery: "galery",
      pricePerNight: priceN,
      additionalPerPerson: addPers,
      additionalCosts: addCosts,
      garage: garage,
      // ownerId: session?.user?.name,<-GOOGLE
      ownerId: user?.uid,
      // promeni ovo!!!!!!!!!!!!!!!!!!!!!
      images: images,
      // stars: 0,
      totalStars: 0,
      numberOfReview: 0,
      isSuperhost: false,
    });
    console.log("lllll");
    // console.log(titleRef.current ? titleRef.current.value"] : "");
  };
  return (
    <>
      {user ? (
        <>
          <Layout>
            <div className="max-w-7xl px-5 mx-auto">
              <div className="pt-7 pb-5 text-center text-3xl font-bold">
                New property
              </div>
              <Inputs
                item={title}
                setItem={setTitle}
                placeholder=""
                text="Title"
                type="text"
              />
              <div
                className="mx-auto bg-grey-100 border shadow-md p-1.5
              text-lg sm:text-2xl font-semibold rounded-lg 
              flex flex-col pl-6 w-full"
              >
                <div className="text-sm text-gray-600">Description</div>
                <textarea
                  value={desc}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  className="outline-0  bg-transparent text-lg text-gray-600"
                />
              </div>
              <div className="grid sm:grid-cols-3 grid-cols-1">
                <Inputs
                  item={state}
                  setItem={setState}
                  placeholder=""
                  text="State"
                  type="text"
                />
                <Inputs
                  item={city}
                  setItem={setCity}
                  placeholder=""
                  text="City"
                  type="text"
                />
                <div
                  className="mx-auto bg-grey-100 border shadow-md p-1.5
              text-lg sm:text-2xl font-semibold rounded-lg 
              hidden sm:inline-flex flex-col pl-6 w-full"
                ></div>
              </div>
              <div className="grid sm:grid-cols-3 grid-cols-1">
                <Inputs
                  item={mun}
                  setItem={setMun}
                  placeholder=""
                  text="Municipality"
                  type="text"
                />
                <Inputs
                  item={street}
                  setItem={setStreet}
                  placeholder=""
                  text="Street"
                  type="text"
                />
                <Inputs
                  item={streetNum}
                  setItem={setStreetNum}
                  placeholder=""
                  text="streetNum"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-3 ">
                <div
                  className="mx-auto bg-grey-100 border shadow-md p-1.5
              text-lg sm:text-2xl font-semibold rounded-lg 
              flex flex-col pl-6 w-full"
                >
                  <div className="text-sm text-gray-600">Type</div>
                  <select
                    name="accType"
                    className="outline-0 bg-transparent text-lg text-gray-600"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                  >
                    <option value=""></option>
                    <option value="apartment" className="text-lg text-gray-400">
                      Apartment
                    </option>
                    <option value="house">House</option>
                    <option value="lakehouse">Lake house</option>
                  </select>
                </div>

                <Inputs
                  item={numRoooms}
                  setItem={setNumRoooms}
                  placeholder="0"
                  text="Number of Rooms"
                  type="number"
                />
                <Inputs
                  item={numPers}
                  setItem={setNumPers}
                  placeholder="0"
                  text="Number of Persons"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-3">
                <Inputs
                  item={priceN}
                  setItem={setPriceN}
                  placeholder="0"
                  text="Price per night"
                  type="number"
                />
                <Inputs
                  item={addPers}
                  setItem={setAddPers}
                  placeholder="0"
                  text="Additional price per person per night"
                  type="number"
                />
                <Inputs
                  item={addCosts}
                  setItem={setAddCosts}
                  placeholder="0"
                  text="Additional costs"
                  type="number"
                />
              </div>
              <Inputs
                item={garage}
                setItem={setGarage}
                placeholder=""
                text="Is there any parking spot"
                type="text"
              />
              Img and galery
              <FileForm images={images} setImages={setImages} />
              <Button action={add} text="Add" type="" />
            </div>
            {/* //FORM TAG?? MOZDA */}
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
