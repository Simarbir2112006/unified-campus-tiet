from fastapi import FastAPI

app = FastAPI(title="Unified Campus Management System - TIET")

@app.get("/")
def root():
    return {"message": "UCMS API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}