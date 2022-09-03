import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import ReservationCard from "../components/reservationcard";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ErrorPage from "./errorpage";
import { isHostModeHost, removedByAdmin } from "../lib/hooks";
import { useContext } from "react";
import { AuthContext } from "../firebase-authProvider";
import RemovedByAdmin from "../components/removedbyadmin";

export default function HostsReservations({
  uid,
  reservations,
  isRemovedByAdmin,
}: {
  uid: string;
  reservations: string;
  isRemovedByAdmin: boolean;
  // DocumentData[];
}) {
  const q = query(
    collection(db, "reservations"),
    where("hostId", "==", uid),
    orderBy("createdAt")
  );
  const [realtimeReservations] = useCollectionData(q);

  if (isRemovedByAdmin) return <RemovedByAdmin />;

  const reserv: DocumentData[] =
    realtimeReservations ||
    //  reservations;
    JSON.parse(reservations);

  return (
    <Layout>
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16 ">
        <div className="pt-7 pb-5 text-center text-3xl font-bold">
          Reservations
        </div>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from(reserv).map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    <ReservationCard
                      {...(item as any)}
                      reservationId={item.id}
                      // bez obzira na mod, cak i da jeste inace host, ovde je u ulozi guesta
                      isHost={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    var hasPermission: boolean = false;
    var isRemovedByAdmin: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      const myUser: DocumentData = docSnap.data();
      if (isHostModeHost(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          isRemovedByAdmin = true;
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
    const arrData: DocumentData[] = [];
    const q = query(
      collection(db, "reservations"),
      where("hostId", "==", uid),
      orderBy("createdAt")
    );
    const querySnapshot = await getDocs(q);
    // querySnapshot.docs.sort((a, b) => {
    //   return a.data().createdAt - b.data().createdAt;
    // });
    // setArr([]);
    // querySnapshot.forEach((doc) => {
    //   arrData.push(doc.data());
    // });
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      arrData.push(querySnapshot.docs[index].data());
    }
    ////
    return {
      props: {
        uid: uid,
        reservations:
          //  arrData,
          JSON.stringify(arrData),
        isRemovedByAdmin: isRemovedByAdmin,
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
