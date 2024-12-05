const crypto = require('crypto');

async function postPredictHandler (request, h) {
    const { image } = request.payload;

    if (image.size > 1000000) {
        return h.response({
            "status": "fail",
            "message": "Payload content length greater than maximum allowed: 1000000"
         }).code(413);
    }

    const { model } = request.server.app;

    try {
        const id = crypto.randomUUID();
        const { result, suggestion } = await predict(image, model);
        const createdAt = new Date().toISOString();
    
        const data = {
            "id": id,
            "result": result,
            "suggestion": suggestion,
            "createdAt": createdAt,
        }
    
        db.collection('predictions').doc(id).set(data);
    
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
        
    }
};

module.exports = { postPredictHandler };
