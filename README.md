# Tennis Analyzer

![Tennis Analyzer Logo](path/to/logo.png) *(Replace with your logo)*

## Table of Contents

- [Description](#description)
- [Clone the Repository](#clone-the-repository)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Running Databases](#running-databases)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
  - [Running Celery](#running-celery)
  - [Database Migrations](#database-migrations)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Description

**Tennis Analyzer** is a comprehensive application designed for tennis enthusiasts and professionals to upload, analyze, and manage tennis videos. The platform processes uploaded videos to detect balls, courts, and players, providing detailed metrics and insights. Additionally, it maintains and updates metrics for each video, ensuring users have access to the latest analysis whenever new videos are uploaded.

## Clone the Repository

To get started with Tennis Analyzer, clone the repository using the following command:

```bash
git clone https://github.com/ono-final-project-tennis-analyzer/tennis-analyzer.git
cd tennis-analyzer
```

## Features

- **Video Uploading:** Seamlessly upload tennis videos for analysis.
- **Automated Processing:** Detects balls, courts, and players within the video.
- **Metrics Tracking:** Maintains comprehensive metrics for each video, updated with every new upload.
- **Real-Time Status Updates:** Monitor the processing status of your videos in real-time.
- **Secure Storage:** Utilizes MinIO for efficient and secure video storage.
- **User Authentication:** Secure login and account management with Flask-Login.
- **Intuitive Frontend:** User-friendly interface built with React and MantineUI.

## Technology Stack

### Backend

- **Language:** Python
- **Framework:** Flask
- **ORM:** SQLAlchemy

### Database

- **Database:** PostgreSQL
- **Migrations:** Alembic

### Storage

- **Object Storage:** MinIO

### Queue

- **Task Queue:** Celery
- **Broker:** Redis

### Additional Backend Tools

- **Authentication:** Flask-Login

### Frontend

- **Framework:** React
- **Build Tool:** ViteJS
- **UI Library:** MantineUI
- **State Management & Data Fetching:** React Query
- **Routing:** React Router
- **Validation:** Zod

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Operating System:** Linux or macOS
- **Python:** Version 3.10
- **Node.js:** Version 20
- **Docker:** Installed and running

## Installation

Follow these steps to set up the Tennis Analyzer project locally.

### 1. Clone the Repository

If you haven't already cloned the repository, do so with:

```bash
git clone https://github.com/ono-final-project-tennis-analyzer/tennis-analyzer.git
cd tennis-analyzer
```

### 2. Running Databases

Initialize and start the necessary databases using Docker.

```bash
cd devops
./start_dbs.sh
```

### 3. Running the Backend

Ensure the databases are running before starting the backend.

1. **Create a Virtual Environment:**

    ```bash
    python3.10 -m venv venv
    source venv/bin/activate
    ```

2. **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3. **Configure Environment Variables:**

    Create a `.env` file in the root directory with the following content:

    ```env
    DATABASE_NAME=db1
    MINIO_ENDPOINT=localhost:9000
    MINIO_ACCESS_KEY=minioadmin
    MINIO_SECRET_KEY=minioadmin
    MINIO_BUCKET_NAME=data
    APP_SECRET_KEY=f40c638a47239a64125cfe7d90bec415e84dca006c27ac46760e44f913332faa

    ACCOUNT_PASSWORD_ENCRYPTION_KEY=isKwIUotaTqVZYENd9bHfGRFSZ3tOwCo2W7Q
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    ```

4. **Start the Backend Server:**

    ```bash
    cd ..
    ./start_server.sh
    ```

### 4. Running the Frontend

Ensure the backend server is running before starting the frontend.

1. **Navigate to Frontend Directory:**

    ```bash
    cd frontend
    ```

2. **Install Dependencies:**

    ```bash
    npm install -g yarn
    yarn install
    ```

3. **Start the Frontend Development Server:**

    ```bash
    yarn dev
    ```

### 5. Running Celery

Celery handles background tasks such as video processing.

1. **Open a New Terminal Window:**

2. **Start Celery Beat:**

    ```bash
    ./start_celery_beat.sh
    ```

3. **Start Celery Worker:**

    ```bash
    ./start_celery_worker.sh
    ```

4. **Stopping Celery:**

    To stop Celery processes, run:

    ```bash
    ./stop_celery.sh
    ```

### 6. Database Migrations

Manage database schema changes using Alembic.

```bash
./run/_migration
```

## Folder Structure

```
tennis-analyzer/
├── alembic/                   # Alembic migration files
├── ball_detector/            # Ball detection service and payload builder
├── celery_app/                # Celery setup and task definitions
├── court_detector/           # Court detection service and payload builder
├── db/                        # Database models, managers, and views for Flask app
├── devops/                    # Docker scripts and Celery monitoring tools (e.g., Flower)
├── frontend/                  # Frontend React application
├── player_detector/          # Player detection service and payload builder
├── storage_client/           # MinIO storage client class
├── tennis_video_analyzer/    # Root of the detection model and processing services
├── requirements.txt           # Python dependencies
├── package.json               # Node.js dependencies
├── start_server.sh            # Script to start the backend server
├── start_dbs.sh               # Script to start databases
├── start_celery_beat.sh       # Script to start Celery Beat
├── start_celery_worker.sh     # Script to start Celery Worker
├── stop_celery.sh             # Script to stop Celery processes
└── README.md                  # Project documentation
```

## Usage

1. **Upload a Video:**
   - Navigate to the video table in the application.
   - Click the "Upload Video" button and select your tennis video.

2. **Processing:**
   - The backend validates the video format and uploads it to MinIO.
   - A new entry is created in the PostgreSQL database.
   - Celery processes the video for ball, court, and player detection.
   - The frontend displays real-time status updates.

3. **View Results:**
   - Once processing is complete, download the original and processed videos.
   - View detailed metrics and analysis results within the application.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

    ```bash
    git checkout -b feature/YourFeature
    ```

3. **Commit Your Changes**

    ```bash
    git commit -m "Add your message"
    ```

4. **Push to the Branch**

    ```bash
    git push origin feature/YourFeature
    ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, please contact [dkhodos94@@gmail.com](mailto:your.email@example.com).
