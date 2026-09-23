"""Initial booking database migration."""

from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(database_engine: Engine) -> None:
    """Create slots, bookings, and audit logs (CON-TECH-01, IF-HIS-01)."""

    Base.metadata.create_all(bind=database_engine)
