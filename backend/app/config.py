from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str

    HOST: str
    PORT: int

    API_PREFIX: str

    UPLOAD_DIR: str
    RESULT_DIR: str
    WEIGHTS_DIR: str

    MAX_UPLOAD_SIZE_MB: int

    DEFAULT_IMAGE_SIZE: int

    PIXEL_RESOLUTION_METERS: int

    ALLOWED_EXTENSIONS: str

    LOW_THRESHOLD: float
    HIGH_THRESHOLD: float

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )

    @property
    def upload_path(self):
        return Path(self.UPLOAD_DIR)

    @property
    def result_path(self):
        return Path(self.RESULT_DIR)

    @property
    def weights_path(self):
        return Path(self.WEIGHTS_DIR)

    @property
    def allowed_extensions(self):
        return {
            ext.strip().lower()
            for ext in self.ALLOWED_EXTENSIONS.split(",")
        }


settings = Settings()