"""Database engine and session setup."""

import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db.models import Base


def create_database_engine():
    """Create the configured database engine (CON-TECH-01)."""

    database_url = os.getenv("DATABASE_URL", "sqlite:///:memory:")
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    return create_engine(database_url, connect_args=connect_args)


engine = create_database_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    """Provide a database session for an API request (CON-TECH-01)."""

    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


def create_tables() -> None:
    """Create all booking tables for the configured database."""

    Base.metadata.create_all(bind=engine)
