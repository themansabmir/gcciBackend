import { IQuery } from '@features/vendor/vendor.types';
import { Document, Schema } from 'mongoose';

export interface IShipment extends Document {
  shipment_name: string;
  shipment_type: string;
  __id: string;
  created_by: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShipmentBody {
  shipment_type: string;
  created_by: Schema.Types.ObjectId;
}

export interface IShipmentQuery extends IQuery {
  shipment_type?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  searchFields?: string; // fields to search in: 'name', 'type', 'creator'
}

export interface IShipmentListResponse {
  data: IShipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IShipmentFilters {
  shipment_type?: 'IMP' | 'EXP';
  created_by?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}
