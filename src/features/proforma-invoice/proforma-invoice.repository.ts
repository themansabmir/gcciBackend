import { BaseRepository } from '../base.repository';
import { IProformaInvoice } from './proforma-invoice.types';
import ProformaInvoiceEntity from './proforma-invoice.entity';

class ProformaInvoiceRepository extends BaseRepository<IProformaInvoice> {
  constructor() {
    super(ProformaInvoiceEntity);
  }
}

export default ProformaInvoiceRepository;
