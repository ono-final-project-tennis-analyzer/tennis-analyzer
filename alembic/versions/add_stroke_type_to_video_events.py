"""add stroke type to video events

Revision ID: add_stroke_type_to_video_events
Revises: a461969bbafa
Create Date: 2024-03-17 15:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_stroke_type_to_video_events'
down_revision = 'a461969bbafa'
branch_labels = None
depends_on = None


def upgrade():
    # Add stroke_type column to video_events table with NULL as default
    op.add_column('video_events', sa.Column('stroke_type', sa.Integer(), nullable=True, server_default=None))


def downgrade():
    # Remove stroke_type column from video_events table
    op.drop_column('video_events', 'stroke_type') 