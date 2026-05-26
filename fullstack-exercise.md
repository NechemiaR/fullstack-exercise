# 🎯 תרגיל מסכם — אפליקציית פול-סטאק

פרויקט קטן שמשלב את **כל** מה שעברת: TypeScript, React, Node, FastAPI, Docker, ו-CI/CD.
בנוי בשלבים מדורגים — אחרי כל שלב יש לך משהו עובד. אפשר לעצור בכל נקודה.

> **הרעיון:** אפליקציית "ספריית ספרים" — מוסיפים ספרים, רואים רשימה, ומקבלים "ניתוח" קצר על ספר משירות AI.

---

## 🗺️ התמונה הכוללת

```
React (frontend)  ──HTTP──►  Node (backend)  ──SQL──►  Postgres
                                   │
                                   └──HTTP──►  FastAPI (שירות ניתוח)
```

הכל רץ ב-Docker, מחובר ב-docker-compose, ועובר דרך CI בכל push.

---

## שלב 0 — הכנה

- [ ] צור תיקיית פרויקט עם המבנה הבא:

```
book-app/
  frontend/        # React + TypeScript
  backend/         # Node + Express + TypeScript
  ai-service/      # FastAPI
  docker-compose.yml
  .github/workflows/ci.yml
```

- [ ] אתחל git: `git init`
- [ ] צור repo ריק ב-GitHub ותחבר אותו

---

## שלב 1 — Backend בסיסי (Node + TypeScript + Express)

**מטרה:** שרת API שמחזיר רשימת ספרים מהזיכרון (עדיין בלי DB).

- [ ] אתחל פרויקט: `npm init -y` והתקן `express`, `cors`, `typescript`, `@types/express`, `@types/node`, `tsx`
- [ ] צור `tsconfig.json` בסיסי
- [ ] הגדר `interface Book` עם: `id: number`, `title: string`, `author: string`
- [ ] בנה את ה-endpoints:
  - [ ] `GET /books` — מחזיר מערך ספרים (כרגע ממערך בזיכרון)
  - [ ] `POST /books` — מקבל `{ title, author }`, מוסיף למערך, מחזיר את הספר עם id
- [ ] הוסף `cors()` ו-`express.json()` כ-middleware
- [ ] הוסף `try/catch` בכל route אסינכרוני

**מה תרגלת:** בלוק 1 (interface, types), בלוק 3 (Express, middleware, CORS, Node+TS)

**בדיקה:** הרץ את השרת ושלח בקשות עם `curl` או Postman.

```bash
curl http://localhost:3000/books
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Herbert"}'
```

---

## שלב 2 — Frontend (React + TypeScript)

**מטרה:** ממשק שמציג את הספרים ומאפשר להוסיף.

- [ ] צור אפליקציית React עם TypeScript (Vite: `npm create vite@latest frontend -- --template react-ts`)
- [ ] הגדר `interface Book` (אותו מבנה כמו ב-backend — שווה לשתף!)
- [ ] בנה קומפוננטת `BookList` שמקבלת `books: Book[]` כ-prop ומציגה אותם (עם `key`!)
- [ ] בנה קומפוננטת `AddBookForm`:
  - [ ] state ל-`title` ו-`author` (controlled inputs)
  - [ ] `onAddBook` כ-prop (פונקציה שזורמת מההורה)
  - [ ] `handleSubmit` עם `e.preventDefault()` וולידציה
- [ ] בקומפוננטת `App`:
  - [ ] state ל-`books` (`useState<Book[]>([])`)
  - [ ] `useEffect` שטוען את הספרים מה-backend ב-mount
  - [ ] state ל-`loading` + conditional rendering ("טוען...")
  - [ ] פונקציה שמוסיפה ספר (POST ל-backend, ואז מעדכנת state)

**מה תרגלת:** בלוק 2 כולו (components, props, state, useEffect, controlled inputs, React+TS)

**בדיקה:** הוסף ספר בטופס וודא שהוא מופיע ברשימה ונשמר ב-backend.

---

## שלב 3 — מסד נתונים (Postgres)

**מטרה:** להחליף את המערך בזיכרון במסד נתונים אמיתי.

- [ ] התקן `pg` ב-backend
- [ ] צור `Pool` עם `connectionString: process.env.DATABASE_URL`
- [ ] כתוב migration ראשון שיוצר טבלת `books`
- [ ] עדכן את ה-endpoints להשתמש ב-`pool.query`:
  - [ ] `GET` — `SELECT * FROM books`
  - [ ] `POST` — `INSERT ... VALUES ($1, $2) RETURNING *` ← **placeholders! לא שרשור!**
- [ ] ודא `try/catch` סביב כל שאילתה

**מה תרגלת:** בלוק 5 (משתני סביבה), הדוגמה של backend+DB, migrations, אבטחת SQL

**⚠️ נקודת אבטחה:** לעולם אל תשרשר ערכי משתמש ל-SQL. תמיד `$1`, `$2`.

---

## שלב 4 — שירות AI (FastAPI)

**מטרה:** שירות Python נפרד שמקבל ספר ומחזיר "ניתוח" קצר.

- [ ] צור פרויקט FastAPI עם `fastapi` ו-`uvicorn`
- [ ] הגדר `Pydantic model` בשם `BookInput` עם `title: str`, `author: str`
- [ ] הגדר `Pydantic model` בשם `Analysis` עם `summary: str`, `word_count: int`
- [ ] בנה `POST /analyze` שמקבל `BookInput` ומחזיר `Analysis`
  - (הניתוח יכול להיות פשוט — למשל ספירת אותיות בכותרת + משפט גנרי. זה תרגיל מבנה, לא AI אמיתי)
- [ ] בדוק את התיעוד האוטומטי ב-`/docs` (Swagger!)
- [ ] חבר מה-backend: כש-Node מקבל POST על ספר, הוא קורא ל-FastAPI ומצרף ניתוח

**מה תרגלת:** בלוק 4 כולו (FastAPI, Pydantic, response_model, Swagger), תקשורת בין שירותים

**בדיקה:** היכנס ל-`http://localhost:8000/docs` ונסה את ה-endpoint ישר מהדפדפן.

---

## שלב 5 — Docker (containerize הכל)

**מטרה:** כל שירות בקונטיינר, הכל רץ בפקודה אחת.

- [ ] כתוב `Dockerfile` ל-`frontend` (זכור: COPY package.json קודם, אז npm install, אז שאר הקוד)
- [ ] כתוב `Dockerfile` ל-`backend`
- [ ] כתוב `Dockerfile` ל-`ai-service`
- [ ] כתוב `docker-compose.yml` עם 4 שירותים:
  - [ ] `frontend` (build, ports)
  - [ ] `backend` (build, ports, environment עם DATABASE_URL, depends_on: db)
  - [ ] `ai-service` (build, ports)
  - [ ] `db` (image: postgres, environment, volume לשמירת מידע)
- [ ] ודא שה-backend פונה ל-DB לפי שם השירות (`@db:5432`) ול-AI לפי `http://ai-service:8000`
- [ ] הוסף `volumes` לפיתוח (hot reload)

**מה תרגלת:** בלוק 5 כולו (Dockerfile, compose, networking לפי שם שירות, volumes)

**בדיקה:**
```bash
docker compose up
# כל הסטאק עולה — פתח את ה-frontend בדפדפן וודא שהכל מחובר
```

---

## שלב 6 — CI/CD (GitHub Actions)

**מטרה:** כל push בודק את הקוד אוטומטית.

- [ ] צור `.github/workflows/ci.yml`
- [ ] הגדר טריגר `on: push` ל-main ו-`pull_request`
- [ ] job שבודק את ה-backend:
  - [ ] checkout + setup-node
  - [ ] `npm install`
  - [ ] `npx tsc --noEmit` (בדיקת טיפוסים)
  - [ ] טסטים (אם כתבת)
- [ ] (בונוס) job שבונה את ה-Docker images
- [ ] (בונוס) job עם `needs:` שרץ רק אם הבדיקות עברו
- [ ] דחוף ל-GitHub וצפה ב-Actions רץ אוטומטית

**מה תרגלת:** בלוק 6 (CI/CD, GitHub Actions, pipeline, needs)

**בדיקה:** דחוף קוד עם שגיאת טיפוס בכוונה — ראה את ה-CI נכשל באדום. תקן — ראה אותו עובר בירוק.

---

## 🏆 אתגרי בונוס (אם נשאר כוח)

- [ ] **שיתוף טיפוסים** — הוצא את `interface Book` לתיקיית `shared/` שגם frontend וגם backend משתמשים בה
- [ ] **Custom hook** — חלץ את לוגיקת הטעינה ב-React ל-`useBooks()` hook
- [ ] **מחיקה** — הוסף `DELETE /books/:id` וכפתור מחיקה ב-UI
- [ ] **multi-stage build** — הפוך את ה-Dockerfile של ה-backend ל-multi-stage
- [ ] **error handling** — הוסף error handler מרכזי ב-Express (4 פרמטרים)
- [ ] **loading states** — הוסף אינדיקציית טעינה גם בעת הוספת ספר

---

## 📋 מפת הקישור — איזה שלב מתרגל מה

| שלב | בלוקים שמתרגלים |
|-----|------------------|
| 1. Backend | TypeScript, Node, Express, middleware |
| 2. Frontend | React (הכל), React+TS |
| 3. DB | משתני סביבה, SQL מאובטח, migrations |
| 4. FastAPI | Python, Pydantic, async, Swagger |
| 5. Docker | Dockerfile, compose, networking, volumes |
| 6. CI/CD | GitHub Actions, pipeline |

---

## 💡 טיפים לתרגול

- **אל תנסה לבנות הכל בבת אחת.** סיים שלב, ודא שהוא עובד, ורק אז המשך. כל שלב נותן משהו רץ.
- **כשנתקע — חזור לנושא הרלוונטי.** העמודה הימנית בטבלה מפנה אותך.
- **השתמש ב-`/docs` של FastAPI ובלוגים של Docker** — הם החברים הכי טובים שלך לדיבוג.
- **commit קטן ותכוף.** כל שלב = commit לפחות. ככה גם תתרגל git workflow אמיתי.
- **המטרה היא לקבע מושגים, לא להגיש מוצר מושלם.** אם הניתוח של ה-AI מטופש — מצוין, זה רק תרגיל מבנה.

בהצלחה! 🚀 כשתסיים את זה, תהיה במצב מצוין למשרה.
