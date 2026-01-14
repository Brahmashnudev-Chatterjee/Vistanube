import sys
import os

# Add backend root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import get_db_connection

with open("database/schema.sql", "r") as f:
    schema = f.read()

conn = get_db_connection()
conn.executescript(schema)
conn.commit()
conn.close()

print("Database initialized successfully.")
