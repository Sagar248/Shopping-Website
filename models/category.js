var mongoose=require('mongoose');
// Category Schema
var CategorySchema=mongoose.Schema({
  title:{
    type:String,
    require:true
  },
  slug:{
    type:String
  }
});
var Category=module.exports=mongoose.model('Category',CategorySchema)