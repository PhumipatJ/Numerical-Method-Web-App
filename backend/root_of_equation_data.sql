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

INSERT INTO root_of_equation_data (id,data_id, fx, xl, xr, initial_x, initial_first_x, initial_second_x)
VALUES
(1, 1, 'x^3 - 6x^2 + 4x + 12', 1, 5, NULL, NULL, NULL),
(2, 1, 'x^4 - 13', 1, 5, NULL, NULL, NULL),
(3, 2, '((x^2)+7) / 2x', NULL, NULL, 1, NULL, NULL),
(4, 3, '(x^2)-7', NULL, NULL, 1, NULL, NULL),
(5, 4, '(x^2)-7', NULL, NULL, NULL, 1, 5);
