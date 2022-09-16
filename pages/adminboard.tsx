import Layout from "../components/layout";
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  DocumentData,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ReportCard from "../components/reportcard";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { isAdmin } from "../lib/hooks";
import { useEffect, useState } from "react";
import { Divider } from "@mui/material";

const LIMIT = 5;

export default function AdminBoard({ reports }: { reports: string }) {
  const repp: DocumentData[] = JSON.parse(reports);

  const [rep, setRep] = useState<DocumentData[]>(repp);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(repp.length === 0 ? true : false);
  //////
  const rt = query(
    collection(db, "reports"),
    orderBy("createdAt", "asc"),
    startAfter(rep[0].createdAt)
    // limit(1)
  );
  const [realtimeReports] = useCollectionData(rt);

  // ////////////
  //STARO: bez paginationa
  // const [realtimeReservations] = useCollectionData(q);
  // const rep: DocumentData[] = realtimeReservations || JSON.parse(reports);
  // orderBy("processed"),//NE radi i sa ovim
  const getMorePosts = async () => {
    setLoading(true);
    const last = rep[rep.length - 1];
    const cursor = last.createdAt;
    const q = query(
      collection(db, "reports"),

      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(q)).docs.map((doc) => doc.data());
    setRep(rep.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <Layout>
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            Reports
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
            {realtimeReports &&
              realtimeReports.reverse().map((item) => {
                console.log("RT id", item, item.id);
                return (
                  <div key={item.id} className="my-3 w-full">
                    <ReportCard report={item} />
                  </div>
                );
              })}
          </div>
          <Divider />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
            {rep.map((item) => {
              return (
                <div key={item.id} className="my-3 w-full">
                  <ReportCard report={item} />
                </div>
              );
            })}
          </div>
          {!loading && !postsEnd && (
            <button className="btn w-full" onClick={getMorePosts}>
              Load more
            </button>
          )}

          {rep.length !== 0 && postsEnd && (
            <div className="badge  w-full">You have reached the end!</div>
          )}
          {rep.length === 0 && (
            <div className="badge w-full">There are no reports.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // context.res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=100"
  // );
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    var hasPermission: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      const myUser: DocumentData = docSnap.data();
      if (isAdmin(myUser)) {
        hasPermission = true;
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
    const querySnapshot = await getDocs(
      query(
        collection(db, "reports"),
        // orderBy("processed"),
        orderBy("createdAt", "desc"),
        limit(LIMIT)
      )
    );

    for (let index = 0; index < querySnapshot.docs.length; index++) {
      arrData.push(querySnapshot.docs[index].data());
    }
    return {
      props: {
        reports: JSON.stringify(arrData),
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
