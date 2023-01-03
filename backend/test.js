const Drugs = require("./drugs");
const db = require("./db");

const d = async (name) => {
    const y = await Drugs.getDrugForms(name)
    console.log(y)
};

const x = async ({name, form}) => {
    const y = await Drugs.getDrugDoses({name, form})
    console.log(y)
};

const z = async ({name, form}) => {
     const y = await Drugs.getDrugQtys({name, form})
    console.log(y)
};

d("AMOXICILLIN");
d("test");
x({name:"AMOXICILLIN", form:"Oral Suspension"});
z({name:"AMOXICILLIN", form:"Oral Suspension"});
