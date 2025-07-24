#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import { checkDatabaseConnection, runMigrations } from '../database/migrations';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🔧 Database Migration Script');
  console.log('============================');
  
  try {
    // Check database connection first
    await checkDatabaseConnection();
    
    // Run migrations
    await runMigrations();
    
    console.log('✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

main();
