const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const LIST = mongoose.model("LIST");
const jwt = require('jsonwebtoken');
const {secret_key} = require('../keys');

function get_uuid_from_token(token) {
  try {
      const decoded = jwt.verify(token, secret_key);
      return decoded.uuid;
  } catch (error) {
      console.error("Error decoding token:", error);
      return null;
  }
}

router.delete("/delete_city", (req, res) => {
  const city = req.headers.city;
  const token=req.headers.authorization;

  const uuid=get_uuid_from_token(token)
  if (uuid == "" || city == "") {
    return res.json({ message: "empty feild" });
  }
  LIST.findOne({ uuid: uuid })
    .then((detail) => {
      if (detail) {
        if (detail.citylist.includes(city)) {
          detail.citylist = detail.citylist.filter((item) => item !== city);
          detail
            .save()
            .then(() => {
              return res.json({ message: "deleted sucessfully" });
            })
            .catch((err) => {
              console.log(err);
              return res.json({ error: "error occur" });
            });
        } else {
          return res.json({ message: "city not exist" });
        }
      } else {
        return res.json({ message: "id not present" });
      }
    })
    .catch((err) => {
      res.json({ error: "error occur" });
    });
});

module.exports = router;
