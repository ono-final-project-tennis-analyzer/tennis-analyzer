"""create videos table

Revision ID: 988b86f9ebd2
Revises: 26d616c23792
Create Date: 2024-09-06 12:17:11.316835

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '988b86f9ebd2'
down_revision: Union[str, None] = '26d616c23792'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('videos',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('event_id', sa.Integer(), nullable=True),
                    sa.Column('video_path', sa.String(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ))
    pass


def downgrade() -> None:
    op.drop_table('videos')
    pass
