CREATE TABLE integrate_data (
    id SERIAL PRIMARY KEY,
    data_id INTEGER,
    fx TEXT NOT NULL,
    a FLOAT,
    b FLOAT,
    n INTEGER
);

INSERT INTO integrate_data (data_id, fx, a, b, n) 
VALUES 
(1, 1, 'x^2 + 3x + 1', 2, 5, 10),
(2, 1, 'x^3 - 6x^2 + 4x + 20', -0.5, 4.5, 10);