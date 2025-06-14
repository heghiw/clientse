from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import candidate

app = FastAPI()

# CORS (for Angular dev on localhost:4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:4200"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(candidate.router, prefix="/api/candidate")
