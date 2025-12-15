import { Projects, Session, User} from "@/app/_types/types";
import { Users } from "@/db/schema";
import dayjs from "dayjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${Number(process.env.JWT_EXPIRATION_TIME_IN_MINUTES)} mins from now`)
    .sign(key);
}

export async function decrypt(input?: string): Promise<any> {
  if(!input) {
    return 
  }
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}


export async function setSession(sessionObject: Session) {
// Verify credentials && get the user
  // Create the session
  const expires = dayjs().add(Number(process.env.JWT_EXPIRATION_TIME_IN_MINUTES), 'minutes').toDate();
  const session = await encrypt({ ...sessionObject, expires });
  // Save the session in a cookie
 return (await cookies()).set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
 (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session) as Session;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}