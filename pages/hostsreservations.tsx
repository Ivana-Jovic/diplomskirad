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
import { isHost, removedByAdmin } from "../lib/hooks";
import toast from "react-hot-toast";
import { useContext, useEffect } from "react";
import { AuthContext } from "../firebase-authProvider";
export default function HostsReservations({
  uid,
  reservations,
}: {
  uid: string;
  reservations: string;
}) {
  const { user, myUser, hostModeHostC, setHostModeHostC } =
    useContext(AuthContext);

  useEffect(() => {
    if (myUser && myUser.host && !hostModeHostC) {
      //can access only if isHostModeHost, else change mod
      setHostModeHostC(true);
    }
  }, [myUser]);

  const q = query(
    collection(db, "reservations"),
    where("hostId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const [realtimeReservations] = useCollectionData(q);

  const reserv: DocumentData[] =
    realtimeReservations || JSON.parse(reservations);

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
    const q = query(
      collection(db, "reservations"),
      where("hostId", "==", uid),
      orderBy("createdAt", "desc")
    );
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
      console.log("1");
      return {
        redirect: {
          destination: "/",
        },
        props: [],
      };
    }
    const arrData: DocumentData[] = [];

    // const querySnapshot = await getDocs(q);
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      arrData.push(querySnapshot.docs[index].data());
    }

    return {
      props: {
        uid: uid,
        reservations: JSON.stringify(arrData),
      },
    };
  } catch (err) {
    console.log("2");
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
