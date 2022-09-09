import CardHostsProperty from "../components/cardhostsproperty";
import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import dynamic from "next/dynamic";
import Map2 from "../components/map2";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { isHost, removedByAdmin } from "../lib/hooks";
import toast from "react-hot-toast";
import { useContext, useEffect } from "react";
import { AuthContext } from "../firebase-authProvider";
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
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);
  const properties: DocumentData[] = JSON.parse(propertiesJSON);
  useEffect(() => {
    if (myUser && myUser.host && !hostModeHostC) {
      //can access only if isHostModeHost, else change mod
      setHostModeHostC(true);
    }
  }, [myUser]);
  return (
    <Layout>
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
                  (new Date().getTime() -
                    new Date(property.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24 * 30.5)
                );
                const daysFromDateAddedProperty = Math.ceil(
                  (new Date().getTime() -
                    new Date(property.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={propertyid} className="grid">
                    <div className="text-2xl text-center m-3 font-bold hidden lg:inline-block">
                      {property.title.length < 15
                        ? property.title
                        : property.title.slice(
                            0,
                            property.title.indexOf(" ", 15)
                          ) + "..."}
                    </div>
                    <div className="stats stats-vertical lg:stats-horizontal shadow">
                      <div className="text-2xl text-center m-3 font-semibold lg:hidden">
                        {property.title.length < 15
                          ? property.title
                          : property.title.slice(
                              0,
                              property.title.indexOf(" ", 15)
                            ) + "..."}
                      </div>
                      <div className="stat ">
                        <div className="stat-title">Total earnings</div>
                        <div className="stat-value">
                          {property.totalEarnings}e
                        </div>
                        <div className="stat-desc">
                          from {new Date(property.createdAt).toDateString()}
                        </div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">
                          Average earnings per month
                        </div>
                        <div className="stat-value">
                          {property.totalEarnings / monthsFromDateAddedProperty}
                          e
                        </div>
                        <div className="stat-desc">
                          from {new Date(property.createdAt).toDateString()}
                        </div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Total occupancy</div>
                        <div className="stat-value">
                          {property.totalOccupancyDays} days
                        </div>
                        <div className="stat-desc">
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
            <div className=" w-full max-w-xl">
              <Calendar propertyId={propertiesIds} />
            </div>
          )}
          {(!propertiesIds || propertiesIds.length === 0) && <div>None</div>}

          <div className="flex flex-col items-center justify-center mt-10 w-full h-96">
            {properties.length > 0 && <Map2 arrLoc={properties} />}
          </div>
        </div>
      </>
      {/* )} */}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    var hasPermission: boolean = false;
    const q = query(collection(db, "property"), where("ownerId", "==", uid));

    // const docSnap = await getDoc(doc(db, "users", uid));
    const [docSnap, querySnapshot] = await Promise.all([
      getDoc(doc(db, "users", uid)),
      getDocs(q),
    ]);

    if (docSnap.exists()) {
      const myUser: DocumentData = docSnap.data();
      if (isHost(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          return {
            redirect: {
              destination: "/removedbyadmin",
            },
            props: [],
          };
        }
      }
    }
    if (!hasPermission) {
      return {
        redirect: {
          destination: "/",
        },
        props: [],
      };
    }
    var properties: DocumentData[] = [];
    var propertiesIds: string[] = [];

    // const querySnapshot = await getDocs(q);

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
