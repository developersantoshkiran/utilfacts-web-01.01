
import { CreateEmailResponseSuccess, Resend } from 'resend';
let resend = new Resend(process.env.RESEND_API_KEY)
export async function EmailService(from: string, to: Array<string>, sub: string, emailTemplate: any, tempateProps: Record<string, any>, cc: Array<string> = []): Promise<CreateEmailResponseSuccess | null> {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: sub,
      react: emailTemplate(tempateProps),
      cc
    });

    if (error) {
      throw new Error(error.message)
    }
    return data;
  } catch (e) {
    console.log(e)
    throw new Error('Error in email Service');
  }

}