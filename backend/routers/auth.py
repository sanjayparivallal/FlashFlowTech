from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from db.mongo import users_collection
from models.trip import UserRegisterRequest, UserLoginRequest
from utils.auth import hash_password, verify_password, generate_token

router = APIRouter()


@router.post("/register")
async def register(body: UserRegisterRequest):
    # Check if email already exists
    existing = await users_collection.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")

    token = generate_token()
    user_doc = {
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "hashed_password": hash_password(body.password),
        "green_points": 0,
        "token": token,
        "created_at": datetime.now(timezone.utc),
    }
    result = await users_collection.insert_one(user_doc)

    return {
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": user_doc["name"],
            "email": user_doc["email"],
            "green_points": 0,
        },
    }


@router.post("/login")
async def login(body: UserLoginRequest):
    user = await users_collection.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Regenerate token on login for security
    token = generate_token()
    await users_collection.update_one({"_id": user["_id"]}, {"$set": {"token": token}})

    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "green_points": user.get("green_points", 0),
        },
    }


@router.post("/logout")
async def logout(body: dict = {}):
    """Invalidate the token server-side (frontend should also clear localStorage)."""
    token = body.get("token")
    if token:
        await users_collection.update_one({"token": token}, {"$unset": {"token": ""}})
    return {"message": "Logged out successfully."}
