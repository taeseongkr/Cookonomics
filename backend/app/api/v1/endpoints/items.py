from typing import Any, List

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_user, get_item_service
from app.models.item import Item, ItemCreate, ItemUpdate
from app.models.user import User
from app.services.item_service import ItemService

logger = structlog.get_logger()

router = APIRouter()


@router.post("/", response_model=Item)
async def create_item(
    item_data: ItemCreate,
    current_user: User = Depends(get_current_user),
    item_service: ItemService = Depends(get_item_service),
) -> Any:
    try:
        item = await item_service.create_item(item_data, current_user.id)

        logger.info(f"Item created successfully: {item.id}")
        return item
    except Exception as e:
        logger.error(f"Error creating item: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create item",
        )


@router.get("/", response_model=List[Item])
async def read_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    item_service: ItemService = Depends(get_item_service),
) -> Any:
    try:
        items = await item_service.get_user_items(
            user_id=current_user.id, skip=skip, limit=limit
        )
        return items
    except Exception as e:
        logger.error(f"Error retrieving items: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve items",
        )


@router.get("/{item_id}", response_model=Item)
async def read_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    item_service: ItemService = Depends(get_item_service),
) -> Any:
    try:
        item = await item_service.get_item_by_id(item_id)

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )

        if item.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )

        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving item {item_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve item",
        )


@router.put("/{item_id}", response_model=Item)
async def update_item(
    item_id: int,
    item_update: ItemUpdate,
    current_user: User = Depends(get_current_user),
    item_service: ItemService = Depends(get_item_service),
) -> Any:
    try:
        existing_item = await item_service.get_item_by_id(item_id)
        if not existing_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )

        if existing_item.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )

        item = await item_service.update_item(item_id, item_update)

        logger.info(f"Item updated successfully: {item_id}")
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating item {item_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update item",
        )


@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    item_service: ItemService = Depends(get_item_service),
) -> Any:
    try:
        existing_item = await item_service.get_item_by_id(item_id)
        if not existing_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )

        if existing_item.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )

        success = await item_service.delete_item(item_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )

        logger.info(f"Item deleted successfully: {item_id}")
        return {"message": "Item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting item {item_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete item",
        )
