from api.utils.state_utils import get_state_info, get_county_info


def get_state_dict():
    state_info = get_state_info()
    county_info = get_county_info()
    state_info = county_info.merge(state_info, how="left", on="State Abbreviation")
    state_info = state_info[["Region", "State", "County"]]
    state_info = state_info.dropna()

    state_dict = {}
    for region in list(state_info["Region"].unique()):
        temp_df = state_info[state_info["Region"] == region]
        temp_dict = {
            state: temp_df[temp_df["State"] == state]["County"].to_list() for state in list(temp_df["State"].unique())
        }
        state_dict[region] = temp_dict

    return state_dict
