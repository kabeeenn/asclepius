const crypto = require('crypto');
const { db } = require('../services/database');
const { predictClassification } = require('../services/inferenceService');

async function postPredictHandler (request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        const id = crypto.randomUUID();
        const { result, suggestion } = await predictClassification(image, model);
        const createdAt = new Date().toISOString();
    
        const data = {
            "id": id,
            "result": result,
            "suggestion": suggestion,
            "createdAt": createdAt,
        }
    
        await db.collection('predictions').doc(id).set(data);
    
        return h.response({
            "status": "success",
            "message": "Model is predicted successfully",
            "data": data,
        }).code(201);
    } catch (error) {
        return h.response({
            "status": "fail",
            "message": "Terjadi kesalahan dalam melakukan prediksi"
        }).code(400);
    }
};

async function getPredictHistoriesHandler (request, h) {
    try {
        const predictions = await db.collection('predictions').get();
        const predictionsData = predictions.docs.map(doc => doc.data());

        return h.response({
            "status": "success",
            "data": predictionsData,
        }).code(200);
    } catch (error) {
        return h.response({
            "status": "fail",
            "message": "Terjadi kesalahan dalam mengambil data prediksi"
        }).code(500);
    }
};

module.exports = { postPredictHandler, getPredictHistoriesHandler };
