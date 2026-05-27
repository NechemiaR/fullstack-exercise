import express, { Request, Response } from "express";
import { pool } from "./db.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi.js";

const app = express();

const PORT = process.env.PORT || 3000;

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
if (!AI_SERVICE_URL) {
  throw new Error("AI_SERVICE_URL is required");
}

app.use(express.json());
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/books", async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query("SELECT * FROM books ORDER BY id");
        return res.json(rows);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/books", async (req: Request, res: Response) => {
    try {
        const { title, author } = req.body;
        if (!title || !author) {
            return res.status(400).json({ error: "Title and author are required" });
        }
        const result = await pool.query(
            "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
            [title, author]
        );
        const book = result.rows[0];

        const aiResponse = await fetch(`${AI_SERVICE_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
        });
        const analysis = await aiResponse.json();

        return res.status(201).json({ ...book, analysis });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/books/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *",[id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});