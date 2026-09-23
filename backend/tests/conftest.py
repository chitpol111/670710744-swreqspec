"""Shared in-memory database setup for booking tests."""

from collections.abc import Generator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db.models import Base


@pytest.fixture
def database_session() -> Generator[Session, None, None]:
    """Provide an isolated SQLite database session for each test."""

    database_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(database_engine)
    session_factory = sessionmaker(bind=database_engine)
    database = session_factory()
    try:
        yield database
    finally:
        database.close()
        Base.metadata.drop_all(database_engine)
