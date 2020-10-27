from flask import Blueprint, request

from api.services.state_services import get_state_dict

state_info = Blueprint("state_info", __name__)


@state_info.route("/state-info", methods=["GET"])
def state_info_data():
    return get_state_dict()
