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
import { useContext } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";

export default function GuestBoard({
  uid,
  reservations,
}: {
  uid: string;
  reservations: string;
  // DocumentData[]; //RADILO SA string
}) {
  const reserv: DocumentData[] =
    // reservations;
    JSON.parse(reservations);
  // console.log(reserv);

  return (
    <Layout>
      {/* THIS IS Guest BOARD */}
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            My reservations
          </div>
          <div className="flex flex-col ">
            {Array.from(reserv).map((item, index) => {
              return (
                <div key={index}>
                  <ReservationCard
                    {...(item as any)} //ovde mora any
                    reservationId={item.id}
                    // TODO : Kad napravis modove u oba resrvation carda obrati paznju na isHost
                    isHost={false}
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
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;
    const arrData: DocumentData[] = [];
    const q = query(
      collection(db, "reservations"),
      where("userId", "==", uid),
      orderBy("createdAt")
    );

    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   arrData.push(doc.data());
    // });

    for (let index = 0; index < querySnapshot.docs.length; index++) {
      arrData.push(querySnapshot.docs[index].data());
    }
    return {
      props: {
        uid: uid,
        // reservations: { ...{ ...arrData } },
        reservations:
          // arrData,
          JSON.stringify(arrData),
        // reservations: { ...{ ...querySnapshot.docs } },
        // session: "Your email is ${email} and your UID is ${uid}",
      },
    };
  } catch (err) {
    context.res.writeHead(302, { location: "/" });
    context.res.end();
    return { props: [] };
  }
}
