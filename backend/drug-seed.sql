\COPY drugnames FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_names.csv' DELIMITER ',' CSV HEADER;

\COPY doses FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_doses (c).csv' DELIMITER ',' CSV HEADER;

\COPY quantities FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_qtys (c).csv' DELIMITER ',' CSV HEADER;

\COPY drugforms FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_forms (c).csv' DELIMITER ',' CSV HEADER;

\COPY drugs FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_name_form.csv' DELIMITER ',' CSV HEADER;

\COPY drug_qty FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_form_qtys (c).csv' DELIMITER ',' CSV HEADER;

\COPY drug_dose FROM '/home/henry/Projects/DrugPriceAPI/backend/csv/medication_form_dose.csv' DELIMITER ',' CSV HEADER;