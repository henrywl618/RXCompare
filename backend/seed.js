const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

// create a new connection to the database
const pool = new Pool({
  host: "localhost",
  user: "henry",
  database: "drug",
  password: "11416a",
  port: 5432,
  idleTimeoutMillis: 50000,
});

let stream1 = fs.createReadStream("./csv/medication_names.csv");
let stream2 = fs.createReadStream("./csv/medication_doses (c).csv");
let stream3 = fs.createReadStream("./csv/medication_forms (c).csv");
let stream4 = fs.createReadStream("./csv/medication_qtys (c).csv");
let stream5 = fs.createReadStream("./csv/medication_name_form.csv");
let stream6 = fs.createReadStream("./csv/medication_form_qty.csv");
let stream7 = fs.createReadStream("./csv/medication_form_dose.csv");
let nameData = [];
let doseData = [];
let formData = [];
let qtyData = [];
let nameFormData = [];
let drugQtyData = [];
let drugDoseData = [];


let csvStream1 = fastcsv
    .parse()
    .on("data", function(data) {
      nameData.push(data);
    })
    .on("end", function() {
      // remove the first line: header
      nameData.shift();

      const query =
        "INSERT INTO drugnames (name) VALUES ($1)";

      pool.connect((err, client, release) => {
        if (err) throw err;

        try {
          nameData.forEach(row => {
            client.query(query, row, (err, res) => {
              if (err) {
                console.log(err.stack);
              } else {
                // console.log("inserted " + res.rowCount + " row:", row);
              }
            });
          });
        } finally {
          release();
        }
      });
    });

let csvStream2 = fastcsv
  .parse()
  .on("data", function(data) {
    doseData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    doseData.shift();

    const query =
      "INSERT INTO doses (dose) VALUES ($1)";

    pool.connect((err, client, release) => {
      if (err) throw err;

      try {
        doseData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              // console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        release();
      }
    });
  });

let csvStream3 = fastcsv
  .parse()
  .on("data", function(data) {
    formData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    formData.shift();

    const query =
      "INSERT INTO drugforms (form) VALUES ($1)";

    pool.connect((err, client, release) => {
      if (err) throw err;

      try {
        formData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              // console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        release();
      }
    });
  });

let csvStream4 = fastcsv
  .parse()
  .on("data", function(data) {
    qtyData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    qtyData.shift();

    const query =
      "INSERT INTO quantities (qty) VALUES ($1)";

    pool.connect((err, client, release) => {
      if (err) throw err;

      try {
        qtyData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              // console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        release();
      }
    });
  });

let csvStream5 = fastcsv
  .parse()
  .on("data", function(data) {
    nameFormData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    nameFormData.shift();

    const query =
      "INSERT INTO drugs (name, form) VALUES ($1, $2)";

    pool.connect((err, client, release) => {
      if (err) throw err;

      try {
        nameFormData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(row)
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        console.log("released 5")
        release();
      }
    });
  });

let csvStream6 = fastcsv
  .parse()
  .on("data", function(data) {
    drugQtyData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    drugQtyData.shift();

    const query =
      "INSERT INTO drug_qty (name, form, qty) VALUES ($1, $2, $3)";

    pool.connect((err, client, release) => {
      if (err) throw err;

      try {
        drugQtyData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(row)
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        console.log("released 6")
        release();
      }
    });
  });

let csvStream7 = fastcsv
  .parse()
  .on("data", function(data) {
    drugDoseData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    drugDoseData.shift();

    const query =
      "INSERT INTO drug_dose (name, form, dose) VALUES ($1, $2, $3)";

    pool.connect((err, client, release) => {
      if (err) throw err;

      try {
        drugDoseData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(row)
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        console.log("released 7")
        release();
      }
    });
  });


  
stream1.pipe(csvStream1);
stream2.pipe(csvStream2);
stream3.pipe(csvStream3);
stream4.pipe(csvStream4);
// stream5.pipe(csvStream5);
// stream6.pipe(csvStream6);
// stream7.pipe(csvStream7);


