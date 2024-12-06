const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'submissionmlgc-bintangque',
    keyFilename: './database-key.json',
});

module.exports = { db };