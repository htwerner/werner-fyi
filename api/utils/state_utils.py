import io
import requests
import pandas as pd


def get_state_info():
    url = "https://raw.githubusercontent.com/cphalpert/census-regions/master/us%20census%20bureau%20regions%20and%20divisions.csv"
    # State, State Code, Region, Division
    req = requests.get(url).content
    state_info = pd.read_csv(io.StringIO(req.decode("utf-8")))
    state_info = state_info.rename(
        columns={
            "State Code": "State Abbreviation"
        }
    )
    return state_info


def get_county_info():
    url = "https://raw.githubusercontent.com/kjhealy/fips-codes/master/state_and_county_fips_master.csv"
    # fips, name, state
    req = requests.get(url).content
    county_info = pd.read_csv(io.StringIO(req.decode("utf-8")), dtype={"fips": str})
    county_info = county_info.rename(
        columns={
            "fips": "FIPS",
            "name": "County",
            "state": "State Abbreviation"
        }
    )
    return county_info


def get_state_electoral_data():
    url = "https://raw.githubusercontent.com/kshaffer/election2016/master/2016ElectionResultsByState.csv"
    # state, postal, clintonVotes, clintonElectors, trumpVotes, trumpElectors, johnsonVotes, steinVotes, mcmullinVotes,
    # othersVotes, totalVotes
    req = requests.get(url).content
    state_data = pd.read_csv(io.StringIO(req.decode("utf-8")))
    state_data = state_data[["state", "postal", "clintonVotes", "clintonElectors", "trumpVotes", "trumpElectors"]]
    state_data = state_data.rename(
        columns={
            "state": "State",
            "postal": "State Abbreviation",
            "clintonVotes": "Clinton Votes",
            "clintonElectors": "Clinton Electors",
            "trumpVotes": "Trump Votes",
            "trumpElectors": "Trump Electors",
        }
    )
    return state_data
