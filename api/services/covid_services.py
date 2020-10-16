import numpy as np

from api.utils.covid_utils import get_data


def since_date_breakdown(category, region):
    data = get_data()
    if region != 'all':
        data = data[data['region'] == region.capitalize()]

    data = data[['date', category, 'state_winner']]

    df = data.groupby(['state_winner', 'date'])\
        .agg({category: 'sum'})\
        .fillna(0)\
        .reset_index()
    df['New ' + category.capitalize()] = df[category].diff()
    df['New ' + category.capitalize()] = np.where(
      df['state_winner'] != df['state_winner'].shift(1),
      np.nan,
      df['New ' + category.capitalize()]
    )
    df = df.sort_values(['state_winner', 'date'])

    df['date'] = df['date'].dt.strftime('%m-%d-%Y')

    df = df.rename(
        columns={
            'date': 'Date',
            category: 'Total ' + category.capitalize(),
            'state_winner': 'State Winner'
        }
    )
    return df


def since_first_breakdown(category, region):
    data = get_data()
    if region != 'all':
        data = data[data['region'] == region.capitalize()]

    data = data[['date', 'state', category, 'state_winner']]

    # Group by date and state or county, and sum cases
    df = data.groupby(['date', 'state', 'state_winner'])[category]\
        .apply(sum)\
        .fillna(0)\
        .reset_index()

    # Group by state or county and assign day numbers since first case or death
    df['days_since_first_' + category[:-1]] = df.sort_values('date')\
                                                .groupby(['state'])\
                                                .cumcount()+1

    # Find last day where all states have COVID and filter past
    max_days = min(
        df.groupby(['state']).agg({'days_since_first_' + category[:-1]: max})['days_since_first_' + category[:-1]]
    )
    df = df[df['days_since_first_' + category[:-1]] <= max_days]

    # Group by state or county winner and days since first case or death, and sum cases
    df = df.groupby(['state_winner', 'days_since_first_' + category[:-1]])[category]\
        .apply(sum)\
        .fillna(0)\
        .reset_index()

    df['New ' + category.capitalize()] = df[category].diff()
    df['New ' + category.capitalize()] = np.where(
        df['state_winner'] != df['state_winner'].shift(1),
        np.nan,
        df['New ' + category.capitalize()]
    )
    df = df.sort_values(['state_winner', 'days_since_first_' + category[:-1]])

    df = df.rename(
        columns={
            'date': 'Date',
            category: 'Total ' + category.capitalize(),
            'days_since_first_' + category[:-1]: 'Days Since First ' + category[:-1].capitalize(),
            'state_winner': 'State Winner'
        }
    )
    return df
