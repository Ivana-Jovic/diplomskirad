// Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
// at Search (webpack-internal:///./pages/search.tsx:126:72)
// at AuthProvider (webpack-internal:///./firebase-authProvider.js:54:26)
// at MyApp (webpack-internal:///./pages/_app.tsx:76:28)
// at ErrorBoundary (webpack-internal:///./node_modules/next/dist/compiled/@next/react-dev-overlay/client.js:8:20746)
// at ReactDevOverlay (webpack-internal:///./node_modules/next/dist/compiled/@next/react-dev-overlay/client.js:8:23395)
// at Container (webpack-internal:///./node_modules/next/dist/client/index.js:323:9)
// at AppContainer (webpack-internal:///./node_modules/next/dist/client/index.js:825:26)
// at Root (webpack-internal:///./node_modules/next/dist/client/index.js:949:27)
// window.console.error @ next-dev.js?3515:25
// printWarning @ react-dom.development.js?ac89:86
// error @ react-dom.development.js?ac89:60
// checkForNestedUpdates @ react-dom.development.js?ac89:27300
// scheduleUpdateOnFiber @ react-dom.development.js?ac89:25475
// dispatchSetState @ react-dom.development.js?ac89:17527
// eval @ search.tsx?c3ba:183
// commitHookEffectListMount @ react-dom.development.js?ac89:23150
// commitPassiveMountOnFiber @ react-dom.development.js?ac89:24926
// commitPassiveMountEffects_complete @ react-dom.development.js?ac89:24891
// commitPassiveMountEffects_begin @ react-dom.development.js?ac89:24878
// commitPassiveMountEffects @ react-dom.development.js?ac89:24866
// flushPassiveEffectsImpl @ react-dom.development.js?ac89:27039
// flushPassiveEffects @ react-dom.development.js?ac89:26984
// eval @ react-dom.development.js?ac89:26769
// workLoop @ scheduler.development.js?bcd2:266
// flushWork @ scheduler.development.js?bcd2:239
// performWorkUntilDeadline @ scheduler.development.js?bcd2:533
import { Chip, Rating } from "@mui/material";
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
async function isAvailable(from: Date, to: Date, propertyId: string) {
  const querySnapshot6 = await getDocs(
    query(
      collection(db, "reservations"),
      where("propertyId", "==", propertyId)
      //TODO: change from and to to DATE types in db!!!! and remove condition from if clause
      // where("to" as Date, ">", from) //= means they are checkig out the same day others are checking in which is ok
    )
  );
  for (let index = 0; index < querySnapshot6.docs.length; index++) {
    const doc = querySnapshot6.docs[index];
    console.log("KK ", propertyId, index, doc.id);

    //oni koji se potencijalno poklapaju
    if (new Date(doc.data().to) <= from || new Date(doc.data().from) >= to) {
      //ne poklapaju se
    } else {
      //poklapaju se kako god
      //ako je doc.to izmedju to i from poklapaju se sigurno
      //ako doc.to vece od to poklapaju se  ako je from iymedju ili pre from
      //
      console.log(
        "ELSE GRANA",
        propertyId,
        from.toDateString(),
        to.toDateString()
      );
      return false;
    }
  }
  return true;
  // querySnapshot6.docs.forEach((doc) => {
  //   //oni koji se potencijalno poklapaju
  //   if (new Date(doc.data().from) >= to) {
  //     //ne poklapaju se
  //   } else {
  //     //poklapaju se kako god
  //     //ako je doc.to izmedju to i from poklapaju se sigurno
  //     //ako doc.to vece od to poklapaju se  ako je from iymedju ili pre from
  //     //
  //     return false;
  //   }
  //   return true;
  // });
}
export default function Search() {
  const router = useRouter();
  const { location, from, to } = router.query; //,rooms,numOfGuests, from, to
  const fromDate = new Date(router.query.from as string);
  fromDate.setHours(0, 0, 0, 0);
  // (router.query.from as string).toDateString() ?? (router.query.from as string)
  // );
  // (router.query.from as string);
  // router.query.from
  //   ? new Date(router.query.from as string)
  //   : undefined;
  const toDate = new Date(router.query.to as string);
  toDate.setHours(0, 0, 0, 0);
  //   router.query.to?.toDateString() ?? (router.query.to as string)
  // );
  //  router.query.to
  //   ? new Date(router.query.to as string)
  //   : undefined;

  const rooms = (router.query.rooms ?? 0) as number;
  // router.query.rooms ? +router.query.rooms : undefined;
  const numOfGuests = (router.query.numOfGuests ?? 0) as number;
  // ? +router.query.numOfGuests
  // : undefined;
  const [arr, setArr] = useState<any[]>([]);

  const [selectedSuperhost, setSelectedSuperhost] = useState<boolean>(false);
  const [selectedRatingFourAndUp, setSelectedRatingFourAndUp] =
    useState<boolean>(false);
    const [selectedGarage, setSelectedGarage] = useState<boolean>(false);
  
  const getSearchProperties = useCallback(async () => {
    console.log("in search gethostproperty");
    const qs44: string[] = [];
    const qs33: string[] = [];

    const arrData: any[] = [];

    const querySnapshot1 = await getDocs(
      query(collection(db, "property"), where("city", "==", location))
    );

    const querySnapshot2 = await getDocs(
      query(collection(db, "property"), where("state", "==", location))
    );
    // const querySnapshot3 = await getDocs(
    //   query(
    //     collection(db, "property"),
    //     where("numOfPersons", ">=", numOfGuests)
    //   )
    // );
    // const querySnapshot4 = await getDocs(
    //   query(collection(db, "property"), where("numOfRooms", ">=", rooms))
    // );

    // querySnapshot4.docs.forEach((doc) => {
    //   qs44.push(doc.id);
    //   console.log("/", doc.id);
    // });
    // querySnapshot3.docs.forEach((doc) => {
    //   qs33.push(doc.id);
    //   console.log("//", doc.id);
    // });

    let r: QueryDocumentSnapshot<DocumentData>[] = querySnapshot1.docs.concat(
      querySnapshot2.docs
    );
    //UNIJA

    r.forEach(async (doc) => {
      if (
        rooms &&
        numOfGuests &&
        doc.data().numOfPersons >= numOfGuests &&
        doc.data().numOfRooms >= rooms
      ) {
        // console.log("MAIN", doc.data().from, doc.data().to);
        console.log("MAIN", fromDate, toDate);
        // const isAv = await isAvailable(fromDate, toDate, doc.id);
        // if (isAv) {
        arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
        setArr(arrData);
        console.log(
          "MAIN2",
          fromDate,
          toDate,
          doc.id,
          arrData.length,
          arr.length
        );
        // }
      }

      //PRESEK
      // console.log("unutra");
      // console.log("4- " + querySnapshot4.docs[0].id);
      // console.log("4+ " + doc.id);

      // console.log('"', qs44?.length);

      ///// DATUMI
      // const querySnapshot5 = await getDocs(
      //   query(collection(db, "reservations"), where("propertyId", "==", doc.id),
      //   where("resFrom",">=",fromDate))
      // );

      // if (qs33?.includes(doc.id) && qs44?.includes(doc.id)) {
      // console.log("sadrzi");
      // arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
      // setArr(arrData);
      // }
    });
  }, [location, numOfGuests, rooms]);

  // useEffect(() => {
  //   //TODO: proveri uslove
  //   if (
  //     location != undefined &&
  //     rooms != undefined &&
  //     numOfGuests != undefined &&
  //     rooms &&
  //     location &&
  //     numOfGuests &&
  //     fromDate &&
  //     toDate
  //   )
  //     getSearchProperties();
  // }, [location, rooms, numOfGuests, getSearchProperties]); //TODO proveriti sve useeffect nizove

  const shouldBeShown = (selected: boolean, is: boolean) => {
    if ((selected && is) || !selected) {
      console.log("shouldBeShown TRUE");
      return true;
    } else {
      console.log("shouldBeShown FALSE", selected, is);
      return false;
    }
  };
  const filterProperties = (item: any) => {
    const property = JSON.parse(item.split("---")[1]);
    const propertyid = item.split("---")[0];
    //if selectedSuperhost and isSuperhost
    // or !selectedSuperhost   -> SHOULD BE SHOWN
    if (
      shouldBeShown(selectedSuperhost, property.isSuperhost) &&
      shouldBeShown(
        selectedRatingFourAndUp,
        property.totalStars / property.numberOfReviews >= 4
      )&&
      shouldBeShown(selectedGarage, property.garage) 
    ) {
      console.log("TRUE");
      return true;
    }

    console.log("FALSE", selectedSuperhost, property.isSuperhost);
    return false;
  };
  // const filterProperties = useCallback(() => {
  // const arrData2: any[] = [];
  // const arrData3: any[] = arr;
  // arrData3.forEach((item) => {
  //   console.log("in arrdata3");
  //   const property = JSON.parse(item.split("---")[1]);
  //   const propertyid = item.split("---")[0];
  //   if (selectedSuperhost && property.isSuperhost) {
  //     arrData2.push(item);
  //     console.log("in arrdata2", arrData2.length);
  //     setArr(arrData2);
  //   }
  // });
  // }, []);
  // const bljuc = () => {
  //   // arr.filter(filterProperties);
  //   setArr(arr.filter(filterProperties));
  // };

  useEffect(() => {
    if (selectedSuperhost || selectedRatingFourAndUp||selectedGarage) {
      // filterProperties();
      // bljuc()
      const arrData5: any[] = arr.filter(filterProperties);
      setArr(arrData5);
    } else {
      if (
        location != undefined &&
        rooms != undefined &&
        numOfGuests != undefined &&
        fromDate != undefined &&
        toDate != undefined &&
        rooms &&
        location &&
        numOfGuests &&
        fromDate &&
        toDate
      ) {
        getSearchProperties();
      }
    }
  }, [
    location,
    rooms,
    numOfGuests,
    getSearchProperties,
    selectedSuperhost,
    selectedRatingFourAndUp,
    selectedGarage
  ]); //TODO proveriti sve useeffect nizove

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
            {/* <p className="buttonfilter flex items-center">
              <Rating name="read-only" value={4} readOnly size="small" /> & up
            </p> */}
            <Chip
              icon={<Rating name="read-only" value={4} readOnly size="small" />}
              label="& up"
              variant={selectedRatingFourAndUp ? "filled" : "outlined"}
              onClick={() => {
                setSelectedRatingFourAndUp(!selectedRatingFourAndUp);
              }}
            />
            <p className="buttonfilter">Price</p>
            <p className="buttonfilter">Garage</p>
            <Chip
              label="Garage"
              variant={selectedGarage ? "filled" : "outlined"}
              onClick={() => {
                setSelectedGarage(!selectedGarage);
              }}
            />
            {/* <p className="buttonfilter">Superhost</p> */}
            <Chip
              label="Superhost"
              variant={selectedSuperhost ? "filled" : "outlined"}
              onClick={() => {
                setSelectedSuperhost(!selectedSuperhost);
              }}
            />

            {/* <p className="buttonfilter">more</p> */}
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
                  // stars="5"
                  totalStars={property.totalStars}
                  numberOfReviews={property.numberOfReviews}
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
