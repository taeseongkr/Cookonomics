from datetime import datetime
from typing import List, Optional

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.item import Item, ItemCreate, ItemTable, ItemUpdate

logger = structlog.get_logger()


class ItemService:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_item(self, item_data: ItemCreate, user_id: int) -> Item:
        try:
            db_item = ItemTable(
                name=item_data.name,
                description=item_data.description,
                price=item_data.price,
                status=item_data.status,
                user_id=user_id,
            )

            self.db.add(db_item)
            await self.db.commit()
            await self.db.refresh(db_item)

            return Item.model_validate(db_item)
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating item: {str(e)}")
            raise

    async def get_item_by_id(self, item_id: int) -> Optional[Item]:
        try:
            result = await self.db.execute(
                select(ItemTable).where(ItemTable.id == item_id)
            )
            db_item = result.scalar_one_or_none()

            if not db_item:
                return None

            return Item.model_validate(db_item)
        except Exception as e:
            logger.error(f"Error getting item {item_id}: {str(e)}")
            return None

    async def get_user_items(
        self, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Item]:
        try:
            result = await self.db.execute(
                select(ItemTable)
                .where(ItemTable.user_id == user_id)
                .offset(skip)
                .limit(limit)
            )
            db_items = result.scalars().all()

            return [Item.model_validate(db_item) for db_item in db_items]
        except Exception as e:
            logger.error(f"Error getting user items: {str(e)}")
            return []

    async def update_item(
        self, item_id: int, item_update: ItemUpdate
    ) -> Optional[Item]:
        try:
            result = await self.db.execute(
                select(ItemTable).where(ItemTable.id == item_id)
            )
            db_item = result.scalar_one_or_none()

            if not db_item:
                return None

            if item_update.name is not None:
                db_item.name = item_update.name
            if item_update.description is not None:
                db_item.description = item_update.description
            if item_update.price is not None:
                db_item.price = item_update.price
            if item_update.status is not None:
                db_item.status = item_update.status

            db_item.updated_at = datetime.utcnow()

            await self.db.commit()
            await self.db.refresh(db_item)

            return Item.model_validate(db_item)
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating item {item_id}: {str(e)}")
            return None

    async def delete_item(self, item_id: int) -> bool:
        try:
            result = await self.db.execute(
                select(ItemTable).where(ItemTable.id == item_id)
            )
            db_item = result.scalar_one_or_none()

            if not db_item:
                return False

            await self.db.delete(db_item)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting item {item_id}: {str(e)}")
            return False
