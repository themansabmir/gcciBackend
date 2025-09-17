import { Document, PopulatedDoc } from 'mongoose';
import { IUser } from '../user/user.types';

export interface IProformaInvoice extends Document {
  proforma_id: string;
  issue_date: Date;
  valid_until: Date;
  customer: {
    name: string;
    billing_address: string;
    shipping_address: string;
    contact: {
      phone: string;
      email: string;
    };
    tax_id: string;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    tax_percentage: number;
    subtotal: number;
  }[];
  totals: {
    subtotal: number;
    total_tax: number;
    grand_total: number;
  };
  payment_terms: string;
  notes: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  linked_invoice_id?: string;
  created_by: PopulatedDoc<IUser>;
  updated_by?: PopulatedDoc<IUser>;
  createdAt: Date;
  updatedAt: Date;
}
