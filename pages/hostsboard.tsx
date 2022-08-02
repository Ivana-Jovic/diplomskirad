import { useRouter } from "next/router";
import CardHostsProperty from "../components/cardhostsproperty";
import Layout from "../components/layout";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";

export default function HostsBoard() {
  const { user, myUserr } = useContext(AuthContext);
  const [arr, setArr] = useState<any[]>([]);

  const getHostProperties = async () => {
    const arrData: any[] = [];
    const q = query(
      collection(db, "property"),
      where("ownerId", "==", user?.uid)
      //?????????????
    );
    const querySnapshot = await getDocs(q);
    // console.log("size", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      // if (querySnapshot.size == arr.length) {
      //   setArr([]);
      // }
      arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      console.log(doc.id + "---" + JSON.stringify(doc.data()));
      console.log(doc.data());
      setArr(arrData);
      // console.log(arr.length);
    });
  };

  useEffect(() => {
    if (user) getHostProperties();
  }, [user]);

  return (
    <Layout>
      THIS IS HOSTS BOARD
      <div className=" flex max-w-7xl mx-auto px-8 sm:px-16">
        <section className="  px-10 py-10 w-full ">
          <div className="hidden sm:inline-flex mb-5 space-x-3 text-gray-800">
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">filter1</p>
            <p className="buttonfilter">more</p>
          </div>
          <div className="flex flex-col ">
            {arr.map((item) => {
              const property = JSON.parse(item.split("---")[1]);
              const propertyid = item.split("---")[0];
              // { title, description, images, pricePerNight }
              return (
                <CardHostsProperty
                  key={propertyid}
                  propertyid={propertyid}
                  name={property.title}
                  description={property.description}
                  image={property.images[0]}
                  price={property.pricePerNight}
                  stars="5"
                />
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
