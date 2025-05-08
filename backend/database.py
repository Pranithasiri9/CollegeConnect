import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Use SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./college_events.db")

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True)
Base = declarative_base()

# Create async session
async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

async def init_db():
    """Initialize database tables."""
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)