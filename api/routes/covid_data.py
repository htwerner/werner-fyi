from flask import Blueprint
from services import covid

covid_all = Blueprint('covid_all', __name__)
covid_since_date = Blueprint('covid_since_date', __name__)
covid_since_first = Blueprint('covid_since_first', __name__)


@covid_all.route('/covid-all', methods=['GET'])
def covid_all_data():
    df = covid.get_virus_data()
    df_json = df.to_json(orient='records', date_format='iso')
    return df_json


@covid_since_date.route('/covid-since-date/<category>/<level>/<region>', methods=['GET'])
def covid_since_date_breakdown(category='cases', level='state', region='all'):
    df = covid.since_date_breakdown(category, level, region)
    df_json = df.to_json(orient='records', date_format='iso')
    return df_json


@covid_since_first.route('/covid-since-first/<category>/<level>/<region>', methods=['GET'])
def covid_since_first_breakdown(category, level, region):
    df = covid.since_first_breakdown(category, level, region)
    df_json = df.to_json(orient='records', date_format='iso')
    return df_json
