import pool from './index';

// Migration to create users table
export async function createUsersTable(): Promise<void> {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        picture TEXT,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(query);
    console.log('✅ Users table created successfully');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
    throw error;
  }
}

// Migration to create indexes for better performance
export async function createIndexes(): Promise<void> {
  try {
    const queries = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);',
      'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);'
    ];
    
    for (const query of queries) {
      await pool.query(query);
    }
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

// Run all migrations
export async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...');
  
  try {
    await createUsersTable();
    await createIndexes();
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Check database connection
export async function checkDatabaseConnection(): Promise<void> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}
