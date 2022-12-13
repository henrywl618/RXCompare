from flask import Flask, jsonify, request
from scraper import DDNSearch, WellRxSearch

app = Flask(__name__)
DDNSearch = DDNSearch()
WellRxSearch = WellRxSearch()


@app.route("/drugs/names/<search_term>")
def get_drug_names(search_term):
    results = DDNSearch.get_drugnames(search_term)
    names = {"names":[]}
    return jsonify(names)

@app.route("/drugs/forms")
def get_drug_forms():
    forms = {"forms":[]}
    return jsonify(forms)

@app.route("/drugs/doseqty")
def get_doseandqty():
    doseqty = {"doses":[], "quantities":[]}
    return jsonify(doseqty)

@app.route("/drugs/prices")
def get_prices():
    prices = {"wellrx":[], "ddn":[]}
    return jsonify(prices)