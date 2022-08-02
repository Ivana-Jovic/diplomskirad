import { Console } from "console";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useRef } from "react";
import CardSearch from "../components/cardsearch";
import Layout from "../components/layout";
import { db } from "../firebase";

//TODO: dodati datume u search i ostale

//PROMENI KEY!!!
export default function Search() {
  const router = useRouter();
  const { location, from, to } = router.query; //,rooms,numOfGuests
  const rooms = router.query.rooms ? +router.query.rooms : undefined;
  const numOfGuests = router.query.numOfGuests
    ? +router.query.numOfGuests
    : undefined;
  const [arr, setArr] = useState<any[]>([]);
  // const [qs4, setQs4] = useState<string[] | null>([]);

  // const [qs3, setQs3] = useState<string[] | null>([]);
  // const [done, setDone] = useState<boolean>(false);

  const getHostProperties = useCallback(async () => {
    console.log("in search gethostproperty");
    const qs44: string[] = [];
    const qs33: string[] = [];
    // // const arrData: any[] = [];
    // // const q = query(collection(db, "property"), where("city", "==", location));
    // // const querySnapshot = await getDocs(q);
    // // // console.log("size", querySnapshot.size);
    // // querySnapshot.forEach((doc) => {
    // //   // if (querySnapshot.size == arr.length) {
    // //   //   setArr([]);
    // //   // }
    // //   arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
    // //   setArr(arrData);
    // // });
    // const arrData: any[] = [];
    // const querySnapshot1 = await getDocs(
    //   query(collection(db, "property"), where("city", "==", location))
    // );

    // const querySnapshot2 = await getDocs(
    //   query(collection(db, "property"), where("state", "==", location))
    // );
    // const querySnapshot3 = await getDocs(
    //   query(
    //     collection(db, "property"),
    //     where("numOfPersons", ">=", numOfGuests)
    //   )
    // );
    // const querySnapshot4 = await getDocs(
    //   query(collection(db, "property"), where("numOfRooms", ">=", rooms))
    // );

    // // let r = new Set<QueryDocumentSnapshot<DocumentData>>(
    // //   //TODO eliminate duplicates//WHY DOESNT THIS WORK
    // //   querySnapshot1.docs.concat(querySnapshot2.docs)
    // // );
    // let r = querySnapshot1.docs.concat(querySnapshot2.docs);
    // //UNIJA
    // let bla: any[] = [];
    // // const nn=querySnapshot1.
    // r.forEach((doc) => {
    //   //PRESEK
    //   console.log("unutra");
    //   if (
    //     querySnapshot3.docs.includes(doc) &&
    //     querySnapshot4.docs.includes(doc)
    //   ) {
    //     bla.concat(doc);
    //     console.log("sadrzi");
    //   }
    // });
    // // console.log(querySnapshot1);

    // r.forEach((it: QueryDocumentSnapshot<DocumentData>) => {
    //   arrData.push(it.id + "---" + JSON.stringify(it.data()));
    //   setArr(arrData);
    // });

    // // let un = querySnapshot1.docs.concat(querySnapshot2.docs);
    // // un.forEach((item: QueryDocumentSnapshot<DocumentData>) => {
    // //   arrData.push(item.id + "---" + JSON.stringify(item.data()));
    // //   setArr(arrData);
    // // });
    // // let intersect = new Set([...a].filter((i) => b.has(i)));
    // // querySnapshot.forEach((doc) => {
    // //   arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
    // //   setArr(arrData);
    // // });

    //POSLE MORA
    // const arrData: any[] = [];
    // const q = query(collection(db, "property"), where("city", "==", location));
    // const querySnapshot = await getDocs(q);
    // // console.log("size", querySnapshot.size);
    // querySnapshot.forEach((doc) => {
    //   // if (querySnapshot.size == arr.length) {
    //   //   setArr([]);
    //   // }
    //   arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
    //   setArr(arrData);
    // });
    const arrData: any[] = [];

    const querySnapshot1 = await getDocs(
      query(collection(db, "property"), where("city", "==", location))
    );

    const querySnapshot2 = await getDocs(
      query(collection(db, "property"), where("state", "==", location))
    );
    const querySnapshot3 = await getDocs(
      query(
        collection(db, "property"),
        where("numOfPersons", ">=", numOfGuests)
      )
    );
    const querySnapshot4 = await getDocs(
      query(collection(db, "property"), where("numOfRooms", ">=", rooms))
    );

    querySnapshot4.docs.forEach((doc) => {
      qs44.push(doc.id);
      // setQs4(qs44);
      console.log("/", doc.id);
    });
    querySnapshot3.docs.forEach((doc) => {
      qs33.push(doc.id);
      // setQs3(qs33);
      console.log("//", doc.id);
    });

    let r: QueryDocumentSnapshot<DocumentData>[] = querySnapshot1.docs.concat(
      querySnapshot2.docs
    );
    //UNIJA

    r.forEach((doc) => {
      //PRESEK
      console.log("unutra");
      console.log("4- " + querySnapshot4.docs[0].id);
      console.log("4+ " + doc.id);

      // querySnapshot4.docs.forEach(//OVO RADI SAMO JE PRESPORO i tesko ya prosirivanje
      //   (item: QueryDocumentSnapshot<DocumentData>) => {
      //     if (item.id == doc.id) {
      //       // bla.concat(doc);
      //       console.log("sadrzi");
      //       arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      //       setArr(arrData);
      //     }
      //   }
      // );

      console.log('"', qs44?.length);
      if (
        qs33?.includes(doc.id) &&
        qs44?.includes(doc.id)
        // true
      ) {
        // bla.concat(doc);
        console.log("sadrzi");
        arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
        setArr(arrData);
      }
    });

    // bla.forEach((it: QueryDocumentSnapshot<DocumentData>) => {
    //   arrData.push(it.id + "---" + JSON.stringify(it.data()));
    //   setArr(arrData);
    // });
    // setDone(true);
  }, [location, numOfGuests, rooms]);

  useEffect(() => {
    //TODO: proveri uslove
    if (
      location != undefined &&
      rooms != undefined &&
      numOfGuests != undefined &&
      rooms &&
      location &&
      numOfGuests
    )
      getHostProperties();
  }, [location, rooms, numOfGuests, getHostProperties]); //TODO proveriti sve useeffect nizove

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
    // {/* </div> */}
  );
}
// export async function getServerSideProps(params: type) {
//   // const searchresults= await fetch(...).then(res.....)
// }
