import pymongo
from datetime import datetime


def connect(db_name):
    client = pymongo.MongoClient(
        "mongodb+srv://werner-fyi:werner-fyi@cluster0.ncsjk.mongodb.net/" +
        db_name +
        "?retryWrites=true&w=majority"
    )
    db = client[db_name]
    return db


def upsert_document(db, collection, document):
    col = db[collection]
    col.save(document)


def fetch_document(db, collection, _id):
    col = db[collection]
    query = {"_id": _id}
    docs = col.find_one(query)
    return docs


def check_expired_doc(document, expiration_minutes):
    updated_at = datetime.strptime(document["updated_at"], "%m/%d/%Y, %H:%M:%S")
    now = datetime.now()
    elapsed_minutes = (now - updated_at).seconds / 60
    expired = True if elapsed_minutes > expiration_minutes else False
    return expired
