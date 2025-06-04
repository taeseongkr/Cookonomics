import structlog
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.services.item_service import ItemService
from app.services.user_service import UserService

logger = structlog.get_logger()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)


async def get_item_service(db: AsyncSession = Depends(get_db)) -> ItemService:
    return ItemService(db)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_service: UserService = Depends(get_user_service),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        user_id = verify_token(token)
        if user_id is None:
            raise credentials_exception

        user = await user_service.get_user_by_id(user_id)

        if user is None:
            raise credentials_exception

        return user
    except (jwt.JWTError, ValidationError):
        raise credentials_exception
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise credentials_exception


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user
