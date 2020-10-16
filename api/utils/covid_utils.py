import io
import requests
import pandas as pd
import numpy as np


def get_virus_data():
    url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'
    req = requests.get(url).content
    virus_data = pd.read_csv(io.StringIO(req.decode('utf-8')), dtype={'fips': str})
    virus_data = virus_data[pd.notnull(virus_data['fips'])]
    virus_data['date'] = pd.to_datetime(virus_data['date'])
    virus_data = virus_data[virus_data['date'] >= '03-01-2020']
    virus_data = virus_data[['fips', 'date', 'cases', 'deaths']]
    return virus_data


def get_state_info():
    url = 'https://raw.githubusercontent.com/cphalpert/census-regions/master/us%20census%20bureau%20regions%20and%20divisions.csv'
    req = requests.get(url).content
    state_info = pd.read_csv(io.StringIO(req.decode('utf-8')))
    state_info.columns = map(str.lower, state_info.columns)
    state_info.columns = state_info.columns.str.replace(' ', '_')
    state_info = state_info.rename(columns={'state_code': 'state_abbr'})
    return state_info


def get_state_data():
    url = 'https://raw.githubusercontent.com/kshaffer/election2016/master/2016ElectionResultsByState.csv'
    req = requests.get(url).content
    return pd.read_csv(io.StringIO(req.decode('utf-8')))


def get_county_data():
    url = 'https://raw.githubusercontent.com/tonmcg/US_County_Level_Election_Results_08-16/master/US_County_Level_Presidential_Results_12-16.csv'
    req = requests.get(url).content
    return pd.read_csv(io.StringIO(req.decode('utf-8')), dtype={'combined_fips': str})


def get_data():
    virus_data = get_virus_data()
    state_info = get_state_info()
    state_data = get_state_data()
    county_data = get_county_data()

    state_data['state_winner'] = np.where(
        state_data['clintonElectors'] > state_data['trumpElectors'],
        'Clinton won',
        'Trump won'
    )
    state_data = state_data.rename(columns={'postal': 'state_abbr'})
    state_data = state_data[['state_abbr', 'state_winner']]

    county_data = county_data.rename(
        columns={
            'combined_fips': 'fips',
            'county_name': 'county',
            'votes_dem_2016': 'votes_dem',
            'votes_gop_2016':'votes_gop'
        }
    )
    county_data['fips'] = county_data['fips'].apply(lambda x: x.zfill(5))
    county_data = county_data.merge(state_info, how='left', on='state_abbr')
    county_data = county_data[['fips', 'region', 'state_abbr', 'state', 'county', 'votes_dem', 'votes_gop']]
    county_data['county_winner'] = np.where(
        county_data['votes_dem'] > county_data['votes_gop'],
        'Clinton won',
        'Trump won'
    )
    county_data = county_data.merge(state_data, how='left', on='state_abbr')

    virus_data = virus_data.merge(county_data, how='left', on='fips')
    virus_data = virus_data[[
        'fips',
        'state',
        'county',
        'date',
        'cases',
        'deaths',
        'region',
        'state_winner',
        'county_winner',
    ]]

    return virus_data
