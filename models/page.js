var mongoose=require('mongoose');
var PageSchema=mongoose.Schema({
  title:{
    type:String,
    require:true
  },
  slug:{
    type:String
  },
  content:{
    type:String,
    required:true
  },
  sorting:{
    type:Number
  }
});
var Page=module.exports=mongoose.model('Page',PageSchema)