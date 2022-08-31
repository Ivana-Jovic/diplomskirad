import { useRouter } from "next/router";
import CardHostsProperty from "../components/cardhostsproperty";
import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";
import dynamic from "next/dynamic";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function HostsReservations({
  uid,
  reservations,
}: {
  uid: string;
  reservations: string;
}) {
  // const { user, myUser } = useContext(AuthContext);

  const q = query(
    collection(db, "reservations"),
    where("hostId", "==", uid),
    orderBy("createdAt")
  );
  const [realtimeReservations] = useCollectionData(q);

  const reserv: DocumentData[] =
    realtimeReservations || JSON.parse(reservations);

  return (
    <Layout>
      {/* THIS IS HOSTS BOARD */}

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
                  </div>{" "}
                  {/* {new DAteitem.createdAt} */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
// type DocumentDataType = {
//   data: DocumentData;
//   id: string;
// };
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;
    ///
    const arrData: DocumentData[] = []; //TODO promeni tipove na drugimmestima
    const q = query(
      collection(db, "reservations"),
      where("hostId", "==", uid)
      // orderBy("createdAt")//TODO  svuda poredjaj sve podatke
    );
    const querySnapshot = await getDocs(q);
    // setArr([]);
    querySnapshot.forEach((doc) => {
      arrData.push(doc.data());
      arrData.push({});
      // arrData.push({ data: doc.data(), id: doc.id });
      // setArr((prev) => {
      //   return [...prev, doc];
      // });
    });
    ////
    return {
      props: {
        uid: uid,
        reservations: JSON.stringify(arrData),
        // session: "Your email is ${email} and your UID is ${uid}",
      },
    };
  } catch (err) {
    context.res.writeHead(302, { location: "/" }); //on ga tera na login
    context.res.end();
    return { props: [] };
  }
}
