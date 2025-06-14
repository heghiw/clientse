from fastapi import APIRouter, Depends
from db import get_db
from schemas import CandidateCreate, CandidateOut
from models import create_candidate, get_candidates
from gcs import get_signed_upload_url

router = APIRouter()

@router.get("/", response_model=list[CandidateOut])
async def read_all(db=Depends(get_db)):
    return await get_candidates(db)

@router.post("/", response_model=CandidateOut)
async def create(data: CandidateCreate, db=Depends(get_db)):
    new_id = await create_candidate(db, data)
    return {**data.dict(), "id": new_id}

@router.post("/{candidate_id}/upload-url")
def upload_url(candidate_id: int):
    url = get_signed_upload_url(f"cv/{candidate_id}.pdf")
    return {"url": url}
