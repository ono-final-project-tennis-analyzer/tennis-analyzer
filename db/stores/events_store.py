from typing import Optional
from sqlalchemy.orm import Session
from ..models.events_model import Events


class EventStore:
    def __init__(self, session: Session):
        self._session = session

    def create_event(self, name: str, account_id: str, meta: dict):
        new_event = Events(name=name, stage="started", progress=0.0, account_id=account_id, meta=meta)
        self._session.add(new_event)
        self._session.commit()
        return new_event

    def get_event(self, event_id: int) -> Optional[Events]:
        return self._session.query(Events).filter(Events.id == event_id).first()

    def get_all_events(self, account_id: str):
        return self._session.query(Events).filter(Events.account_id == account_id).all()

    def update_event(self, event_id: int, stage: str = None, progress: float = None):
        event = self.get_event(event_id)
        if not event:
            return None
        if stage is not None:
            event.stage = stage
        if progress is not None:
            event.progress = progress
        self._session.commit()
        return event

    def delete_event(self, event_id: int) -> bool:
        event = self.get_event(event_id)
        if not event:
            return False

        self._session.delete(event)
        self._session.commit()
        return True
