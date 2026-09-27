import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('clothesai.db');

export const initDb = async () => {
  // Initialize users table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatarUri TEXT,
      createdAt INTEGER DEFAULT (cast(strftime('%s', 'now') as int))
    );
  `);

  // Initialize categories table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Initialize clothes table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS clothes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUri TEXT NOT NULL,
      categoryId INTEGER,
      userId INTEGER NOT NULL,
      createdAt INTEGER DEFAULT (cast(strftime('%s', 'now') as int)),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Initialize outfits table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS outfits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      userId INTEGER NOT NULL,
      topId INTEGER,
      bottomId INTEGER,
      shoesId INTEGER,
      jewelryId INTEGER,
      createdAt INTEGER DEFAULT (cast(strftime('%s', 'now') as int)),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (topId) REFERENCES clothes(id) ON DELETE SET NULL,
      FOREIGN KEY (bottomId) REFERENCES clothes(id) ON DELETE SET NULL,
      FOREIGN KEY (shoesId) REFERENCES clothes(id) ON DELETE SET NULL,
      FOREIGN KEY (jewelryId) REFERENCES clothes(id) ON DELETE SET NULL
    );
  `);

  try {
    await db.execAsync("ALTER TABLE outfits ADD COLUMN jewelryId INTEGER REFERENCES clothes(id) ON DELETE SET NULL");
  } catch (e) {
    // Column already exists
  }
  
  try {
    await db.execAsync("ALTER TABLE outfits ADD COLUMN jewelryIds TEXT");
  } catch (e) {
    // Column already exists
  }
};
