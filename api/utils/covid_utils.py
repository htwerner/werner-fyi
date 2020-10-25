import io
import requests
import pandas as pd
import numpy as np

from api.utils.state_utils import get_state_info, get_state_electoral_data


def get_virus_data():
    url = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"
    # date, county, state, fips, cases, deaths
    req = requests.get(url).content
    virus_data = pd.read_csv(io.StringIO(req.decode("utf-8")), dtype={"fips": str})
    virus_data = virus_data[pd.notnull(virus_data["fips"])]
    virus_data["date"] = pd.to_datetime(virus_data["date"])
    virus_data = virus_data[virus_data["date"] >= "03-01-2020"]
    virus_data = virus_data.rename(
        columns={
            "date": "Date",
            "county": "County",
            "state": "State",
            "fips": "FIPS",
            "cases": "Cases",
            "deaths": "Deaths"
        }
    )
    return virus_data


def get_virus_political_data():
    virus_data = get_virus_data()
    state_info = get_state_info()
    state_data = get_state_electoral_data()

    state_data["State Winner"] = np.where(
        state_data["Clinton Electors"] > state_data["Trump Electors"],
        "Clinton won",
        "Trump won"
    )
    state_data = state_data[["State", "State Winner"]]
    state_data = state_data.merge(state_info, how="left", on="State")
    state_data = state_data[["Region", "State", "State Winner"]]
    virus_data = virus_data.merge(state_data, how="left", on="State")
    virus_data = virus_data[[
        "Date",
        "Region",
        "State",
        "State Winner",
        "Cases",
        "Deaths"
    ]]
    return virus_data
