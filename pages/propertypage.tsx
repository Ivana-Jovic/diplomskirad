import Image from "next/image";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Layout from "../components/layout";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Heart from "../components/heart";
import Extrawierd from "../components/extrawierd";
import { Rating } from "@mui/material";
import Button from "../components/button";
import Map2 from "../components/map2";
import ImageGallery from "react-image-gallery";
import CommentCard from "../components/commentcard";

type imgGalleryType = {
  original: string;
  thumbnail: string;
};

export default function PropertyPage() {
  const [more, setMore] = useState<boolean>(false);
  const { user, myUser } = useContext(AuthContext);
  const router = useRouter();
  const { property: propertyid, from, to, numOfGuests } = router.query;
  const [property, setProperty] = useState<DocumentData>();
  const [comments, setComments] =
    useState<QueryDocumentSnapshot<DocumentData>[]>();
  const pid: string = propertyid ? propertyid.toString() : "";
  const [arrLocation, setArrLocation] = useState<DocumentData[]>([]);
  const [galleryImages, setGalleryImages] = useState<imgGalleryType[]>([]);

  const getProperty = async () => {
    const comm: any[] = [];
    const docSnap = await getDoc(doc(db, "property", pid));
    setArrLocation([]);
    if (docSnap.exists()) {
      setProperty(docSnap.data());
      setGalleryImages([]);
      docSnap.data().images.forEach((element, index) => {
        setGalleryImages((prev) => {
          return [
            ...prev,
            {
              original: element,
              thumbnail: element,
            },
          ];
        });
      });
      setArrLocation((prev) => [...prev, docSnap.data()]);
      const subColl = query(
        collectionGroup(db, "comments"),
        where("propertyId", "==", pid),
        orderBy("createdAt")
      );

      // const subDocSnap = await getDocs(subColl);
      // const subColl = collection(db, "property", pid, "comments");
      const subDocSnap = await getDocs(subColl);
      subDocSnap.forEach((doc) => {
        comm.push(doc);
      });
      setComments(comm);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (propertyid) getProperty();
  }, [propertyid]); //probaj i property ako ne radi

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
                {(property.totalStars / property.numberOfReviews).toFixed(1)}

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
          {!more && (
            <button
              className="btn mb-10"
              onClick={() => {
                setMore(!more);
              }}
            >
              See all pictures
            </button>
          )}
          {more && (
            <button
              className="btn mb-10"
              onClick={() => {
                setMore(!more);
              }}
            >
              See less pictures
            </button>
          )}
          {more && galleryImages.length == property.images.length && (
            <div className="w-full h-96 ">
              <ImageGallery
                items={galleryImages}
                showPlayButton={false}
                showFullscreenButton={false}
              />
            </div>
          )}

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
          </div>
          <div className="flex flex-col items-center justify-center  mb-10">
            {arrLocation.length > 0 && (
              <Map2 setLoc={""} arrLoc={arrLocation} />
            )}
          </div>
          <div className=" w-full  grid place-content-center  mb-10 ">
            <Extrawierd property={property} />
          </div>
          <div className="mb-10 mt-10">
            <div className="pt-7 pb-5 text-center text-3xl font-bold">
              Reviews
            </div>
            {comments?.map((item: QueryDocumentSnapshot<DocumentData>) => {
              return (
                <div key={item.id} className="">
                  <CommentCard comment={item} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}
