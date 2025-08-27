from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: AnyUrl = "postgres://postgres:vFDYX84Iyiq7TR0BC2SFav3FezhN731eeHV3zAWWeyzlpT3jnMFTDk3AS3NHrz4m@95.217.18.18:5435/postgres?sslmode=require"
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    ENV: str = "local"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

settings = Settings()  # reads from env / .env if present
