import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
import { db } from "../firebase";
const arrData = [
  {
    name: "MON",
    description: "blabla",
    price: "100",
    image: "/images/app1.jpg",
    stars: "5",
  },
  {
    name: "MON2",
    description: "blabla",
    price: "100",
    image: "/images/app2.jpg",
    stars: "5",
  },
  {
    name: "MON3",
    description: "blabla",
    price: "100",
    image: "/images/app3.jpg",
    stars: "5",
  },
  {
    name: "MON4",
    description: "blabla",
    price: "100",
    image: "/images/profile.jpg",
    stars: "5",
  },
  {
    name: "MON5",
    description: "blabla",
    price: "100",
    image: "/images/banner.jpg",
    stars: "5",
  },
];
//PROMENI KEY!!!
export default function Search() {
  const router = useRouter();
  const { location, numOfGuests, rooms, from, to } = router.query;

  const [arr, setArr] = useState<any[]>([]);

  const getHostProperties = async () => {
    const arrData: any[] = [];
    const q = query(collection(db, "property"), where("city", "==", location));
    const querySnapshot = await getDocs(q);
    console.log("size", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      if (querySnapshot.size == arr.length) {
        setArr([]);
      }
      arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      setArr(arrData);
    });
  };

  useEffect(() => {
    if (location) getHostProperties();
  }, [arr, location]); //TODO proveriti sve useeffect nizove

  return (
    <Layout
      placeholder={
        location + " | " + numOfGuests + " guests" + " | " + rooms + " rooms"
      }
    >
      <div className=" flex max-w-7xl mx-auto px-8 sm:px-16">
        <section className="  px-10 py-10 w-full ">
          {/* flexgrow */}
          <p className="text-sm pb-5">
            Stay in {location} <br />
            from {from} to {to} <br />
            {numOfGuests} guests - {rooms} rooms
          </p>
          <p className="text-4xl mb-6">Stays in {location}</p>
          {/* dodati burger  ya telefone */}
          {/* hidden sm:inline-flex */}
          <div className="flex mb-5 space-x-3 text-gray-800">
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
              return (
                <CardSearch
                  key={propertyid}
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
    // {/* </div> */}
  );
}
// export async function getServerSideProps(params: type) {
//   // const searchresults= await fetch(...).then(res.....)
// }
