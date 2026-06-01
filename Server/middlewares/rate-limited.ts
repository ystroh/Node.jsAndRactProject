import rateLimit from 'express-rate-limit';

// יצירת הגדרה: מקסימום 100 בקשות בכל 15 דקות
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 100, // מגבלה ל-100 בקשות בתוך ה-windowMs
  message: {
    status: "error",
    message: "יותר מדי בקשות, נסה שוב מאוחר יותר"
  },
  standardHeaders: true, // מחזיר מידע על המגבלה ב-Headers של התגובה
  legacyHeaders: false,
});

