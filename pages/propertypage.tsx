import Image from "next/image";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Layout from "../components/layout";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { yellow, red } from "@mui/material/colors";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Heart from "../components/heart";
import Extrawierd from "../components/extrawierd";
import { Rating } from "@mui/material";
import Button from "../components/button";
import Map2 from "../components/map2";

export default function PropertyPage() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [more, setMore] = useState<boolean>(false);
  const { user, myUser } = useContext(AuthContext);
  const router = useRouter();
  const { property: propertyid, from, to, numOfGuests } = router.query;
  const [property, setProperty] = useState<DocumentData>();
  const [comments, setComments] = useState<DocumentData[]>();
  const pid: string = propertyid ? propertyid.toString() : "";
  const [arrLocation, setArrLocation] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const getProperty = async () => {
    const comm: any[] = [];

    // const pid: string = propertyid ? propertyid.toString() : "";
    const docSnap = await getDoc(doc(db, "property", pid));
    setArrLocation([]);
    if (docSnap.exists()) {
      setProperty(docSnap.data());
      setArrLocation((prev) => [...prev, docSnap]);
      const subColl = collection(db, "property", pid, "comments");
      const subDocSnap = await getDocs(subColl);
      subDocSnap.forEach((doc) => {
        comm.push(doc);
        // console.log(" such document!", doc.data());
      });
      setComments(comm);
      // console.log(" such !", comm);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (propertyid) getProperty();
  }, [propertyid]); //probaj i property ako ne radi

  const report = async (comment: DocumentData) => {
    //report comment
    const docRef = await addDoc(collection(db, "reports"), {
      guestId: comment.data().userId, //ko je komentarisao
      guestFirstName: comment.data().firstName,
      guestLastName: comment.data().lastName,
      reservationId: comment.data().reservationId,
      hostId: user?.uid ?? "",
      // reportedFirstName: myUser.firstName,//TODO Put in db in reserv and in rep
      // reportedLastName: myUser.lastName,
      guestIsReporting: false,
      reportText: "comment",
      processed: false,
      commentId: comment.id,
      // timestamp
    });
  };
  return (
    <Layout>
      {property && (
        <div className="pt-7 font-semibold  flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
          <div
            className="border shadow-md text-lg sm:text-2xl
                font-semibold rounded-lg  p-6 mb-2 text-center"
          >
            {property.title}
          </div>

          <div className="flex justify-between font-semibold ">
            <div className="flex space-x-4">
              <div className="flex  items-center">
                {/* {property.stars} */}
                {(property.totalStars / property.numberOfReviews).toFixed(1)}
                {/* <StarOutlineRoundedIcon sx={{ fontSize: 18 }} /> */}
                {/* <Rating
                  name="read-only"
                  value={property.totalStars / property.numberOfReviews}
                  readOnly
                  size="small"
                  precision={0.1}
                /> */}
                <Rating
                  name="read-only"
                  value={1}
                  readOnly
                  size="small"
                  max={1}
                />
              </div>
              <div>{property.numberOfReviews}reviews</div>
              <div>
                {property.isSuperhost ? (
                  <>
                    <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
                    Superhost
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {property.state}, {property.city}
              </div>
            </div>
            <Heart propertyid={propertyid as string} />
          </div>

          <div
            className="h-[300px] sm:h-[400px] lg:h-[500px] mt-2
    xl:h-[600px] 2xl:h-[600px] grid grid-cols-3 mb-5"
          >
            <div className="relative col-span-3 sm:col-span-2 row-span-2 sm:mr-2">
              <Image
                src={property.images[0]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="relative col-span-2 sm:col-span-1 sm:mb-2 sm:ml-2 ml-0 mt-2 sm:mt-0 mb-0">
              <Image
                src={property.images[1]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="relative mt-2 ml-2 ">
              <Image
                src={property.images[2]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>

          {more && property.images.length > 3 && (
            <div className="flex flex-row gap-4 flex-wrap">
              {property.images.map((item: string, index: number) => {
                return (
                  <>
                    {index.valueOf() >= 3 && (
                      <>
                        <div key={item} className="relative mb-2 h-48 w-full">
                          <Image
                            src={property.images[index]}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      </>
                    )}
                  </>
                );
              })}
            </div>
          )}
          <button
            className="btn"
            onClick={() => {
              setMore(!more);
            }}
          >
            More
          </button>
          <div className="mb-5">
            {property.numOfPersons} guests · {property.numOfRooms} bedroom ·{" "}
            {property.type}
          </div>
          <div className="flex flex-col bg-grey-100 mb-10">
            <div
              className="border shadow-md text-lg sm:text-2xl
                font-semibold rounded-lg  p-6"
            >
              {property.description}
            </div>
            {/* {property.street}-{property.streetNum} */}
          </div>
          <div className="mb-10">Amenities</div>
          <div className="mt-10">MAP</div>
          <div className="flex flex-col items-center justify-center">
            {arrLocation.length > 0 && (
              <Map2 setLoc={""} arrLoc={arrLocation} />
            )}
            {/* {loc && (
            <div>
              {JSON.parse(loc.split("-")[0])}-{JSON.parse(loc.split("-")[1])}
            </div>
          )} */}
          </div>
          <div className="mb-10">
            REVIEWS{" "}
            {comments?.map((item: DocumentData) => {
              return (
                <div key={item.id} className="my-5 p-2 border">
                  {/* <div>{item.data().userId}</div> */}
                  <div>
                    {item.data().firstName}-{item.data().lastName}
                  </div>
                  <div className="text-xs">
                    {/* jun 2022. */}
                    {months[new Date(item.data().date).getMonth()]}
                    &nbsp;
                    {new Date(item.data().date).getFullYear()}
                    {/* // .toLocaleString("default", { style: "long" })} */}
                  </div>
                  {/* //TODO: timestamp */}
                  <div>
                    <Rating
                      name="read-only"
                      value={item.data().stars}
                      readOnly
                      size="small"
                    />
                  </div>
                  <div className="font-normal">{item.data().comment}</div>

                  <div className="mt-3">
                    {myUser.host && (
                      // <Button
                      //   action={report(item)}
                      //   text="Do you want to report?"
                      //   type=""
                      // />
                      //TODO: ako je reportovano makni dugme
                      //ovo sam pre radila tako sto odvojim u komponentu zasebnu
                      <button
                        onClick={() => {
                          report(item);
                        }}
                      >
                        Do you want to report?
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10">CALENDAR- RESERVE</div>
          <div className="bg-slate-100">
            <Extrawierd property={property} />
            {/* //TODO: ograniciti dokle ide broj gostiju ili skloniti */}
          </div>
        </div>
      )}
    </Layout>
  );
}
