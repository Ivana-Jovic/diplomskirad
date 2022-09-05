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
import { useContext } from "react";
import { AuthContext } from "../firebase-authProvider";
import ReservationCard from "../components/reservationcard";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import ErrorPage from "./errorpage";
import {
  isFullyRegisteredUser,
  isHostModeTravel,
  isLoggedUser,
  removedByAdmin,
} from "../lib/hooks";
import RemovedByAdmin from "../components/removedbyadmin";

export default function GuestBoard({
  uid,
  reservations,
}: // isRemovedByAdmin,
{
  uid: string;
  reservations: string;
  // isRemovedByAdmin: boolean;
  // DocumentData[]; //RADILO SA string
}) {
  // if (isRemovedByAdmin) return <RemovedByAdmin />;

  const reserv: DocumentData[] =
    // reservations;
    JSON.parse(reservations);
  // console.log(reserv);

  return (
    <Layout>
      {" "}
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
                    // bez obzira na mod, cak i da jeste inace host, ovde je u ulozi guesta
                    //  Kad napravis modove u oba resrvation carda obrati paznju na isHost
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

    var hasPermission: boolean = false;
    // var isRemovedByAdmin: boolean = false;
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      const myUser: DocumentData = docSnap.data();
      if (!isFullyRegisteredUser(myUser)) {
        return {
          redirect: {
            destination: "/profilesettings",
          },
          props: [],
        };
      }
      if (isLoggedUser(myUser) || isHostModeTravel(myUser)) {
        hasPermission = true;
        if (removedByAdmin(myUser)) {
          // isRemovedByAdmin = true;
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
        // isRemovedByAdmin: isRemovedByAdmin,
        // reservations: { ...{ ...querySnapshot.docs } },
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
