const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        return await tf.loadGraphModel('https://storage.googleapis.com/asclepius-8080/submissions-model/model.json');
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load model');
    }
}
 
module.exports = loadModel;