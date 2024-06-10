from faker import Faker
from datetime import datetime, timedelta
import bcrypt
import random

# Initialize Faker
fake = Faker()

# Function to generate a unique email
def generate_unique_email():
    while True:
        email = fake.email()
        if email not in emails:
            emails.add(email)
            return email

# Function to generate a unique phone number
def generate_unique_phone_number():
    while True:
        phone_number = fake.phone_number()
        if phone_number not in phone_numbers:
            phone_numbers.add(phone_number)
            return phone_number

# Initialize unique sets
emails = set()
phone_numbers = set()

# Generate 50 customer records
customers = []
for _ in range(50):
    password = bcrypt.hashpw(fake.password().encode('utf-8'), bcrypt.gensalt())
    customer = {
        "_id": {"$oid": fake.uuid4()},
        "name": fake.name(),
        "email": generate_unique_email(),
        "password": password.decode('utf-8'),
        "phoneNumber": generate_unique_phone_number(),
        "address": fake.address(),
        "dateOfBirth": {"$date": fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=90).isoformat() + "Z"},
        "resetToken": None,
        "isAdmin": False,
        "totalSpends": random.randint(1000, 50000),
        "visits": random.randint(1, 100),
        "lastVisit": {"$date": (datetime.now() - timedelta(days=random.randint(365, 2000))).isoformat() + "Z"},
        "createdAt": {"$date": fake.date_this_year(before_today=True, after_today=False).isoformat() + "Z"},
        "updatedAt": {"$date": fake.date_this_year(before_today=True, after_today=False).isoformat() + "Z"},
        "__v": 0
    }
    customers.append(customer)

customers
