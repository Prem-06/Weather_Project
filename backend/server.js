const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
require("./models/list_item");
require("./models/caching_details.js");
app.use(require("./routes/addcity"));
app.use(require("./routes/delete_city.js"));
app.use(require("./routes/update_city.js"));
app.use(require("./routes/weather.js"));
app.use(require("./routes/generate_uuid.js"));
app.use(require("./routes/city_weather.js"));
mongoose
  .connect("mongodb://127.0.0.1:27017/weatherapp")
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("not connected to database");
  });

app.listen(port, () => {
  console.log("server is running on port 3000");
});

