# IST Procurement

A Django-based procurement management project (work in progress) that provides a backend for handling procurement-related data and features. This repository contains the Django project configuration, a core app, and a `proformas` area for procurement documents.

**Status:** Early development — basic project scaffolding, models, serializers, and views are present. See the project layout below for where to find key code.

**Table of Contents**

- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Testing](#testing)
- [Where to Look Next](#where-to-look-next)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

## Tech Stack

- Python 3 (see `requirements.txt` for exact packages)
- Django (project structure and `manage.py` present)
- SQLite (`db.sqlite3` used for development)
- Docker / Docker Compose (project contains `Dockerfile` and `docker-compose.yml`)

## Repository Layout

Top-level files and directories of interest:

- `manage.py` - Django management CLI
- `requirements.txt` - Python dependencies
- `db.sqlite3` - Development SQLite database file (auto-generated)
- `Dockerfile`, `docker-compose.yml` - Docker configurations
- `config/` - Django project package
  - `config/settings.py` - Main Django settings
  - `config/urls.py` - Project URL configuration
  - `config/wsgi.py`, `config/asgi.py` - WSGI/ASGI entrypoints
- `core/` - Main application containing models, views, serializers, and admin
  - `core/models.py` - Data models
  - `core/serializers.py` - DRF serializers (if using DRF)
  - `core/views.py` - View logic
  - `core/ai_utils.py` - AI-related helper utilities
  - `core/tests.py` - Unit tests
- `proformas/` - Folder for procurement/proforma-related code or data

Note: Inspect `config/settings.py` to review installed apps, middleware, and environment-driven configuration.

## Getting Started (Local Development)

1. Clone the repository and enter the project directory:

```bash
git clone https://github.com/Placide11/ist_procurement.git 
cd ist_procurement
```

2. Create and activate a Python virtual environment (Windows example using PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Apply migrations and create a superuser:

```bash
python manage.py migrate
python manage.py createsuperuser
```

5. Run the development server:

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000/` and check the available routes. The admin site is available at `http://127.0.0.1:8000/admin/` by default.

### Environment Variables

This project currently uses standard Django settings. If you add environment-driven settings (e.g., `SECRET_KEY`, `DEBUG`, `DATABASE_URL`), document them in `config/settings.py` and consider using a `.env` file with `python-dotenv` or similar.

## Running with Docker

Build and run the application with Docker Compose (if Docker is installed):

```bash
docker-compose up --build
```

This will build the container(s) and start the service(s) described in `docker-compose.yml`. Check the `Dockerfile` and `docker-compose.yml` for service names, exposed ports, and volume mounts.

## Testing

Run the Django test suite with:

```bash
python manage.py test
```

Unit tests are located in `core/tests.py` — add tests for new features as you develop them.

## Where to Look Next (Developer Notes)

- `config/settings.py` — verify or add environment-driven configuration and installed apps.
- `core/models.py` — extend or review data models for procurement entities.
- `core/serializers.py` and `core/views.py` — API endpoints and serialization logic.
- `core/ai_utils.py` — contains helper functions for any AI-related processing; review before modifying.

If you plan to add an API, consider adding Django REST Framework to `requirements.txt` and registering routes in `config/urls.py` or `core/urls.py`.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Make changes and add tests.
4. Run tests locally: `python manage.py test`.
5. Open a pull request with a clear description of your changes.

Please follow existing code style and add tests for new behavior.
