import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import Image from "next/image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
// import storage_2, { storage } from "../../../firebase";
import storage_1 from "firebase/storage";
import { Scrollbar } from "react-scrollbars-custom";

import { getStorage, ref ,uploadBytesResumable,getDownloadURL} from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { doc, onSnapshot } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  doc as docs,
  DocumentData,
} from "firebase/firestore";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import CancelIcon from '@mui/icons-material/Cancel';
import { dbForCollection, storage, auth } from "../../../firebase";

type arrayData = {
  displayname: string;
  email: string;
  profile: string;
  selected: boolean;
  uid: string;
};

//elem as receiver
const Message = (props: {
  elem: arrayData;
  loginUserData: arrayData;
  handleSubmitMessage: (inp: string) => string;
  data: any;
  setReceiveMsg: any;
}) => {
  const [inp, setInp] = useState("");
  const senderId = props?.loginUserData?.uid;
  const senderProfile = props?.loginUserData?.profile;
  const [images, setImages] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  console.log("senderId", senderId);
  console.log("ELEM", props.elem);

  useEffect(() => {
    let combineId: string = "";

    if (senderId > props.elem.uid) {
      combineId = senderId + props.elem.uid;
    } else {
      combineId = props.elem.uid + senderId;
    }
    const q = collection(
      dbForCollection,
      "message",
      `${combineId}`,
      `${combineId}`
    );
    // const q = collection(dbForCollection, "message");
    onSnapshot(q, (snapshot) => {
      console.log("skjjdnfsdfkjnjnsdkjhnj", combineId);
      props.setReceiveMsg(`${Math.random() * 10}`);

      snapshot.docChanges().forEach((change) => {
        console.log("OnSnapShotData", change);
        console.log("New city: ", change.doc.data());
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.elem]);

  // useEffect(() => {
  //   storage_2()
  //     .ref("/" + "FA984B65-38D4-44B1-BF02-4E7EF089773B.jpg") //name in storage in firebase console
  //     .getDownloadURL()
  //     .then((url) => {
  //       setImageUrl(url);
  //     })
  //     .catch((e) => console.log("Errors while downloading => ", e));
  // }, []);
  console.log("ReceiverDetails===>", props.elem);

  const enterKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setInp("");
      props.handleSubmitMessage(inp);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("eveent===>", e);
    const files = e.target.files;
    if (files && files[0]) {
      setImgUrl(URL.createObjectURL(files[0]));

      const storageRef = ref(storage, `images/${files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, files[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + snapshot.totalBytes);
        },
        (error) => {
          console.error(error);
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

  

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onImageSubmit = () =>{
    
  }

  return (
    <div className="secondDiv h-full">
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          className="imageModal"
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box className="boxContainer">
            <div className="imageContainer">
              <Image
                src={imgUrl}
                width={200}
                height={200}
                className=" rounded border"
                alt="Picture of the author"
              />
              <Button variant="contained" size="small" className="sendModalBtn" onClick={onImageSubmit}>Send</Button>
              <CancelIcon className="closeIcon" onClick={handleClose}/>
            </div>
          </Box>
        </Modal>
      </div>
      <div className="userProfile flex p-4 shadow-md">
        <div className="imageContainer">
          <Image
            src={props?.elem?.profile}
            width={50}
            height={50}
            className="userImage rounded border"
            alt="Picture of the author"
          />
          
        </div>
        <div>
          <div className="mx-3 flex flex-col">
            <div className="font-bold">{props?.elem?.displayname}</div>
            <div>Last seen 3 hours ago</div>
          </div>
        </div>
      </div>
      <div className="messageContainer">
        <Scrollbar style={{ height: "500px" }}>
          {props?.data?.map((elem: any, ind: any) => {
            console.log("DATAAAaskjfskjfs====>", elem.senderId == senderId);
            return elem.senderId == senderId ? (
              <div key={ind} className={`flex flex-row-reverse m-4 w-full`}>
                <div
                  className={`flex flex-row-reverse m-4 w-4/6 ${
                    props.data.length == ind + 1 && "pb-8"
                  }`}
                >
                  <div>
                    <Image
                      src={senderProfile}
                      width={50}
                      height={50}
                      className="userImage rounded border mx-2"
                      alt="Picture of the author"
                    />
                  </div>
                  <div className="shadow-md rounded ms-2 flex content-start p-2">
                    <div>{elem?.message}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={ind}
                className={`flex m-4 w-4/6 ${
                  props.data.length == ind + 1 && "pb-8"
                }`}
              >
                <div>
                  <Image
                    src={props?.elem?.profile}
                    width={50}
                    height={50}
                    className="userImage rounded border"
                    alt="Picture of the author"
                  />
                </div>
                <div className="shadow-md rounded ms-2 flex content-start p-2">
                  <div>{elem?.message}</div>
                </div>
              </div>
            );
          })}
        </Scrollbar>
      </div>
      <div className="sendMessage footer bg-white shadow-inner  w-full ">
        <div className="forImagePurpose"></div>
        <div className="flex inpCoppntainer border my-4 mx-5">
          <div className="alignCenter w-full justify-between">
            <div className="flex w-full">
              <div className=" alignCenter relative">
                <AttachFileIcon className="sentFile cursor-pointer m-2" />
                <input
                  className="file"
                  type="file"
                  onChange={(e) => {
                    handleOpen();
                    onImageChange(e);
                  }}
                />
              </div>
              <div className="inputField mx-2 w-full flex ">
                <input
                  placeholder="Type a message here"
                  className="w-full outline-none"
                  value={inp}
                  onKeyDown={(e) => enterKeyPress(e)}
                  onChange={(e) => setInp(e.target.value)}
                />
              </div>
            </div>
            <div className="submitBtnContainer">
              <SendIcon
                className="submitBtn"
                onClick={() => {
                  setInp("");
                  // scrollToBottom()
                  if (inp.trim() !== "") {
                    props.handleSubmitMessage( inp);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
