const axios = require('axios');

const FASTAPI_URL = "http://127.0.0.1:8000";

const predictTransaction = async (features)=>{
    try{
        const response = await axios.post(`${FASTAPI_URL}/predict`, 
            {
                features : features
            });
        return response.data;
    } catch (error) {
        console.error(
            "FastAPI Error:",
            error.response?.data || error.message
        );

        throw new Error("ML service unavailable");
    }
};

module.exports = {
    predictTransaction
};