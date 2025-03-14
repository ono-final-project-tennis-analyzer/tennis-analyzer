"""add_player_account_ids_to_videos

Revision ID: a461969bbafa
Revises: c37086b47dcf
Create Date: 2025-03-14 18:15:18.438868

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a461969bbafa'
down_revision: Union[str, None] = 'c37086b47dcf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add bottom_player_account_id and top_player_account_id columns to videos table
    op.add_column('videos', sa.Column('bottom_player_account_id', sa.Integer(), nullable=True))
    op.add_column('videos', sa.Column('top_player_account_id', sa.Integer(), nullable=True))
    
    # Add foreign key constraints
    op.create_foreign_key(
        'fk_videos_bottom_player_account_id_accounts',
        'videos', 'accounts',
        ['bottom_player_account_id'], ['id']
    )
    op.create_foreign_key(
        'fk_videos_top_player_account_id_accounts',
        'videos', 'accounts',
        ['top_player_account_id'], ['id']
    )


def downgrade() -> None:
    # Drop foreign key constraints
    op.drop_constraint('fk_videos_bottom_player_account_id_accounts', 'videos', type_='foreignkey')
    op.drop_constraint('fk_videos_top_player_account_id_accounts', 'videos', type_='foreignkey')
    
    # Drop columns
    op.drop_column('videos', 'bottom_player_account_id')
    op.drop_column('videos', 'top_player_account_id')
