import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

interface Book {
    id: number;
    title: string;
    author: string;
}

let books: Book[] = [];
let nextId = 1;

app.get("/books", (req: Request, res: Response) => {
    return res.json(books);
});

app.post("/books", async (req: Request, res: Response) => {
    try {
        const { title, author } = req.body;
        if (!title || !author) {
            return res.status(400).json({ error: "Title and author are required" });
        }
        const newBook: Book = {
            id: nextId++,
            title,
            author,
        };
        books.push(newBook);
        return res.status(201).json(newBook);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/books/:id", (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        const index = books.findIndex((b) => b.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Book not found" });
        }
        books.splice(index, 1);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});