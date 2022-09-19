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
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import {
  isAdmin,
  isFullyRegisteredUser,
  isHost,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import IndexHostModeHost from "../components/indexhostmodehost";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../firebase-authProvider";

export default function Index({ propertiesJSON }: { propertiesJSON: string }) {
  const router = useRouter();
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);

  if (myUser && !isFullyRegisteredUser(myUser)) {
    console.log(
      "is not FullyRegisteredUser and this should be caught in SSR!!"
    );
    router.push({
      pathname: "/profilesettings",
    });
    return;
  }
  if (myUser && myUser.host && hostModeHostC) {
    // //can access only if isHostModeTravel, else change mod

    return (
      <Layout>
        <IndexHostModeHost />
      </Layout>
    );
  }

  const arr: DocumentData[] = JSON.parse(propertiesJSON);
  return (
    <Layout>
      <Head>
        <title>diplomski</title>
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
                <Card
                  key={propertyid}
                  propertyid={propertyid}
                  name={property.title ?? ""}
                  image={property.images[0] ?? ""}
                  price={property.pricePerNight ?? ""}
                  totalStars={property.totalStars ?? ""}
                  numberOfReviews={property.numberOfReviews ?? ""}
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
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=100"
  );
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;
    var myUser: DocumentData = null;
    var hasPermission: boolean = false;

    const q = query(
      collection(db, "property"),
      orderBy("numberOfReviews", "desc"),
      orderBy("totalStars", "desc"),
      limit(6)
    );
    const [userSnap, querySnapshot] = await Promise.all([
      getDoc(doc(db, "users", uid)),
      getDocs(q),
    ]);

    if (userSnap.exists()) {
      myUser = userSnap.data();
      if (!isFullyRegisteredUser(myUser)) {
        return {
          redirect: {
            destination: "/profilesettings",
          },
          props: {},
        };
      }
      if (isLoggedUser(myUser) || isHost(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          return {
            redirect: {
              destination: "/removedbyadmin",
            },
            props: {},
          };
        }
      }

      if (isAdmin(myUser)) {
        return {
          redirect: {
            destination: "/indexadmin",
          },
          props: {},
        };
      }
    }

    if (!hasPermission) {
      return {
        props: {},
      };
    }

    var properties: DocumentData[] = [];
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      properties.push(querySnapshot.docs[index].data());
    }

    return {
      props: {
        propertiesJSON: JSON.stringify(properties),
      },
    };
  } catch (err) {
    var properties: DocumentData[] = [];
    const q = query(
      collection(db, "property"),
      orderBy("numberOfReviews", "desc"),
      orderBy("totalStars", "desc"),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      properties.push(querySnapshot.docs[index].data());
    }
    return {
      props: {
        propertiesJSON: JSON.stringify(properties),
      },
    };
  }
}
