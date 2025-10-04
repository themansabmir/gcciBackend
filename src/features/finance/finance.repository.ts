import { BaseRepository } from "@features/base.repository";
import { IFinanceDocument } from "./finance.types";

class FinanceRepository extends BaseRepository<IFinanceDocument> { }

export default FinanceRepository;
