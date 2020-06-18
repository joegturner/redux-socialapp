const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { db } = require("./util/admin");
const {
  getAllBarks,
  postOneBark,
  getBark,
  commentOnBark,
  likeBark,
  unlikeBark,
  deleteBark,
} = require("./handlers/barks");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/users");

/** Helper Functions **/

/** barks routes **/
// GET all barks
app.get("/barks", getAllBarks);
// POST new bark
app.post("/bark", FBAuth, postOneBark);
// GET bark details
app.get("/bark/:barkId", getBark);

// TODO:
// delete bark
app.delete("/bark/:barkId", FBAuth, deleteBark);
// like a bark
app.get("/bark/:barkId/like", FBAuth, likeBark);
// unlike a bark
app.get("/bark/:barkId/unlike", FBAuth, unlikeBark);
// POST comment on a bark
app.post("/bark/:barkId/comment", FBAuth, commentOnBark);

/** users routes **/
// POST Signup route
app.post("/signup", signup);
// POST Login route
app.post("/login", login);
// POST upload image route
app.post("/user/image", FBAuth, uploadImage);
// POST user details
app.post("/user", FBAuth, addUserDetails);
// GET authenticated user details
app.get("/user", FBAuth, getAuthenticatedUser);
// GET any user details, public
app.get("/user/:handle", getUserDetails);
// POST read notification
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/barks/${snapshot.data().barkId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            barkId: doc.id,
            type: "like",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnLike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotifictionOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/barks/${snapshot.data().barkId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            barkId: doc.id,
            type: "comment",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("barks")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const bark = db.doc(`/barks/${doc.id}`);
            batch.update(bark, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        })
        .catch((err) => {
          console.error(err);
        });
    } else return true;
  });

exports.onBarkDeleted = functions.firestore
  .document("/barks/{barkId}")
  .onDelete((snapshot, context) => {
    const barkId = context.params.barkId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("barkId", "==", barkId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("barkId", "==", barkId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("barkId", "==", barkId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
