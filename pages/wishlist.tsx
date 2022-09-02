import Layout from "../components/layout";
import { getDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import CardSearch from "../components/cardsearch";
import Loader from "../components/loader";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ErrorPage from "./errorpage";
import { isHostModeTravel, isLoggedUser } from "../lib/hooks";

export default function Wishlist({
  propertiesJSON,
}: {
  propertiesJSON: string;
}) {
  const faves: DocumentData[] = JSON.parse(propertiesJSON);
  // const { user, myUser } = useContext(AuthContext);
  // const [faves, setFaves] = useState<any[]>([]);
  // const [showProgress, setShowProgress] = useState<boolean>(true);
  // const getFaves = async () => {
  //   const arrData: any[] = [];
  //   myUser.faves.forEach(async (item: any) => {
  //     const docSnap = await getDoc(doc(db, "property", item));

  //     if (docSnap.exists()) {
  //       arrData.push(docSnap);
  //     }
  //     setFaves(arrData);
  //   });
  // };
  // useEffect(() => {
  //   if (myUser)
  //     getFaves().then(() => {
  //       setShowProgress(false);
  //     });
  // }, [user, myUser]);

  const { user, myUser } = useContext(AuthContext);
  if (isLoggedUser(user, myUser) || isHostModeTravel(user, myUser))
    return (
      <Layout>
        <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
          <div>
            <div className="flex flex-col mt-10 ">
              {/* {showProgress && <progress className="progress w-full"></progress>} */}
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
                      // stars="5"
                      totalStars={property.totalStars}
                      numberOfReviews={property.numberOfReviews}
                      numberOfNights={0}
                      avgPricePerNight={0}
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
  else
    return (
      <>
        <ErrorPage />
      </>
    );
}
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

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
    // context.res.writeHead(302, { location: "/" });
    // context.res.end();
    // return { props: [] };
  }
}
