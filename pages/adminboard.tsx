import Layout from "../components/layout";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
  doc,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";
import CardSearch from "../components/cardsearch";
import Button from "../components/button";
import ReportCard from "../components/reportcard";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function AdminBoard({
  uid,
  reports,
}: {
  uid: string;
  reports: // DocumentData[];
  string;
}) {
  // const { user, myUser } = useContext(AuthContext);

  const q = query(collection(db, "reports"), orderBy("createdAt"));
  const [realtimeReservations] = useCollectionData(q);

  const rep: DocumentData[] =
    realtimeReservations ||
    // reports;
    JSON.parse(reports);

  // const { user, myUser } = useContext(AuthContext);
  // const [arr, setArr] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  // const getReports = async () => {
  //   const querySnapshot = await getDocs(query(collection(db, "reports")));
  //   setArr([]);
  //   querySnapshot.forEach((doc) => {
  //     setArr((prev) => {
  //       return [...prev, doc];
  //     });
  //   });
  // };

  // useEffect(() => {
  //   getReports();
  // }, []);

  return (
    <Layout>
      {/* THIS IS Admin BOARD */}

      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            Reports
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
            {rep.map((item) => {
              return (
                <div key={item.id} className="my-3 ">
                  <ReportCard report={item} />
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
    const querySnapshot = await getDocs(
      query(collection(db, "reports"), orderBy("createdAt"))
    );
    // querySnapshot.forEach((doc) => {
    //   //??KAO RADI
    //   arrData.push(doc.data());
    // });
    // querySnapshot.docs.sort((a,b)=>{
    //  return  a.data().createdAt-b.data().createdAt
    // })
    for (let index = 0; index < querySnapshot.docs.length; index++) {
      arrData.push(querySnapshot.docs[index].data());
    }
    return {
      props: {
        uid: uid,
        reports:
          // arrData,
          JSON.stringify(arrData),
      },
    };
  } catch (err) {
    context.res.writeHead(302, { location: "/" });
    context.res.end();
    return { props: [] };
  }
}
