/**
 * Database Cleanup Script
 *
 * This script deletes all data from the database EXCEPT:
 * - Teams
 * - Vendors (customers)
 *
 * Usage: npm run cleanup
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models
import PortModel from './features/port/port.entity';
import { RateSheetMasterTable, ChargeTable } from './features/ratemaster/ratemaster.entity';
import { QuotationTable, QuotationLineItemTable } from './features/quotation/quotation.entity';
import ShipmentEntity, { ShipmentCounterEntity } from './features/shipment/shipment.entity';
import { MblEntity } from './features/mbl/mbl.entity';
import { HBLEntity } from './features/hbl/hbl.entity';
import { VendorEntity } from './features/vendor/vendor.entity';

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freightdex-dev';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Cleanup function
async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...\n');
  console.log('⚠️  This will delete all data EXCEPT Teams and Vendors (customers)\n');

  try {
    // Connect to database
    await connectDB();

    console.log('🗑️  Deleting data...\n');

    // Delete all collections except Team and Vendor
    const deletionResults = await Promise.all([
      PortModel.deleteMany({}),
      RateSheetMasterTable.deleteMany({}),
      ChargeTable.deleteMany({}),
      QuotationTable.deleteMany({}),
      QuotationLineItemTable.deleteMany({}),
      ShipmentEntity.deleteMany({}),
      ShipmentCounterEntity.deleteMany({}),
      MblEntity.deleteMany({}),
      HBLEntity.deleteMany({}),
      VendorEntity.deleteMany({}),
    ]);

    // Count deleted documents
    const deletedCounts = {
      ports: deletionResults[0].deletedCount,
      rateMasters: deletionResults[1].deletedCount,
      charges: deletionResults[2].deletedCount,
      quotations: deletionResults[3].deletedCount,
      quotationLineItems: deletionResults[4].deletedCount,
      shipments: deletionResults[5].deletedCount,
      shipmentCounters: deletionResults[6].deletedCount,
      mbls: deletionResults[7].deletedCount,
      hbls: deletionResults[8].deletedCount,
    };

    const totalDeleted = Object.values(deletedCounts).reduce((sum, count) => sum + (count || 0), 0);

    console.log('='.repeat(50));
    console.log('🎉 Database cleanup completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📊 Deleted Records:');
    console.log(`  🗑️  Ports: ${deletedCounts.ports}`);
    console.log(`  🗑️  Rate Masters: ${deletedCounts.rateMasters}`);
    console.log(`  🗑️  Charges: ${deletedCounts.charges}`);
    console.log(`  🗑️  Quotations: ${deletedCounts.quotations}`);
    console.log(`  🗑️  Quotation Line Items: ${deletedCounts.quotationLineItems}`);
    console.log(`  🗑️  Shipments: ${deletedCounts.shipments}`);
    console.log(`  🗑️  Shipment Counters: ${deletedCounts.shipmentCounters}`);
    console.log(`  🗑️  MBLs: ${deletedCounts.mbls}`);
    console.log(`  🗑️  HBLs: ${deletedCounts.hbls}`);
    console.log(`\n  📊 Total Deleted: ${totalDeleted}`);
    console.log('\n✅ Preserved:');
    console.log('  👥 Teams');
    console.log('  🏢 Vendors (customers)');
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('\n❌ Database cleanup failed:', error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Execute cleanup
cleanupDatabase()
  .then(() => {
    console.log('\n✅ Cleanup script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup script failed:', error);
    process.exit(1);
  });
