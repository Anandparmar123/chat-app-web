"use client";

// import Image from "next/image";
// import styles from "../../../styles/signup.module.css";
// import TextField from "@mui/material/TextField";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
// import "firebase/compat/firestore";
// import { collection, addDoc, getDocs, doc } from "firebase/firestore";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import db, { auth, imagesRef } from "../../../firebase";
// import { useRouter } from "next/navigation";
////////Chjange
import Image from "next/image";
import styles from "../../../styles/signup.module.css";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Link from "next/link";
import { uploadBytesResumable } from "firebase/storage";
import "firebase/compat/firestore";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { dbForCollection, storage, auth } from "../../../firebase";
import { get } from "http";

//------------------> Table name : users
//------------------> Column : uid , displayname , email , selected(Boolean),profile
//------------------> uid, displayname and email you will get after register user with firebase authentication

const Page = (props: any) => {
  const router = useRouter();

  const [data, setData] = useState<{
    username: string;
    email: string;
    password: string;
  }>({
    username: "",
    email: "",
    password: "",
  });

  const [imageSelect, setImageSelect] = useState(false);
  const [image, setImage] = useState<string>();
  const [file, setFile] = useState<HTMLInputElement | null>();
  const [imgUrl, setImageUrl] = useState("");

  const [error, setError] = useState<string>("");
  const [showErrorField, setShowErrorField] = useState<boolean>(false);

  const [percent, setPercent] = useState<any>();

  console.log("PROPS", props);

  const metadata = {
    contentType: "image/jpeg",
  };

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(dbForCollection, "users"));
      querySnapshot.forEach((doc) => {
        console.log("Identification", doc.id);
        console.log("Response", doc.data());
      });
    };
    getData();
  }, []);

  const onChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const onImageSelect = async (e: any): Promise<void> => {
    console.log("Image", e);

    const files = e.target.files;

    if (files && files[0]) {
      setImage(URL.createObjectURL(files[0]));
      setImageSelect(true);
      setFile(files[0]);

      const storageRef = ref(storage, `images/${files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, files[0]);
      console.log("uploadTask", uploadTask);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + snapshot.totalBytes);
        },
        (error) => {
          console.error("dfsdf");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImageUrl(downloadURL);
          });
        }
      );
    }
  };

  const onSubmit = async () => {
    setShowErrorField(true);

    let uId = "";
    // for create new user
    if (data.username.trim() === "") {
      setError("username");
    } else if (data.email.trim() === "") {
      setError("email");
    } else if (data.password.trim() === "") {
      setError("password");
    } else {
      const dataA = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("LOGINDONE", userCredential);
          uId = await user.uid;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error in create user");
          return;
        });
      console.log("UID", uId);

      let req = {
        uid: uId,
        displayname: data.username,
        email: data.email,
        selected: false,
        profile: imgUrl,
      };
      try {
        const docRef: any = await addDoc(
          collection(dbForCollection, "users"),
          req
        );
        console.log("Document written with ID: ", docRef);
        let id = docRef["_key"].path.segments[1];
        // set username
        // localData["displayName"] = data.username;
        localStorage.setItem("Data", JSON.stringify(req));
        // navigate to signup
        router.push(`/signup/${uId}`);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  console.log("sknfjsbndfj", percent);
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
          <div className={styles.credContainer}>
            <h1 className={styles.h1_text_1}>Sign Up</h1>

            <div className={styles.uploadBtnWrapper}>
              {/* <button className="btn"></button> */}
              {imageSelect ? (
                <Image
                  src={image ? image : ""}
                  alt="image"
                  width={100}
                  height={100}
                  className={styles.imgSelected}
                />
              ) : (
                <Image
                  src={"/images/user_12.webp"}
                  alt="image"
                  width={100}
                  height={100}
                  className={styles.imgLogo}
                />
              )}
              <input
                type="file"
                name="myfile"
                max={5242880}
                accept="image/*"
                // onChange={(e) => handleImage(e)}
                onChange={onImageSelect}
              />
            </div>

            {/* <div className={styles.logoContainer}>
              <input type="file" className="filetype" id="group_image" />
              <Image
                src={"/images/user_12.webp"}
                alt="image"
                width={100}
                height={100}
                className={styles.img}
              />
            </div> */}
            <div className={styles.input_container}>
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                onChange={(e) => onChange("username", e.target.value)}
              />
            </div>
            {showErrorField && error === "username" && (
              <div className={styles.err_msg}>username is required</div>
            )}

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
                SignUp
              </button>
            </div>
            <div className={styles.back_btn_container}>
              <Link href="/signin">
                {" "}
                <div>Back ?</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
