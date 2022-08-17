import { useState, useEffect } from "react";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage, db, timestamp } from "../firebase";
import ImageForm from "./imageform";
import Image from "next/image";

type ImgProps = { images: string[]; setImages: any };
//TODO vrati rules u storage

// export default function FileForm() {
//   const [imgs, setImgs] = useState<File[]>([]);
//   //   const arr: Url[] = [];usereref
//   const [file, setFile] = useState<File | null>(null);
//   const [error, setError] = useState<any>(""); //na svaku promenu ide refresh kompoonente
//   const allowedTypes = ["image/png", "image/jpeg"];
//   const [url, setUrl] = useState<string | null>(null); //SKLONI OVO i promeni u userref
//   const [url2, setUrl2] = useState<string | null | ArrayBuffer>(null);
//   const [url3, setUrl3] = useState<string[]>([]);
//   const [imgs3, setImgs3] = useState<string[]>([]);
//   useEffect(() => {
//     //MOZDA JE VSIAK
//     if (url) {
//       setFile(null);
//       console.log("klll");
//     }
//     console.log("in fileform useEffect");
//   }, [url]);

//   function previewFile(file: File) {
//     const reader = new FileReader();

//     reader.addEventListener(
//       "load",
//       () => {
//         // convert image file to base64 string
//         setUrl2(reader.result);
//         // setUrl3((prev: any) => [...prev, reader.result]);
//         // return  reader.result
//       },
//       false
//     );

//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   }
// function previewFile(file: File) {
//   for (let index = 0; index < arr.length; index++) {
//     const selected: File = arr[index];
//   // const preview = document.querySelector("img");

//   // const file = document.querySelector("input[type=file]")?.files[0];
//   // const file: File = e.target.files;
//   const reader = new FileReader();

//   reader.addEventListener(
//     "load",
//     () => {
//       // convert image file to base64 string
//       setUrl2(reader.result);
//       return reader.result;
//     },
//     false
//   );

//   if (file) {
//     reader.readAsDataURL(file);
//   }
// }
// }
//   const changeHandler = (e: any) => {
//     const arr: File[] = e.target.files;
//     setImgs(e.target.files);
//     const tt: string[] = [];
//     for (let index = 0; index < arr.length; index++) {
//       const selected: File = arr[index];
//       // const selected: File = e.target.files[0];

//       if (selected && allowedTypes.includes(selected.type)) {
//         setFile(selected);
//         //////////1. nacin
//         const nn: string = "ppp-" + selected.name;
//         const storageRef = ref(storage, nn); //ref to file. file dosnt exist yet
//         //when we upload using this ref this file should have that name
//         const uploadTask = uploadBytesResumable(storageRef, selected);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             console.log(
//               "zdravo"
//               // +(snapshot.bytesTransferred / snapshot.totalBytes) * 100 +"%"
//             );
//           },
//           (err) => {
//             console.log("ovo je greska");
//             setError(err);
//           },
//           () => {
//             getDownloadURL(uploadTask.snapshot.ref).then((urll) => {
//               setUrl(urll);
//               // setImages(images.concat([urll]));
//               tt.push(urll);
//               // setImgs(tt);
//               setImgs3(tt);
//               console.log("====" + tt.length);
//               // images.splice(0 + index, 0, tt[index]);
//               // setImages(images.concat([urll]));
//               // console.log("--" + imgs.concat([urll]).length);
//               //////addToDB(urll, timestamp);
//               console.log("e");
//             });
//           }
//         );
//         //////////////////// 2. nacin
//         // const nn: string = "ppp-" + selected.name;
//         // const storageRef = ref(storage, nn);
//         // console.log(nn);
//         // uploadBytes(storageRef, selected).then((snapshot) => {
//         //   console.log("Uploaded a blob or file!" + snapshot.ref.toString());
//         //   // setImages(images.concat([snapshot.ref.toString()]));
//         //   getDownloadURL(ref(storage, nn)).then((urll) => {
//         //     setUrl(urll);
//         //     setImages(images.concat([urll]));
//         //     console.log("--" + images.concat([urll]).length);
//         //     console.log("-" + urll);
//         //     //   addToDB(urll, timestamp);
//         //   });
//         // });
//         //////////////////////////////
//         setError("");
//       } else {
//         setFile(null);
//         setError("Please select an image file (png or jpeg)");
//       }
//     }
//   };

//   return (
//     <>
//       {file && previewFile(file)}
//       aaaaaaaaaaaaaaaaaaaa
//       {typeof url2 === "string" && (
//         <Image src={url2} width={100} height={100} alt="" />
//       )}
//       {/* <div> */}
//       <label>
//         {!file && <input type="file" multiple onChange={changeHandler} />}
//         {file && <p>Storing image...</p>}
//         <span>+</span>
//       </label>
//       {/* {imgs3.map((item: any) => (
//         <div key={item.name}>k
//           <Image src= {item && previewFile(item)} width={100} height={100} alt="" />
//           </div>
//       ))} */}
//       {/*    <div className="">
//           {error && <div>{error}</div>}
//           {/* {file && <div>{file.name}</div>} */}
//       {/* {url && <Image src={url} width={30} height={30} alt="" />} */}
//       {/*   <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
//             {imgs3.map((item: any) => (
//               <div key={item.name}>
//                 {/* <ImageForm url={item} /> */}
//       {/* ??TODO stavi tipove u input */}
//       {/* <>{previewFile(item)}</>
//                 {typeof url2 === "string" && (
//                   <Image src={url2} width={100} height={100} alt="" />
//                 )} */}
//       {/*     </div>
//             ))}{" "}
//           </div>
//         </div>
//         {/* aaaaaa<input type="file" onChange={previewFile}></input> */}
//       {/*   </div> */}
//     </>
//   );
// }
// type ImgProps = { images: string[]; setImages: any };
export default function FileForm({ images, setImages }: ImgProps) {
  //   const arr: Url[] = [];usereref
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<any>(""); //na svaku promenu ide refresh kompoonente
  const allowedTypes = ["image/png", "image/jpeg"];
  const [url, setUrl] = useState<string | null>(null); //SKLONI OVO i promeni u userref
  useEffect(() => {
    //MOZDA JE VSIAK
    if (url) {
      setFile(null);
      console.log("klll");
    }
    console.log("in fileform useEffect");
  }, [url]);

  const changeHandler = (e: any) => {
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
    //TODO stavi kontroler
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
          {images.map((item) => (
            <div key={item}>
              <ImageForm url={item} />
            </div>
          ))}{" "}
        </div>
      </div>
      {/* aaaaaa<input type="file" onChange={previewFile}></input> */}
    </div>
  );
}
