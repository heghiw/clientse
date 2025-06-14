import os
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()
bucket_name = os.getenv("GCS_BUCKET")

def get_signed_upload_url(filename: str):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(filename)

    url = blob.generate_signed_url(
        version="v4",
        expiration=900,  # 15 minutes
        method="PUT",
        content_type="application/pdf"
    )
    return url
