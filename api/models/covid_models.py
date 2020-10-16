from datetime import datetime


class CovidMongoDocument:
    def __init__(self, _id, data):
        self._id = _id
        self.updated_at = datetime.strftime(datetime.now(), "%m/%d/%Y, %H:%M:%S")
        self.data = data
