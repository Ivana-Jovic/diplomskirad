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
}: {
  uid: string;
  reservations: string;
}) {
  const reserv: DocumentData[] = JSON.parse(reservations);

  return (
    <Layout>
      {" "}
      <div className=" flex flex-col max-w-7xl mx-auto px-8 sm:px-16">
        <div>
          <div className="pt-7 pb-5 text-center text-3xl font-bold">
            My reservations
          </div>
          <div className="grid  lg:grid-cols-2 grid-cols-1 gap-4 ">
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
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

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
    return {
      redirect: {
        destination: "/",
      },
      props: [],
    };
  }
}
