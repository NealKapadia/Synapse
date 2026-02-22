import os

env_path = ".env.local"
with open(env_path, "a") as f:
    f.write("\nTWILIO_ACCOUNT_SID=ACb7f1c0229095206cfc9200ee7be6d832\n")
    f.write("TWILIO_AUTH_TOKEN=2bd7cfdad56403eea74343570091830f\n")
    f.write("TWILIO_PHONE_NUMBER=1234567890\n")  # Mock number as user didn't provide one
