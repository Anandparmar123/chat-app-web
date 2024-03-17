"use client";
//----------------= > Message --> senderUID+receiverUID --> senderUID+receiverUID --> timestamp --> Data(object)

import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc as docs,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
import { dbForCollection } from "../../../../firebase";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import Message from "@/app/components/Message";
import { getFirestore, Timestamp, setDoc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { Scrollbar } from "react-scrollbars-custom";
// import { onDocumentCreated } from "firebase-functions/v2/firestore";

// import firebase from "firebase/app";

type paramType = {
  id: string;
};

type arrayData = {
  displayname: string;
  email: string;
  profile: string;
  selected: boolean;
  uid: string;
};

const Page = ({ params }: { params: paramType }) => {
  const { id } = params;
  const [users, setUsers] = useState<arrayData[]>([]);
  const count = useRef(1);
  const [loginUser, setLoginUser] = useState<arrayData>();

  console.log("loginUser=====>", loginUser);
  const [data, setData] = useState<arrayData[]>([]);
  const [userMessage, setUserMessage] = useState<boolean>(false);
  const [msgSend, setMsgSend] = useState<boolean>(false);
  const [msgSend_1, setMsgSend_1] = useState<boolean>(false);
  const [msgSend_2, setMsgSend_2] = useState<boolean>(false);
  const [receiverData, setReceiverData] = useState<arrayData>();

  const [senderId, setSenderId] = useState<string>(id);
  const [receiverId, setReceiverId] = useState<string>("");
  const [combineId, setCombineId] = useState<string>("");

  const senderDataA: string | null = localStorage.getItem("Data");
  const senderData = JSON.parse(senderDataA ? senderDataA : "");
  const [receiveMsg, setReceiveMsg] = useState("1");

  console.log("sjdbfjbhsdf", id);

  // For getting perticular user messsages
  useEffect(() => {
    const getData = async () => {
      let combineId: string = "";

      let res: any = [];
      if (senderId > receiverId) {
        combineId = senderId + receiverId;
      } else {
        combineId = receiverId + senderId;
      }
      console.log("CombineId", combineId);

      const querySnapshot = await getDocs(
        collection(dbForCollection, `message/${combineId}/${combineId}`)
      );
      querySnapshot.forEach((doc) => {
        console.log("Response_111", doc.data());
        res.push(doc.data());
      });
      console.log("RESPONSe====>", res);
      setData([...res]);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgSend, count.current, receiveMsg]);

  // For user Listing
  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(dbForCollection, "users"));
      let a: arrayData[] = [];

      querySnapshot.forEach(async (doc) => {
        console.log("Response", doc.data());

        let docData = doc.data() as arrayData;
        console.log("TYPPPPPPPP", typeof docData.uid, typeof id);
        if (id !== docData.uid) {
          a.push(docData);
        } else {
          console.log("loginUser======>", docData.uid);
          setLoginUser(docData);
        }
      });
      console.log("sdkfjnskjfdns", a);
      setUsers([...a]);
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("DATAAAAAAAAAAAAAAAAA", data);

  // user's messages
  const userClickHandler = async (elem: arrayData) => {
    let combineId: string = "";

    console.log("ReceiverData", elem);
    setUserMessage(true);
    setReceiverData(elem);
    setReceiverId(elem.uid);
    if (senderId > elem.uid) {
      combineId = senderId + elem.uid;
    } else {
      combineId = elem.uid + senderId;
    }
    console.log("kjsgdjfgjsghfd", combineId);

    setCombineId(`${combineId}`);
    setReceiveMsg(`${Math.random() * 10}`);
    // getMessageResponese(elem);
  };

  console.log("DATAAAAA", data);

  // Submit Message handler
  const handleSubmitMessage = async (inp: string) => {
    setMsgSend_1(!msgSend_1);
    setMsgSend(!msgSend);

    console.log("SENDERDATA", senderData, typeof senderData);

    const senderId = senderData.uid;
    const receiverId = receiverData ? receiverData?.uid : "";

    let combineId: string = "";

    if (senderId > receiverId) {
      combineId = senderId + receiverId;
    } else {
      combineId = receiverId + senderId;
    }
    console.log("Condition", senderId > receiverId, combineId);

    await setDoc(
      docs(
        dbForCollection,
        `message/${combineId}/${combineId}`,
        `${Timestamp.now().seconds}`
      ),
      {
        message: inp,
        senderId,
        receiverId,
        timestamp: Timestamp.now().seconds,
        image: "",
        User: { ...senderData },
      }
    );
  };

  console.log("dataaaa", loginUser);
  console.log("receiveMsg", receiveMsg);

  return (
    <div className="mainDiv">
      <div className="divContainer w-full">
        <div className=" header flex justify-between items-center p-2 px-4 z-10 relative shadow-md">
          <div>
            <div className="text-2xl font-bold">Chats{receiveMsg}</div>
          </div>
          <div className="flex items-center">
            <Image
              src={
                loginUser?.profile ? loginUser.profile : "/images/user_11.webp"
              }
              width="50"
              height="50"
              className="userImage border mx-3"
              alt="Picture of the author"
            />

            <div>{loginUser?.displayname}</div>
          </div>
        </div>
        <div className="flex">
          <div className="firstDiv">
            <div className="searchContainer my-3">
              <div className="searchbar p-1 bg-white shadow-md">
                <div className="ms-2">
                  <SearchIcon />
                </div>
                <input
                  placeholder="Search"
                  className="mx-2 flex-1 outline-none me-3 overflow-hidden"
                />
              </div>
            </div>
            <div className=" mt-6">
              <Scrollbar style={{ height: "500px" }}>
                {users.map((elem: arrayData, ind) => {
                  return (
                    <div
                      className={`flex userBox bg-white rounded-xl p-2 me-3 justify-between drop-shadow-md ${
                        users.length === ind + 1 ? "drop-shadow-none" : "mb-3"
                      }`}
                      key={ind}
                      onClick={() => userClickHandler(elem)}
                    >
                      <div className="flex">
                        <div>
                          <Image
                            src={elem ? elem.profile : "/images/user_11.webp"}
                            width={50}
                            height={50}
                            className="userImage rounded border"
                            alt="Picture of the author"
                          />
                        </div>
                        <div className="mx-2 flex flex-col">
                          <div className="font-bold">{elem.displayname}</div>
                          <div>Are we meeting together</div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between me-2">
                        <div>3:14</div>
                        <div className="flex justify-center">
                          <div className="flex justify-center baseCount align-center">
                            <div>1</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Scrollbar>
            </div>
          </div>
          <div className="w-full h-full">
            {userMessage ? (
              <Message
                data={data as any}
                setReceiveMsg={setReceiveMsg as any}
                elem={receiverData as arrayData}
                loginUserData={loginUser as arrayData}
                handleSubmitMessage={handleSubmitMessage as any}
              />
            ) : (
              <div className="flex justify-center items-center">
                <div>
                  <div className="font-bold text-2xl text-center mt-5">
                    Welcome, {loginUser?.displayname}
                  </div>
                  <div className="inline-block"></div>
                  <div>Let{"'"}s start talkig, Great things might happen.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
