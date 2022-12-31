INSERT INTO drugnames (name)
VALUES ('AMOXICILLIN');

INSERT INTO drugforms (form)
VALUES 	('Capsule'),
		('Oral Suspension'),
		('Tablet'),
		('Chewable Tablet');

INSERT INTO doses (dose)
VALUES 	('125 MG/5ML'),
		('200 MG/5ML'),
		('250 MG/5ML'),
		('400 MG/5ML');

INSERT INTO quantities (qty)
VALUES 	('75'),
		('100'),
		('150'),
		('200'),
		('300');

INSERT INTO drugs (name, form)
VALUES ('AMOXICILLIN', 'Capsule'),
       ('AMOXICILLIN', 'Oral Suspension'),
       ('AMOXICILLIN', 'Tablet'),
       ('AMOXICILLIN', 'Chewable Tablet');

INSERT INTO drug_dose (name, form, dose)
VALUES 	('AMOXICILLIN', 'Oral Suspension', '125 MG/5ML'),
		('AMOXICILLIN', 'Oral Suspension', '200 MG/5ML'),
		('AMOXICILLIN', 'Oral Suspension', '250 MG/5ML'),
		('AMOXICILLIN', 'Oral Suspension', '400 MG/5ML');

INSERT INTO drug_qty (name, form, qty)
VALUES 	('AMOXICILLIN', 'Oral Suspension', '75'),
		('AMOXICILLIN', 'Oral Suspension', '100'),
		('AMOXICILLIN', 'Oral Suspension', '150'),
		('AMOXICILLIN', 'Oral Suspension', '200'),
		('AMOXICILLIN', 'Oral Suspension', '300');