const mongoose=require("mongoose")

const bmiSchema= new mongoose.Schema({

    BMI:{type:Number,required: true},
    heigth:{type:String,required: true},
    weight:{type:String,required: true},
    user_id:{type:String,required: true},
},
{
    timestamps: true

})

const BMIModel=mongoose.model("bmi",bmiSchema)

module.exports={
    BMIModel
}


