let express = require("express")
let mongoose = require("mongoose")

let app = express()
app.use(express.json())

let connect = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/c4")
}

let userSchema =new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        address: { type: String, required: true },
        gender: { type: String, required: true, default: "female" },
        type:{type:String,default:"customer"}

    }, {
    timestamp: true,
    versionKey: false
}
)

let User = mongoose.model("user", userSchema)


let branchSchema =new mongoose.Schema(
    {
        name: { type: String, required: true },
        address:{ type: String, required: true },
        IFSC:{ type: String, required: true },
        MICR:{ type: Number, required: true },

    },
    {
        timestamp: true,
        versionKey: false
    }
)

let Branch = mongoose.model("branch", branchSchema)


let MasterSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        balance:{type:Number,required:true},
        
    },
    {
        timestamp: true,
        versionKey: false
    }
)

let Master =  mongoose.model("master", MasterSchema)

let saveSchema = mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        balanceId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"master",
            required:true,
        },
        interestRate:{type:Number,required:true}
    },
    {
        timestamp: true,
        versionKey: false
    }
)
let Save =  mongoose.model("save", saveSchema)


let fixSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"save",
            required:true,
        },
        balanceId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"master",
            required:true,
        },
      
        startDate:{type:Number,required:true},
        maturityDate:{type:Number,required:true},
    },
    {
        timestamp: true,
        versionKey: false
    }
)
let Fix = mongoose.model("fix",fixSchema)


app.get("/user",async(req,res)=>{
    try{
      let user_data = await User.find().lean().exec()
     return res.status(201).send({user_data:user_data})
    }
    catch(err){
        res.send({err:err.message})
    }
})

app.post("/user",async(req,res)=>{
    try{
       let user_data = await User.create(req.body)
       return res.status(201).send({user_data:user_data})
    }
    catch(err){
        res.send({err:err.message})
    }
})

app.get("/master",async(req,res)=>{
    try{
        let master_data = await Master.find().populate({path:"userId",select:{"_id":1,"balance:":1}}).lean().exec()
        return res.send({master_data:master_data})
    }
    catch(err){
        res.send({err:err.message})
    }
})   

app.post("/master",async(req,res)=>{
    try{
        let master_data = await Master.create(req.body) 
        return res.status(201).send({master_data:master_data})
     }
     catch(err){
         res.send({err:err.message})
     }
})

app.post("/save",async(req,res)=>{
    try{
        let save_data = await Save.create(req.body)
        return res.status(201).send({save_data:save_data})
    }
    catch(err){
        res.send({err:err.message})
    }
})
app.post("/fix",async(req,res)=>{
    try{
        let fix_data = await Fix.create(req.body)
        return res.status(201).send({fix_data:fix_data})
    }
    catch(err){
        res.send({err:err.message})
    }
}) 
app.delete("/fix/:id",async(req,res)=>{
    try{
        let fix_data = await Fix.findByIdAndDelete(req.params.id)
        return res.status(201).send({fix_data:fix_data})
    }
    catch(err){
        res.send({err:err.message}) 
    }
})


app.patch("/fix/:id", async (req, res) => {
    try {
      const fix_data = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).lean().exec();
      
    
        
  
      return res.status(200).send(fix_data);   
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

app.listen(2000, async () => {
    try {
        await connect()
    }
    catch (err) {
        console.log(err)
    }
    console.log("this is the 4000 portal")  
})    