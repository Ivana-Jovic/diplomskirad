import { onAuthStateChanged, User } from "firebase/auth";
import { doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore";
import React, { createContext, useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";
import nookies from "nookies";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

type ContextType = {
  user: null | undefined | User;
  myUser: DocumentData | undefined;
  setHostModeHostC: React.Dispatch<React.SetStateAction<boolean>>;
  hostModeHostC: boolean;
  // loading: boolean;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};
export const AuthContext = createContext<ContextType>({
  user: undefined,
  myUser: null,
  // loading: false,
  setHostModeHostC: () => {},
  hostModeHostC: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, loading] = useAuthState(auth);
  const [myUser, setMyUser] = useState<DocumentData | undefined>(undefined);
  const [hostModeHostC, setHostModeHostC] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe;
    async function helper() {
      if (user) {
        // User is signed in
        const token = await user.getIdToken();

        nookies.set(undefined, "token", token, {});
        const ref = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(ref, (doc) => {
          setMyUser(doc.data());
          console.log(doc.data());
        });
      } else {
        // User is signed out
        setMyUser(null);
        nookies.set(undefined, "token", "", {});
      }
    }
    helper();
    return unsubscribe;
  }, [user]);
  useEffect(() => {
    if (myUser && myUser.host)
      toast.success(hostModeHostC ? "Mode: host" : "Mode: travel");
  }, [hostModeHostC, myUser]);
  // const [user, setUser] = useState<User | null | undefined>(null);
  // const [myUser, setMyUser] = useState<any>(null);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       // User is signed in
  //       const token = await user.getIdToken();
  //       setUser(user);
  //       nookies.set(undefined, "token", token, {});
  //       // console.log("!!!!!!!!!!!", user);
  //       const docSnap = await getDoc(doc(db, "users", user.uid));

  //       if (docSnap.exists()) {
  //         console.log("firebase - Document data:", docSnap.data());

  //         // myUser.current = docSnap.data();
  //         setMyUser(docSnap.data());
  //       } else {
  //         console.log("firebase - No such document!", user.uid);
  //       }
  //     } else {
  //       // User is signed out
  //       setUser(null);
  //       setMyUser(null);
  //       nookies.set(undefined, "token", "", {});
  //     }
  //   });

  //   return unsubscribe;
  // }, []);
  const u: ContextType = {
    user,
    myUser,
    setHostModeHostC,
    hostModeHostC,
    // , loading };
  };
  return (
    <AuthContext.Provider value={u}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
