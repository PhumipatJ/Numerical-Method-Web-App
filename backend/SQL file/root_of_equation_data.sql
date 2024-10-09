CREATE TABLE root_of_equation_data (
    id SERIAL PRIMARY KEY,
    data_id INTEGER,
    fx TEXT NOT NULL,
    xl NUMERIC(10, 5),
    xr NUMERIC(10, 5),
    initial_x NUMERIC(10, 5),
    initial_first_x NUMERIC(10, 5),
    initial_second_x NUMERIC(10, 5)
);

INSERT INTO root_of_equation_data (id, data_id, fx, xl, xr, initial_x, initial_first_x, initial_second_x)
VALUES
(1, 1, 'x^3 - 6x^2 + 4x + 12', 1, 5, NULL, NULL, NULL),
(2, 1, 'x^4 - 13', 1, 3, NULL, NULL, NULL),
(3, 1, 'x^3 + 5x -35', 1, 5, NULL, NULL, NULL),
(4, 1, '9x^3-54', -5, 5, NULL, NULL, NULL),
(5, 1, 'cos(x)-x', -5, 5, NULL, NULL, NULL),

(6, 2, '((x^2)+7) / 2x', NULL, NULL, 1, NULL, NULL),
(7, 2, '(1+43x)/86', NULL, NULL, 4.5, NULL, NULL),
(8, 2, '(e^(x/4))(2-x)-1', NULL, NULL, -4, NULL, NULL),

(9, 3, '(x^2)-7', NULL, NULL, 1, 1, 5),
(10, 3, 'cos(x)', NULL, NULL, 3, -4, -1),
(11, 3, 'cos(x)-x', NULL, NULL, 3, -4, -1),
(12, 3, 'sin(x)^5', NULL, NULL, -1.5, -2, 1),
(13, 3, 'x^3-7x+4', NULL, NULL, 4.5, -4.5, -1);




(12, 4, '(x^2)-7', NULL, NULL, NULL, 1, 5);
(13, 4, 'cos(x)', NULL, NULL, NULL, -4, -1);
(14, 4, 'cos(x)-x', NULL, NULL, NULL, -4, -1);
(15, 4, 'x^3-7x+4', NULL, NULL, NULL, -4.5, -1);

