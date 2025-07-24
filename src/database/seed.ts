import pool from './index';

async function seed() {
  try {
    await pool.query(`
      INSERT INTO users (name, email, picture, google_id, created_at) VALUES
      ('Alice Example', 'alice@example.com', 'https://i.pravatar.cc/150?img=1', 'googleid_alice', NOW()),
      ('Bob Example', 'bob@example.com', 'https://i.pravatar.cc/150?img=2', 'googleid_bob', NOW())
      ON CONFLICT (google_id) DO NOTHING;
    `);
    console.log('Seeded users table successfully.');
  } catch (err) {
    console.error('Error seeding users table:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed(); 