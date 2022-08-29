import { onAuthStateChanged, User } from "firebase/auth";
import { doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore";
import React, { createContext, useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";
import nookies from "nookies";
type ContextType = {
  user: User | null | undefined;
  myUser: any;
};
type AuthProviderProps = {
  children?: React.ReactNode;
};
export const AuthContext = createContext<ContextType>({
  user: null,
  myUser: null,
});
import { useAuthState } from "react-firebase-hooks/auth";
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user] = useAuthState(auth);
  const [myUser, setMyUser] = useState<DocumentData | undefined>(undefined);
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
  return (
    <AuthContext.Provider value={{ user, myUser }}>
      {children}
    </AuthContext.Provider>
  );
};
