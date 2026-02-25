CREATE TABLE launches (
    id                  SERIAL PRIMARY KEY,
    company_name        VARCHAR(255) NOT NULL,
    launch_date         DATE NOT NULL,
    video_src_url       TEXT NOT NULL,
    thumbnail_url       TEXT,
    transcript          TEXT,
    tags                VARCHAR(255),
    revenue_at_launch   VARCHAR(100),
    funding_at_launch   VARCHAR(100),
    employees_at_launch INTEGER,
    company_description TEXT,
    company_url         TEXT,
    founded_year        INTEGER,
    founders            TEXT,
    headquarters        VARCHAR(255),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_launches_launch_date ON launches (launch_date DESC);
CREATE INDEX idx_launches_company_name ON launches (company_name);
CREATE INDEX idx_launches_tags ON launches (tags);
CREATE INDEX idx_launches_founded_year ON launches (founded_year);
