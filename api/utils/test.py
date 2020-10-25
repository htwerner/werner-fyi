import io
import requests
import pandas as pd

url = "https://raw.githubusercontent.com/kjhealy/fips-codes/master/state_and_county_fips_master.csv"
req = requests.get(url).content
data = pd.read_csv(io.StringIO(req.decode("utf-8")), dtype={"fips": str})

for county in data["name"].to_list():
    print("-", county)
