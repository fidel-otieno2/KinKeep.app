#!/usr/bin/env python3
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Add missing columns to users table
        columns_to_add = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(200)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday DATE",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT"
        ]
        
        for sql in columns_to_add:
            try:
                db.session.execute(text(sql))
                print(f"Executed: {sql}")
            except Exception as e:
                print(f"Column may already exist: {e}")
        
        db.session.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        db.session.rollback()