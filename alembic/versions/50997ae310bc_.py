"""empty message

Revision ID: 50997ae310bc
Revises: 637156f4bbfe
Create Date: 2024-11-23 21:58:14.525518

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '50997ae310bc'
down_revision: Union[str, None] = '637156f4bbfe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('videos', sa.Column('processed_video_path', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('videos', 'processed_video_path')
    # ### end Alembic commands ###
