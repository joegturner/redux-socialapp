const { db } = require("../util/admin");

// get all barks
exports.getAllBarks = (req, res) => {
  db.collection("barks")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let barks = [];
      data.forEach((doc) => {
        barks.push({
          barkId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(barks);
    })
    .catch((err) => console.error(err));
};

// post one bark
exports.postOneBark = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newBark = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("barks")
    .add(newBark)
    .then((doc) => {
      const resBark = newBark;
      resBark.barkId = doc.id;
      res.json({ resBark });
    })
    .catch((err) => {
      res.status(500).json({
        error: `something went wrong`,
      });
      console.error(err);
    });
};

// fetch one bark
exports.getBark = (req, res) => {
  let barkData = {};

  db.doc(`/barks/${req.params.barkId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Bark not found" });
      }
      barkData = doc.data();
      barkData.barkId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("barkId", "==", req.params.barkId)
        .get();
    })
    .then((data) => {
      barkData.comments = [];
      data.forEach((doc) => {
        barkData.comments.push(doc.data());
      });
      return res.json(barkData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// comment on a Bark
exports.commentOnBark = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    barkId: req.params.barkId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/barks/${req.params.barkId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Bark not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

// delete Bark
exports.deleteBark = (req, res) => {
  const document = db.doc(`/barks/${req.params.barkId}`);
  document
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (req.user.handle === doc.data().userHandle) {
          return document.delete().then(() => {
            res.status(200).json({ message: "Bark successfully deleted" });
          });
        } else {
          return res.status(403).json({ error: "User not authorized" });
        }
      } else {
        return res.status(404).json({ error: "Bark not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

// like a bark
exports.likeBark = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("barkId", "==", req.params.barkId)
    .limit(1);

  const barkDocument = db.doc(`/barks/${req.params.barkId}`);

  let barkData;

  barkDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        barkData = doc.data();
        barkData.barkId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "bark not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            barkId: req.params.barkId,
            userHandle: req.user.handle,
          })
          .then(() => {
            barkData.likeCount++;
            return barkDocument.update({ likeCount: barkData.likeCount });
          })
          .then(() => {
            return res.json(barkData);
          });
      } else {
        return res.status(400).json({ error: "Bark already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// unlike a bark
exports.unlikeBark = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("barkId", "==", req.params.barkId)
    .limit(1);

  const barkDocument = db.doc(`/barks/${req.params.barkId}`);

  let barkData = {};

  // check if bark exists
  barkDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        barkData = doc.data();
        barkData.barkId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Bark not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Bark not liked" });
      } else {
        db.doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            barkData.likeCount--;
            return barkDocument.update({ likeCount: barkData.likeCount });
          })
          .then(() => {
            return res.json(barkData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
