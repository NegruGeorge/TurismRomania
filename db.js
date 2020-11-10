const mysql = require ("mysql");

const db = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "toor",
    database: "tourismv2",
    port: "3306"
})
db.connect((err)=>{
    if(err)
    {
        console.log(err); 
        throw err;
    }
    console.log("Mysql connected");
})



module.exports = db;