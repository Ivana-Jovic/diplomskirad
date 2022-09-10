import { doc, DocumentData, getDoc } from "firebase/firestore";
import Link from "next/link";
import Layout from "../components/layout";
import { db } from "../firebase";
import { isAdmin } from "../lib/hooks";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseadmin";
import { useState } from "react";
import SimpleBackdrop from "../components/backdrop";

export default function IndexAdmin() {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Layout>
      {loading && <SimpleBackdrop loading={loading} />}
      <div className="mt-20 flex flex-col mx-auto max-w-md  px-8 sm:px-16  text-center gap-4 ">
        <Link href="/profilesettings">
          <a className="btn" onClick={() => setLoading(true)}>
            Profile
          </a>
        </Link>

        <Link href="/adminboard">
          <a className="btn" onClick={() => setLoading(true)}>
            Admin board
          </a>
        </Link>

        <Link href="/faq">
          <a className="btn" onClick={() => setLoading(true)}>
            FAQ
          </a>
        </Link>
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=100"
  );
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

    return {
      props: {},
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
