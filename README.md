# Workly DB Documentation

## Overview

This document describes the schema of the recruiting and invoicing database used in the **Workly** system, hosted on Google Cloud SQL (MySQL). It supports:

- Candidate records and their desired job positions  
- Company records and associated candidate assignments  
- File management for CVs, portfolios, LinkedIn profiles, invoices, and timesheets  

### File Storage via Google Cloud Storage

All candidate and company-related files are stored in **Google Cloud Storage (GCS)** buckets instead of inside the database. Each file is linked by a signed URL stored in the relevant file table (`Candidate_file`, `Company_file`).

Files include:

- `cv`, `portfolio`, and `linkedin` links for candidates  
- `invoice` and `timesheet` documents for companies  

The application uses public/private GCS buckets with restricted access. Uploads are authenticated and URLs are time-limited for security.

### Frontend Integration

The frontend interface is implemented in **Angular**. The frontend communicates with:

- The MySQL database via a backend API (e.g., Node.js or Python Flask/FastAPI)  
- Google Cloud Storage for uploading and retrieving files  

When a user uploads a file (CV, invoice, etc.), the frontend:

1. Requests a signed URL from the backend  
2. Uploads the file directly to GCS  
3. Submits file metadata (type, link, timestamp) to the database  

---

## ER Diagram

![Entity-Relationship Diagram](https://github.com/heghiw/clientse/blob/main/ER)

---

## Tables

### Candidate

| Column        | Type         | Description                      |
|---------------|--------------|----------------------------------|
| candidate_id  | INT          | Primary key                      |
| first_name    | VARCHAR(50)  | Candidate's first name           |
| last_name     | VARCHAR(50)  | Candidate's last name            |
| birth_date    | DATE         | Date of birth                    |
| email         | VARCHAR(100) | Email address                    |
| phone         | VARCHAR(20)  | Phone number                     |
| city          | VARCHAR(100) | City of residence                |
| country       | VARCHAR(100) | Country of residence             |
| date_added    | DATETIME     | When the candidate was added     |
| company_id    | INT          | FK to Company                    |

**Constraints:**

- `PRIMARY KEY (candidate_id)`
- `FOREIGN KEY (company_id)` → `Company(company_id)`

---

### Company

| Column       | Type         | Description       |
|--------------|--------------|-------------------|
| company_id   | INT          | Primary key       |
| name         | VARCHAR(100) | Company name      |
| phone        | VARCHAR(20)  | Contact phone     |
| email        | VARCHAR(100) | Contact email     |
| date_added   | DATETIME     | When added        |

**Constraints:**

- `PRIMARY KEY (company_id)`

---

### Position

| Column       | Type         | Description                     |
|--------------|--------------|---------------------------------|
| candidate_id | INT          | FK to Candidate                 |
| position     | VARCHAR(100) | Desired position                |
| location     | VARCHAR(100) | Location of the position        |
| date_added   | DATETIME     | When the preference was added   |

**Constraints:**

- `FOREIGN KEY (candidate_id)` → `Candidate(candidate_id)`
- `UNIQUE (candidate_id, position, location)` (prevents duplicates)

---

### Candidate_file

| Column        | Type         | Description                          |
|---------------|--------------|--------------------------------------|
| file_id       | INT          | Primary key                          |
| candidate_id  | INT          | FK to Candidate                      |
| file_type     | VARCHAR(50)  | Type of file                         |
| file_url      | TEXT         | Link to file or resource             |
| uploaded_at   | DATETIME     | Upload timestamp                     |

**Constraints:**

- `PRIMARY KEY (file_id)`
- `FOREIGN KEY (candidate_id)` → `Candidate(candidate_id)`

**Allowed values for `file_type`:**

- `cv` – PDF or DOC file  
- `linkedin` – Link to LinkedIn profile (URL)  
- `portfolio` – Either a link or a PDF  

---

### Company_file

| Column        | Type         | Description                                  |
|---------------|--------------|----------------------------------------------|
| file_id       | INT          | Primary key                                  |
| company_id    | INT          | FK to Company                                |
| candidate_id  | INT          | FK to Candidate                              |
| file_type     | VARCHAR(50)  | Type of file (e.g. invoice, timesheet)       |
| file_url      | TEXT         | Link to file                                 |
| month_for     | DATE         | Month the file is related to (e.g. 2025-06)  |
| uploaded_at   | DATETIME     | Upload timestamp                             |

**Constraints:**

- `PRIMARY KEY (file_id)`
- `FOREIGN KEY (company_id)` → `Company(company_id)`
- `FOREIGN KEY (candidate_id)` → `Candidate(candidate_id)`
- `UNIQUE (company_id, candidate_id, file_type, month_for)` — prevents duplicates

**Allowed values for `file_type`:**

- `invoice` – PDF/DOC file for billing  
- `timesheet` – Monthly timesheet per candidate  

---

## Relationships Summary

- `Candidate.company_id` → `Company.company_id`  
- `Position.candidate_id` → `Candidate.candidate_id`  
- `Candidate_file.candidate_id` → `Candidate.candidate_id`  
- `Company_file.company_id` → `Company.company_id`  
- `Company_file.candidate_id` → `Candidate.candidate_id`  
