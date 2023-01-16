CREATE TABLE drugnames (
    name VARCHAR(40) PRIMARY KEY
);

CREATE TABLE drugforms (
    form VARCHAR(25) PRIMARY KEY
);

CREATE TABLE doses (
    dose VARCHAR(25) PRIMARY KEY
);

CREATE TABLE quantities (
    qty VARCHAR(40) PRIMARY KEY
);

CREATE TABLE drugs (
    name VARCHAR(40) 
        REFERENCES drugnames ON DELETE CASCADE,
    form VARCHAR(25)
        REFERENCES drugforms ON DELETE CASCADE,
    PRIMARY KEY(name, form)
);

CREATE TABLE drug_dose (
    name VARCHAR(40) NOT NULL, 
    form VARCHAR(25) NOT NULL,
    dose VARCHAR(25) NOT NULL
        REFERENCES doses ON DELETE CASCADE,
    PRIMARY KEY(name, form, dose),
    FOREIGN KEY(name, form) REFERENCES drugs(name, form)
);

CREATE TABLE drug_qty (
    name VARCHAR(40) NOT NULL, 
    form VARCHAR(25) NOT NULL,
    qty VARCHAR(40) NOT NULL
        REFERENCES quantities ON DELETE CASCADE,
    PRIMARY KEY(name, form, qty),
    FOREIGN KEY(name, form) REFERENCES drugs(name, form)
);

