from flask import Blueprint, request

from api.models.covid_models import CovidMongoDocument
from api.services import covid_services
from api.utils.db_utils import connect, upsert_document, fetch_document, check_expired_doc

covid_summary = Blueprint("covid_summary", __name__)
covid_since_date = Blueprint("covid_since_date", __name__)
covid_since_first = Blueprint("covid_since_first", __name__)

category_options = frozenset(["Cases", "Deaths"])


@covid_summary.route("/covid-all", methods=["POST"])
def covid_summary_data():
    request_body = request.get_json(force=True)
    if "category" in request_body:
        category = request_body["category"]
        if category not in category_options:
            category = "Cases"
    else:
        category = "Cases"

    region = "All"
    state = "All"
    county = "All"
    if "region" in request_body:
        region = request_body["region"]
        if "state" in request_body:
            state = request_body["state"]
            if "county" in request_body:
                county = request_body["county"]

    df = covid_services.summary_data(category, region, state, county)
    df_json = df.to_json(orient="records", date_format="iso")
    return df_json


@covid_since_date.route("/covid-since-date", methods=["POST"])
def covid_since_date_breakdown(category="cases", region="all"):
    request_body = request.get_json(force=True)
    if "category" in request_body:
        category = request_body["category"]
        if category not in category_options:
            category = "Cases"
    else:
        category = "Cases"

    region = request_body["region"] if "region" in request_body else "All"

    _id = "-".join([category, region])
    db = connect("covid-since-date")
    cache_doc = fetch_document(db, _id, _id)
    expired = check_expired_doc(cache_doc, 60) if cache_doc is not None else True
    if cache_doc is None or expired:
        df = covid_services.since_date_breakdown(category, region)
        df_json = df.to_json(orient="records", date_format="iso")
        new_doc = CovidMongoDocument(_id, df_json)
        upsert_document(db, _id, new_doc)
    else:
        df_json = cache_doc["data"]
    return df_json


@covid_since_first.route("/covid-since-first", methods=["POST"])
def covid_since_first_breakdown(category="cases", region="all"):
    request_body = request.get_json(force=True)
    if "category" in request_body:
        category = request_body["category"]
        if category not in category_options:
            category = "Cases"
    else:
        category = "Cases"

    region = request_body["region"] if "region" in request_body else "All"

    _id = "-".join([category, region])
    db = connect("covid-since-first")
    cache_doc = fetch_document(db, _id, _id)
    expired = check_expired_doc(cache_doc, 60) if cache_doc is not None else True
    if cache_doc is None or expired:
        df = covid_services.since_first_breakdown(category, region)
        df_json = df.to_json(orient="records", date_format="iso")
        new_doc = CovidMongoDocument(_id, df_json)
        upsert_document(db, _id, new_doc)
    else:
        df_json = cache_doc["data"]
    return df_json
