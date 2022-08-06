import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const myUser = useRef < any > null;
  const [myUser, setMyUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
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
      }
    });
  }, []);
  // useEffect(() => {
  //   console.log("!!first", user);
  //   auth.onAuthStateChanged(setUser);
  //   console.log("!!sec", user);
  // }, []);
  return (
    <AuthContext.Provider value={{ user, myUser }}>
      {children}
    </AuthContext.Provider>
  );
};
