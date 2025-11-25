<!--
README.md - Professional, final version for IST Procurement
This file is intentionally detailed to help new contributors and maintainers.
-->

# IST Procurement

[![Python](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/django-5.2.x-green)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/license-Unspecified-lightgrey)](#license)

Professional, extensible procurement management backend built with Django and Django REST Framework. The project focuses on automating procurement workflows by providing a lightweight API to manage purchase requests, extract metadata from proformas (PDFs), and generate purchase orders (POs).

Note: This project is in active development and used for educational or internal purposes. Please do not use the default secret key or Debug=True settings in production.

---

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Quick Start](#quick-start)
- [Docker](#docker)
- [Environment Variables & Configuration](#environment-variables--configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Project Layout](#project-layout)
- [Contributing](#contributing)
- [Security & Responsible Disclosure](#security--responsible-disclosure)
- [Roadmap](#roadmap)
- [License & Contact](#license--contact)

---

## Highlights

- API-first backend for procurement lifecycle (submit request, approve, reject).
- Automated PDF parsing for proforma documents using `pdfplumber`.
- Simple PO generation to a PDF using `reportlab`.
- JWT-based authentication using `djangorestframework-simplejwt`.

## Tech Stack & Architecture

- Python 3.11+ and Django 5.2
- Django REST Framework (DRF) for API endpoints
- SQLite by default for local development, Postgres supported via `DATABASE_URL`
- JWT authentication (SimpleJWT) for stateless API access
- PDF parsing with `pdfplumber` and PDF generation with `reportlab`
- CORS headers enabled (`django-cors-headers`) for local frontend integration

Typical architecture:

- Single Django service (API + admin) with optional Postgres database and persistent storage for media files (proformas/POs).

## Quick Start

Follow these steps for running the project locally.

Prerequisites:

- Python 3.11+
- Git

1. Clone the repository

```bash
git clone https://github.com/Placide11/ist_procurement.git
cd ist_procurement
```

2. Create and activate a virtual environment

PowerShell (Windows):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Unix/macOS:

```bash
python -m venv .venv
source .venv/bin/activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Configure environment variables (see next section)

5. Apply migrations and create a superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

6. Start the development server

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8001/` for the API (and `http://127.0.0.1:8001/admin/` for admin).

## Docker

The repository includes `docker-compose.yml`. The default compose configuration runs Postgres + Django web service.

Start with:

```bash
docker-compose up --build
```

Stop with:

```bash
docker-compose down
```

In the compose file:

- The `web` service runs the Django dev server on 0.0.0.0:8001.
- The `db` service uses Postgres and persists data in a named volume.

## Environment Variables & Configuration

The project is currently configured for local development. For production, set the following environment variables and secure them in your hosting environment or `.env` file.

Recommended environment variables:

- `SECRET_KEY` — Django secret key (never commit a real secret key to VCS)
- `DEBUG` — `0` or `1` (set to `0` in production)
- `DATABASE_URL` — optional Postgres connection string (e.g., `postgres://user:pass@host:port/dbname`)
- `ALLOWED_HOSTS` — comma-separated hosts (e.g., `example.com,api.example.com`)
- `CORS_ALLOWED_ORIGINS` or `CORS_ALLOWED_ORIGIN_REGEXES` — for frontend connections

Notes:

- `config/settings.py` includes a default SQLite DB for local development; Docker Compose sets `DATABASE_URL` to Postgres.
- Configure `MEDIA_ROOT` and `MEDIA_URL` in `config/settings.py` or via your production config to persist uploaded files and generated POs.

## API Reference

- Authentication
  - `POST /api/token/` — obtain JWT access & refresh tokens (payload: `username`, `password`). Example:

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

- Purchase Requests
  - `GET /api/requests/` — list purchase requests (authenticated; staff/users see different results)
  - `POST /api/requests/` — create a purchase request (multipart if uploading `proforma_file`)
  - `GET /api/requests/{id}/` — get request details
  - `PATCH /api/requests/{id}/approve/` — approve at current level (L1/L2) if user has permission
  - `PATCH /api/requests/{id}/reject/` — reject request with optional `reason`

Example creating a request (multipart with file upload):

```bash
curl -X POST http://127.0.0.1:8000/api/requests/ \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F title='New Laptop' \
  -F description='Need a new laptop for dev work' \
  -F amount=2500.00 \
  -F currency=USD \
  -F proforma_file=@./proforma.pdf
```

Response will contain `extracted_data` where the system attempts to extract the vendor and total.

## Testing

Run tests locally:

```bash
python manage.py test
```

The `core/tests.py` file contains unit tests for the core application. Add tests when you introduce new behavior.

## Project Layout

Key directories and files:

- `config/` — Django project configuration (`settings.py`, `urls.py`, WSGI/ASGI)
- `core/` — Application with business logic (models, views, serializers, utils)
  - `models.py` — `PurchaseRequest` is the main model with file uploads and status tracking
  - `views.py` — DRF `PurchaseRequestViewSet` handles create, approve, reject
  - `ai_utils.py` — PDF parsing and basic data extraction
  - `po_utils.py` — PO PDF generation with `reportlab`
- `Dockerfile`, `docker-compose.yml` — Docker images and composition for Postgres + Django

## Contributing

Contributions are welcome. A simple workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/<name>`.
3. Add tests and run the test suite.
4. Create a PR with a clear summary and description.

Guidelines:

- Follow the existing code style and structure.
- Keep API changes backward-compatible when possible.
- Add tests for new behavior.

## Security & Responsible Disclosure

- Do not commit secrets or credentials to the repository. Use environment variables for keys.
- If you find a security vulnerability, please open a private issue and mark it as security-related or contact the repository owner directly.

## Roadmap

Planned / desirable improvements:

- Add a simple frontend demo (Vite/React) to demonstrate integration
- Add role-based permissions and approval chains that are configurable
- Add e2e and integration tests, CI/CD pipeline, and a production-ready WSGI configuration
- Replace the hard-coded secret key with a secure secrets management setup
- Add a proper API reference (OpenAPI/Swagger) and automatic docs using `drf-spectacular`

## License & Contact

This project does not currently include a license file. Add a `LICENSE` if you intend to open-source (common licenses include MIT, Apache-2.0).

For questions or collaborations, open an issue or contact the repository owner via the GitHub repo.

---

_README last updated: November 2025_
