"use client";

import Image from "next/image";
import styles from "../../../styles/login.module.css";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Link from "next/link";

import { auth, dbForCollection, db } from "../../../firebase";
import { getFirestore, getDocs, doc, addDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
// import { doc, onSnapshot } from "firebase/firestore";

import { useRouter } from "next/navigation";
// import db from "../../../firebase";

import { collection, query, where, onSnapshot } from "firebase/firestore";

const Page = () => {
  const [data, setData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showErrorField, setShowErrorField] = useState<boolean>(false);

  const router = useRouter();

  console.warn("PageLoad");

  const q = collection(dbForCollection, "ppp");

  // onSnapshot(q, (snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
  //     console.log("OnSnapShotData", change);
  //     console.log("New city: ", change.doc.data());
  //   });
  // });

  // useEffect(()=>{
  //   const addTodo = async() => {
  //     const data = fetch("/api/postdata", {
  //       method: "POST"
  //     })
  //     console.log("POST",data)
  //   };
  //   addTodo()
  // },[])

  useEffect(() => {
    const addTodo = async () => {
      const data = await fetch("/api/postdata", {
        method: "POST",
        body: JSON.stringify({ name: "Sanjay" }),
      });
      console.log(data);
    };
    addTodo();
  }, []);

  // useEffect(() => {
  //   const addTodo = async () => {
  //     const data = await fetch("/api/getdata");
  //     console.log(data);
  //   };
  //   addTodo();
  // }, []);

  // useEffect(() => {
  //   const getData = async () => {
  //     const querySnapshot = await getDocs(collection(db, "users"));
  //     querySnapshot.forEach((doc) => {
  //       console.log("Identification", doc.id);
  //       console.log("Response", doc.data());
  //     });
  //   };
  //   getData();
  // }, []);

  const onChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  // useEffect(() => {
  //   createUserWithEmailAndPassword(auth, "tristate.mteam@gmail.com", "tristate123")
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       console.log("LOGINDONE",userCredential)
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // }, []);

  const onSubmit = async () => {
    const docRef: any = await addDoc(collection(dbForCollection, "ppp"), {
      name: data.email,
    });

    console.log("DATA", data);
    setShowErrorField(true);
    if (data.email.trim() === "") {
      setError("email");
    } else if (data.password.trim() === "") {
      setError("password");
    } else {
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential: any) => {
          // Signed in
          const user = userCredential.user.providerData[0];
          console.log("userCredential", userCredential);
          console.log("RES", user);
          user["uid"] = userCredential.user.uid;

          // const userBody = {
          //   uid:user.uid,
          //   displayname:user.
          // }
          localStorage.setItem("Data", JSON.stringify(user));

          router.push(`/signup/${userCredential.user.uid}`);

          // const data = fetch("/api/postdata", {
          //   method: "POST",
          //   body:JSON.stringify({name:"pankil"})
          // });
          // console.log("postDataRes", data);
        })
        .catch((error: any) => {
          console.log("ERROR", error);
          alert("Please provide correct creadentials");
        });
    }
  };

  return (
    <>
      <div className={styles.bg_body}>
        <div className={styles.main_div}>
          <div className={styles.img_container}>
            <Image
              src={"/images/chat.webp"}
              alt="image"
              width={1000}
              height={1000}
              className={styles.img}
            />
          </div>
          <div className={styles.cred_container}>
            <h1 className={styles.h1_text}>Sign In</h1>
            <div className={styles.input_container}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                onChange={(e) => onChange("email", e.target.value)}
              />
            </div>
            {showErrorField && error === "email" && (
              <div className={styles.err_msg}>email is required</div>
            )}
            <div className={styles.input_container}>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                onChange={(e) => onChange("password", e.target.value)}
              />
            </div>
            {showErrorField && error === "password" && (
              <div className={styles.err_msg}>password is required</div>
            )}

            <div className={styles.btn_container}>
              <button className={styles.login_btn} onClick={onSubmit}>
                Sign In
              </button>
            </div>
            <div className={styles.btn_container}>
              <button className={styles.forgot_btn}>
                <Link
                  // href="/pages/signup"
                  href={{
                    pathname: "/signup",
                  }}
                >
                  <p className="cp">Sign Up</p>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
