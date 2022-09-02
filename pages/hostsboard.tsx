import CardHostsProperty from "../components/cardhostsproperty";
import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import dynamic from "next/dynamic";
// import FullCalendar from "@fullcalendar/react";
import Map2 from "../components/map2";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { isHostModeHost } from "../lib/hooks";
import ErrorPage from "./errorpage";

// import { responsiveProperty } from "@mui/material/styles/cssUtils";
const Calendar = dynamic(() => import("../components/calendar"), {
  ssr: false,
});

export default function HostsBoard({
  propertiesJSON,
  propertiesIds,
}: {
  propertiesJSON: string;
  propertiesIds: string[];
}) {
  const properties: DocumentData[] = JSON.parse(propertiesJSON);
  // const [showProgress, setShowProgress] = useState<boolean>(true);
  // const { user, myUser } = useContext(AuthContext);
  // const [arr, setArr] = useState<any[]>([]);
  // const [arrLocation, setArrLocation] = useState<DocumentData[]>([]);

  // const bljuc = useRef<string[]>([]);
  // const getHostProperties = useCallback(async () => {
  //   bljuc.current = [];
  //   const arrData: any[] = [];
  //   const q = query(
  //     collection(db, "property"),
  //     where("ownerId", "==", user?.uid)
  //     // orderBy("createdAt")
  //     //?????????????
  //   );
  //   console.log("--------------");
  //   const querySnapshot = await getDocs(q);
  //   setArr([]);
  //   setArrLocation([]);
  //   bljuc.current = [];
  //   querySnapshot.forEach((doc) => {
  //     // console.log("\\\\\\\\\\\\]", doc.id);
  //     // arrData.push(doc.id + "---" + JSON.stringify(doc.data()));
  //     bljuc.current.push(doc.id);
  //     // console.log(doc.id + "---" + JSON.stringify(doc.data()));
  //     console.log("WWWWWWWWWWWW", bljuc.current.length);
  //     // setArr(arrData);

  //     setArr((prev) => [...prev, doc]);
  //     setArrLocation((prev) => [...prev, doc.data()]);
  //   });
  // }, [user?.uid]);

  // useEffect(() => {
  //   if (user)
  //     getHostProperties().then(() => {
  //       setShowProgress(false);
  //     });
  // }, [getHostProperties, user]);

  const { user, myUser } = useContext(AuthContext);
  if (isHostModeHost(user, myUser))
    return (
      <Layout>
        {/* {showProgress ? (
        <progress className="progress w-full"></progress>
      ) : ( */}
        <>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            My properties
          </div>
          <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16 ">
            <section className=" w-full ">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {properties.map((item: DocumentData) => {
                  const property = item;
                  const propertyid = item.id;
                  // { title, description, images, pricePerNight }
                  return (
                    <CardHostsProperty
                      key={propertyid}
                      propertyid={propertyid}
                      name={property.title}
                      description={property.description}
                      image={property.images[0]}
                      price={property.pricePerNight}
                      totalStars={property.totalStars}
                      numberOfReviews={property.numberOfReviews}
                    />
                  );
                })}
              </div>
            </section>
            <div className="pt-7 pb-5 text-center text-3xl font-bold">
              Statstics
            </div>
            <div>
              <div className="grid  grid-cols-2 lg:grid-cols-1 gap-4">
                {properties.map((item: DocumentData) => {
                  const property = item;
                  const propertyid = item.id;
                  const monthsFromDateAddedProperty = Math.ceil(
                    //round
                    (new Date().getTime() -
                      new Date(property.createdAt).getTime()) /
                      // dateAddedProperty
                      (1000 * 60 * 60 * 24 * 30.5)
                  );
                  const daysFromDateAddedProperty = Math.ceil(
                    //round
                    (new Date().getTime() -
                      new Date(property.createdAt).getTime()) /
                      // dateAddedProperty
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={propertyid} className="grid">
                      <div className="stats stats-vertical lg:stats-horizontal shadow">
                        <p className="text-2xl text-center m-3 font-semibold">
                          {property.title.length < 15
                            ? property.title
                            : property.title.slice(
                                0,
                                property.title.indexOf(" ", 15)
                              ) + "..."}
                        </p>
                        <div className="stat ">
                          <div className="stat-title">Total earnings</div>
                          <div className="stat-value">
                            {property.totalEarnings}e
                          </div>
                          <div className="stat-desc">
                            {/* from {property.dateAddedProperty} */}
                            from {new Date(property.createdAt).toDateString()}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">
                            Average earnings per month
                          </div>
                          <div className="stat-value">
                            {property.totalEarnings /
                              monthsFromDateAddedProperty}
                            e
                          </div>
                          <div className="stat-desc">
                            {/* from {property.dateAddedProperty} */}
                            from {new Date(property.createdAt).toDateString()}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Total occupancy</div>
                          <div className="stat-value">
                            {property.totalOccupancyDays} days
                          </div>
                          <div className="stat-desc">
                            {/* from {property.dateAddedProperty} */}
                            from {new Date(property.createdAt).toDateString()}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Average occupancy</div>
                          <div className="stat-value">
                            {(
                              (property.totalOccupancyDays /
                                daysFromDateAddedProperty) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                          <div className="stat-desc">
                            {/* from {property.dateAddedProperty} */}
                            from {new Date(property.createdAt).toDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-7 pb-5 text-center text-3xl font-bold ">
              Calendar
            </div>
            {propertiesIds && propertiesIds.length <= 10 && (
              <Calendar propertyId={propertiesIds} />
            )}
            {(!propertiesIds || propertiesIds.length == 0) && <div>NEMA</div>}

            <div className="flex flex-col items-center justify-center mt-10">
              {properties.length > 0 && <Map2 arrLoc={properties} />}
            </div>
          </div>
        </>
        {/* )} */}
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
    var propertiesIds: string[] = [];
    const q = query(
      collection(db, "property"),
      where("ownerId", "==", uid)
      // orderBy("createdAt")
      //?????????????
    );

    const querySnapshot = await getDocs(q);

    for (let index = 0; index < querySnapshot.docs.length; index++) {
      properties.push(querySnapshot.docs[index].data());
      propertiesIds.push(querySnapshot.docs[index].id);
    }
    return {
      props: {
        uid: uid,
        propertiesJSON: JSON.stringify(properties),
        propertiesIds: propertiesIds,
      },
    };
  } catch (err) {
    // context.res.writeHead(302, { location: "/" });
    // context.res.end();
    // return { props: [] };
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
