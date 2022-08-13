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
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";
import CardSearch from "../components/cardsearch";
import Button from "../components/button";
import ReportCard from "../components/reportcard";

export default function AdminBoard() {
  const { user, myUser } = useContext(AuthContext);
  const [arr, setArr] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  //TODO: mozda treba da osluskuje a ne da cita
  const getReports = async () => {
    const q = query(collection(db, "reports"));
    const querySnapshot = await getDocs(q);
    setArr([]);
    querySnapshot.forEach((doc) => {
      setArr((prev) => {
        return [...prev, doc];
      });
    });
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <Layout>
      {/* THIS IS Admin BOARD */}

      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            Reports
          </div>
          <div className="flex flex-col ">
            {arr.map((item) => {
              return (
                <div
                  key={item.id}
                  className="my-3 grid grid-cols-1 lg:grid-cols-2"
                >
                  <ReportCard item={item} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
