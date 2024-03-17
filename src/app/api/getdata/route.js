import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../../../firebase";

const firestore = getFirestore(app);

import { NextResponse } from "next/server";

export async function GET(req, res) {
  const snapshot = await getDocs(collection(firestore, "users"));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // console.log("DATAAAAAAAAAAAAA", data);

  return NextResponse.json({ data: { name: "anand" } }, { status: 200 });
}

// export {handler as GET}
