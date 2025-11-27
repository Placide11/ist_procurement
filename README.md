# Procure-to-Pay System (IST Africa Assessment)

> A secure, extensible Purchase Request & Approval backend built with Django (DRF), a React frontend scaffold, and Docker for development/deployment. The project implements the complete procurement lifecycle: submission, AI-assisted proforma extraction, multi-level approvals, and PDF Purchase Order (PO) generation.

---

## 🔍 Highlights

- Role-based workflows: Staff, Manager (L1), and Director (L2)
- Multi-step approval workflows (Draft → Pending → Approved L1 → Approved L2)
- PDF proforma extraction with `pdfplumber` to auto-fill request metadata
- Automatic PO generation with `reportlab` on final approval
- JWT authentication using `djangorestframework-simplejwt`
- Containerized backend and database using Docker / Docker Compose

---

## 🛠 Tech Stack

- Python 3.10+ (3.11 recommended) & Django 5.x
- Django REST Framework (DRF)
- React 18 + Vite and Material UI (frontend scaffold)
- PostgreSQL 15 (production) / SQLite (locally)
- Docker, Docker Compose
- ReportLab (PDF generation), PDFPlumber (PDF extraction)
- djangorestframework-simplejwt (JWT auth)

---

## Quick Start (Docker)

These steps will get the entire stack (backend, frontend, database) running locally.

1. Clone the repository

```bash
git clone https://github.com/Placide11/ist_procurement.git
cd ist_procurement
```

If you forked the repository, replace the repo URL above with your fork's URL.

2. Start the stack

```bash
docker-compose up --build
```

Alternative (Docker Compose v2):

```bash
docker compose up --build
```

Default endpoints:

- Backend API: http://localhost:8001
- Frontend UI: http://localhost:5173

3. Initialize the database & create a superuser

Open a new shell while containers are running and execute:

```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

> On some Linux setups you may need to prefix Docker Compose commands with `sudo`.

---

## Local Development (without Docker)

Recommended for development contributors that prefer local execution.

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` for the API and `http://127.0.0.1:8000/admin/` for Django admin.

---

## Usage Guide

1. Frontend Dashboard: visit `http://localhost:5173`.
2. Login using the superuser credentials created earlier.
3. As Staff: create a new request, attach a Proforma PDF. The backend will attempt to auto-extract vendor and totals.
4. Approvers (Manager, Director) can approve or reject requests from the dashboard or using the API.
5. On final approval (L2), a Purchase Order (PDF) is generated and available for download.

---

## API Overview

The backend exposes a REST API (paths shown are relative to root of the server):

- `POST /api/token/` — obtain JWT access/refresh tokens (payload: `{"username":"...","password":"..."}`).
- `GET /api/requests/` — list purchase requests.
- `POST /api/requests/` — create a request (multipart/form-data if uploading a file).
- `GET /api/requests/{id}/` — retrieve details for request with `id`.
- `PATCH /api/requests/{id}/approve/` — approve the specified request.
- `PATCH /api/requests/{id}/reject/` — reject the specified request (send `reason`).

Example: obtain a token

```bash
curl -X POST http://127.0.0.1:8001/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Example: create a request (multipart / file upload)

```bash
curl -X POST http://127.0.0.1:8001/api/requests/ \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F title='New Laptop' \
  -F description='Required for dev work' \
  -F amount=2500.00 \
  -F currency=USD \
  -F proforma_file=@proforma.pdf
```

---

## Project Structure (high-level)

- `config/` — Django project configuration (settings, urls, wsgi/asgi)
- `core/` — Main app with models, views, serializers, business logic
  - `models.py` — `PurchaseRequest` model and lifecycle details
  - `views.py` — DRF viewsets (create, list, approve, reject)
  - `ai_utils.py` — PDF extraction helpers used during create workflow
  - `po_utils.py` — Purchase Order PDF generator
- `frontend/` — React UI (Vite + MUI) scaffold
- `Dockerfile`, `docker-compose.yml` — Container setup and orchestration

---

## Testing

Run the Django test suite (recommended in the web container):

```bash
docker-compose exec web python manage.py test
```

Or locally in a virtual environment:

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
python manage.py test
```

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository and create a feature branch: `git checkout -b feat/<short-description>`.
2. Implement changes, add tests, and update docs.
3. Run tests locally and ensure they pass.
4. Open a PR with details and screenshots (if applicable).

Guidelines:

- Keep PRs small and focused.
- Add tests for new behaviors.
- Ensure you don't commit secrets or environment files.

---

## Security

- Keep `SECRET_KEY` and other credentials out of the repository; use environment variables or secret managers.
- For production, set `DEBUG=False`, secure `ALLOWED_HOSTS`, and use a production-ready server (e.g., Gunicorn, Daphne).

---

## Roadmap

- Fine-grained role and permission management
- Robust frontend with role-based views and better UX
- Better AI extraction, line item parsing and structured outputs
- CI/CD with tests and security scanning
- OpenAPI / Swagger docs (drf-spectacular)

---

## Contact

Developer: Placide — IST Africa Assessment — Advanced Django Developer

If you spot an issue or want to collaborate, open an issue or PR in the GitHub repository.

---

## Final Git Push

After updating README locally:

```bash
git add README.md
git commit -m "docs: update README"
git push origin main
```

---

_README last updated: November 2025_

<!--
Procure-to-Pay System (IST Africa Assessment)
Professional README.md - final version
-->

# Procure-to-Pay System (IST Africa Assessment)

A full-stack Purchase Request & Approval System built with Django (DRF), React, and Docker. This system handles the full procurement lifecycle — from request creation with proforma uploads and AI-assisted extraction to multi-level approvals and automatic Purchase Order (PO) generation.

---

## 🚀 Features

- **Role-Based Access Control**: Distinct workflows for Staff, Managers (Level 1), and Directors (Level 2).
- **Multi-Level Approval Workflow**:
  - Draft -> Pending -> Approved L1 -> Approved L2 (Final).
  - Atomic database transactions are used where appropriate to avoid race conditions during concurrent approvals.
- **AI Document Processing**: Extracts metadata from uploaded Proforma Invoices (PDFs) to auto-fill request details.
- **Automatic PO Generation**: The system generates a simple PDF Purchase Order using `ReportLab` once a request reaches final approval.
- **Containerized**: Dockerized stack for backend, frontend, and database for consistent local and cloud deployments.
- **Modern UI**: Frontend scaffold built with React, Vite, and Material UI (MUI).

---

## 🛠 Tech Stack

- **Backend**: Python 3.10+ (3.11 recommended), Django 5.x, Django REST Framework (DRF)
- **Frontend**: React 18, Vite, Material UI (MUI), Axios
- **Database**: PostgreSQL 15 for production; SQLite is used by default for local dev
- **DevOps**: Docker, Docker Compose
- **Tools & Libraries**: ReportLab (PO generation), PDFPlumber (PDF extraction), djangorestframework-simplejwt (JWT auth), django-cors-headers

---

## 💻 Setup & Installation

### Prerequisites

- Docker & Docker Desktop (or Docker Engine + Docker Compose)
- Git
- (Optional) Python 3.10+ for running locally without Docker

### 1. Clone the repository

```bash
git clone https://github.com/Placide11/ist_procurement.git
cd procure-to-pay
```

### 2. Run the entire stack with Docker

Start the backend, frontend, and database using the included `docker-compose.yml`:

```bash
docker-compose up --build
```

Default endpoints:

- Backend API: http://localhost:8001
- Frontend Dashboard: http://localhost:5173

### 3. Initialize the Database

Once the containers are running and stable, open a new terminal and run the migrations then create a superuser:

Linux / macOS / PowerShell (Windows - **without** sudo if Docker Desktop runs natively):

```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

> If your Docker requires root privileges on Linux, prefix the previous commands with `sudo`.

---

## 📖 Usage Guide

### 1. Login

Open the frontend dashboard at `http://localhost:5173` and log in using the superuser credentials created earlier.

> The superuser can be used during development to act as Staff/Manager/Director to test different workflows.

### 2. Create a Request (Staff)

1. Click **New Request**.
2. Fill in Title, Description, Amount, and upload a PDF Proforma Invoice.
3. Submit the request. The backend will attempt to extract vendor and line-item metadata from the uploaded PDF.

### 3. Approval Workflow (Manager & Director)

1. Managers review Pending requests and click **Approve Level 1** — status moves to `APPROVED_L1`.
2. Directors review `APPROVED_L1` requests and click **Approve Level 2** — status moves to `APPROVED_L2` and triggers PO generation.

> Approval endpoints use transactions to avoid race conditions; only one approver can commit the approval step at a time.

### 4. Download the PO

Once the request status becomes `APPROVED_L2` a `Purchase Order (PO)` PDF is generated and can be retrieved/downloaded via the UI or API.

---

## 📂 API Documentation

Key endpoints — all under the `/api/` path (DRF viewset-backed routes):

- `POST /api/token/` — obtain JWT access and refresh tokens (payload: `username` and `password`).
- `GET /api/requests/` — list purchase requests (authenticated; staff/users see different results).
- `POST /api/requests/` — create a purchase request (multipart/form-data if uploading `proforma_file`).
- `GET /api/requests/{id}/` — get request details.
- `PATCH /api/requests/{id}/approve/` — approve a request (L1 -> L2 progression).
- `PATCH /api/requests/{id}/reject/` — reject a request (optional `reason`).

### Example: Obtain a JWT token

```bash
curl -X POST http://127.0.0.1:8001/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Example: Create a request with a file upload (multipart)

```bash
curl -X POST http://127.0.0.1:8001/api/requests/ \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F title='New Laptop' \
  -F description='Need a new laptop for dev work' \
  -F amount=2500.00 \
  -F currency=USD \
  -F proforma_file=@./proforma.pdf
```

---

## 📁 Project Layout (High level)

- `config/` — Django project configuration (settings, urls, WSGI/ASGI)
- `core/` — Django app containing business logic (models, views, serializers, utils)
  - `models.py` — `PurchaseRequest` with file upload fields, status lifecycle and approvals
  - `views.py` — DRF `PurchaseRequestViewSet`, approval/rejection logic, file extraction hooks
  - `ai_utils.py` — PDF extraction helper using `pdfplumber`
  - `po_utils.py` — PO PDF generator using `reportlab`
- `frontend/` — React + Vite UI scaffold (if present and used locally)
- `Dockerfile` & `docker-compose.yml` — container definitions

---
## 👥 Contributing

Contributions welcome! Suggested workflow:

1. Fork the repository and create a feature branch: `git checkout -b feat/<name>`.
2. Add features, tests, and update docs.
3. Open a PR with a clear title and description.

Guidelines:

- Prefer clear, small PRs.
- Add or update tests for new behavior.
- Keep CI green (if CI exists).

---

## ⚠️ Security & Responsible Disclosure

- Do not commit secret keys, credentials, or other sensitive information to source control.
- If you find a security issue, open a private issue or reach out to the project maintainer.

---

## 🗺 Roadmap & Next Steps

- Add role-based permissions (fine-grained roles and company-specific approver chains).
- Add a comprehensive OpenAPI/Swagger documentation (e.g., `drf-spectacular`).
- Optional: Convert to a production-ready deployment (Gunicorn/ASGI server, storage for media files, and secure secrets management).
- Improve the AI extraction to better parse line items and totals, add automated tests around AI helpers.

---
