import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import Layout from "../components/layout";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Button from "../components/button";
import Inputs from "../components/inputs";
import { Session } from "inspector";

export default function AddProperty() {
  const { data: session, status } = useSession();

  const titleRef = useRef(null);
  const descRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const munRef = useRef(null);
  const streetRef = useRef(null);
  const streetNumRef = useRef(null);
  const typeRef = useRef(null);
  const numRooomsRef = useRef(null);
  const numPersRef = useRef(null);
  //image i galery
  const priceNRef = useRef(null);
  const addPersRef = useRef(null);
  const addCostsRef = useRef(null);
  const garageRef = useRef(null);

  // ovaj dole nacinje oristan jer ovako mozemo da sharujemo nekom link da vidi nase reyultate
  const add = async () => {
    //PROVERI OVO treba .value a ne ovo sa zagradama
    // if (titleRef.current && !titleRef.current["value"]) return;
    //TODO dodati ove gore provere ya sve i ako nije nesto napisano poruka
    const docRef = await addDoc(collection(db, "property"), {
      title: titleRef.current ? titleRef.current["value"] : "",
      description: descRef.current ? descRef.current["value"] : "",
      state: stateRef.current ? stateRef.current["value"] : "",
      city: cityRef.current ? cityRef.current["value"] : "",
      municipality: munRef.current ? munRef.current["value"] : "",
      street: streetRef.current ? streetRef.current["value"] : "",
      streetNum: streetNumRef.current ? streetNumRef.current["value"] : "",
      type: typeRef.current ? typeRef.current["value"] : "",
      numOfRooms: numRooomsRef.current ? numRooomsRef.current["value"] : 0,
      numOfPersons: numPersRef.current ? numPersRef.current["value"] : 0,
      image: "image",
      galery: "galery",
      pricePerNight: priceNRef.current ? priceNRef.current["value"] : 0,
      additionalPerPerson: addPersRef.current ? addPersRef.current["value"] : 0,
      additionalCosts: addCostsRef.current ? addCostsRef.current["value"] : 0,
      garage: garageRef.current ? garageRef.current["value"] : "",
      ownerId: session?.user?.name,
      // promeni ovo!!!!!!!!!!!!!!!!!!!!!
    });
    console.log("lllll");
    console.log(titleRef.current ? titleRef.current["value"] : "");
  };
  return (
    <Layout>
      <div className="max-w-7xl px-5 mx-auto">
        <div className="pt-7 pb-5 text-center text-3xl font-bold">
          New property
        </div>
        <Inputs reff={titleRef} placeholder="" text="Title" type="text" />
        <div
          className="mx-auto bg-grey-100 border shadow-md p-1.5
              text-lg sm:text-2xl font-semibold rounded-lg 
              flex flex-col pl-6 w-full"
        >
          <div className="text-sm text-gray-600">Description</div>
          <textarea
            ref={descRef}
            // type={type}
            // placeholder={placeholder}
            // defaultValue={type == "number" ? "0" : ""}
            className="outline-0  bg-transparent text-lg text-gray-600"
          />
        </div>
        <div className="grid sm:grid-cols-3 grid-cols-1">
          <Inputs reff={stateRef} placeholder="" text="State" type="text" />
          <Inputs reff={cityRef} placeholder="" text="City" type="text" />
          <div
            className="mx-auto bg-grey-100 border shadow-md p-1.5
              text-lg sm:text-2xl font-semibold rounded-lg 
              hidden sm:inline-flex flex-col pl-6 w-full"
          ></div>
        </div>
        <div className="grid sm:grid-cols-3 grid-cols-1">
          <Inputs
            reff={munRef}
            placeholder=""
            text="Municipality"
            type="text"
          />
          <Inputs reff={streetRef} placeholder="" text="Street" type="text" />
          <Inputs
            reff={streetNumRef}
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
              ref={typeRef}
            >
              <option value=""></option>
              <option value="apartament" className="text-lg text-gray-400">
                Apartament
              </option>
              <option value="house">House</option>
              <option value="lakehouse">Lake house</option>
            </select>
          </div>

          <Inputs
            reff={numRooomsRef}
            placeholder="0"
            text="Number of Rooms"
            type="number"
          />
          <Inputs
            reff={numPersRef}
            placeholder="0"
            text="Number of Persons"
            type="number"
          />
        </div>
        <div className="grid grid-cols-3">
          <Inputs
            reff={priceNRef}
            placeholder="0"
            text="Price per night"
            type="number"
          />
          <Inputs
            reff={addPersRef}
            placeholder="0"
            text="Additional price per person per night"
            type="number"
          />
          <Inputs
            reff={addCostsRef}
            placeholder="0"
            text="Additional costs"
            type="number"
          />
        </div>
        <Inputs
          reff={garageRef}
          placeholder=""
          text="Is there any parking spot"
          type="text"
        />
        Img and galery
        <Button action={add} text="Add" />
      </div>
    </Layout>
  );
}
