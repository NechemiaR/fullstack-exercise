from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Book AI Service")

class BookInput(BaseModel):
    title: str
    author: str

class Analysis(BaseModel):
    summary: str
    word_count: int

@app.post("/analyze", response_model=Analysis)
def analyze(book: BookInput) -> Analysis:
    # build summary and word_count from book.title / book.author
    summary = f'"{book.title}" by {book.author} is a fascinating work that explores deep themes.'
    word_count = len(book.title.split())

    return Analysis(summary=summary, word_count=word_count)


@app.get("/")
def health():
    return {"status": "ok"}
