import { useRouter } from "next/router";
import CardHostsProperty from "../components/cardhostsproperty";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useRef, useState } from "react";

// const arrData = [
//   {
//     name: "MON",
//     description: "blabla",
//     price: "100",
//     image: "/images/app1.jpg",
//     stars: "5",
//   },
//   {
//     name: "MON2",
//     description: "blabla",
//     price: "100",
//     image: "/images/app2.jpg",
//     stars: "5",
//   },
//   {
//     name: "MON3",
//     description: "blabla",
//     price: "100",
//     image: "/images/app3.jpg",
//     stars: "5",
//   },
//   {
//     name: "MON4",
//     description: "blabla",
//     price: "100",
//     image: "/images/profile.jpg",
//     stars: "5",
//   },
//   {
//     name: "MON5",
//     description: "blabla",
//     price: "100",
//     image: "/images/banner.jpg",
//     stars: "5",
//   },
// ];
export default function HostsBoard() {
  const router = useRouter();
  // const arrData: any[] = [];
  const arrData = useRef<any[]>([]);
  const [arr, setArr] = useState<any[]>([]);
  // const { location, numOfGuests } = router.query;
  const addProperty = () => {
    router.push({
      pathname: "/addproperty",
    });
  };
  const getHostProperties = async () => {
    //   arrData.current = arrData.current.splice(0);
    //   setArr([]);
    //   const q = query(
    //     collection(db, "property"),
    //     where("ownerId", "==", auth.currentUser?.uid)
    //     //?????????????
    //   );
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     // console.log(doc.id, " => ", doc.data());
    //     arrData.current.push(doc.data());
    //     setArr(arrData.current);
    //   });
    //   console.log(arrData.current.length);
  };

  // useEffect(() => {
  //   arrData.current = arrData.current.splice(0);
  //   setArr([]);
  //   getHostProperties();
  // }, []);
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
