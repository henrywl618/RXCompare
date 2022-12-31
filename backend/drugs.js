const db = require("db");


/**Related functions for drugs */

class Drugs {

    /**Add a drugname to db */
    static async addDrugName(drugName){

        // Add code for duplication check

        const result =  await db.query(
            `INSERT INTO drugnames (name)
                VALUES ($1)
                RETURNING name`,
            [drugName]
        )

        const name = result.rows[0];
        return name
    }

    /**Add a drugform to db */
    static async addDrugForm(drugForm){

        // Add code for duplication check

        const result =  await db.query(
            `INSERT INTO drugforms (form)
                VALUES ($1)
                RETURNING form`,
            [drugForm]
        )

        const form = result.rows[0];
        return form
    }

    /**Add a drug (drugname+drugform) to db */
    static async addDrug({name, form}) {

        // Add code for duplication check

        const result = await db.query(
            `INSERT INTO drugs (name, form)
                VALUE ($1, $2)
                RETURNING name, form`,
            [name, form]
        )

        const drug = result.rows[0];
        return drug
    }

    static async addDose (dose) {

        const result = await db.query(
            `INSERT INTO doses (dose)
                VALUE ($1)
                RETURNING dose`,
            [dose]
        )
        const drugDose = result.rows[0];
        return drugDose
    }

    static async addQty (qty) {

        const result = await db.query(
            `INSERT INTO quantities (qty)
                VALUE ($1)
                RETURNING qty`,
            [qty]
        )
        const drugQty = result.rows[0];
        return drugQty
    }

    static async addDrugDose ({name, form}, dose) {

        const result = await db.query(
            `INSERT INTO drug_dose (name, form, dose)
                VALUE ($1, $2, $3)
                RETURNING name, form, dose`,
                [name, form, dose]
        )
        const drugdose = result.rows[0];
        return drugdose
    }

    static async addDrugQty ({name, form}, qty) {

        const result = await db.query(
            `INSERT INTO drug_qty (name, form, qty)
                VALUE ($1, $2, $3)
                RETURNING name, form, qty`,
                [name, form, qty]
        )
        const drugqty = result.rows[0];
        return drugqty
    }

    static async getDrugForms (name) {

        const results = await db.query(
            `SELECT form FROM drugs
                WHERE name=$1
                RETURNING form`,
                [name]
        )
        const forms = results.rows;
        return forms
    }

    static async getDrugDoses ({name, form}) {
        const results = await db.query(
            `SELECT dose FROM drug_dose
                WHERE name=$1 AND form=$2
                RETURNING dose`,
                [name, form]
        )
        return results.rows
    }

    static async getDrugQtys ({name, form}) {
        const results = await db.query(
            `SELECT qty FROM drug_qty
                WHERE name=$1 AND form=$2
                RETURNING qty`,
                [name, form]
        )
        return results.rows
    }
}

module.exports = Drugs;