const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser=require("body-parser");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect("mongodb://localhost:27017/employeeDB", ()=>{
    console.log("Database is connected on port 27017")
});

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    status: String
});

const Employee = new mongoose.model("employee", employeeSchema)

//routes
app.get('/', (req, res)=>{
    const employees = Employee.find({}, function(err, foundUsers){
        if(err){
            console.log(err)
        }else{
            res.render("home", {
                employees: foundUsers
            });
        }
    });
   
})

app.get('/add', (req, res)=>{
    res.render("add");
});
app.get('/edit/:id', (req, res)=>{
    res.render("edit");
});

app.get('/delete/:id', (req, res)=>{
    console.log(req.params.id)
    Employee.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/");
        }
    })
});


app.post('/',(req, res)=>{
    // res.render("home")
   const status =  req.body.status;
   const employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    status: req.body.status
   });
   employee.save();
   res.redirect("/")
});
app.post('/add', (req, res)=>{
    res.redirect('/')
});

app.post('/edit', (req, res)=>{
    res.render("edit")
});





app.listen(3000, ()=>{
    console.log("server is on port 3000")
})