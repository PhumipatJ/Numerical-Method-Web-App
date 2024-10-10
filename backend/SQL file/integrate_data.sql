CREATE TABLE integrate_data (
    id SERIAL PRIMARY KEY,
    data_id INTEGER,
    fx TEXT NOT NULL,
    a FLOAT,
    b FLOAT,
    n INTEGER
);

INSERT INTO integrate_data (id, data_id, fx, a, b, n) 
VALUES 
(1, 1, 'x^2 + 3x + 1', 2, 5, 5),
(2, 1, 'x^3 - 6x^2 + 4x + 12', -0.5, 4.5, 3),
(3, 1, 'x^3 + 5x -35', 1, 6, 7),
(4, 1, 'cos(x)-x', -5, 5, 10),
(5, 1, 'e^(x/4))(2-x)-1', -2, 3, 8),
(6, 1, 'cos(x)', 2, 6, 2),
(7, 1, 'sin(x)^5', 2, 6, 8),
(8, 1, 'x^3+8x+5', 2, 5, 4);
