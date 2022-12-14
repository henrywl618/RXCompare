from flask import Flask, jsonify, request
from scraper import DDNSearch, WellRxSearch

app = Flask(__name__)
DDNSearch = DDNSearch()
WellRxSearch = WellRxSearch()


@app.route("/drugs/names/<search_term>")
def get_drug_names(search_term):
    results = DDNSearch.get_drugnames(search_term)
    names = {"names":results}
    return jsonify(names)

@app.route("/drugs/forms")
def get_drug_forms():
    drug_name = request.json.get("name")
    zip_code = request.json.get("zip")
    results = DDNSearch.get_drugforms(drug_name, zip_code)
    forms = {"forms":results}
    return jsonify(forms)

@app.route("/drugs/doseqty")
def get_doseandqty():
    drug_name = request.json.get("name")
    zip_code = request.json.get("zip")
    form = request.json.get("form")
    results = DDNSearch.get_doseandqty(drug_name, zip_code, form)
    return jsonify(results)

@app.route("/drugs/prices")
def get_prices():
    prices = {"wellrx":[], "ddn":[]}
    return jsonify(prices)