from typing import TypedDict

from celery_config import app
from db.models import with_session
from db.stores.events_store import EventStore
from tennis_video_analyzer.tennis_video_analyzer import process_video


class ProcessVideoMeta(TypedDict):
    file_name: str
    account_id: int
    event_id: int

@app.task()
def process_video_task(meta: ProcessVideoMeta):
    print(f"Read Task Test: started with {meta=}")

    try:
        with with_session() as session:
            store = EventStore(session)
            event = store.get_event(meta['event_id'])
        
            print(f"target event: {event.id}")

            process_video(event_id=event.id, draw_ball_trace=True)
    except Exception as e:
        print(f"Error: {e}")
        store.update_event(meta['event_id'], stage="error", progress=100)
    finally:
        store.update_event(meta['event_id'], stage="ended", progress=100)
