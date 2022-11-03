const VoucherRedemption = require("gopaisa-models").mongoModels.voucherRedemption;

module.exports = {
    addvouchers: async (voucher) => {
        try {
            await VoucherRedemption.create({
                userId: "",
                transCode: "",
                status: "0",
                validTill: voucher.expiry_date,
                voucherCode: voucher.gift_card_code,
                voucherId: voucher.gift_card_id,
                voucherAmount: voucher.amount,
                retailerId: voucher.retailer
            });
        } catch (error) {
            logger.error({
                message: "Error in addvouchers",
                error: error
            });
        }
    },
    getAllVouchersUserTransaction: async (req, res) => {
        try {
            return sqlRead.userTransaction.findAll({
                where: {
                    paymentMethod: {
                        [Op.in]: [5, 7]
                    },
                    status: 4
                },
                raw: true
            });
        } catch (error) {
            logger.error({
                message: "Error in getAllVouchersUserTransaction",
                error: error
            });
            return res.status(403).send("Something Went Wrong");
        }
    },
    getVoucherForRedemption: async (retailerId, quantity, amount) => {
        try {
            let isVoucherPresent = await VoucherRedemption.find({
                retailerId: retailerId,
                voucherAmount: amount
            }).limit(parseInt(quantity));
            console.log(isVoucherPresent);
            if (isVoucherPresent.length < parseInt(quantity)) {
                return false;
            }
            return true;
        } catch (error) {
            logger.error({
                message: "Error in getVoucherForRedemption",
                error: error
            });
        }
    }
};
