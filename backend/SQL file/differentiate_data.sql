CREATE TABLE differentiate_data (
    id SERIAL PRIMARY KEY,
    data_id INTEGER,
    fx TEXT NOT NULL,
    x FLOAT,
    h FLOAT
);

INSERT INTO differentiate_data (id, data_id, fx, x, h) 
VALUES 
(1, 1, 'x^5+x^4+x^3+x^2+x', 5, 0.25),
(2, 1, '3x^4+6x^3+9x', 3, 0.5),
(3, 1, '9x^6+8x^2', 7, 0.3),
(4, 1, '3sin(x)^4', 9, 0.125),
(5, 1, '9cos(x)^6', 11, 0.4);