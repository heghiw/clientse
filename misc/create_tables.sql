CREATE TABLE Candidate (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birth_date DATE,
    email VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Position (
    candidate_id INT,
    position VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id),
    UNIQUE (candidate_id, position, location)
);
CREATE TABLE Company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE CandidateFile (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    file_type VARCHAR(50),           -- e.g. 'cv', 'linkedin'
    file_url TEXT,                   -- path to file or LinkedIn link
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id)
);
CREATE TABLE CompanyFile (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    candidate_id INT,
    file_type VARCHAR(50),               -- e.g. 'invoice', 'timesheet'
    file_url TEXT,                       -- GCS link or filepath
    month_for DATE,                      -- the period the file is for
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Company(company_id),
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id),
    UNIQUE (company_id, candidate_id, file_type, month_for)
);
