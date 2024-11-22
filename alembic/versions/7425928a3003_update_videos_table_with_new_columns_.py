"""update videos table with new columns and constraints

Revision ID: 7425928a3003
Revises: b26c4e7a6dfe
Create Date: 2024-11-22 14:05:36.051096

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7425928a3003'
down_revision: Union[str, None] = 'b26c4e7a6dfe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns
    op.add_column('videos', sa.Column('name', sa.String(), nullable=False))
    op.add_column('videos', sa.Column('upload_date', sa.String(), nullable=False))
    op.add_column('videos', sa.Column('status', sa.Integer(), nullable=False))
    op.add_column('videos', sa.Column('account_id', sa.Integer(), nullable=True))

    op.create_foreign_key(
        'fk_videos_account_id',
        'videos',
        'accounts',
        ['account_id'],
        ['id']
    )
    op.alter_column('videos', 'event_id', nullable=False)

def downgrade() -> None:
    op.drop_constraint('fk_videos_account_id', 'videos', type_='foreignkey')
    op.drop_column('videos', 'account_id')
    op.drop_column('videos', 'status')
    op.drop_column('videos', 'upload_date')
    op.drop_column('videos', 'name')
    op.alter_column('videos', 'event_id', nullable=True)
