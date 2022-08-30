// import { useState, useEffect } from "react";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { storage } from "../firebase";
// import ImageForm from "./imageform";

// type ImgProps = { images: string[]; setImages: any };
// //TODO vrati rules u storage

export default function FileForm() {}
// ({ images, setImages }: ImgProps) {
//   //   const arr: Url[] = [];usereref
//   const [file, setFile] = useState<File | null>(null);
//   const [error, setError] = useState<any>(""); //na svaku promenu ide refresh kompoonente
//   const allowedTypes = ["image/png", "image/jpeg"];
//   const [url, setUrl] = useState<string | null>(null); //SKLONI OVO i promeni u userref
//   useEffect(() => {
//     //MOZDA JE VSIAK
//     if (url) {
//       setFile(null);
//       console.log("klll");
//     }
//     console.log("in fileform useEffect");
//   }, [url]);

//   const changeHandler = (e: any) => {
//     const arr: File[] = e.target.files;
//     const tt: string[] = images;
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
//               setImages(tt);
//               console.log("====" + tt.length);
//               // images.splice(0 + index, 0, tt[index]);
//               // setImages(images.concat([urll]));
//               console.log("--" + images.concat([urll]).length);
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
//     //TODO stavi kontroler
//     <div>
//       <label>
//         {!file && <input type="file" multiple onChange={changeHandler} />}
//         {file && <p>Storing image...</p>}
//         <span>+</span>
//       </label>
//       <div className="">
//         {error && <div>{error}</div>}
//         {/* {file && <div>{file.name}</div>} */}
//         {/* {url && <Image src={url} width={30} height={30} alt="" />} */}
//         <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
//           {images.map((item) => (
//             <div key={item}>
//               <ImageForm url={item} />
//             </div>
//           ))}{" "}
//         </div>
//       </div>
//       {/* aaaaaa<input type="file" onChange={previewFile}></input> */}
//     </div>
//   );
// }
