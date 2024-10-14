from flask import Flask, request, jsonify
from models import db, Business, Hospital
from flask_migrate import Migrate
from geopy.distance import geodesic

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital_locator.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)


@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Business & Hospital Locator API!"})


@app.route('/register_business', methods=['POST'])
def register_business():
    data = request.json
    new_business = Business(
        name=data['name'],
        address=data['address'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        contact_info=data.get('contact_info')
    )
    db.session.add(new_business)
    db.session.commit()
    
    return jsonify({'message': f'Business {new_business.name} registered successfully!'}), 201


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

if __name__ == '__main__':
    app.run(debug=True)
