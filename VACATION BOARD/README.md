# לוח החופש

לוח חופש שיתופי למשפחה עם תאריך עברי, ענפי משפחה, צבעים אישיים ופעילויות קיץ.

## הרצה

```bash
npm install
npm run dev
```

## שמירה משותפת (Google Sheets)

הוראות מלאות ב־[`apps-script/README.md`](./apps-script/README.md).

בקצרה: יוצרים גיליון → מדביקים את `apps-script/Code.gs` ב־Apps Script → מפרסמים Web App → מדביקים את הכתובת בלוח (כפתור Sheets).

## GitHub Pages

https://chepti.github.io/KolMini/  
(Settings → Pages → Source: GitHub Actions)

## יכולות

- תאריכים עבריים + לועזיים על הלוח
- ענפי משפחה (למשל משפחת בן ארצי) עם ילדים
- הצגה/הסתרה של ענף שלם או אדם בודד
- בחירת צבע לכל אחד
- אירועים ליום אחד (פילים: בוקר / צהריים / ערב) או לכמה ימים (פס צבעוני)
- סימון משתתפים: כולם / ענף / אנשים ספציפיים
- שמירה אוטומטית ב-localStorage
