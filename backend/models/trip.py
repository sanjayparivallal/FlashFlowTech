from pydantic import BaseModel, EmailStr


class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class UserLoginRequest(BaseModel):
    email: str
    password: str


class TripCompareRequest(BaseModel):
    source: str
    destination: str
    distance_km: float


class TripSelectRequest(BaseModel):
    source: str
    destination: str
    transport_mode: str
    distance_km: float


class ProfileUpdateRequest(BaseModel):
    name: str
