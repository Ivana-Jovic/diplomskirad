import Image from "next/image";
import {
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { db } from "../firebase";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Heart from "../components/heart";
import MakeAReservation from "../components/makeareservation";
import { Rating } from "@mui/material";
import Map2 from "../components/map2";
import ImageGallery from "react-image-gallery";
import CommentCard from "../components/commentcard";
import ErrorPage from "./errorpage";
import {
  isFullyRegisteredUser,
  isHost,
  isHostModeHost,
  isHostModeTravel,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import RemovedByAdmin from "../components/removedbyadmin";
import toast from "react-hot-toast";

type imgGalleryType = {
  original: string;
  thumbnail: string;
};

export default function PropertyPage({
  uid,
  isHostModeHost,
  myUserJSON,
}: {
  uid: string;
  isHostModeHost: boolean;
  myUserJSON: string;
}) {
  const myUser: DocumentData | null = uid ? JSON.parse(myUserJSON) : null; //null ako je neulogovan
  const [more, setMore] = useState<boolean>(false);

  const router = useRouter();
  const { property: propertyid, from, to, numOfGuests } = router.query;
  const [property, setProperty] = useState<DocumentData>();
  const [comments, setComments] =
    useState<QueryDocumentSnapshot<DocumentData>[]>();
  const pid: string = propertyid ? propertyid.toString() : "";
  const [arrLocation, setArrLocation] = useState<DocumentData[]>([]);
  const [galleryImages, setGalleryImages] = useState<imgGalleryType[]>([]);

  //bez server side props jer ima dosta slozenih objekata
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
        orderBy("createdAt", "desc")
      );

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
            <div className="flex gap-x-5">
              <div className="flex  items-center gap-x-1">
                {(property.totalStars / property.numberOfReviews).toFixed(1)}

                <Rating
                  name="read-only"
                  value={1}
                  readOnly
                  size="small"
                  max={1}
                />
              </div>
              <div>{property.numberOfReviews} reviews </div>
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
            <div className="sm:mr-3 mr-1">
              <Heart propertyid={propertyid as string} />
            </div>
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
          {more && galleryImages.length === property.images.length && (
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
          <div className="flex flex-col items-center justify-center  mb-10 w-full h-96">
            {arrLocation.length > 0 && <Map2 arrLoc={arrLocation} />}
          </div>

          {uid !== "" && !isHostModeHost && !myUser?.removedByAdmin && (
            <div className=" w-full  grid place-content-center   ">
              {property.adminApproved && (
                <MakeAReservation property={property} />
              )}
              {!property.adminApproved && (
                <div className="badge">
                  **It is not posible to make a reservation yet. Waiting for
                  admin approval.**
                </div>
              )}
            </div>
          )}
          {uid === "" && (
            <div className="badge w-full  grid place-content-center  mb-10 ">
              **You must be logged in to make a reservation**
            </div>
          )}
          {isHostModeHost && (
            <div className="badge w-full  grid place-content-center  mb-10 ">
              **You can&apos;t make a reservation in host mode**
            </div>
          )}

          {property.removedByAdmin && (
            <div className="badge w-full  grid place-content-center  mb-10 ">
              **You can&apos;t make a reservation - property removed by admin**
            </div>
          )}
          <div className="mb-10 mt-10">
            <div className="pt-7 pb-5 text-center text-3xl font-bold">
              Reviews
            </div>
            {comments?.map((item: QueryDocumentSnapshot<DocumentData>) => {
              return (
                <div key={item.id} className="">
                  <CommentCard
                    comment={item}
                    propertyOwnerId={property.ownerId}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    var myUser: DocumentData = null;
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

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
      if (
        isLoggedUser(myUser) ||
        isHostModeHost(myUser) ||
        isHostModeTravel(myUser)
      ) {
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
      //ovde pada admin
      return {
        redirect: {
          destination: "/",
        },
        props: [],
      };
    }
    if (isHostModeHost(myUser)) {
      return {
        props: {
          uid: uid,
          isHostModeHost: true,
          myUserJSON: JSON.stringify(myUser),
        },
      };
    }
    return {
      props: {
        uid: uid,
        isHostModeHost: false,
        myUserJSON: JSON.stringify(myUser),
      },
    };
  } catch (err) {
    return {
      props: {
        uid: "", //not logged in
        isHostModeHost: false,
        myUserJSON: JSON.stringify(myUser), // ovde je myUser null
      },
    };
  }
}
