from flask import Flask, request, jsonify
from models import db, Business, Hospital
from flask_migrate import Migrate
from flask_cors import CORS
from geopy.distance import geodesic
import os

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital_locator.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)
CORS(app)


@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Business & Hospital Locator API!"})


@app.route('/register_business', methods=['POST'])
def register_business():
    data = request.json
    new_business = Business(
        business_owner=data['business_owner'],
        business_name=data['business_name'],
        contact_number=data['contact_number'],
        email=data['email'],
        address=data['address'],
        business_type=data['business_type'],
        description=data['description'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        
    )
    db.session.add(new_business)
    db.session.commit()
    
    return jsonify({'message': f'Business {new_business.business_name} registered successfully!'}), 201


@app.route('/register_hospital', methods=['POST'])
def register_hospital():
    data = request.json
    new_hospital = Hospital(
        name=data['name'],
        address=data['address'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        services=data.get('services'),
        contact_info=data.get('contact_info')
    )
    db.session.add(new_hospital)
    db.session.commit()
    
    return jsonify({'message': f'Hospital {new_hospital.name} registered successfully!'}), 201

# Route to find nearby hospitals based on business location
@app.route('/nearby_hospitals', methods=['GET'])
def nearby_hospitals():
    latitude = float(request.args.get('latitude'))
    longitude = float(request.args.get('longitude'))
    radius_km = float(request.args.get('radius', 5)) 

    business_coords = (latitude, longitude)
    nearby_hospitals = []
    
    # Fetch all hospitals
    all_hospitals = Hospital.query.all()
    
    for hospital in all_hospitals:
        hospital_coords = (hospital.latitude, hospital.longitude)
        distance = geodesic(business_coords, hospital_coords).km
        
        if distance <= radius_km:
            nearby_hospitals.append({
                'name': hospital.name,
                'address': hospital.address,
                'latitude': hospital.latitude,
                'longitude': hospital.longitude,
                'services': hospital.services,
                'contact_info': hospital.contact_info,
                'distance_km': round(distance, 2)
            })

    return jsonify({'nearby_hospitals': nearby_hospitals}), 200

# Route to fetch all businesses to be rendered on the map
@app.route('/businesses', methods=['GET'])
def get_businesses():
    # Fetch all businesses
    all_businesses = Business.query.all()
    
    # Create a list of businesses with relevant details
    businesses_data = [{
        'business_name': business.business_name,
        'latitude': business.latitude,
        'longitude': business.longitude,
        'business_owner': business.business_owner,
        'contact_number': business.contact_number,
        'email': business.email,
        'address': business.address,
        'business_type': business.business_type,
        'description': business.description
    } for business in all_businesses]

    return jsonify({'businesses': businesses_data}), 200


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
