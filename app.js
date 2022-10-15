const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();



app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
app.set("view engine",'ejs')

// Here we are connecting our application to mongo atlas cloud clutser running on AWS bahrain me-south-1

mongoose.connect("mongodb+srv://helmy:abc123abc@cluster0.qudkkj4.mongodb.net/todolistDB")

// Creating the schema
const itemsSchema = {
    name: String
};

// Creating the model
const Item = mongoose.model('Item', itemsSchema);

// Creating items
const item1 = new Item({
    name: "Welcome to your To do list"
})
const item2 = new Item({
    name: "Hit the + button to add a task"
})
const item3 = new Item({
    name: "If you wish to delete a task mark the checkbox!"
})
// Creating an array to contain the items 
const defaultItems = [item1,item2,item3]




app.get("/",function (req,res) {
    Item.find({}, function(err, foundItems){
        /// Inserting the defualt items only if the array is empty indicating intial start
        
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err)
                } else {
                    console.log("Successfully  Saved default items to DB")
                }
            });
            res.redirect("/");
        }else{
            res.render("list", {listTitle: "Today", newListItem: foundItems})
        }
        
    })

});

app.post("/", function(req,res){
    let itemName = req.body.newItem;
    
    const item = new Item({
        name: itemName
    })

    item.save();

    res.redirect("/")
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox
    console.log(checkedItemId)
    
    Item.findByIdAndRemove(checkedItemId.trim(), function(err){
        console.log(err);
        res.redirect("/")
    })
    
});






app.get("/work",function(req,res){
    res.render("list",{listTitle:"work",newListItem:workItems});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port,function(){
    console.log("The server is running");
});
    