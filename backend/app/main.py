from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers.health import router as health_router
from app.utils.startup import create_directories
from app.routers.detect import router as detect_router

create_directories()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static",
)
app.mount(
    "/uploads",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)
app.include_router(
    health_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    detect_router,
    prefix=settings.API_PREFIX,
)

@app.get("/")
def root():

    return {
        "message": settings.APP_NAME,
    }