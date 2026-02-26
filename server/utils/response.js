/**
 * Standardized success response.
 */
const sendSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({ success: true, data });
};

module.exports = { sendSuccess };
