const admin = require("firebase-admin");

var serviceAccount = require("../key/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialdoggo-448a0.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
