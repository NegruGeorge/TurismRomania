const express = require("express"),
    router = express.Router(),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt");






    router.use(bodyParser.urlencoded({extended:true}));
  

    router.use(bodyParser.json());
    
    const db = require("../db");


    router.get("/map",(req,res)=>{
       
        q= "SELECT * FROM locatii"
        db.query(q,(err,rows,fields)=>{
            if(err)
                {
                    console.log("avem eroare")
                    throw err;
                }
            
            res.render("map.ejs",{locatii:rows,session:req.session.userId})
        })
    })


    router.post("/map",(req,res)=>{
        console.log(req.body.locatie_form);
        q= `SELECT * from locatii where lower(Oras) LIKE "%${req.body.locatie_form}%"`
        db.query(q,(err,rows,fields)=>{
            if(err)
                throw(err)
                console.log(rows);
                res.render("map.ejs",{locatii:rows,session:req.session.userId})
        })
       
    })


    router.get("/map/:id",async(req,res)=>{
        console.log(req.params.id);
        let locatie;
        q = `SELECT * from locatii where id_locatie = ?`
        db.query(q,[req.params.id],(err,rows,fields)=>{
            if(err)
            {
                console.log(err)
                throw err;
            }
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(rows[0]);
            locatie = rows[0];

            q = `SELECT * from review Inner Join users on review.id_user = users.id_user where id_locatie = ?`
            db.query(q,[req.params.id],(err,rows,fields)=>{
                if(err)
                {
                    console.log(err)
                    throw err;
                }
                let review = rows
                 res.render("loc_show.ejs",{locatie:locatie,reviews:review,session:req.session.userId})
            })
           
        })

    })


    router.post("/map/:id/reviews",(req,res)=>{
        console.log(req.body.locatie_categorie)
        console.log(req.body.review)
        let rating = req.body.review.rating
        let com = req.body.review.body
        console.log(rating)
        console.log(com)
        q = "Insert into review (comentariu,rating,id_user,id_locatie) Values(?,?,?,?)"
        db.query(q,[com,rating,req.session.userId,req.params.id],(err,rows,fields)=>{
            if(err)
            {
                console.log("avem err in review")
                throw err;
            }
           

        })

        q = `SELECT * from users where id_user=?`
        let pct = parseInt(req.body.locatie_categorie);
        pct = pct*10;
        q= `UPDATE users set puncte=puncte+${pct} where id_user=${req.session.userId}`
        db.query(q,(err,rows,fields)=>{
            if(err)
            {
                throw err;
            }
            console.log("am reusit")
            res.redirect(`/map/${req.params.id}`);
        })
        // q = `SELECT * from review where id_locatie = ?`
        // db.query(q,[req.params.id],(err,rows,fields)=>{
        //     if(err)
        //     {
        //         console.log(err)
        //         throw err;
        //     }
        //     console.log(rows[0]);

        //     q = "SELECT * from"


        //     res.render("loc_show.ejs",{locatie:rows[0]})
        // })

        // q=""


    })


    router.post("/map/:id/reviews/:reviewId",(req,res)=>{
        console.log(req.params.reviewId)
         q = "DELETE from review where id_review = ?"
         db.query(q,[req.params.reviewId],(err,rows,fields)=>{
             if(err)
             {
                 console.log("eroare in delete")
                 throw err;
             }
             res.redirect(`/map/${req.params.id}`);
         })
    })



    router.get("/ss",(req,res)=>{
        console.log(req.session.userId)
        res.send("in ss");
    })


    // router.get("/account",(req,res)=>{
    //     q = "select * from users where id_user=?"
    //     db.query(q,[req.session.userId],(err,rows,fields)=>{
    //             if(err)
    //                 throw err

            
    //                 res.render("account.ejs",{user:rows[0]});
    //     })
       
    // })

    router.get("/account",(req,res)=>{
        q = "select * from users where id_user=?"
        let user_curent;
        db.query(q,[req.session.userId],(err,rows,fields)=>{
                if(err)
                    throw err

            q = "select * from users"
            user_curent =rows[0];
            db.query(q,[req.session.userId],(err,rows,fields)=>{
                if(err)
                    throw err
                    let users = rows;
                    console.log(users);
                    let scor=[]
                    users.forEach((u)=>
                    {
                        scor.push(parseInt(u.puncte));
                    })
                    console.log(scor);
                    scor.sort(function(a, b){return b - a});
                    console.log(scor)
                    res.render("account.ejs",{user:user_curent,scoruri:scor});
                })      
        })
      
        
        
    })

   
    router.get("/about",(req,res)=>{
        
        res.render("about.ejs")
    })

    module.exports = router;


