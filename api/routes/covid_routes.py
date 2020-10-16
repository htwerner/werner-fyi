from flask import Blueprint

from api.models.covid_models import CovidMongoDocument
from api.services import covid_services
from api.utils.db_utils import connect, upsert_document, fetch_document, check_expired_doc

covid_since_date = Blueprint('covid_since_date', __name__)
covid_since_first = Blueprint('covid_since_first', __name__)


@covid_since_date.route('/covid-since-date/<category>/<region>', methods=['GET'])
def covid_since_date_breakdown(category='cases', region='all'):
    _id = "-".join([category, region])
    db = connect("werner-fyi")
    cache_doc = fetch_document(db, _id, _id)
    expired = check_expired_doc(cache_doc, 60) if cache_doc is not None else True
    if cache_doc is None or expired:
        df = covid_services.since_date_breakdown(category, region)
        df_json = df.to_json(orient='records', date_format='iso')
        new_doc = CovidMongoDocument(_id, df_json)
        upsert_document(db, _id, new_doc)
    else:
        df_json = cache_doc["data"]
    return df_json


@covid_since_first.route('/covid-since-first/<category>/<region>', methods=['GET'])
def covid_since_first_breakdown(category='cases', region='all'):
    _id = "-".join([category, region])
    db = connect("werner-fyi")
    cache_doc = fetch_document(db, _id, _id)
    expired = check_expired_doc(cache_doc, 60) if cache_doc is not None else True
    if cache_doc is None or expired:
        df = covid_services.since_first_breakdown(category, region)
        df_json = df.to_json(orient='records', date_format='iso')
        new_doc = CovidMongoDocument(_id, df_json)
        upsert_document(db, _id, new_doc)
    else:
        df_json = cache_doc["data"]
    return df_json
