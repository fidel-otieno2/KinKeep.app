#!/usr/bin/env python3
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Add missing columns
    columns = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(200)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday DATE",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT"
    ]
    
    for sql in columns:
        cur.execute(sql)
        print(f"Executed: {sql}")
    
    conn.commit()
    print("Migration completed!")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        conn.close()