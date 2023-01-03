const db = require("./db");
const axios = require("axios")
const {NotFoundError, BadRequestError} = require("./expressErrors");


/**Related functions for drugs */

class Drugs {

    /**Add a drugname to db 
     * 
     * Will add to the db if it does not exist.
     * 
     * Returns the added/existing drugname
    */
    static async addDrugName(drugName){

        // Add code for duplication check
        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT name
                FROM drugnames
                WHERE name=$1`, [drugName]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result =  await db.query(
            `INSERT INTO drugnames (name)
                VALUES ($1)
                RETURNING name`,
            [drugName]
        )

        const name = result.rows[0];
        return name
    }

    /**Add a drugform to db 
     * 
     * Will add to the db if it does not exist.
     * 
     * Returns the added/existing drugform
    */
    static async addDrugForm(drugForm){

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT form
             FROM drugforms
             WHERE form=$1`, [drugForm]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];
        
        //Add to the table if it doesnt exist
        const result =  await db.query(
            `INSERT INTO drugforms (form)
                VALUES ($1)
                RETURNING form`,
            [drugForm]
        )

        const form = result.rows[0];
        return form
    }

    /**Add a drug (drugname+drugform) to db 
     * 
     * Data should be {drugname, drugform}
     * 
     * Returns drug : {drugname, drugform}
    */
    static async addDrug({name, form}) {

        // Add code for duplication check

        const result = await db.query(
            `INSERT INTO drugs (name, form)
                VALUES ($1, $2)
                RETURNING name, form`,
            [name, form]
        )

        const drug = result.rows[0];
        return drug
    }

    /** Add a drug dose to the db
     * 
     * Will add to db if it does not exist
     * 
     * Returns added/existing drug dose
     */
    static async addDose (dose) {

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT dose
                FROM doses
                WHERE dose=$1`, [dose]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result = await db.query(
            `INSERT INTO doses (dose)
                VALUES ($1)
                RETURNING dose`,
            [dose]
        )
        const drugDose = result.rows[0];
        return drugDose
    }

    /** Add a drug qty to the db
     * 
     * Will add to db if it does not exist
     * 
     * Returns added/existing drug qty
     */
    static async addQty (qty) {

        // Check for duplicate entry, if it exists, return it
        const duplicateCheck = await db.query(
            `SELECT qty
                FROM quantities
                WHERE qty=$1`, [qty]
        )
        if(duplicateCheck.rows[0]) return duplicateCheck.rows[0];

        const result = await db.query(
            `INSERT INTO quantities (qty)
                VALUES ($1)
                RETURNING qty`,
            [qty]
        )
        const drugQty = result.rows[0];
        return drugQty
    }

    static async addDrugDose ({name, form}, dose) {

        const result = await db.query(
            `INSERT INTO drug_dose (name, form, dose)
                VALUES ($1, $2, $3)
                RETURNING name, form, dose`,
                [name, form, dose]
        )
        const drugdose = result.rows[0];
        return drugdose
    }

    static async addDrugQty ({name, form}, qty) {

        const result = await db.query(
            `INSERT INTO drug_qty (name, form, qty)
                VALUES ($1, $2, $3)
                RETURNING name, form, qty`,
                [name, form, qty]
        )
        const drugqty = result.rows[0];
        return drugqty
    }

    static async getDrugForms (name) {

        const results = await db.query(
            `SELECT form FROM drugs
                WHERE name=$1`,
                [name]
        )
        const forms = results.rows.map(row => row.form);
        return forms
    }

    static async getDrugDoses ({name, form}) {
        const results = await db.query(
            `SELECT dose FROM drug_dose
                WHERE name=$1 AND form=$2`,
                [name, form]
        )
        const doses = results.rows.map(row => row.dose);
        return doses
    }

    static async getDrugQtys ({name, form}) {
        const results = await db.query(
            `SELECT qty FROM drug_qty
                WHERE name=$1 AND form=$2`,
                [name, form]
        )
        const qtys = results.rows.map(row => row.qty);
        return qtys
    }

    static async scrapeDrugName (searchTerm) {
        const response = await axios.get(`${DrugScrapeWebAPIURL}/names/${searchTerm}`);
        //Handles error reponses from the scraper api
        if(response.data.message) throw new BadRequestError(response.data.message)
    }

    static async scrapeDrugForms () {

    }

    static async scrapeDrugQtyDoses () {

    }

    static async scrapeDrugPrices () {

    }
}

module.exports = Drugs;