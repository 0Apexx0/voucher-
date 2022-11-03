

const formidable = require("formidable");
const csv = require("csvtojson");
const voucherModel = require("../model/voucherModel.js");

const getFormData = (req) => {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, function (err, fields, files) {
            if (err) {
                return reject(err);
            }
            return resolve({ name: files.report.name, path: files.report.path });
        });
    });
};
const getValidTransaction = async (paymentDetails) => {
    try {
        if (paymentDetails.length > 1) {
            paymentDetails = paymentDetails.split("-");
            let retailerId = paymentDetails[0];
            let quantity = paymentDetails[1];
            let amount = paymentDetails[2];
            let isVoucherAvailable = await voucherModel.getVoucherForRedemption(
                retailerId,
                quantity,
                amount
            );
            return isVoucherAvailable;
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    homepage : async (req,res) => {
        try {
            return res.render("homepage");
        } catch (error) {
            console.log(error)
        }
    },
    addVoucher: async (req, res) => {
        try {
            let file = await getFormData(req);
            let vouchers = await csv().fromFile(file.path);
            if (vouchers && vouchers.length > 10000) {
                return res
                    .status(409)
                    .send("please upload a csv file having 10000 entries or less");
            } else if (vouchers) {
                vouchers.map(async (voucher) => {
                    await voucherModel.addvouchers(voucher);
                });
                return res.status(200).send("Added successfully");
            }
            return res.status(404).send("No vouchers Found");
        } catch (error) {
            logger.error({
                message: "Error in deleteGluvUser",
                error: error
            });
            return res.status(500).send("something went wrong");
        }
    },

    voucherWithdraw: async (req, res) => {
        try {
            let transactions = await voucherModel.getAllVouchersUserTransaction();
            if (transactions && transactions.length > 0) {
                transactions.map(async (transaction, i) => {
                    if (i == 0 || i == 8) {
                        console.log(transaction.transCode, transaction.paymentDetails);
                        if (transaction.paymentDetails) {
                            if (transaction.paymentDetails.indexOf(",") !== -1) {
                                let paymentDetails = transaction.paymentDetails.split(",");

                                for (let details of paymentDetails) {
                                    let isVoucherpresent = await getValidTransaction(details);
                                    console.log(isVoucherpresent);
                                    if (isVoucherpresent === false) {
                                        return;
                                    }
                                }
                            } else {
                                let paymentDetails = transaction.paymentDetails;
                                let isVoucherpresent = await getValidTransaction(paymentDetails);
                                console.log(isVoucherpresent);
                            }
                        }
                    }
                });
                return res.status(200).send(transactions);
            }
        } catch (error) {
            logger.error({
                message: "Error in voucherWithdraw",
                error: error
            });
            return res.status(500).send("something went wrong");
        }
    },

};

