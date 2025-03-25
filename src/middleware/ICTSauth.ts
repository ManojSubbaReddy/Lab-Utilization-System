// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { redirect } from "next/navigation";

// export interface JWTPayload {
//   userId: string;
//   role: string;
//   name?: string;
//   department?: string;
// }

// export async function verifyJWTToken(): Promise<JWTPayload> {
//   // Read cookies from the request (server-side)
//   const cookieStore = cookies();
//   const tokenCookie = cookieStore.get("token");
  
//   if (!tokenCookie || !tokenCookie.value) {
//     redirect("/auth/login");
//   }

  
//   const token = tokenCookie!.value;
//   let decoded: JWTPayload;
  
//   try {
//     // Verify the JWT token using your secret
//     decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
//   } catch (error) {
//     redirect("/auth/login");
//   }
  
//   // Ensure that only ICTSHead users can access the page
//   if (decoded.role !== "ICTS-Lab Manager") {
//     redirect("/auth/login");
//   }
  
//   return decoded;
// }



import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export interface JWTPayload {
  userId: string;
  role: string;
  department?: string;
}

export async function verifyJWTToken(): Promise<JWTPayload> {
  // Await the cookies() call
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie || !tokenCookie.value) {
    redirect("/auth/login");
  }

  const token = tokenCookie.value;
  let decoded: JWTPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
  } catch (error) {
    redirect("/auth/login");
  }

  // Ensure that only the intended role can access
  if (decoded.role !== "ICTS-Lab Manager") {
    redirect("/auth/login");
  }

  return decoded;
}
