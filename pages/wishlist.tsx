import Layout from "../components/layout";
import {
  getDoc,
  doc,
  DocumentData,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import CardSearch from "../components/cardsearch";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ErrorPage from "./errorpage";
import {
  isFullyRegisteredUser,
  isHostModeTravel,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import RemovedByAdmin from "../components/removedbyadmin";

export default function Wishlist({
  uid,
  propertiesJSON,
}: {
  uid: string;
  propertiesJSON: string;
}) {
  const faves: DocumentData[] = JSON.parse(propertiesJSON);
  return (
    <Layout>
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="flex flex-col mt-10 ">
            <div className="pt-7 pb-5 text-center text-3xl font-bold">
              Wishlist
            </div>
            {faves.map((property: DocumentData) => {
              return (
                <div key={property.id}>
                  <CardSearch
                    key={property.id}
                    propertyid={property.id}
                    name={property.title}
                    description={property.description}
                    image={property.images[0]}
                    price={property.pricePerNight}
                    totalStars={property.totalStars}
                    numberOfReviews={property.numberOfReviews}
                    numberOfNights={0}
                    avgPricePerNight={0}
                    inWishlist={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div></div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    var hasPermission: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      const myUser: DocumentData = docSnap.data();
      if (!isFullyRegisteredUser(myUser)) {
        return {
          redirect: {
            destination: "/profilesettings",
          },
          props: [],
        };
      }
      if (isLoggedUser(myUser) || isHostModeTravel(myUser)) {
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
      return {
        redirect: {
          destination: "/",
        },
        props: [],
      };
    }
    var properties: DocumentData[] = [];
    const docSnap1 = await getDoc(doc(db, "users", uid));

    if (docSnap1.exists()) {
      for (let index = 0; index < docSnap1.data().faves.length; index++) {
        const docSnap2 = await getDoc(
          doc(db, "property", docSnap1.data().faves[index])
        );

        if (docSnap2.exists()) {
          properties.push(docSnap2.data());
        }
      }
    }

    return {
      props: {
        uid: uid,
        propertiesJSON: JSON.stringify(properties),
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
