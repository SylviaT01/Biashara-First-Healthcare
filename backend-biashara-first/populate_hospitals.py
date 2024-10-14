import json
from models import db, Hospital
from app import app

geojson_file ='./Hospital_locations.geojson'

# Load the geoJSON data
with open(geojson_file, 'r') as f:
    geojson_data = json.load(f)

# Initialize Flask app context
with app.app_context():
    # Iterate over the features in the geoJSON file
    for feature in geojson_data['features']:
        hospital_name = feature['properties'].get('name')
        hospital_address = feature['properties'].get('address', 'Unknown')  
        latitude = feature['geometry']['coordinates'][1]
        longitude = feature['geometry']['coordinates'][0]
        services = feature['properties'].get('services', 'No services listed')
        contact_info = feature['properties'].get('contact_info', 'No contact info')
        
        # Create new Hospital object
        new_hospital = Hospital(
            name=hospital_name,
            address=hospital_address,
            latitude=latitude,
            longitude=longitude,
            services=services,
            contact_info=contact_info
        )

       
        db.session.add(new_hospital)

    
    db.session.commit()

print("Hospitals have been successfully added to the database!")
