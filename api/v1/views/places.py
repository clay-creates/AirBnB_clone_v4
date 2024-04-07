#!/usr/bin/python3
""" API views for Places objects
Allows routes to list, get, delete, create, and update Places
as requested. """

from flask import jsonify, abort, request
from models import storage
from models.city import City
from models.user import User
from models.place import Place
from models.amenity import Amenity
from api.v1.views import app_views


@app_views.route('/cities/<city_id>/places', methods=['GET'],
                 strict_slashes=False)
def get_places(city_id):
    """Returns a list of all Place objects of the specified City"""
    city = storage.get(City, city_id)
    if not city:
        abort(404)
    return jsonify([place.to_dict() for place in city.places])


@app_views.route('/places/<place_id>', methods=['GET'],
                 strict_slashes=False)
def get_place(place_id):
    """Returns a Place"""
    place = storage.get(Place, place_id)
    if not place:
        abort(404)
    return jsonify(place.to_dict())


@app_views.route('/cities/<city_id>/places', methods=['POST'],
                 strict_slashes=False)
def create_place(city_id):
    """Creates a Place in the specified City"""
    # Check if the Content-Type is application/json
    if request.content_type != 'application/json':
        abort(400,
              description="Invalid Content-Type. Expects 'application/json'")
    city = storage.get(City, city_id)
    if not city:
        abort(404)
    place_data = request.get_json()
    if not place_data:
        abort(400, description="Not a JSON")
    if 'user_id' not in place_data:
        abort(400, description="Missing user_id")
    if 'name' not in place_data:
        abort(400, description="Missing name")
    user = storage.get(User, place_data['user_id'])
    if not user:
        abort(404)
    place = Place(**place_data)
    place.city_id = city_id
    place.save()
    return jsonify(place.to_dict()), 201


@app_views.route('/places/<place_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_place(place_id):
    """Deletes a Place"""
    place = storage.get(Place, place_id)
    if not place:
        abort(404)
    storage.delete(place)
    storage.save()
    return jsonify({}), 200


@app_views.route('/places/<place_id>', methods=['PUT'],
                 strict_slashes=False)
def update_place(place_id):
    """Updates a place"""
    # Check if the Content-Type is application/json
    if request.content_type != 'application/json':
        abort(400,
              description="Invalid Content-Type. Expects 'application/json'")
    place = storage.get(Place, place_id)
    if not place:
        abort(404)
    place_data = request.get_json()
    if not place_data:
        abort(400, description="Not a JSON")
    for key, value in place_data.items():
        if key not in ['id', 'user_id', 'city_id', 'created_at', 'updated_at']:
            setattr(place, key, value)
    place.save()
    return jsonify(place.to_dict()), 200

@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
def places_search():
    """ Retrieves all Place objects based on JSON in request """
    if not request.is_json:
        abort(400, description="Not a JSON request")
    
    data = request.get_json()
    filters = []
    
    if 'states' in data and data['states']:
        city_ids = [city.id for city in storage.all(City).filter(City.state_id.in_(data['states']))]
        filters.append(Place.city_id.in_(city_ids))
    
    if 'cities' in data and data['cities']:
        filters.append(Place.city_id.in_(data['Cities']))
    
    if 'amenities' in data and data['amenities']:
        filters.append(Place.amenities.any(Amenity.id.in_(data['amenities'])))
    
    if not filters:
        places = storage.all(Place)
    else:
        places = storage.all(Place).filter(*filters)
    
    places_json = [place.to_dict() for place in places]
    return jsonify(places_json)

