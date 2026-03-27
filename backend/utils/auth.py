import uuid
from passlib.context import CryptContext
from fastapi import Header, HTTPException
from db.mongo import users_collection

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def generate_token() -> str:
    return str(uuid.uuid4())


async def get_current_user(x_token: str = Header(...)):
    """Dependency that validates the X-Token header against the DB."""
    user = await users_collection.find_one({"token": x_token})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token. Please log in again.")
    return user
