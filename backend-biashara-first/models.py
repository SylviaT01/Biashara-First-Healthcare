from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Business Model
class Business(db.Model):
    __tablename__ = 'businesses'
    
    id = db.Column(db.Integer, primary_key=True)
    business_owner= db.Column(db.String(100), nullable=False)
    business_name = db.Column(db.String(100), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    email= db.Column(db.String(100), nullable=False, unique=True)
    address = db.Column(db.String(200), nullable=False)
    business_type = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    
    def __repr__(self):
        return f'<Business {self.name} - {self.address}>'

# Hospital Model
class Hospital(db.Model):
    __tablename__ = 'hospitals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    services = db.Column(db.String(500), nullable=True) 
    contact_info = db.Column(db.String(100), nullable=True)
    
    def __repr__(self):
        return f'<Hospital {self.name} - {self.address}>'

if __name__ == '__main__':
    app.run(debug=True)