const express = require("express"),
    app = express(),
    path = require("path"),
    bodyParser = require("body-parser"),
    cookieSession = require("cookie-session"),
    session = require("express-session");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = "pk.eyJ1IjoibmVncnVnZW9yZ2U4IiwiYSI6ImNraDdvM2J2YTBtanoyeG81Y3d0aWg0NzYifQ.b_3-hL80A0ifUoBOEJ00xg"
console.log(mapBoxToken);
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
//passport

   
    const PORT  = 3000;






app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieSession({
    cookieName: 'session',
    keys: ['jkqhfdjksandc1234hjksmdfnc']
     // req.session forneaza un obiect care de fiecare data cand se incarca pagina 
     // il primesc ca un string encrypttat cu cheia data de mine 
}))
app.use(session({secret: 'cevasecret'}))



//using paths 
app.use(express.static(path.join(__dirname,"public")));


app.get("/ss3",(req,res)=>{
    console.log(req.session.userId)
})

// require routs
 main = require("./routes/main.js");
 show = require("./routes/show.js")
 

// require db










// using routes
app.use(main);
app.use(show);




app.listen(PORT,()=>{
    console.log("linsten on port 3000");
})