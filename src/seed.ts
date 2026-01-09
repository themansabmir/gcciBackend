/**
 * Database Seeding Script
 *
 * This script seeds the database with sample data in the correct order
 * to maintain referential integrity.
 *
 * Order of insertion:
 * 1. Port (no dependencies)
 * 2. Team (no dependencies)
 * 3. Vendor (no dependencies, multiple types)
 * 4. RateMaster + Charges (depends on Port, Vendor)
 * 5. Quotation (depends on Port, Vendor)
 * 6. Shipment (depends on Team)
 * 7. MBL (depends on Shipment, Port, Vendor)
 * 8. HBL (depends on Shipment, Port, Vendor)
 *
 * Usage: npx tsx src/seed.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models
import PortModel from './features/port/port.entity';
import TeamEntity from './features/team/team.entity';
import { VendorEntity } from './features/vendor/vendor.entity';
import { RateSheetMasterTable, ChargeTable } from './features/ratemaster/ratemaster.entity';
import { QuotationTable, QuotationLineItemTable } from './features/quotation/quotation.entity';
import ShipmentEntity from './features/shipment/shipment.entity';
import { MblEntity } from './features/mbl/mbl.entity';
import { HBLEntity } from './features/hbl/hbl.entity';

// Load environment variables
dotenv.config();

interface SeededData {
  ports: any[];
  teams: any[];
  vendors: {
    cha: any[];
    agent: any[];
    shipper: any[];
    consignee: any[];
    shipping_line: any[];
    freight_forwarder: any[];
  };
  rateMasters: any[];
  charges: any[];
  quotations: any[];
  shipments: any[];
  mbls: any[];
  hbls: any[];
}

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

// 1. Seed Ports
async function seedPorts(): Promise<any[]> {
  console.log('\n🚢 Seeding Ports...');

  const ports = [
    { port_name: 'Nhava Sheva', port_code: 'INNSA' },
    { port_name: 'Mumbai Port', port_code: 'INBOM' },
    { port_name: 'Chennai Port', port_code: 'INMAA' },
    { port_name: 'Kolkata Port', port_code: 'INCCU' },
    { port_name: 'Mundra Port', port_code: 'INMUN' },
    { port_name: 'Singapore Port', port_code: 'SGSIN' },
    { port_name: 'Shanghai Port', port_code: 'CNSHA' },
    { port_name: 'Dubai Port', port_code: 'AEDXB' },
    { port_name: 'Rotterdam Port', port_code: 'NLRTM' },
    { port_name: 'Los Angeles Port', port_code: 'USLAX' },
  ];

  const createdPorts = await PortModel.insertMany(ports);
  console.log(`✅ Created ${createdPorts.length} ports`);

  return createdPorts;
}

// 2. Seed Teams
async function seedTeams(): Promise<any[]> {
  console.log('\n👥 Seeding Teams...');

  const teams = [
    {
      username: 'admin',
      email: 'admin@gcci.com',
      password: '$2b$10$YourHashedPasswordHere', // In production, hash this properly
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
    },
    {
      username: 'editor1',
      email: 'editor1@gcci.com',
      password: '$2b$10$YourHashedPasswordHere',
      first_name: 'John',
      last_name: 'Editor',
      role: 'editor',
      is_active: true,
    },
  ];

  const createdTeams = await TeamEntity.insertMany(teams);
  console.log(`✅ Created ${createdTeams.length} team members`);

  return createdTeams;
}

// 3. Seed Vendors (different types)
async function seedVendors(): Promise<SeededData['vendors']> {
  console.log('\n🏢 Seeding Vendors...');

  const vendorData = {
    cha: [
      {
        vendor_name: 'Mumbai CHA Services',
        vendor_type: ['cha'],
        credit_days: '30',
        pan_number: 'ABCDE1234F',
        primary_email: 'contact@mumbaicha.com',
        primary_mobile_number: '+919876543210',
        locations: [
          {
            city: 'Mumbai',
            address: '123 CHA Street, Andheri East',
            state: 'Maharashtra',
            country: 'India',
            pin_code: '400001',
            telephone: '+912212345678',
            mobile_number: '+919876543210',
            gst_number: '27ABCDE1234F1Z5',
            email: 'mumbai@mumbaicha.com',
          },
        ],
      },
      {
        vendor_name: 'Chennai CHA Associates',
        vendor_type: ['cha'],
        credit_days: '30',
        pan_number: 'XYZAB5678C',
        primary_email: 'info@chennaicha.com',
        primary_mobile_number: '+919876543220',
        locations: [
          {
            city: 'Chennai',
            address: '456 Port Road, Royapuram',
            state: 'Tamil Nadu',
            country: 'India',
            pin_code: '600013',
            telephone: '+914412345678',
            mobile_number: '+919876543220',
            gst_number: '33XYZAB5678C1Z5',
            email: 'chennai@chennaicha.com',
          },
        ],
      },
    ],
    agent: [
      {
        vendor_name: 'Global Freight Agents',
        vendor_type: ['agent'],
        credit_days: '45',
        pan_number: 'FGHIJ5678K',
        primary_email: 'info@globalagents.com',
        primary_mobile_number: '+919876543211',
        locations: [
          {
            city: 'Chennai',
            address: '456 Agent Road, T Nagar',
            state: 'Tamil Nadu',
            country: 'India',
            pin_code: '600017',
            telephone: '+914423456789',
            mobile_number: '+919876543211',
            gst_number: '33FGHIJ5678K1Z5',
            email: 'chennai@globalagents.com',
          },
        ],
      },
      {
        vendor_name: 'International Logistics Partners',
        vendor_type: ['agent'],
        credit_days: '45',
        pan_number: 'PQRST9876L',
        primary_email: 'contact@ilp.com',
        primary_mobile_number: '+919876543221',
        locations: [
          {
            city: 'Delhi',
            address: '789 Connaught Place',
            state: 'Delhi',
            country: 'India',
            pin_code: '110001',
            telephone: '+911123456789',
            mobile_number: '+919876543221',
            gst_number: '07PQRST9876L1Z5',
            email: 'delhi@ilp.com',
          },
        ],
      },
    ],
    shipper: [
      {
        vendor_name: 'Export House India',
        vendor_type: ['shipper'],
        credit_days: '60',
        pan_number: 'KLMNO9012P',
        primary_email: 'sales@exporthouse.com',
        primary_mobile_number: '+919876543212',
        locations: [
          {
            city: 'Delhi',
            address: '789 Export Lane, Nehru Place',
            state: 'Delhi',
            country: 'India',
            pin_code: '110019',
            telephone: '+911134567890',
            mobile_number: '+919876543212',
            gst_number: '07KLMNO9012P1Z5',
            email: 'delhi@exporthouse.com',
          },
        ],
      },
      {
        vendor_name: 'Textile Exporters Ltd',
        vendor_type: ['shipper'],
        credit_days: '60',
        pan_number: 'TEXAB1234D',
        primary_email: 'export@textiles.com',
        primary_mobile_number: '+919876543222',
        locations: [
          {
            city: 'Surat',
            address: '123 Textile Market',
            state: 'Gujarat',
            country: 'India',
            pin_code: '395001',
            telephone: '+912612345678',
            mobile_number: '+919876543222',
            gst_number: '24TEXAB1234D1Z5',
            email: 'surat@textiles.com',
          },
        ],
      },
    ],
    consignee: [
      {
        vendor_name: 'International Imports LLC',
        vendor_type: ['consignee'],
        credit_days: '30',
        pan_number: 'PQRST3456U',
        primary_email: 'imports@intlimports.com',
        primary_mobile_number: '+919876543213',
        locations: [
          {
            city: 'Bangalore',
            address: '321 Import Avenue, Whitefield',
            state: 'Karnataka',
            country: 'India',
            pin_code: '560066',
            telephone: '+918012345678',
            mobile_number: '+919876543213',
            gst_number: '29PQRST3456U1Z5',
            email: 'bangalore@intlimports.com',
          },
        ],
      },
      {
        vendor_name: 'Electronics Importers Pvt Ltd',
        vendor_type: ['consignee'],
        credit_days: '30',
        pan_number: 'ELEAB5678E',
        primary_email: 'info@electroimports.com',
        primary_mobile_number: '+919876543223',
        locations: [
          {
            city: 'Pune',
            address: '567 Electronics Hub',
            state: 'Maharashtra',
            country: 'India',
            pin_code: '411001',
            telephone: '+912012345678',
            mobile_number: '+919876543223',
            gst_number: '27ELEAB5678E1Z5',
            email: 'pune@electroimports.com',
          },
        ],
      },
    ],
    shipping_line: [
      {
        vendor_name: 'Maersk Line',
        vendor_type: ['shipping_line'],
        credit_days: '45',
        pan_number: 'UVWXY7890Z',
        primary_email: 'india@maersk.com',
        primary_mobile_number: '+919876543214',
        locations: [
          {
            city: 'Mumbai',
            address: '100 Shipping Line Road, Nariman Point',
            state: 'Maharashtra',
            country: 'India',
            pin_code: '400021',
            telephone: '+912222345678',
            mobile_number: '+919876543214',
            gst_number: '27UVWXY7890Z1Z5',
            email: 'mumbai@maersk.com',
          },
        ],
      },
      {
        vendor_name: 'MSC Shipping',
        vendor_type: ['shipping_line'],
        credit_days: '45',
        pan_number: 'ABCXY1234M',
        primary_email: 'india@msc.com',
        primary_mobile_number: '+919876543215',
        locations: [
          {
            city: 'Chennai',
            address: '200 MSC Tower, Anna Salai',
            state: 'Tamil Nadu',
            country: 'India',
            pin_code: '600002',
            telephone: '+914433456789',
            mobile_number: '+919876543215',
            gst_number: '33ABCXY1234M1Z5',
            email: 'chennai@msc.com',
          },
        ],
      },
      {
        vendor_name: 'CMA CGM',
        vendor_type: ['shipping_line'],
        credit_days: '45',
        pan_number: 'CMACG5678N',
        primary_email: 'india@cma-cgm.com',
        primary_mobile_number: '+919876543224',
        locations: [
          {
            city: 'Mumbai',
            address: '300 CMA Building, BKC',
            state: 'Maharashtra',
            country: 'India',
            pin_code: '400051',
            telephone: '+912267890123',
            mobile_number: '+919876543224',
            gst_number: '27CMACG5678N1Z5',
            email: 'mumbai@cma-cgm.com',
          },
        ],
      },
    ],
    freight_forwarder: [
      {
        vendor_name: 'DHL Global Forwarding',
        vendor_type: ['freight_forwarder'],
        credit_days: '30',
        pan_number: 'DEFGH5678N',
        primary_email: 'india@dhl.com',
        primary_mobile_number: '+919876543216',
        locations: [
          {
            city: 'Gurgaon',
            address: '500 DHL Plaza, Cyber City',
            state: 'Haryana',
            country: 'India',
            pin_code: '122002',
            telephone: '+911244567890',
            mobile_number: '+919876543216',
            gst_number: '06DEFGH5678N1Z5',
            email: 'gurgaon@dhl.com',
          },
        ],
      },
      {
        vendor_name: 'Kuehne + Nagel',
        vendor_type: ['freight_forwarder'],
        credit_days: '30',
        pan_number: 'KUEHN6789O',
        primary_email: 'india@kuehne-nagel.com',
        primary_mobile_number: '+919876543225',
        locations: [
          {
            city: 'Mumbai',
            address: '600 K+N House, Andheri',
            state: 'Maharashtra',
            country: 'India',
            pin_code: '400059',
            telephone: '+912267891234',
            mobile_number: '+919876543225',
            gst_number: '27KUEHN6789O1Z5',
            email: 'mumbai@kuehne-nagel.com',
          },
        ],
      },
    ],
  };

  const createdVendors: SeededData['vendors'] = {
    cha: [],
    agent: [],
    shipper: [],
    consignee: [],
    shipping_line: [],
    freight_forwarder: [],
  };

  // Insert vendors by type
  for (const [type, vendors] of Object.entries(vendorData)) {
    const created = await VendorEntity.insertMany(vendors);
    createdVendors[type as keyof typeof createdVendors] = created;
    console.log(`✅ Created ${created.length} ${type} vendor(s)`);
  }

  const totalVendors = Object.values(createdVendors).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`✅ Total vendors created: ${totalVendors}`);

  return createdVendors;
}

// 4. Seed RateMaster and Charges
async function seedRateMasterAndCharges(ports: any[], vendors: SeededData['vendors']): Promise<{ rateMasters: any[]; charges: any[] }> {
  console.log('\n💰 Seeding Rate Masters and Charges...');

  const rateMasters = [];
  const charges = [];

  // Create multiple rate masters for different routes and shipping lines
  const routes = [
    { startIdx: 0, endIdx: 5, containerType: 'GENERAL', containerSize: '40', tradeType: 'EXPORT' }, // Nhava Sheva -> Singapore
    { startIdx: 0, endIdx: 6, containerType: 'GENERAL', containerSize: '40', tradeType: 'EXPORT' }, // Nhava Sheva -> Shanghai
    { startIdx: 2, endIdx: 5, containerType: 'GENERAL', containerSize: '20', tradeType: 'EXPORT' }, // Chennai -> Singapore
    { startIdx: 5, endIdx: 0, containerType: 'GENERAL', containerSize: '40', tradeType: 'IMPORT' }, // Singapore -> Nhava Sheva
    { startIdx: 0, endIdx: 7, containerType: 'REEFER', containerSize: '40', tradeType: 'EXPORT' }, // Nhava Sheva -> Dubai
  ];

  for (let i = 0; i < Math.min(routes.length, vendors.shipping_line.length); i++) {
    const route = routes[i];
    const shippingLine = vendors.shipping_line[i % vendors.shipping_line.length];
    const startPort = ports[route.startIdx];
    const endPort = ports[route.endIdx];

    const comboKey = `${shippingLine._id}_${startPort._id}_${endPort._id}_${route.containerType}_${route.containerSize}_${route.tradeType}`;

    const rateMasterData = {
      comboKey,
      shippingLineId: shippingLine._id,
      startPortId: startPort._id,
      endPortId: endPort._id,
      containerType: route.containerType,
      containerSize: route.containerSize,
      tradeType: route.tradeType,
    };

    const createdRateMaster = await RateSheetMasterTable.create(rateMasterData);
    rateMasters.push(createdRateMaster);
    console.log(`✅ Created rate master: ${startPort.port_name} -> ${endPort.port_name} (${route.containerType} ${route.containerSize})`);

    // Create charges for this rate master
    const basePrice = route.containerSize === '40' ? 1500 : 800;
    const chargesList = [
      {
        rateSheetMasterId: createdRateMaster._id,
        chargeName: 'Ocean Freight',
        hsnCode: '996511',
        price: basePrice,
        currency: 'USD',
        effectiveFrom: new Date('2026-01-01'),
        effectiveTo: new Date('2026-12-31'),
      },
      {
        rateSheetMasterId: createdRateMaster._id,
        chargeName: 'Terminal Handling Charge',
        hsnCode: '996512',
        price: route.containerSize === '40' ? 250 : 150,
        currency: 'USD',
        effectiveFrom: new Date('2026-01-01'),
        effectiveTo: new Date('2026-12-31'),
      },
      {
        rateSheetMasterId: createdRateMaster._id,
        chargeName: 'Documentation Fee',
        hsnCode: '996513',
        price: 50,
        currency: 'USD',
        effectiveFrom: new Date('2026-01-01'),
        effectiveTo: new Date('2026-12-31'),
      },
      {
        rateSheetMasterId: createdRateMaster._id,
        chargeName: 'Bill of Lading Fee',
        hsnCode: '996514',
        price: 75,
        currency: 'USD',
        effectiveFrom: new Date('2026-01-01'),
        effectiveTo: new Date('2026-12-31'),
      },
    ];

    const createdCharges = await ChargeTable.insertMany(chargesList);
    charges.push(...createdCharges);
    console.log(`✅ Created ${createdCharges.length} charges for rate master`);
  }

  console.log(`✅ Total rate masters created: ${rateMasters.length}`);
  console.log(`✅ Total charges created: ${charges.length}`);

  return { rateMasters, charges };
}

// 5. Seed Quotations
async function seedQuotations(ports: any[], vendors: SeededData['vendors']): Promise<any[]> {
  console.log('\n📋 Seeding Quotations...');

  const quotations = [];

  // Create quotations for different customers
  for (let i = 0; i < Math.min(3, vendors.shipper.length); i++) {
    const customer = vendors.shipper[i];
    const shippingLine = vendors.shipping_line[i % vendors.shipping_line.length];
    const startPort = ports[i % 3]; // Rotate between first 3 ports
    const endPort = ports[5 + (i % 2)]; // Singapore or Shanghai

    const quotationData = {
      quotationNumber: `QT-2026-${String(i + 1).padStart(3, '0')}`,
      customerId: customer._id,
      customerAddressId: customer.locations[0]._id,
      customerName: customer.vendor_name,
      customerEmail: customer.primary_email,
      shippingLineId: shippingLine._id,
      startPortId: startPort._id,
      endPortId: endPort._id,
      containerType: i % 2 === 0 ? 'GENERAL' : 'REEFER',
      containerSize: i % 2 === 0 ? '40' : '20',
      tradeType: 'EXPORT',
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2026-12-31'),
      status: i === 0 ? 'DRAFT' : i === 1 ? 'SENT' : 'APPROVED',
    };

    const createdQuotation = await QuotationTable.create(quotationData);
    quotations.push(createdQuotation);
    console.log(`✅ Created quotation: ${quotationData.quotationNumber}`);

    // Create line items for the quotation
    const basePrice = quotationData.containerSize === '40' ? 1500 : 800;
    const lineItems = [
      {
        quotationId: createdQuotation._id,
        chargeName: 'Ocean Freight',
        hsnCode: '996511',
        price: basePrice,
        currency: 'USD',
        quantity: 1,
        totalAmount: basePrice,
      },
      {
        quotationId: createdQuotation._id,
        chargeName: 'Terminal Handling Charge',
        hsnCode: '996512',
        price: quotationData.containerSize === '40' ? 250 : 150,
        currency: 'USD',
        quantity: 1,
        totalAmount: quotationData.containerSize === '40' ? 250 : 150,
      },
      {
        quotationId: createdQuotation._id,
        chargeName: 'Documentation Fee',
        hsnCode: '996513',
        price: 50,
        currency: 'USD',
        quantity: 1,
        totalAmount: 50,
      },
    ];

    await QuotationLineItemTable.insertMany(lineItems);
    console.log(`✅ Created ${lineItems.length} line items for quotation`);
  }

  console.log(`✅ Total quotations created: ${quotations.length}`);

  return quotations;
}

// 6. Seed Shipments
async function seedShipments(teams: any[]): Promise<any[]> {
  console.log('\n📦 Seeding Shipments...');

  const team = teams[0];

  const shipmentData = [
    {
      shipment_name: 'SHIP-EXP-001',
      created_by: team._id,
      shipment_type: 'EXP',
    },
    {
      shipment_name: 'SHIP-IMP-001',
      created_by: team._id,
      shipment_type: 'IMP',
    },
    {
      shipment_name: 'SHIP-EXP-002',
      created_by: team._id,
      shipment_type: 'EXP',
    },
  ];

  const createdShipments = await ShipmentEntity.insertMany(shipmentData);
  console.log(`✅ Created ${createdShipments.length} shipments`);

  return createdShipments;
}

// 7. Seed MBLs
async function seedMBLs(shipments: any[], ports: any[], vendors: SeededData['vendors'], teams: any[]): Promise<any[]> {
  console.log('\n🚢 Seeding MBLs...');

  const mbls = [];
  const team = teams[0];

  // Create MBLs for export shipments
  for (let i = 0; i < Math.min(2, shipments.filter((s) => s.shipment_type === 'EXP').length); i++) {
    const shipment = shipments.filter((s) => s.shipment_type === 'EXP')[i];
    const shippingLine = vendors.shipping_line[i % vendors.shipping_line.length];
    const shipper = vendors.shipper[i % vendors.shipper.length];
    const consignee = vendors.consignee[i % vendors.consignee.length];
    const agent = vendors.agent[i % vendors.agent.length];
    const polPort = ports[i % 3]; // Rotate between first 3 Indian ports
    const podPort = ports[5 + i]; // International ports

    const mblData = {
      shipment_folder_id: shipment._id,
      shipment_mode: 'sea',
      movement_type: 'ROAD',
      shipment_type: 'FCL',
      trade_type: 'export',
      booking_number: `BKG2026${String(i + 1).padStart(4, '0')}`,
      mbl_type: i === 0 ? 'OBL' : 'TLX',
      mbl_number: `MBL2026${String(i + 1).padStart(4, '0')}`,
      mbl_date: new Date('2026-01-15'),

      shipper: shipper._id,
      shipper_address: shipper.locations[0]._id,
      consignee: consignee._id,
      consignee_address: consignee.locations[0]._id,
      shipping_line: shippingLine._id,
      agent_origin: agent._id,
      agent_origin_address: agent.locations[0]._id,

      port_of_loading: polPort._id,
      port_of_discharge: podPort._id,
      place_of_receipt: polPort.port_name,
      place_of_delivery: podPort.port_name,

      incoterm: 'FOB',
      freight_type: 'COLLECT',

      etd_pol: new Date('2026-02-01'),
      eta_pod: '2026-02-15',

      vessel_number: `VSL${i + 1}234`,
      voyage_number: `VOY${i + 1}567`,

      marks_numbers: 'MADE IN INDIA',
      description_of_goods: i === 0 ? 'Textile Products' : 'Electronic Components',

      containers: [
        {
          container_number: `MSCU123456${i}`,
          container_size: '40',
          container_type: 'GENERAL',
          package_count: 100 + i * 50,
          package_type: 'Cartons',
          description: i === 0 ? 'Textile Products' : 'Electronic Components',
          gross_weight: 20000 + i * 1000,
          net_weight: 18000 + i * 900,
          volume: 60 + i * 5,
        },
      ],

      free_time_origin: 7,
      free_time_destination: 5,
      exchange_rate: 83.5,

      created_by: team._id,
    };

    const createdMBL = await MblEntity.create(mblData);
    mbls.push(createdMBL);
    console.log(`✅ Created MBL: ${mblData.mbl_number}`);
  }

  console.log(`✅ Total MBLs created: ${mbls.length}`);

  return mbls;
}

// 8. Seed HBLs
async function seedHBLs(shipments: any[], ports: any[], vendors: SeededData['vendors']): Promise<any[]> {
  console.log('\n📄 Seeding HBLs...');

  const hbls = [];

  // Create HBLs for export shipments (LCL)
  for (let i = 0; i < Math.min(2, shipments.filter((s) => s.shipment_type === 'EXP').length); i++) {
    const shipment = shipments.filter((s) => s.shipment_type === 'EXP')[i];
    const shippingLine = vendors.shipping_line[i % vendors.shipping_line.length];
    const shipper = vendors.shipper[i % vendors.shipper.length];
    const consignee = vendors.consignee[i % vendors.consignee.length];
    const freightForwarder = vendors.freight_forwarder[i % vendors.freight_forwarder.length];
    const polPort = ports[i % 3];
    const podPort = ports[5 + i];

    const hblData = {
      hblId: `HBL2026${String(i + 1).padStart(4, '0')}`,
      shipment_folder_id: shipment._id,
      shipment_mode: 'sea',
      movement_type: 'ROAD',
      shipment_type: 'LCL',
      trade_type: 'export',
      hbl_number: `HBL2026${String(i + 1).padStart(4, '0')}`,
      hbl_date: new Date('2026-01-15'),

      shipper: shipper._id,
      shipper_address: shipper.locations[0]._id,
      consignee: consignee._id,
      consignee_address: consignee.locations[0]._id,
      shipping_line: shippingLine._id,
      agent_origin: freightForwarder._id,
      agent_origin_address: freightForwarder.locations[0]._id,

      port_of_loading: polPort._id,
      port_of_discharge: podPort._id,
      place_of_receipt: polPort.port_name,
      place_of_delivery: podPort.port_name,

      incoterm: 'CIF',
      freight_type: 'PRE',

      etd_pol: new Date('2026-02-01'),
      eta_pod: '2026-02-15',

      vessel_number: `VSL${i + 5}678`,
      voyage_number: `VOY${i + 5}890`,

      marks_numbers: 'FRAGILE - HANDLE WITH CARE',
      description_of_goods: i === 0 ? 'Handicraft Items' : 'Pharmaceutical Products',

      containers: [
        {
          container_number: `MSCU765432${i}`,
          container_size: '20',
          container_type: 'GENERAL',
          package_count: 50 + i * 25,
          package_type: 'Pallets',
          description: i === 0 ? 'Handicraft Items' : 'Pharmaceutical Products',
          gross_weight: 10000 + i * 500,
          net_weight: 9000 + i * 450,
          volume: 25 + i * 3,
        },
      ],

      free_time_origin: 5,
      free_time_destination: 3,
      exchange_rate: 83.5,
    };

    const createdHBL = await HBLEntity.create(hblData);
    hbls.push(createdHBL);
    console.log(`✅ Created HBL: ${hblData.hbl_number}`);
  }

  console.log(`✅ Total HBLs created: ${hbls.length}`);

  return hbls;
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Connect to database
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      PortModel.deleteMany({}),
      TeamEntity.deleteMany({}),
      VendorEntity.deleteMany({}),
      RateSheetMasterTable.deleteMany({}),
      ChargeTable.deleteMany({}),
      QuotationTable.deleteMany({}),
      QuotationLineItemTable.deleteMany({}),
      ShipmentEntity.deleteMany({}),
      MblEntity.deleteMany({}),
      HBLEntity.deleteMany({}),
    ]);
    console.log('✅ Cleared existing data');

    // Seed in correct order
    const ports = await seedPorts();
    const teams = await seedTeams();
    const vendors = await seedVendors();
    const { rateMasters, charges } = await seedRateMasterAndCharges(ports, vendors);
    const quotations = await seedQuotations(ports, vendors);
    const shipments = await seedShipments(teams);
    const mbls = await seedMBLs(shipments, ports, vendors, teams);
    const hbls = await seedHBLs(shipments, ports, vendors);

    // Summary
    const totalVendors = Object.values(vendors).reduce((sum, arr) => sum + arr.length, 0);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`  ✅ Ports: ${ports.length}`);
    console.log(`  ✅ Teams: ${teams.length}`);
    console.log(`  ✅ Vendors: ${totalVendors}`);
    console.log(`     - CHA: ${vendors.cha.length}`);
    console.log(`     - Agent: ${vendors.agent.length}`);
    console.log(`     - Shipper: ${vendors.shipper.length}`);
    console.log(`     - Consignee: ${vendors.consignee.length}`);
    console.log(`     - Shipping Line: ${vendors.shipping_line.length}`);
    console.log(`     - Freight Forwarder: ${vendors.freight_forwarder.length}`);
    console.log(`  ✅ Rate Masters: ${rateMasters.length}`);
    console.log(`  ✅ Charges: ${charges.length}`);
    console.log(`  ✅ Quotations: ${quotations.length}`);
    console.log(`  ✅ Shipments: ${shipments.length}`);
    console.log(`  ✅ MBLs: ${mbls.length}`);
    console.log(`  ✅ HBLs: ${hbls.length}`);
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Execute seeding
seedDatabase()
  .then(() => {
    console.log('\n✅ Seeding script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding script failed:', error);
    process.exit(1);
  });
