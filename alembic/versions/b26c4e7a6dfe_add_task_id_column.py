"""add task_id column

Revision ID: b26c4e7a6dfe
Revises: 988b86f9ebd2
Create Date: 2024-09-13 11:03:39.446257

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b26c4e7a6dfe'
down_revision: Union[str, None] = '988b86f9ebd2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('events', sa.Column('task_id', sa.Integer(), nullable=True, index=True))
    pass


def downgrade() -> None:
    op.drop_column('events', 'task_id')
    pass
