const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(image, model) {
    try {
        // Convert image to tensor
        const tensor = tf.node
            .decodeImage(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims()

        const predict = model.predict(tensor)
        const prediction = await predict.data();
        const score = prediction[0];
        
        if (score <= 0.5) {
            return {
                result: "Non-cancer",
                suggestion: "Penyakit kanker tidak terdeteksi.",
            };
        }

        if (score > 0.5) {
            return {
                result: "Cancer",
                suggestion: "Segera periksa ke dokter!",
            };
        }

        return { result, suggestion};
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }    
}

module.exports = { predictClassification };