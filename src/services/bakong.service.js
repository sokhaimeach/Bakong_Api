const axios = require("axios");
const { khqrData, BakongKHQR, IndividualInfo } = require("bakong-khqr");

let tokenCache = {
    accessToken: process.env.BAKONG_ACCESS_TOKEN,
    expiresAt: 0
};

// Retrieves a valid Bakong access token, fetching a new one if necessary.
async function _getAccessToken() {
    if(tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
        return tokenCache.accessToken;
    }
    console.log("Fetching new Bakong Access token...");
    try {
        const response = await axios.post(`${process.env.BAKONG_PROD_BASE_API_URL}/token`,{
            merchant_id: process.env.BAKONG_MERCHANT_ID,
            secret: process.env.BAKONG_SECRET
        });

        const { accessToken, expiresIn } = response.data.data;

        // Store the new token and calculate its expiry time (with a 60-second buffer)
        tokenCache.accessToken = accessToken;
        tokenCache.expiresAt = Date.now() + (expiresIn - 60) * 1000;

        return accessToken;
    } catch(error) {
        console.error("Failed to fetch Bakong access token : ", error.response?.data || error.message);
        throw new Error("Could not authenticate with bakong service.");
    }
}

    // Generates a KHQR string and MD5 hash using the bakong-khqr library.
async function generateQrCode(paymentData) {
    const { amount, currency, orderId } = paymentData;
    try {
        // const accessToken = await this._getAccessToken();

        // Set expiration for 5 minutes from now
        const expirationDate = new Date(Date.now() + (5 * 60 * 1000));

        const optionalData = {
            currency: currency === "KHR"? khqrData.currency.khr : khqrData.currency.usd,
            amount: parseFloat(amount),
            billNumber: orderId,
            storeLabel: process.env.STORE_LABEL || "Your Label name",
            terminalLabel: "Online Payment",
            expirationTimestamp: expirationDate.getTime(),
            // merchantCategoryCode: "1234", // Example code
        }

        const individualInfo = new IndividualInfo(
            process.env.BAKONG_ACCOUNT_ID,
            process.env.BAKONG_MERCHANT_NAME || "Meach Sokhai", // Should be from .env
            process.env.LOCATION || "Phnom Penh",
            optionalData
        );

        const khqr = new BakongKHQR();
        const response = khqr.generateIndividual(individualInfo);

        return {
            ...response,
            expiresAt: expirationDate
        }
    } catch(error) {
        console.error("Error generate KHQR code", error);
        throw new Error("Failed to generate KHQR code");
    }
}
// Checks the status of a transaction with the Bakong API.
async function checkTransactionStatus(md5) {
    try {
        const accessToken = process.env.BAKONG_ACCESS_TOKEN; // For simplicity, using the token from .env. In production, should use _getAccessToken() to ensure it's valid.
        const response = await axios.post(
            `${process.env.BAKONG_PROD_BASE_API_URL}/check_transaction_by_md5`,
            { md5 },
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch(error) {
        console.error("Failed to check transaction status: ", error.response?.data || error.message);
        if(error.response?.status === 404) {
            return null;
        }
        throw new Error("Could not check transaction status with Bakong.");
    }
}

module.exports = {
    generateQrCode,
    checkTransactionStatus
};