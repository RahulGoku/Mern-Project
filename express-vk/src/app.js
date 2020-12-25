const express = require("express");
const path = require("path"); 
const app = express(); //initialization
const hbs = require("hbs");
const bodyparser = require('body-parser');
require("./db/conn");
const Register = require("./models/registers");
const Employee = require("./models/employee");
const Jobtype = require("./models/jobtype");
const Feedbacks = require("./models/feedback");
const { json } = require("express");
const router = express.Router();
const assert = require('assert');
const bcrypt = require('bcryptjs');


const port = process.env.PORT || 3000; 

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyparser.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);
//page declaration code
app.get("/", (req, res) => {
    Jobtype.find(function(err, Jobtype){
        res.render('index', {title: 'Node Poject', jobtypes:Jobtype});
    });
});

//page declaration code
app.get("/register", (req, res)=>{
    res.render("register");
});
//page declaration code
app.get("/contact", (req, res)=>{
    res.render("contact");
});
//page declaration code
app.get("/about", (req, res)=>{
    res.render("about");
});

app.get("/jobtype", (req,res)=>{
    res.render("jobtype");
});

//signup form connect with database code
app.post("/register", async (req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            const registerMember = new Register({
                name: req.body.name,
                //lastname: req.body.lastname,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            })

            const registered = await registerMember.save();
            res.status(201).redirect("/register");

        }else{
            res.send("password are not match")
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/home", function(req, res, next) {
    const jobRole=req.query.jobRole;
    Employee.find({jobRole})
    .then(result=>{
        res.status(201).render('list', { employees:result});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })
    
});    

app.get("/index", function(req, res) {
    Jobtype.find(function(err, Jobtype){
        res.render('index', {title: 'Node Poject', jobtypes:Jobtype});
    });
    
});

app.post("/jobtype", async (req, res, next)=>{
    try{
        const registerjobtype = new Jobtype({
            job: req.body.job,
            logo: req.body.logo,
            desc: req.body.desc
        })
            const jobtype = await registerjobtype.save();
            res.status(201).render("jobtype");
    } catch (error) {
        res.status(400).send(error);
    }
});

// register employee detail and make database
app.post("/index", async (req, res, next)=>{
    try{
        const registerEmployee = new Employee({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            jobRole: req.body.jobRole,
            mobileNumber: req.body.mobileNumber,
            workAddress: req.body.workAddress,
            homeAddress: req.body.homeAddress,
            city: req.body.city,
            state: req.body.state,
            pinCode: req.body.pinCode
        })
            const register = await registerEmployee.save();
            res.status(201).redirect('/');
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/feedback", async (req, res)=>{
    try{
        const registerFeedbacks = new Feedbacks({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            contect: req.body.contact,
            check: req.body.check,
            mobileNumber: req.body.mobileNumber,
            feedback: req.body.feedback,
            code: req.body.code
        })
            const Feed = await registerFeedbacks.save();
            res.status(201).render('contact');
    } catch (error) {
        res.status(400).send(error);
    }
});

//cheak your login detail with databases and loged in
app.post("/login", async (req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        const isMatch =await bcrypt.compare(password,useremail.password);

        if(isMatch){
            res.status(201).redirect('/');
        }else{
            res.render("register");
        }
    }catch (error){
        res.status(400).send("invalid login Details")
    }
})
//if any condition sever not worked then show database
app.get("/", (req, res) => {
    res.send("hello from learntime")
});
//runing port
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})