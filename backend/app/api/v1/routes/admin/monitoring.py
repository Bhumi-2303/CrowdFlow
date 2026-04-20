from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.snapshot import CrowdSnapshot
from app.core.database import db
from app.core.security import require_admin

router = APIRouter(prefix="/monitoring", tags=["admin", "monitoring"], dependencies=[Depends(require_admin)])

@router.get("/snapshots", response_model=List[CrowdSnapshot])
async def get_live_snapshots():
    return await db.snapshots.find().sort("created_at", -1).limit(100).to_list(100)

@router.post("/alerts")
async def trigger_alert(zone_id: str, message: str):
    # In a real system, this would push to WebSockets
    # Storing the manual alert for now
    await db.alerts.insert_one({
        "zone_id": zone_id,
        "message": message,
        "severity": "high",
        "resolved": False
    })
    return {"status": "Alert dispatched successfully"}
