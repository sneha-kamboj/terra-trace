from app.config import settings


def create_directories():
    settings.upload_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    settings.result_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    settings.weights_path.mkdir(
        parents=True,
        exist_ok=True,
    )