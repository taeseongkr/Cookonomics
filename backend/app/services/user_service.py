from datetime import datetime
from typing import List, Optional

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserCreate, UserInDB, UserTable, UserUpdate

logger = structlog.get_logger()


class UserService:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user_data: UserCreate) -> User:
        try:
            existing_user = await self.get_user_by_email(user_data.email)
            if existing_user:
                raise ValueError("User with this email already exists")

            hashed_password = get_password_hash(user_data.password)

            db_user = UserTable(
                email=user_data.email,
                full_name=user_data.full_name,
                hashed_password=hashed_password,
                is_active=user_data.is_active,
            )

            self.db.add(db_user)
            await self.db.commit()
            await self.db.refresh(db_user)

            return User.model_validate(db_user)
        except ValueError:
            raise
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating user: {str(e)}")
            raise

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        try:
            result = await self.db.execute(
                select(UserTable).where(UserTable.id == user_id)
            )
            db_user = result.scalar_one_or_none()

            if not db_user:
                return None

            return User.model_validate(db_user)
        except Exception as e:
            logger.error(f"Error getting user by ID {user_id}: {str(e)}")
            return None

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        try:
            result = await self.db.execute(
                select(UserTable).where(UserTable.email == email)
            )
            db_user = result.scalar_one_or_none()

            if not db_user:
                return None

            return UserInDB.model_validate(db_user)
        except Exception as e:
            logger.error(f"Error getting user by email {email}: {str(e)}")
            return None

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        try:
            user = await self.get_user_by_email(email)
            if not user:
                return None

            if not verify_password(password, user.hashed_password):
                return None

            user_dict = user.model_dump()
            del user_dict["hashed_password"]
            return User(**user_dict)
        except Exception as e:
            logger.error(f"Error authenticating user {email}: {str(e)}")
            return None

    async def update_user(
        self, user_id: int, user_update: UserUpdate
    ) -> Optional[User]:
        try:
            result = await self.db.execute(
                select(UserTable).where(UserTable.id == user_id)
            )
            db_user = result.scalar_one_or_none()

            if not db_user:
                return None

            if user_update.email is not None and user_update.email != db_user.email:
                existing_user = await self.get_user_by_email(user_update.email)
                if existing_user and existing_user.id != user_id:
                    raise ValueError("Email already taken")

            if user_update.email is not None:
                db_user.email = user_update.email
            if user_update.full_name is not None:
                db_user.full_name = user_update.full_name
            if user_update.is_active is not None:
                db_user.is_active = user_update.is_active

            db_user.updated_at = datetime.utcnow()

            await self.db.commit()
            await self.db.refresh(db_user)

            return User.model_validate(db_user)
        except ValueError:
            raise
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating user {user_id}: {str(e)}")
            return None

    async def delete_user(self, user_id: int) -> bool:
        try:
            result = await self.db.execute(
                select(UserTable).where(UserTable.id == user_id)
            )
            db_user = result.scalar_one_or_none()

            if not db_user:
                return False

            await self.db.delete(db_user)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting user {user_id}: {str(e)}")
            return False

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        try:
            result = await self.db.execute(select(UserTable).offset(skip).limit(limit))
            db_users = result.scalars().all()

            return [User.model_validate(db_user) for db_user in db_users]
        except Exception as e:
            logger.error(f"Error getting users: {str(e)}")
            return []
