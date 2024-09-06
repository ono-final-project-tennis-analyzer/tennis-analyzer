from datetime import datetime
from sqlalchemy import create_engine, Column, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
import config

# Base model setup
Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def create_session():
    engine = create_engine(config.DATABASE_URL)
    # Base.metadata.create_all(bind=engine)
    return Session(bind=engine)


def with_session():
    engine = create_engine(config.DATABASE_URL)
    # Base.metadata.create_all(bind=engine)
    Session = sessionmaker(engine)
    return Session()
