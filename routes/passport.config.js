const LocalStrategy = require("passport-local").Strategy;
const bycrypt = require("bcrypt");

const db = require("../db");

const e = require("express");

function initialize(passport){
    q="SELECT * FROM users "
    db.query(q,(err,rows,fields)=>{
        if(err)
        {
            throw(err)
        }
        else{
            const authenticateUser = async (user,password,done)=>{
                const username = rows[0].mail;
                //const passowrd = rows[0].passowrd;
                if(username == null){
                    console.log("mail invalid");
                    return done(null,false, {message:"no user with that email"});
                }
                try{
                    if(await bycrypt.compare(password,rows[0].password)){
                        console.log("te ai logat");
                        return done(null,username);
                    } else{
                        console.log("parola incorecta");
                        return done(null,false,{message:"Passowrd incorrect"})
                    }
                }catch{

                }
            }
            passport.use(new LocalStrategy({usernameField:"username"},authenticateUser))
            passport.serializeUser((user,done)=> done(null,user.id))
            passport.deserializeUser((id,done)=>
            done(null,username.id)
            )

        }
       
    
    })
   
}

module.exports = initialize;