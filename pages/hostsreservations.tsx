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
} from "firebase/firestore";
import { db } from "../firebase";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  const { user, myUser } = useContext(AuthContext);

  const bljuc = useRef<string[]>([]);
  const q = query(collection(db, "reservations"), where("hostId", "==", uid));
  const [realtimeReservations] = useCollectionData(q);

  const reserv: DocumentData[] =
    realtimeReservations || JSON.parse(reservations);

  // const reserv = useRef<any[]>([]);

  // TODO: OVO TREBA SREDITI DA SE NE POZIVA ZILION PUTA!!!!!!!!!!!
  // MOZDA DA SE STALNO DOHVATAJU REZERVACIJE IZ BAZE, ALI KAKO ONDA REFRESH???
  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   //TODO react FIREBASE HOOKS -- PITATI MIKIJA usecollectiondata
  //   const res: any[] = [];
  //   querySnapshot.forEach((doc) => {
  //     res.push(doc);

  //     console.log(
  //       "NEW RESRVATION",
  //       doc.data().propertyId,
  //       doc.data().from,
  //       doc.data().to
  //     );
  //   });
  //   reserv.current = res;
  //   // setReserv(res);// sa ovim poludi
  // });
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
                  <ReservationCard
                    {...(item as any)} //TODO promeni u pravi tip
                    // {...item.data()}
                    reservationId={item.id}
                    isHost={true}
                  />
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
    const q = query(collection(db, "reservations"), where("hostId", "==", uid));
    const querySnapshot = await getDocs(q);
    // setArr([]);
    querySnapshot.forEach((doc) => {
      arrData.push(doc.data());
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
