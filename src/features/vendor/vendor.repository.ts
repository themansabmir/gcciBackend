import { BaseRepository } from "@features/base.repository";
import { IVendor } from "./vendor.types";
import { VendorEntity } from "./vendor.entity";

export class VendorRepository extends BaseRepository<IVendor> { }

