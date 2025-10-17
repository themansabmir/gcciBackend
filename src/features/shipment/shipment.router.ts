import { defaultRouter } from "@lib/router";
import { shipmentController } from "./shipment.controller";
import { validateDTO } from "@middleware/validateDTO";
import { shipmentRequestBody } from "./shipment.dto";


const shipmentRouter = defaultRouter()

shipmentRouter.post("/",validateDTO(shipmentRequestBody),  shipmentController.create)
shipmentRouter.get("/", shipmentController.findAll)
shipmentRouter.get("/:id", shipmentController.findById)
shipmentRouter.get("/documents/:id", shipmentController.findDocumentsByShipmentId)

export default shipmentRouter