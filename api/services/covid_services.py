import numpy as np

from api.utils.covid_utils import get_virus_political_data, get_virus_data
from api.utils.state_utils import get_state_info, get_county_info


def summary_data(category, region, state, county):
    covid_data = get_virus_data()
    if region != "All":
        state_data = get_state_info()
        covid_data = covid_data.merge(state_data, how="left", on="State")
        if region != "All":
            covid_data = covid_data[covid_data["Region"] == region]
            if state != "All":
                covid_data = covid_data[covid_data["State"] == state]
                if county != "All":
                    county_data = get_county_info()
                    covid_data = covid_data.merge(county_data, how="left", on="fips")
                    covid_data = covid_data[covid_data["County"] == county]

    covid_data = covid_data[["Date", category]]
    df = covid_data.groupby(["Date"]) \
        .agg({category: "sum"}) \
        .fillna(0) \
        .reset_index()
    df["New " + category.capitalize()] = df[category].diff()
    df["Date"] = df["Date"].dt.strftime("%m-%d-%Y")
    df = df.rename(
        columns={
            category: "Total " + category.capitalize()
        }
    )
    return df


def since_date_breakdown(category, region):
    data = get_virus_political_data()
    if region != "All":
        data = data[data["Region"] == region.capitalize()]

    data = data[["Date", category, "State Winner"]]

    df = data.groupby(["State Winner", "Date"])\
        .agg({category: "sum"})\
        .fillna(0)\
        .reset_index()
    df["New " + category.capitalize()] = df[category].diff()
    df["New " + category.capitalize()] = np.where(
      df["State Winner"] != df["State Winner"].shift(1),
      np.nan,
      df["New " + category.capitalize()]
    )
    df = df.sort_values(["State Winner", "Date"])

    df["Date"] = df["Date"].dt.strftime("%m-%d-%Y")

    df = df.rename(
        columns={
            category: "Total " + category.capitalize()
        }
    )
    return df


def since_first_breakdown(category, region):
    data = get_virus_political_data()
    if region != "All":
        data = data[data["Region"] == region]

    data = data[["Date", "State", category, "State Winner"]]

    # Group by date and state or county, and sum cases
    df = data.groupby(["Date", "State", "State Winner"])[category]\
        .apply(sum)\
        .fillna(0)\
        .reset_index()

    # Group by state or county and assign day numbers since first case or death
    df["Days Since First Case"] = df.sort_values("Date")\
                                      .groupby(["State"])\
                                      .cumcount()+1

    # Find last day where all states have COVID and filter past
    max_days = min(
        df.groupby(["State"]).agg({"Days Since First Case": max})["Days Since First Case"]
    )
    df = df[df["Days Since First Case"] <= max_days]

    # Group by state or county winner and days since first case, and sum cases
    df = df.groupby(["State Winner", "Days Since First Case"])[category]\
        .apply(sum)\
        .fillna(0)\
        .reset_index()

    df["New " + category.capitalize()] = df[category].diff()
    df["New " + category.capitalize()] = np.where(
        df["State Winner"] != df["State Winner"].shift(1),
        np.nan,
        df["New " + category.capitalize()]
    )
    df = df.sort_values(["State Winner", "Days Since First Case"])

    df = df.rename(
        columns={
            category: "Total " + category.capitalize()
        }
    )
    return df
