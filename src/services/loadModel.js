const tf = require('@tensorflow/tfjs-node');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.STORAGE_KEY,
});

async function loadModel() {
    try {
        const model_url = await storage.bucket(process.env.BUCKET_NAME).file(process.env.MODEL_PATH).getSignedUrl();
        return await tf.loadGraphModel(model_url[0]);
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load model');
    }
}
 
module.exports = loadModel;