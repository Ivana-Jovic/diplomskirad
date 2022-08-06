import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import Button from "../components/button";
import ImageForm from "../components/imageform";
import Inputs from "../components/inputs";
import Layout from "../components/layout";
import { db, storage } from "../firebase";
import { AuthContext } from "../firebase-authProvider";
import { useRouter } from "next/router";

//TODO proveri svuda za  auth.currentUser da li ostaje ili na neki drugi nacin
export default function ProfileSettings() {
  const { user, myUser } = useContext(AuthContext);
  const router = useRouter();

  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [usernameState, setUsernameState] = useState<string>("");

  const [firstName, setFirstName] = useState<string>("");
  const [secondName, setSecondName] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const allowedTypes = ["image/png", "image/jpeg"];

  useEffect(() => {
    if (user) {
      setEmailState(user.email);
    }
    if (myUser) {
      if (myUser.username) setUsernameState(myUser.username);
      if (myUser.passwordState) setPasswordState(myUser.passwordState);
      //TOD: vidi za pass, posto se ne cuva u users colekciji pravi problem ya dugme plus trebalo bi da se ispisuje stari ili sta vec
      if (myUser.firstName) setFirstName(myUser.firstName);
      if (myUser.secondName) setSecondName(myUser.secondName);
      if (myUser.photoURL) setUrl(myUser.photoURL);
      console.log("{{{{{{{{{{{{{{", myUser.username);
    }
  }, [user, myUser]); //TODO VIDI DA LI OVOR Radi

  useEffect(() => {
    //MOZDA JE VSIAK
    if (url) {
      setFile(null);
      console.log("klll");
    }
  }, [url]);

  const changeHandler = (e: any) => {
    const selected: File = e.target.files[0];

    if (selected && allowedTypes.includes(selected.type)) {
      setFile(selected);
      const nn: string = "ppp-" + selected.name;
      const storageRef = ref(storage, nn); //ref to file. file dosnt exist yet
      //when we upload using this ref this file should have that name
      const uploadTask = uploadBytesResumable(storageRef, selected);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(
            "zdravo"
            // +(snapshot.bytesTransferred / snapshot.totalBytes) * 100 +"%"
          );
        },
        (err) => {
          console.log("ovo je greska");
          setError(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((urll) => {
            setUrl(urll);
          });
        }
      );
      setError("");
    } else {
      setFile(null);
      setError("Please select an image file (png or jpeg)");
    }
  };

  const changeProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //TODO update email, password and other
    // if (auth.currentUser && auth.currentUser?.email != emailState) {
    //   updateEmail(auth.currentUser, emailState)
    //     .then(() => {
    //       console.log("email updated");
    //     })
    //     .catch((error) => {
    //       console.log("ERROR in email updated ", error.message);
    //       const credential = promptForCredentials();
    //       if (auth.currentUser)
    //       reauthenticateWithCredential(auth.currentUser, credential)
    //         .then(() => {
    //           // User re-authenticated.
    //         })
    //         .catch((error) => {
    //           console.log("ERROR in email updated reauth ", error.message);
    //         });
    //     });
    // }
    // if (auth.currentUser && auth.currentUser?.displayName != usernameState) {
    // updateProfile(auth.currentUser, {
    //   displayName: usernameState,
    // })
    //   .then(() => {
    //     console.log("username updated");
    //   })
    //   .catch((error) => {
    //     console.log("ERROR in username updated ", error.message);
    //   });
    // }
    // if (auth.currentUser && auth.currentUser?.photoURL != url) {//NEMA NACINA DA VIDIM U BAZI
    //   updateProfile(auth.currentUser, {
    //     photoURL: url,
    //   })
    //     .then(() => {
    //       console.log("photo updated");
    //     })
    //     .catch((error) => {
    //       console.log("ERROR in photo updated ", error.message);
    //     });

    // update username
    if (user && myUser.username != usernameState) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        username: usernameState,
      }).catch((err) => {
        console.log("ERROR ", error.message);
      });
    }

    // update profile pic
    if (user && myUser.photoURL != url) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        photoURL: url,
      }).catch((err) => {
        console.log("ERROR ", error.message);
      });
    }

    // update first name
    if (user && myUser.firstName != firstName) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        firstName: firstName,
      }).catch((err) => {
        console.log("ERROR ", error.message);
      });
    }

    // update second name
    if (user && myUser.secondName != secondName) {
      const docRef = await updateDoc(doc(db, "users", user.uid), {
        secondName: secondName,
      }).catch((err) => {
        console.log("ERROR ", error.message);
      });
    }
  };
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 sm:px-16  ">
        <div>hello {user?.email}</div>
        <form onSubmit={changeProfile} name="submitFormName">
          <Inputs
            item={firstName}
            setItem={setFirstName}
            placeholder=""
            text="first name"
            type="text"
          />
          <Inputs
            item={secondName}
            setItem={setSecondName}
            placeholder=""
            text="second name"
            type="text"
          />
          <Inputs
            item={emailState}
            setItem={setEmailState}
            placeholder=""
            text="email"
            type="email"
          />
          <Inputs
            item={passwordState}
            setItem={setPasswordState}
            placeholder="enter new password"
            text="password"
            type="password"
          />
          <Inputs
            item={usernameState}
            setItem={setUsernameState}
            placeholder=""
            text="username"
            type="text"
          />

          {!file && <input type="file" onChange={changeHandler} />}
          {file && <p>Storing image...</p>}
          {error && <div>{error}</div>}
          <div className="grid justify-items-center  mx-auto">
            {url && <ImageForm url={url} />}
          </div>
          <div>
            {(!emailState ||
              !passwordState ||
              !usernameState ||
              !url ||
              !firstName ||
              !secondName) && ( // hover:shadow-xl
              <div
                className="my-5 mx-auto  text-center shadow-md  p-3
          
              text-lg sm:text-2xl font-semibold rounded-lg "
              >
                Please fillout every field.
              </div>
            )}
            {emailState &&
              passwordState &&
              usernameState &&
              url &&
              firstName &&
              secondName && (
                <Button
                  type="submit"
                  text="Update info"
                  action={() => {
                    router.push({
                      pathname: "/",
                    });
                  }}
                />
              )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
