CREATE TABLE IF NOT EXISTS extractions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coffee_id INTEGER NOT NULL,
  brewer_id INTEGER NOT NULL,
  grinder_id INTEGER,
  grind_setting TEXT,
  dose REAL NOT NULL,
  yield REAL NOT NULL,
  brew_time REAL NOT NULL,
  water_temp REAL,
  rating REAL NOT NULL CHECK(rating >= 1 AND rating <= 5),
  tasting_notes TEXT,
  recipe_metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coffee_id) REFERENCES coffees(id),
  FOREIGN KEY (brewer_id) REFERENCES equipment(id),
  FOREIGN KEY (grinder_id) REFERENCES equipment(id)
);
