const mongoose=require('mongoose');
const list=new mongoose.Schema({
    uuid:{
        type:String,
        require:true
    },
    citylist:[{
        type:String
    }]
})
mongoose.model('LIST',list);