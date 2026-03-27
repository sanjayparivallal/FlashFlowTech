from fastapi import APIRouter, Depends
from db.mongo import users_collection
from models.trip import ProfileUpdateRequest
from utils.auth import get_current_user

router = APIRouter()


@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user.get("name", ""),
        "email": current_user.get("email", ""),
        "green_points": current_user.get("green_points", 0),
        "created_at": current_user.get("created_at", "").isoformat() if current_user.get("created_at") else None,
    }


@router.put("/update")
async def update_profile(body: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"name": body.name.strip()}},
    )
    return {"message": "Profile updated successfully.", "name": body.name.strip()}
