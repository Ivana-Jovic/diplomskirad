import Layout from "../components/layout";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import CardSearch from "../components/cardsearch";
import Loader from "../components/loader";
//TODO pomeri secrets file
export default function Wishlist() {
  const { user, myUser } = useContext(AuthContext);
  const [faves, setFaves] = useState<any[]>([]);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const getFaves = async () => {
    //TODO potencijalnbo da postoji subkolekcija fave poperty
    console.log("\\\\\\\\\\\\\\\n");
    const arrData: any[] = [];
    myUser.faves.forEach(async (item: any) => {
      const docSnap = await getDoc(doc(db, "property", item));

      if (docSnap.exists()) {
        arrData.push(docSnap);
      }
      setFaves(arrData);
    });
  };
  useEffect(() => {
    if (myUser)
      getFaves().then(() => {
        setShowProgress(false);
      });
  }, [user, myUser]);

  return (
    <Layout>
      {/* THIS IS Guest BOARD */}
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="flex flex-col mt-10 ">
            {showProgress && <progress className="progress w-full"></progress>}
            <div className="pt-7 pb-5 text-center text-3xl font-bold">
              Wishlist
            </div>
            {faves.map((property: any) => {
              return (
                <div key={property.id}>
                  <CardSearch
                    key={property.id}
                    propertyid={property.id}
                    name={property.data().title}
                    description={property.data().description}
                    image={property.data().images[0]}
                    price={property.data().pricePerNight}
                    // stars="5"
                    totalStars={property.data().totalStars}
                    numberOfReviews={property.data().numberOfReviews}
                    numberOfNights={0}
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
