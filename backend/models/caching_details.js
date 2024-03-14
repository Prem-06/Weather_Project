const mongoose = require("mongoose");
const cached_data = new mongoose.Schema({
  city: {
    type: String
  },
  country: {
     type: String 
    },
  temp: { 
    type: String 
  },
  humidity: { 
    type: String
   },
  weather: { 
    type: String 
  },
  icon: {
     type: String
     },
});
mongoose.model("CACHEDLIST", cached_data);

