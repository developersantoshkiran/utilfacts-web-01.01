
import { OTP, Users } from "@/db/schema";
import { db } from "./dbconnection";
import { eq } from "drizzle-orm";
import moment from "dayjs";
import { generate } from "otp-generator";
import { EmailService } from "./email/emailservice";
import { OTPTemplate } from "./email/OTPTemplate";
import dayjs from "dayjs";

export async function OTPService( phoneNumber:string, email?:string) {
    if (!phoneNumber) {
        throw new Error('Phone Number is Required');
    }
    //if OTP is already generated. return generated OTP;
    const results = await db.select().from(OTP).where(eq(OTP.mobile, phoneNumber)).orderBy(OTP.createdAt).limit(1)
  
    if (results && results[0]  && (dayjs(results[0].createdAt).add(Number(process.env.OTP_RESEND_TIME_IN_SECONDS), 'seconds').toDate() > new Date())) {
        throw new Error('otp already sent sent. Please wait');
    }

    //get email from phonenumber
    if (!email) {
        const results = await db.select({ email: Users.email }).from(Users).where(eq(Users.mobile, phoneNumber))
        if (results.length) {
            email = results[0].email
        }
    }
    if (!email) {
        throw new Error('cant find email assigned to phonenumber', { cause: { code: 404 } });
    }

    let validTill = moment().add(Number(process.env.OTP_EXPIRE_TIME_IN_SECONDS), 'seconds').toDate()
    try {
        let otp = generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const res = await EmailService('no-reply@utilfacts.com', [email as string], "OTP for utilfacts", OTPTemplate, { otp });
        if (res?.id) {
            return await db.insert(OTP).values([{
                email: email,
                mobile: phoneNumber,
                validTill,
                sentEmailreferenceId: res.id,
                otp: Number(otp)
            }]).returning({ id: OTP.id })
        }

        return;
    } catch (e) {
        console.log(e)
         throw new Error('Some thing went wrong');
    }
}