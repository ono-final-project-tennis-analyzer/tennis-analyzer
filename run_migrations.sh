#!/bin/bash

source ./venv/bin/activate
export TEST_ENV=true

echo "TEST_ENV=$TEST_ENV"

alembic revision --autogenerate
