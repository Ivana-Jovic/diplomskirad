import type { NextPage } from "next";
import Head from "next/head";
import Banner from "../components/banner";
import Card from "../components/card";
import Layout from "../components/layout";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  DocumentData,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  isAdmin,
  isHost,
  isHostModeHost,
  isHostModeTravel,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import ErrorPage from "./errorpage";
import IndexHostModeHost from "../components/indexhostmodehost";
import IndexAdmin from "../components/indexadmin";
import RemovedByAdmin from "../components/removedbyadmin";

export default function Index({
  isAdmin,
  isHostModeHost,
  propertiesJSON,
  isRemovedByAdmin,
}: {
  isAdmin: boolean;
  isHostModeHost: boolean;
  propertiesJSON: string;
  isRemovedByAdmin: boolean;
}) {
  if (isRemovedByAdmin) return <RemovedByAdmin />;
  // const [arr, setArr] = useState<DocumentData[]>([]);

  // const getRanodomProperties = async () => {
  //   const q = query(
  //     collection(db, "property"),
  //     orderBy("numberOfReviews", "desc"),
  //     orderBy("totalStars", "desc"),
  //     limit(8)
  //   );
  //   console.log("--------------");
  //   const querySnapshot = await getDocs(q);
  //   setArr([]);
  //   querySnapshot.forEach((doc) => {
  //     setArr((prev) => [...prev, doc.data()]);
  //   });
  // };

  // useEffect(() => {
  //   getRanodomProperties();
  // }, []);
  if (isAdmin)
    return (
      <>
        <Layout>
          <IndexAdmin />
        </Layout>
      </>
    );
  if (isHostModeHost)
    return (
      <div className="h-full">
        <Layout>
          <div className="h-full">
            <IndexHostModeHost />
          </div>
        </Layout>
      </div>
    );
  const arr: DocumentData[] = JSON.parse(propertiesJSON);
  return (
    <Layout>
      <Head>
        <title>mybnb</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Banner />
      </div>

      <div className="max-w-7xl mx-auto px-8 sm:px-16  ">
        <section className="pt-10">
          <div className="mb-10">
            <h2 className="pb-4">Get inspiration for your next trip </h2>
            <h3>Here are the most popular accomodations around the world</h3>
          </div>

          <div className="flex gap-4 flex-wrap ">
            {arr.map((item: DocumentData) => {
              const property: DocumentData = item;
              const propertyid = item.id;
              return (
                // <div key={propertyid}> a{property.images[0]}</div>
                <Card
                  key={propertyid}
                  propertyid={propertyid}
                  name={property.title ?? ""}
                  description={""}
                  image={property.images[0] ?? ""}
                  price={property.pricePerNight ?? ""}
                  totalStars={property.totalStars ?? ""}
                  numberOfReviews={property.numberOfReviews ?? ""}
                  numberOfNights={0}
                />
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;
    var myUser: DocumentData = null;
    var hasPermission: boolean = false;
    var isRemovedByAdmin: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      myUser = docSnap.data();
      if (isLoggedUser(myUser) || isHostModeTravel(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          isRemovedByAdmin = true;
        }
      }
    }
    if (!hasPermission) {
      //only admin can't access to text on this page
      return {
        // redirect: {
        //   destination: "/",
        // },
        props: {
          isAdmin: isAdmin(myUser),
          isHostModeHost: isHostModeHost(myUser),
          isRemovedByAdmin: isRemovedByAdmin,
        },
      };
    }
    ////////
    var properties: DocumentData[] = [];
    const q = query(
      collection(db, "property"),
      orderBy("numberOfReviews", "desc"),
      orderBy("totalStars", "desc"),
      limit(8)
    );
    const querySnapshot = await getDocs(q);
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      properties.push(querySnapshot.docs[index].data());
    }

    return {
      props: {
        propertiesJSON: JSON.stringify(properties),
        isRemovedByAdmin: isRemovedByAdmin,
      },
    };
  } catch (err) {
    // context.res.writeHead(302, { location: "/" });
    // context.res.end();
    // return { props: [] };
    var isRemovedByAdmin: boolean = false;
    var properties: DocumentData[] = [];
    const q = query(
      collection(db, "property"),
      orderBy("numberOfReviews", "desc"),
      orderBy("totalStars", "desc"),
      limit(8)
    );
    const querySnapshot = await getDocs(q);
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      properties.push(querySnapshot.docs[index].data());
    }
    return {
      // redirect: {
      //   destination: "/",
      // },
      props: {
        propertiesJSON: JSON.stringify(properties),
        isRemovedByAdmin: isRemovedByAdmin,
      },
    };
  }
}
