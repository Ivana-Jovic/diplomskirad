import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [myUser, setMyUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, "token", token, {});
        // console.log("!!!!!!!!!!!", user);
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
          console.log("firebase - Document data:", docSnap.data());

          // myUser.current = docSnap.data();
          setMyUser(docSnap.data());
        } else {
          console.log("firebase - No such document!", user.uid);
        }
      } else {
        // User is signed out
        setUser(null);
        setMyUser(null);
        nookies.set(undefined, "token", "", {});
      }
    });

    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider value={{ user, myUser }}>
      {children}
    </AuthContext.Provider>
  );
};
