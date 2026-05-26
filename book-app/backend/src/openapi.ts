export const openApiSpec = {
    openapi: "3.0.0",
    info: { title: "Book API", version: "1.0.0" },
    paths: {
        "/books": {
            get: {
                summary: "List all books",
                responses: { "200": { description: "Array of books" } },
            },
            post: {
                summary: "Add a book",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "author"],
                                properties: {
                                    title: { type: "string" },
                                    author: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Book created" },
                    "400": { description: "Missing title or author" },
                },
            },
        },
    },
};
