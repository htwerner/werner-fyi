from api.utils.state_utils import get_state_info, get_county_info


def get_state_dict(state):
    state_info = get_state_info()       # state,state_abbr,region,division
    county_info = get_county_info()     # fips, county, state_abbr
    state_info = county_info.merge(state_info, how="left", on="State Abbreviation")
    state_info = state_info[["State", "County"]]

    if state != "All":
        state_info = state_info[state_info["state"] == state]

    state_dict = {}
    for state in list(state_info["County"].unique()):
        state_dict[state] = state_info[state_info["State"] == state]["County"].to_list()

    return state_dict
