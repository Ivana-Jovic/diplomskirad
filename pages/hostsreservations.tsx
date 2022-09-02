import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import ReservationCard from "../components/reservationcard";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ErrorPage from "./errorpage";
import { isHostModeHost } from "../lib/hooks";
import { useContext } from "react";
import { AuthContext } from "../firebase-authProvider";

export default function HostsReservations({
  uid,
  reservations,
}: {
  uid: string;
  reservations: string;
  // DocumentData[];
}) {
  const q = query(
    collection(db, "reservations"),
    where("hostId", "==", uid),
    orderBy("createdAt")
  );
  const [realtimeReservations] = useCollectionData(q);

  const reserv: DocumentData[] =
    realtimeReservations ||
    //  reservations;
    JSON.parse(reservations);

  const { user, myUser } = useContext(AuthContext);
  if (isHostModeHost(user, myUser))
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
    const { uid, email } = token;

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

        // session: "Your email is ${email} and your UID is ${uid}",
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
