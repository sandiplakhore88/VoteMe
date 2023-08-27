require("dotenv").config();
const express = require('express');
const path = require('path');
const { adminCollection, vDetailCollection } = require("./src/mongoosedb");

// <====== set path for static element ======>
const templatePath = path.join(__dirname, "./templates");
const publicPath = path.join(__dirname, "./public");


const app = express();
const PORT = process.env.PORT || 5000;

//<====== setup middleware ======>
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// <====== set template instead of views and use hbs template engine ======>
app.set("view engine", "hbs");
app.set("views", templatePath);


// <====== Route get For loading page ======>
app.get('/', (req, res) => {
    res.render('index');
});

// <====== Route get For home page ======>
app.get('/home', (req, res) => {
    res.render('home');
});


// <====== Route when click on adminLogin button on home page goto admineLogin page ======>
app.get("/adminlogin", (req, res) => {
    res.render("adminlogin");
});

// <====== Route when click on voterLogin button on home page goto admineLogin page ======>
app.get("/voterlogin", (req, res) => {
    res.render("voterlogin");
});

// <==== set route for adminhome + add some loging functionallity ====>
app.get("/adminhome", async (req, res) => {
    try {
        if (req.headers.cookie) {
            const response = await vDetailCollection.find();
            return res.render("adminhome", { response });
        } else {
            return res.redirect("adminlogin");
        }
    }
    catch (err) {
        return (res.redirect("adminlogin"));
    }
});

// <==== set route for voterhome + add some loging functionallity ====>
app.get("/voterhome", (req, res) => {
    try {
        if (req.headers.cookie) {
            const vName = req.headers.cookie.replace("voterRemember=","").replace("%20","");
            return (res.render("voterhome",{vName}));
        } else {
            return (res.redirect("voterlogin"));
        }
    }
    catch (err) {
        return (res.redirect("voterlogin"));
    }
})


// <====== Route to handle admin login form  ======>
app.post("/adminlogin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminData = await adminCollection.findOne({ username: username });
        if (!adminData) {
            return res.render("adminlogin", { errorMessage: 'Invalid username. Please try again.' });
        }
        if (adminData.password === password) {
            res.cookie('adminRemember', adminData.username, { maxAge: 2 * 60 * 1000 });
            return res.redirect("adminhome");
        }
        else {
            return res.render("adminlogin", { errorMessage: 'Invalid password. Please try again.' });
        }
    }
    catch (err) {
        return res.render("adminlogin");
    }
});



//<====== Route to handle voter login form  ======>
app.post("/voterlogin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const voterData = await vDetailCollection.findOne({ vname: username });
        if (!voterData) {
            return res.render("voterlogin", { errorMessage: 'Invalid username. Please try again.' })
        }
        if (voterData.vpassword === password) {
            res.cookie('voterRemember', voterData.vname, { maxAge: 2 * 60 * 1000 });
            return res.redirect("voterhome");
        }
        else {
            return res.render("voterlogin", { errorMessage: 'Invalid password. Please try again.' });
        }
    }
    catch (err) {
        return res.render("voterlogin");
    }
});


//<====== Route handle to search voter details by click on search button  ======>
app.get("/voterSearch", async (req, res) => {
    try {
        const response = await vDetailCollection.findOne({ vid: req.query.vid });
        if (response) {
            res.json(response);
        }
        else {
            res.json({ error: 'Voter not found' });
        }
    }
    catch (err) {
        res.status(404).json({ error: 'Voter not found' });
    }
})







//<====== set universal route for page not found ======>
app.get("/*", (req,res)=>{
    res.render("page404");
})

// <====== create server on 5000 port ======>
app.listen(5000, () => {
    console.log("Server run on 5000 port..!")
});
