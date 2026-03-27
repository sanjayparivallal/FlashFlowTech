from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routers import trips, dashboard, profile, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Nothing to seed — users register themselves
    yield


app = FastAPI(title="Flash Flow Tech API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(trips.router, prefix="/trips", tags=["Trips"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])


@app.get("/")
async def root():
    return {"message": "Flash Flow Tech API is running 🌿"}
