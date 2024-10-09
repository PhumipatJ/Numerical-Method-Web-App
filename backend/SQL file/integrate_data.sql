CREATE TABLE integrate_data (
    id SERIAL PRIMARY KEY,
    data_id INTEGER,
    fx TEXT NOT NULL,
    a FLOAT,
    b FLOAT,
    n INTEGER
);