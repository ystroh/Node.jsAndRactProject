import nodemailer from 'nodemailer';

// הגדרת החיבור לשרת המיילים (כאן בדוגמה עם Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // כתובת המייל של המערכת שלכן
    pass: process.env.EMAIL_PASS  // סיסמת אפליקציה (App Password) שיוצרים בחשבון גוגל
  }
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// פונקציה גנרית לשליחת מייל
export const sendEmail = async ({ to, subject, text, html }: ISendEmailOptions) => {
  const mailOptions = {
    from: `"מערכת שיתוף חפצים" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`מייל נשלח בהצלחה אל: ${to}. מזהה הודעה: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('שגיאה בשליחת המייל:', error);
    throw error;
  }
};