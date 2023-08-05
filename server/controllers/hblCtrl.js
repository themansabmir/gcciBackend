const HBL = require('../models/shipment/hblModel')

const hblCtrl = {
    createHBL: async (req, res) => {
        try {
          const {
            shiplineName,
            hblNumber,
            hblDate,
            receiptPlace,
            vessel,
            tradeType,
            freightType,
            exchangeRate,
            SOBdate,
            shippingBillNumber,
            shippingBillDate,
            billEntryNumber,
            billEntryDate,
            freePOL,
            freePOD,
            containerNumber,
            pkgCount,
            pkgType,
            grossWeight,
            netWeight,
            volume,
            lineSeal,
            shipperSeal,
            customsSeal,
            description,
            goodsType,
            shipperName,
            shipperAddress,
            consigneeName,
            consigneeAddress,
            notifyName,
            notifyAddress,
            deliveryAgent,
            deliveryAddress,
            loadingPort,
            dischargePort,
            deliveryPlace,
            etaPod,
            } = req.body;


            const newHBL = await HBL.create({

              shiplineName,
              hblNumber,
              hblDate,
              receiptPlace,
              vessel,
              tradeType,
              freightType,
              exchangeRate,
              SOBdate,
              shippingBillNumber,
              shippingBillDate,
              billEntryNumber,
              billEntryDate,
              freePOL,
              freePOD,
              containerNumber,
              pkgCount,
              pkgType,
              grossWeight,
              netWeight,
              volume,
              lineSeal,
              shipperSeal,
              customsSeal,
              description,
              goodsType,
              shipperName,
              shipperAddress,
              consigneeName,
              consigneeAddress,
              notifyName,
              notifyAddress,
              deliveryAgent,
              deliveryAddress,
              loadingPort,
              dischargePort,
              deliveryPlace,
              etaPod,
            });




           await newHBL.populate(
             [`shipperName shipperAddress consigneeName loadingPort dischargePort notifyAddress deliveryAgent deliveryAddress consigneeAddress notifyName`]
           );


         return   res.status(200).json({data: newHBL})
        } catch (error) {
return res.status(500).json({msg:error.message})
        }
  },
  getHBLbyId: async (req, res) => {
    try {
      const id = req.parms.id
      const hblDocument = await HBL.findById({ _id: id })
      return res.status(200),json({data:hblDocument})
    } catch (error) {
return res.status(500).json({msg:error.message})
    }
  },
  getAllHBL: async (req, res) => {
    try {
      const hblDocuments = await HBL.find().populate([
        {
          path: "shipperName",

          populate: [
            {
              path: "customerAddress",


            }, {
            path:'customerType'
          }
          ]

        },
      ]);
      return res.status(200).json({data:hblDocuments})
    } catch (error) {
return res.status(500).json({msg:error.message})
    }
  }
}

module.exports= hblCtrl