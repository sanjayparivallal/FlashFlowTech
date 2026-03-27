from .trips import router as trips_router
from .dashboard import router as dashboard_router
from .profile import router as profile_router
from .auth import router as auth_router

__all__ = ["trips_router", "dashboard_router", "profile_router", "auth_router"]