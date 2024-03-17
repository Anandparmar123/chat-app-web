import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { signInWithEmailAndPassword } from "firebase/auth";

//  import { auth } from 'firebase/auth'
export async function POST(request: NextRequest) {
  const res = await request.json();
  console.log("bodyResponse", res);
  console.log("POST METHOD");

  return NextResponse.json({ name: "anand" });
}
// signInWithEmailAndPassword(email,pass,auth)
