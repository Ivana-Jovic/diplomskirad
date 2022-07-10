import { useRouter } from "next/router";
import CardHostsProperty from "../components/cardhostsproperty";
import Layout from "../components/layout";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";

export default function HostsBoard() {
  const { user, myUserr } = useContext(AuthContext);
  // const router = useRouter();
  // const arrData = useRef<any[]>([]);
  const [arr, setArr] = useState<any[]>([]);
  // const { location, numOfGuests } = router.query;

  const getHostProperties = async () => {
    const arrData: any[] = [];
    const q = query(
      collection(db, "property"),
      where("ownerId", "==", user?.uid)
      //?????????????
    );
    const querySnapshot = await getDocs(q);
    console.log("size", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      if (querySnapshot.size == arr.length) {
        setArr([]);
      }
      arrData.push(doc.data());
      setArr(arrData);
      console.log(arr.length);
    });
  };

  useEffect(() => {
    getHostProperties();
  }, []);

  return (
    <Layout>
      THIS IS HOSTS BOARD
      <div className=" flex">
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
            {arr.map(({ title, description, image, price, stars }) => {
              return (
                <CardHostsProperty
                  key={title}
                  name={title}
                  description={description}
                  image={image}
                  price={price}
                  stars={stars}
                />
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
