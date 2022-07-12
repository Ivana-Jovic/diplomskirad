import Image from "next/image";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { yellow, red } from "@mui/material/colors";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

export default function PropertyPage() {
  const router = useRouter();
  const { property: propertyid } = router.query;
  const { user, myUserr } = useContext(AuthContext);
  const [property, setProperty] = useState<DocumentData>();
  const [inFaves, setInFaves] = useState<boolean>(false);
  const getProperty = async () => {
    // const arrData: any[] = [];

    const pid: string = propertyid ? propertyid.toString() : "";
    const docSnap = await getDoc(doc(db, "property", pid));

    if (docSnap.exists()) {
      setProperty(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const checkIfInFaves = async () => {
    const pid: string = propertyid ? propertyid.toString() : "";
    const docSnap = await getDoc(doc(db, "users", user?.uid));

    if (docSnap.exists()) {
      if (docSnap.data().faves.includes(pid)) {
        setInFaves(true);
      } else {
        setInFaves(false);
      }
    } else {
      console.log("No such document!");
    }
  };

  const onHeart = async () => {
    if (!inFaves) {
      //TODO: put in faves orr delete from SVUDA GDE JE SRCE
      await updateDoc(doc(db, "users", user?.uid), {
        faves: arrayUnion(propertyid),
      });
      setInFaves(true);
    } else {
      await updateDoc(doc(db, "users", user?.uid), {
        faves: arrayRemove(propertyid),
      });
      setInFaves(false);
    }
  };

  useEffect(() => {
    if (propertyid) getProperty();
  }, [propertyid]); //probaj i property ako ne radi

  useEffect(() => {
    if (user) checkIfInFaves();
  }, [user]);

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
              <div>
                {property.stars}
                <StarOutlineRoundedIcon sx={{ fontSize: 18 }} />
              </div>
              <div>10 reviews</div>
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

            {user && (
              <div onClick={onHeart} className="mr-10">
                {inFaves && (
                  <FavoriteRoundedIcon
                    sx={{ color: red[700] }}
                    className="active:scale-90  transition duration-150"
                  />
                )}
                {!inFaves && (
                  <FavoriteRoundedIcon className="active:scale-90 transition duration-150" />
                )}
              </div>
            )}
          </div>

          <div
            className="h-[300px] sm:h-[400px] lg:h-[500px] mt-2
    xl:h-[600px] 2xl:h-[600px] grid grid-cols-3 mb-5"
          >
            <div className="relative col-span-3 sm:col-span-2 row-span-2 mr-2">
              <Image
                src={property.images[0]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="relative mb-2 ml-2 hidden sm:inline-grid">
              <Image
                src={property.images[1]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="relative mt-2 ml-2 hidden sm:inline-grid">
              <Image
                src={property.images[2]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>
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
          <div className="mb-10">REVIEWS</div>
          <div className="mb-10">MAP</div>
          <div className="mb-10">CALENDAR- RESERVE</div>
        </div>
      )}
    </Layout>
  );
}
