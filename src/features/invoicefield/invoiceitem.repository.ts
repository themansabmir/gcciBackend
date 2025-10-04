import { BaseRepository } from "@features/base.repository";
import { IInvoiceItem } from "./invoiceitem.types";

class InvoiceItemRepository extends BaseRepository<IInvoiceItem> { }

export default InvoiceItemRepository;
