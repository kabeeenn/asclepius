const tf = require('@tensorflow/tfjs-node');
const { InputError } = require('../exceptions/inputError');

async function predictClassification(image, model) {
    try {
        // Convert image to tensor
        const tensor = tf.node
            .decodeImage(image) 
            .resizeNearestNeighbor([224, 224]) // Resize to width 224px, height 224px
            .toFloat() // Convert to float values
            .expandDims(); // Add batch dimension

        // Check if the image is in RGB format
        if (tensor.shape[3] !== 3) {
            throw new Error('Input image is not in RGB format');
        }

        const prediction = await model.predict(tensor).data();
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

        return { result: "Unknown", suggestion: "Tidak dapat menentukan hasil." };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }    
}

module.exports = { predictClassification };