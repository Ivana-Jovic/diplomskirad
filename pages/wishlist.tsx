import Layout from "../components/layout";
import { getDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect } from "react";
import { AuthContext } from "../firebase-authProvider";
import CardSearch from "../components/cardsearch";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import {
  isFullyRegisteredUser,
  isHost,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";

export default function Wishlist({
  uid,
  propertiesJSON,
}: {
  uid: string;
  propertiesJSON: string;
}) {
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);
  useEffect(() => {
    if (myUser && myUser.host && hostModeHostC) {
      //can access only if isHostModeTravel, else change mod
      setHostModeHostC(false);
    }
  }, [myUser]);
  const faves: DocumentData[] = JSON.parse(propertiesJSON);
  return (
    <Layout>
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div className="pt-7 pb-5 text-center text-3xl font-bold">Wishlist</div>
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
        {faves.length === 0 && (
          <div className="badge w-full">
            There are no properties in wishlist.
          </div>
        )}
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
    }
    if (!hasPermission) {
      return {
        redirect: {
          destination: "/",
        },
        props: {},
      };
    }
    var properties: DocumentData[] = [];

    if (docSnap.exists()) {
      for (let index = 0; index < docSnap.data().faves.length; index++) {
        const docSnap2 = await getDoc(
          doc(db, "property", docSnap.data().faves[index])
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
      props: {},
    };
  }
}
