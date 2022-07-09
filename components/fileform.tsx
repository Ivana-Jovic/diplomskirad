// import { addDoc, collection } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
// import { db } from "../firebase";
// import Bla from "./bla";

import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
// import { useEffect, useState } from "react";
import { storage, db, timestamp } from "../firebase";
import Image from "next/image";
// import { Url } from "url";
import Button from "./button";
import ImageForm from "./imageform";
// import StorageMy from "../storageMy";

type ImgProps = { images: string[]; setImages: any };
//TODO vrati rules u storage
export default function FileForm({ images, setImages }: ImgProps) {
  //   const arr: Url[] = [];usereref
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<any>(""); //na svaku promenu ide refresh kompoonente
  const allowedTypes = ["image/png", "image/jpeg"];
  const [url, setUrl] = useState<string | null>(null); //SKLONI OVO i promeni u userref
  // useEffect(() => {
  //   //MOZDA JE VSIAK
  //   if (url) {
  //     setFile(null);
  //     console.log("klll");
  //   }
  // }, [url]);
  //TODO : dodavanje vise slika odjednom
  const changeHandler = (e: any) => {
    //TODO nikad nisam stavila tt na nul tj prazno
    const arr: File[] = e.target.files;
    const tt: string[] = images;
    for (let index = 0; index < arr.length; index++) {
      const selected: File = arr[index];

      // const selected: File = e.target.files[0];

      if (selected && allowedTypes.includes(selected.type)) {
        setFile(selected);
        //////////1. nacin
        const nn: string = "ppp-" + selected.name;
        const storageRef = ref(storage, nn); //ref to file. file dosnt exist yet
        //when we upload using this ref this file should have that name
        const uploadTask = uploadBytesResumable(storageRef, selected);

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
            getDownloadURL(uploadTask.snapshot.ref).then((urll) => {
              setUrl(urll);
              // setImages(images.concat([urll]));
              tt.push(urll);
              setImages(tt);
              console.log("====" + tt.length);
              // images.splice(0 + index, 0, tt[index]);
              // setImages(images.concat([urll]));
              console.log("--" + images.concat([urll]).length);
              //////addToDB(urll, timestamp);
              console.log("e");
            });
          }
        );
        //////////////////// 2. nacin
        // const nn: string = "ppp-" + selected.name;
        // const storageRef = ref(storage, nn);
        // console.log(nn);
        // uploadBytes(storageRef, selected).then((snapshot) => {
        //   console.log("Uploaded a blob or file!" + snapshot.ref.toString());
        //   // setImages(images.concat([snapshot.ref.toString()]));
        //   getDownloadURL(ref(storage, nn)).then((urll) => {
        //     setUrl(urll);
        //     setImages(images.concat([urll]));
        //     console.log("--" + images.concat([urll]).length);
        //     console.log("-" + urll);
        //     //   addToDB(urll, timestamp);
        //   });
        // });
        //////////////////////////////
        setError("");
      } else {
        setFile(null);
        setError("Please select an image file (png or jpeg)");
      }
    }
  };

  return (
    <div>
      <label>
        {!file && <input type="file" multiple onChange={changeHandler} />}
        {file && <p>Storing image...</p>}
        <span>+</span>
      </label>

      <div className="">
        {error && <div>{error}</div>}
        {/* {file && <div>{file.name}</div>} */}
        {/* {url && <Image src={url} width={30} height={30} alt="" />} */}
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
          {/*  */}
          {images.map((item) => (
            <div key={item}>
              <ImageForm url={item} />
            </div>
          ))}
          {/* <ImageForm url="https://firebasestorage.googleapis.com/v0/b/diplomski-55137.appspot.com/o/ppp-r-architecture-2gDwlIim3Uw-unsplash.jpg?alt=media&token=d9b32f7b-909f-4f0c-aced-df293d8eced7" />
          <ImageForm url="https://firebasestorage.googleapis.com/v0/b/diplomski-55137.appspot.com/o/ppp-r-architecture-2gDwlIim3Uw-unsplash.jpg?alt=media&token=d9b32f7b-909f-4f0c-aced-df293d8eced7" />
          <ImageForm url="https://firebasestorage.googleapis.com/v0/b/diplomski-55137.appspot.com/o/ppp-search.png?alt=media&token=db7d554c-5891-4c4c-b7f0-befb39da93b3" />
          <ImageForm url="https://firebasestorage.googleapis.com/v0/b/diplomski-55137.appspot.com/o/ppp-avi-werde-hHz4yrvxwlA-unsplash.jpg?alt=media&token=3bf4a8b0-0e8a-42ec-a3ce-bb2e564ce2aa" /> */}
        </div>
      </div>
      {/* <button onClick={() => addToDB(url, timestamp)}>add pics</button> */}
    </div>
  );
}

// const addToDB = async (u: any, t: any) => {
//   console.log("b");
//   const dbRef = await addDoc(collection(db, "images"), {
//     url: u,
//     createdAt: t,
//   });
// };
