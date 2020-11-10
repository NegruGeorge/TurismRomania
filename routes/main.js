const express = require("express"),
    router = express.Router(),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt");
    const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
    const mapBoxToken = "pk.eyJ1IjoibmVncnVnZW9yZ2U4IiwiYSI6ImNraDdvM2J2YTBtanoyeG81Y3d0aWg0NzYifQ.b_3-hL80A0ifUoBOEJ00xg"
const geocoder = mbxGeocoding({accessToken:mapBoxToken});


const passport = require("passport"),
LocalStrategy = require("passport-local").Strategy;

// require database
const db = require("../db");


    router.use(bodyParser.urlencoded({extended:true}));
  

    router.use(bodyParser.json());
    
    // router.use(passport.initialize());
    // router.use(passport.session());
    

//     passport.serializeUser(function(user,done){
//         console.log("serialize");
//         done(null,user.username);
//     });
//     passport.deserializeUser(function(user,done){
//         console.log("deserialize");
//             //console.log(user);
    
//     db.query(`select * from users where mail="${user}"`,(err,rows,fields)=>{
       
//         done(err,rows[0]);
//     })
// });



// passport.use(new LocalStrategy({
//     usernameField: "username",
//     passwordField: "password",
//     passReqToCallback: true
// },
// function(req,username,password,done){
//     console.log(username);
//     //console.log(password);
//     // wuut protect from sql injections
//     db.query(`SELECT * from users where mail=?`,[username],async (err,rows)=>{
//         if(err)
//         return done(err);
//         console.log(rows);
//         if(rows.length===0){
//             console.log("mail invalid");
//             return done(null,false,null)
//         }
//         if(!(await bcrypt.compare(password,rows[0].password))){
//             console.log("parola invalida");
//             return done(null,false,null);
//         }
//         // daca totul merge
//         return done(null,rows[0]);
//     })
// }

// ))


// functie cu care verific daca pot accesa
// pagina de edit a adminului
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/map");
}







    router.get("/",(req,res)=>{
    // console.log("facem qu");
    // q = "INSERT into users values(null,'Maries','Stefi','stefania_maries@yahoo.com',0753841957)";
    // db.query(q, (err, rows, fields)=>{
    //     console.log("suntem in query")
    //    if(err){
    //     throw err; 
    //    }
        
    //    console.log("Am reusit!!");
    // })
    // q = "SELECT * FROM tickets t Inner Join users u ON t.iduser=u.iduser";
    // db.query(q,(err,rows,fields)=>{
    //     if(err)
    //     {
    //         throw(err);
    //     }
    //     console.log(rows[0])
    //     console.log(">>><<<<<<<<<<<<<<<<")
    //     console.log(">>>>>>>>>>>")

    // res.render("main.ejs",{bilete:rows,id:req.session.userId});
    // });
    res.redirect("/map");
    });

    router.get("/addbilet",(req,res)=>{
        res.render("addbilet.ejs")
    })


    router.get("/signup",(req,res)=>{
        res.render("signup.ejs");
    })


    router.post("/signup",async (req,res)=>{
        console.log(req.body);
        console.log(req.body.nume);
        console.log(req.body.prenume);
        console.log(req.body.telefon);
        console.log(req.body.mail);
        let hashedPassword = await bcrypt.hash(req.body.password,10);

        let q = `SELECT * From users where mail =? `
        db.query(q,[req.body.mail],(err,rows,fields)=>{
            if(err)
                throw err;
            if(rows.length !==0 ){
                console.log("id existent");
                res.redirect("/signup");
                
            }  
            else{
                q = `INSERT into users(nume,prenume,mail,password,telefon) values(?,?,?,?,?)`
                db.query(q,[req.body.nume,req.body.prenume,req.body.mail,hashedPassword,req.body.telefon],(err,rows,fields)=>{
                    if(err)
                    {
                        throw err;
                    }
                    console.log("am reusit")
                    console.log(rows);
                    
                    q = "SELECT * FROM users where mail=?"
                    db.query(q,[req.body.mail],(err,rows,fields)=>{
                        if(err)
                            throw err;
                        console.log(rows[0].id_user);
                        req.session.userId = rows[0].id_user;
                        res.redirect("/map");
                    })


                  
                })
            }
        })


// prevent sql injections
       
    })

    router.get("/ss1",(req,res)=>{
        console.log(req.session.userId)
        res.send("in ss");
    })


    router.get("/signin",(req,res)=>{
        res.render("signin.ejs");
       
    })


    router.post("/signin", (req,res)=>{
        console.log(req.body.mail);
        db.query("SELECT * from users where mail=?",[req.body.mail],async (err,rows,fields)=>{
            if(err)
                {
                    console.log(err);
                    throw err;
                }
            if(rows.length ===0){
                console.log("mail invalid")
                res.redirect("/signin");
            }
              
            else if(!(await(bcrypt.compare(req.body.password,rows[0].password)))){
                console.log("parola invalida")
                res.redirect("/signin");
            }
            else{
                console.log("te ai logat")
                req.session.userId  = rows[0].id_user;
                console.log(req.session.userId);

                res.redirect("/map");
            }
        })
    })


    router.get("/signout",(req,res)=>{
        
        req.session=null;
        res.redirect("/map")
    })

    router.get("/secret",(req,res)=>{
        if(req.session.userId)
            res.send("this is the secret");
        else
            res.redirect("/");
        })








        router.get("/geocode", async (req,res)=>{
        const geodata  = await  geocoder.forwardGeocode({
            query: 'Piata Unirii,Cluj, Romania',
            limit:1
        }).send()
        console.log(geodata.body.features);
        console.log(geodata.body.features[0].geometry.coordinates)
        console.log(geodata.body.features[0].geometry.coordinates[0])
        console.log(geodata.body.features[0].geometry.coordinates[1])
        res.send("ok");
        })





        // router.get("/map",(req,res)=>{
        //     res.render("map.ejs",{obiective:obiective});
        // })

module.exports = router;



/*
obiective= [
    {
        Oras: 'Bucuresti',
        Titlu_obiectiv: 'Gradina Botanica',
        Categorie: 1,
        descriere: 'este un loc special, unde vei lua o pauză de la agitația din Bucuresti. Ascunse în inima Grădinii, și mai departe de orice zgomot, veți găsi serele. Intrați cu încredere! Preferatele noastre sunt cele cu cactuși. Iar accesul în sere costă doar 2 lei.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'https://gradina-botanica.unibuc.ro/contact/',
        img:'/images/locatii/GradinaBotanica_Bucuresti.jpg'
    },

    {
        Oras: 'Bucuresti',
        Titlu_obiectiv: 'Muzeul Cotroceni',
        Categorie: 2,
        descriere: 'Vis-a-vis de Grădina Botanică este intrarea la Muzeul Cotroceni. Vizita trebuie programată, pentru că se face doar cu ghidul muzeului. Dar va fi cu atât mai deosebită.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'http://www.muzeulcotroceni.ro/ ',
        img:'/images/locatii/GradinaBotanica_Bucuresti.jpg'
    },

    {
        Oras: 'Bucuresti',
        Titlu_obiectiv: 'Casa memorială Ion Minulescu',
        Categorie: 3,
        descriere: 'Foarte aproape de Muzeul Cotroceni, se află apartamentul familiei poetului Ion Minulescu. E un apartament care te invită la relaxare și visare. ',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://mnlr.ro/case-memoriale/casa-memoriala-ion-minulescu-claudia-millian/ ',
        img:'/images/locatii/CasaMemoriala-IonMinulescu.jpg'
    },

    {
        Oras: 'Oradea',
        Titlu_obiectiv: 'Piața Unirii',
        Categorie: 3,
        descriere: 'Aici este și centrul istoric al orașului, centru care arată exact așa cum am tot văzut în marile orașe europene, precum Budapesta sau Barcelona.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'https://www.oradeaheritage.ro/patrimoniu-oradea/ ',
        img:'/images/locatii/PiataUnirii_Oradea.jpg'
    },

    {
        Oras: 'Oradea',
        Titlu_obiectiv: 'Turnul Primăriei din Oradea',
        Categorie: 3,
        descriere: 'Ce modalitate mai ușoară pentru a putea cuprinde cu privirea întreg orașul decât un turn? Ușoară este un fel de-a spune căci scările ce duc spre Turnul Primăriei din Oradea sunt o provocare destul de mare. Îți trebuie ceva condiție fizică pentru a face față misiunii, dar și când vei ajunge sus, să vezi atunci răsplată!',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' http://www.oradea.ro/pagina/turnul-primariei',
        img:'/images/locatii/TurnulPrimariei_Oradea.jpg'
    },

    {
        Oras: 'Oradea',
        Titlu_obiectiv: 'Sinagoga Zion',
        Categorie: 3,
        descriere: 'Construită în 1878 cu influențe ale stilului maur, avem de-a face cu cea mai mare sinagogă neologă din România, reabilitată și ea tot cu bani europeni.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://www.oradeaheritage.ro/sinagoga-neologa-sion/',
        img:'/images/locatii/Sinagoga-Sion_Oradea.jpg'
    },

    {
        Oras: 'Cluj',
        Titlu_obiectiv: 'Piata Unirii',
        Categorie: 3,
        descriere: 'Principala piata, Piata Unirii, este un amestec atractiv de stiluri. In ciuda unor eforturi stangace in vremea comunismului si de dupa comunism de a o atenua, arhitectura pastreaza aspectul original, cu unele elemente sasesti.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://cluj.com/locatii/piata-unirii-cluj/ ',
        img:'/images/locatii/piata-unirii-cluj.jpg'
    },

    {
        Oras: 'Cluj',
        Titlu_obiectiv: 'Muzeul National de Istorie a Transilvaniei',
        Categorie: 1,
        descriere: 'Romanii au un talent aparte pentru arhitectura funerara si unul dintre cele mai vrednice locuri de admiratie este Cimitirul Hajongard.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://ro.wikipedia.org/wiki/Muzeul_Na%C8%9Bional_de_Istorie_a_Transilvaniei',
        img:'/images/locatii/MuzeulTransilvaniei_Cluj.jpg'
    },

    {
        Oras: 'Brasov',
        Titlu_obiectiv: 'Biserica Neagră',
        Categorie: 2,
        descriere: 'Biserica Neagră poartă această denumire deoarece în anul 1689 în urma unui incendiu care a cuprins tot orașul, o mare parte din biserică a luat foc. La început lăcașul a purtat denumirea de hramul Sfintei Maria, dar ulterior a fost acceptată această nouă denumire.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://brasovtourism.app/places/biserica-neagra-nejbc17zye9ziq ',
        img:'/images/locatii/BisericaNeagra_Brasov.jpg'
    },

    {
        Oras: 'Brasov',
        Titlu_obiectiv: 'Satul Viscri',
        Categorie: 4,
        descriere: 'Satul lui Charles, cum este cunoscut acum Viscri, este vizitat anual de peste 15.000 de turişti, majoritatea străini. Viscri a fost trecut pe harta mondială a satelor tradiţionale din lume, aflându-se în patrimoniul UNESCO.',
        price: '$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://www.historia.ro/sectiune/travel/articol/satul-viscri-o-comoara-transilvana',
        img:'/images/locatii/Viscri_Brasov.jpg'
    },

 {Oras:"Arieseni",
    Titlu_obiectiv:"Partie Arieseni",
    Categorie:3,
    descriere:"Statiunea Vartop-Arieseni din Judetul Alba are 2 partii de ski si snowboard. Durata medie a sezonului de ski si snowboard in aceasta regiune se intinde din luna decembrie pana in martie-aprilie.",
    price:"$$$",
    type:"Point",
    latitude:"",
    longitude:"",
    link: ' https://www.arieseni.pro/partie-arieseni',
    img:'/images/locatii/Arieseni1.jpg'
},

    {
        Oras:"Iasi",
        Titlu_obiectiv:"Palatul Cultural",
        Categorie:2,
        descriere:"Palatul Culturii din Iași este o clădire emblematică, construită, în perioada 1906 - 1925, în perimetrul fostei curți domnești medievale moldovenești, pe locul fostului palat domnesc. Clădirea este înscrisă în Lista monumentelor istorice, având cod LMI IS-II-m-A-03957.01, și din ansamblu mai fac parte și ruinele curții domnești. Edificiul a servit inițial drept Palat Administrativ și de Justiție. În anul 1955, destinația clădirii a fost schimbată într-una culturală, devenind gazda unor instituții culturale din Iași. Astăzi, Palatul Culturii este sediul Complexului Muzeal Național „Moldova”, ce cuprinde Muzeul de Istorie a Moldovei, Muzeul Etnografic al Moldovei, Muzeul de Artă, Muzeul Științei și Tehnicii „Ștefan Procopiu”, precum și Centrul de Conservare-Restaurare a Patrimoniului Cultural. Până la începerea lucrărilor de renovare, în aripa de nord-est a palatului se afla sediul Bibliotecii Județene „Gheorghe Asachi”.",
        price:"$", 
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'https://palatulculturii.ro/',
        img:"/images/locatii/palatul-culturii-iasi.jpg"
    },

    {
        Oras:"Iasi",
        Titlu_obiectiv:"Gradina Botanica Anastasie Fatu",
        Categorie:4,
        descriere:"Grădina Botanică „Anastasie Fătu” din Iași este cea mai veche grădină botanică din România.",
        price:"$$",
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'https://www.uaic.ro/gradina-botanica-anastasie-fatu/',
        img:"/images/locatii/GradinaBotanica_Iasi.jpg"
    },
    {
        Oras:"Sinaia",
        Titlu_obiectiv:"Castelul Peles",
        Categorie:4,
        descriere:"Castelul Peleș este un palat din Sinaia, construit între anii 1873 și 1914. Construită ca reședință de vară a regilor României, clădirea se află, în prezent, în proprietatea Familiei Regale a României și adăpostește Muzeul Național Peleș.",
        price:"$$",
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'http://peles.ro/ ',
        img:"/images/locatii/CastelulPeles_Sinaia.jpg"

    },
    {
        Oras:"Ploiesti",
        Titlu_obiectiv:"Muzeul Ceasului Nicolae Smiache",
        Categorie:3,
        descriere:"Muzeul Ceasului „Nicolae Simache” este un muzeu județean din Ploiești, România. Organizat din inițiativa profesorului N. I. Simache, ca secție a Muzeului de Istorie, el datează din 1963. A fost instalat mai întâi într-o sală din Palatul Culturii, până când, prin achiziții, a căpătat un patrimoniu atât de bogat încât a avut nevoie de un local propriu. I s-a pus atunci la dispoziție Casa Luca Elefterescu[2], care a fost adaptată noului scop; lucrările de amenajare s-au terminat în anul 1971 și muzeul s-a deschis în ianuarie 1972.",
        price:"$$", 
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'http://www.cimec.ro/muzee/ceasuri/ceas.htm',
        img:"/images/locatii/MuzeulCeasului_Ploiesti.jpg"
},
 {
        Oras:"Satu-Mare",
        Titlu_obiectiv:"Castelul Karoly din Carei",
        Categorie:3,
        descriere:"Castelul este amplasat în mijlocul unui frumos parc dendrologic, în care localnicii se plimbă cu plăcere. Proaspeții căsătoriți din zonă îl aleg adesea și pentru realizarea pozelor de nuntă.Pe lângă castel, în Carei poți vizita Monumentul Eroului Necunoscut și un complex cu apă termală ce se laudă cu cel mai mare tobogan din țara noastră.",
        price:"$$",
        type:"Point",
        latitude:"",
        longitude:"",
        link: 'https://www.historia.ro/sectiune/travel/articol/castelul-karoly-din-carei ',
        img:"/images/locatii/castelul-karoly-din-carei.jpg"
    },
    {   Oras: 'Arges',
        Titlu_obiectiv: 'Transfagarasan',
        Categorie: 4,
        descriere: 'Sau DN7C este una dintre cele mai spectaculoase sosele din Romania, incercata, cu pedala pe acceleratie, la maxim si de cei de la Top Gear. Drumul serpuieste printre Muntii Fagaras ca sa lege doua regiuni istorice, Muntenia si Transilvania. Aveti drum intins, 90 de kilometri construiti cu truda de catre armata romana, in perioada 1970-1974. Cel mai inalt punct al soselei montane este la Balea Lac, 2.034 de metri. Este depasita, in prezent, de Transalpina, cea mai inalta sosea, in Pasul Urdele cu 2.145 de metri.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://www.transfagarasan.net/',
        img:"/images/locatii/transfagarasan.jpg"
    },        
    {  Oras: 'Arges',
        Titlu_obiectiv: 'Baraju Vidraru',
        Categorie: 4,
        descriere: '',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://muntii-fagaras.ro/vidraru ',
        img:"/images/locatii/baraj-vidraru.jpg"
    },
    { Oras: 'Timisoara',
        Titlu_obiectiv: 'Piața Victoriei',
        Categorie: 2,
       descriere: 'Unul dintre cele mai vizitate și instagramabile obiective turistice din Timișoara e reprezentat de Piața Victoriei. Aceasta este cunoscută și sub denumirea de Piața Operei și reprezintă piața centrală a orașului Timișoara. Mai mult de atât, în acest loc, dar pe 20 decembrie 1989, Timișoara a fost declarat primul oraș liber de comunism din Romania. Dacă te uiți cu atenție pe clădirea Operei, încă poți oberva urmele gloanțelor trase în timpul evenimentelor din perioada respectivă.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'http://www.timisoara-info.ro/ro/component/content/article/91-piata-victoriei.html ',
        img:"/images/locatii/PiataVictoriei.jpg"
    },
    {  Oras: 'Mehedinti', 
        Titlu_obiectiv: 'Parcul National Portile de Fier',
        Categorie: 2,
       descriere: 'Doua judete ale Romaniei, Mehedinti si Caras Severin isi ”revendica dreptul” asupra Parcului Natural Portile de Fier. Acesta este unul dintre cele mai mari parcuri naturale din tara si reuneste sub cupola sa 18 rezervatii. Muntii Banatului-Almajului si Locvei se intalnesc cu muntii Mehedinti si ajung intr-o parte a Podisului Mehedinti. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://www.pnportiledefier.ro/ ',
        img:"/images/locatii/ParculNationalPortiledeFier.jpg"
    },
    {   Oras: 'Dolj',
        Titlu_obiectiv: 'Rezervaţia ornitologică de la Ciupercenii Noi',
        Categorie: 2,
       descriere: 'În județul Dolj, în zona inundabilă din Lunca Dunării, se află o zonă de 500 hectare protejată de lege. Asta pentru că acolo se găsesc specii de păsări protejate de lege, datorită faptului că acestea sunt în pericol de extincție. Printre păsările care pot fi admirate aici se numără egreta mică, barza neagră și barza albă, pelicanul creț, stârcul roșu sau lișița, însă aici se găsesc peste 140 specii de păsări. Rezervația a fost inclusă pe lista monumentelor naturale protejate de lege încă din 1971.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://discoverdolj.ro/places/rezervatia-ornitologica-ciuperceni-desa-jxsmrqfi8ac3ra ',
        img:"/images/locatii/Rezervatia-ornitologica-de-la-Ciupercenii-Noi.jpg"
    },

    { Oras: 'Targoviste', 
        Titlu_obiectiv: ' Turnul Chindiei',
        Categorie: 3,
       descriere: 'Este situat in complexul muzeal “Curtea Domneasca” si este construit in perioada in care a fost Vlad Tepes domnitor. Este un turn care se impune prin maretie si are o istorie foarte bogata. Initial a fost turn-clopotnita, dupa care s-a transformat in turn de aparare, turn ceasornic si foisor de foc. Daca vrei sa descoperi o panorama deosebita asupra orasului, trebuie sa urci cele 122 de trepte ale turnului si sa te bucuri de terasa aflata la inaltimea de 27 de metri.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'http://curteadomneascadintargoviste.ro/prezentare-complex/turnul-chindiei/ ',
        img:"/images/locatii/TurnulChindiei.jpg"
    },

    {Oras: 'Giurgiu',
        Titlu_obiectiv: 'Parcul Natural Comana',
        Categorie: 2,
       descriere: 'Rezervația Naturală Comana se întinde pe raza mai multor comune din sudul județul Giurgiu (comunele Comana, Călugăreni, Colibași, Băneasa, Gostinari, Greaca, Mihai Bravu și Singureni), având o suprafaţă de aproape 25 hectare. Parcul a devenit arie protejată din 2005, cu scopul de a proteja speciile de plante endemice și fauna specifică zonei. Printre animalele prezente în rezervație enumăr popândăul, broasca țestoasă de baltă, tritonul danubian, dar și multe păsări care își găsesc refugiu aici pe timp de iarnă, printre care sticletele, barza albă și neagră, lișița, țigănușul și altele.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'http://www.comanaparc.ro/ ',
        img:"/images/locatii/ParculNaturalComana.jpg"
    },
    { Oras: 'Arad',
        Titlu_obiectiv: 'Statiunea Moneasa',
        Categorie: 1,
       descriere:'Daca va petreceti vacanta in judetul Arad, profitati de zilele libere si cautati cazare pentru cateva zile si in statiunea Moneasa. Documentele istorice arata ca aceasta asezare exista inca din anul 1597, iar proprietatile izvoarelor termale erau cunoscute de catre localnici. Profitati din plin de apele terapeutice, va veti intoarce mult mai relaxati. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://statiuneamoneasa.ro/ ',
        img:"/images/locatii/StatiuneaMoneasa.jpg"
    },
    {    Oras: 'Bacau',
        Titlu_obiectiv: 'Salina Drumul Sării ',
        Categorie: 1,
       descriere: ' Dacă ajungi în Târgu Ocna din județul Bacău, trebuie să faci o vizită minei de sare de acolo. Poți chiar să poposești o zi la salină. Ai șansa să faci sport, să vizitezi expoziții de artă sau biserica din salină. Dacă vrei să faci baie în apă sărată, baza turistică include și un ștrand cu apă sărată în care te poți relaxa. Petrecând câteva ore în subteran, respirând aerul sărat poți trata eventualele afecțiuni respiratorii. Salina este concentrată la orizontul IX al minei Trotuș.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://locuridinromania.ro/judetul-bacau/orasul-targu-ocna/salina-drumul-sarii.html ',
        img:"/images/locatii/SalinaDrumulSarii.jpg"
    },
    {  Oras: ' Bistrita-Nasaud',
        Titlu_obiectiv: 'Parcul Naţional Munții Rodnei ',
        Categorie: 1,
       descriere: 'Parcul Național Munții Rodnei a fost desemnat rezervație naturală în anul 1990 și este unul dintre cele mai valoroase astfel de rezervații datorită structurilor geologice, dar și al interesului spre faună, floră și speologie în zonă. Există aici inclusiv câteva specii endemice de plante. În interiorul parcului puteți vizita diverse mănăstiri (Biserica de lemn din Mănăstirea Moisei, construită în 1672) și arii protejate (peșteri, monumente naturale), dar și mori țărănești de apă, în satul Săcel. În Rezervația naturală Munții Rodnei sunt protejate și diverse specii de animale și păsări. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://www.parcrodna.ro/ ',
        img:"/images/locatii/ParculNationalMuntiiRodnei.jpg"
    },
    { Oras: 'Botosani ',
        Titlu_obiectiv: 'Casa memorială Mihai Eminescu și lacul de la Ipotesti ',
        Categorie: 1,
       descriere: 'Locul unde a copilărit cel mai mare poet al României adăpostește astăzi un muzeu dedicat vieții și operelor lui Eminescu, alături de mormintele părinților și fraților acestuia. Tot acolo este și lacul cu nuferi care a inspirat atâtea poezii celebre.  ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://planiada.ro/destinatii/botosani/casa-memoriala-mihai-eminescu-si-lacul-din-ipotesti-281 ',
        img:"/images/locatii/CasaMihaiEminescu.jpg"
    },
    {  Oras: ' Braila',
        Titlu_obiectiv: 'Cetatea Brăilei ',
        Categorie: 2,
       descriere: 'Ruinele vechii cetăți a Brăilei, atestată documentar din 1368, și-a lăsat amprenta peste oraș. Cetatea a fost construită datorită accesului la Dunăre, în portul căreia se importau mărfuri diverse. Centrul istoric al municipiului Brăila păstrează și în prezent urmele acestei cetăți și tunelurile subterane folosite de turci. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' http://obiectivbr.ro/content/cetatea-br%C4%83ilei-d%C4%83r%C3%A2mat%C4%83-cu-3000-de-salahori ',
        img:"/images/locatii/CetateaBrailei.jpg"
    },
    {   Oras: ' Buzau',
        Titlu_obiectiv: ' Lacul Vulturilor',
        Categorie: 1,
       descriere: 'Lacul Vulturilor sau Lacul fara Fund se gaseste pe partea estica a versantului Malaia, la altitudinea de 1420 m, in Muntii Siriului. I se spune Lacul Vulturilor deoarece aici, conform unei legende, consemnata de Alexandru Vlahuta in cartea sa Romania pitoreasca, lacul ar fi un loc unde vulturii veneau primavara sa-si invete puii sa zboare. Numele de Lacul fara Fund provine dintr-o alta legenda, despre un cioban care si-a lasat turma de mioare, a aruncat bata in apa lacului si a plecat. Dupa un an de peregrinari, ciobanul si-ar fi regasit bata in apele Dunarii si mistuit de dorul mioarelor si a locurilor natale, se intoarce acasa.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://ro.wikipedia.org/wiki/Lacul_Vulturilor  ',
        img:"/images/locatii/LaculVulturilor.jpg"
    },
    { Oras: 'Calarasi',
        Titlu_obiectiv: 'Ostroave pe Dunare ',
        Categorie: 1,
       descriere: ' Amplasarea municipiului Călărași pe fluviul Dunăre și pe brațul Borcea al fluviului îi oferă un potențial turistic foarte mare. De altfel, aici există câteva plaje amenajate, precum Plaja Mare, amplasată vizavi de Parcul Central al orașului, Plaja Tineretului sau Plaja Automobiliștilor, pe care se poate ajunge doar cu mașina. Totodată există și un traseu cu vaporul peste Dunăre, până în staţiunea Silistra de pe malul Bulgăresc.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://ro.wikipedia.org/wiki/Ostroavele_Dun%C4%83rii_-_Bugeac_-_Iortmac ',
        img:"/images/locatii/OstroaveDunare.jpg"

    },
    { Oras: ' Constanta',
        Titlu_obiectiv: 'Monumentul Tropaeum Traiani ',
        Categorie: 1,
       descriere: 'O parte a istoriei dacilor si romanilor a ramas si in Adamclisi, si anume, monumentul Tropaeum Traiani. Ridicat intre 105-106, acest edificiu este simbolul victoriei Imparatului Traian asupra Daciei. Merita vazut, fie si doar o data in drumul spre litoral. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://www.parcmamaia.ro/adamclisi-tropaeum-traiani/ ',
        img:"/images/locatii/TropaeumTraiani.jpg"
    },

    {Oras: 'Galati ',
        Titlu_obiectiv: 'Faleza Dunării',
        Categorie: 2,
       descriere: 'Principala atracție a orașului este Faleza Dunării, o adevărată coloană vertebrală a turismului în Galați. Cu o lungime de 4 km, dispusă în două trepte - faleza superioară și faleza inferioară, este considerată cea mai lungă din Europa, de pe cursul Dunării. De-a lungul falezei veți întâlni sculpturi metalice realizate în anii 70, care își aduc contribuția la îmbogățirea experienței vizitatorilor sub aspect estetic. Faleza este parte integrantă din viața locuitorilor orașului, fiind terenul de sport în aer liber pentru iubitorii de mișcare, dar și loc de inspirație pentru fotografii amatori sau profesioniști. Faleza este accesibilă în orice anotimp și ocazional se organizează aici diferite evenimente: concerte, expoziții, întreceri sportive. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://galaticityapp.ro/places/faleza-dunarii-5v3aavcoy-yozg ',
        img:"/images/locatii/FalezaDunarii.jpg"
    },
    {   Oras: 'Hunedoara ',
        Titlu_obiectiv: 'Castelul Corvinilor ',
        Categorie: 2,
       descriere: 'Povestea Castelului Corvinilor începe la 1409, când nobilul Voicu, alături de fraţii lui (Radu şi Mogoş), primesc din partea regelui Ungariei Sigismund de Luxemburg, o moşie (numită în latinește “possession”), care cuprindea şi cetatea regală. Voicu nu adaugă nimic cetății, dar fiul acestuia, Ioan de Hunedoara (Johannes de Hunyad) o va transforma într-un castel comparabil cu alte construcții ale vremii din centrul și vestul Europei.  ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' http://www.castelulcorvinilor.ro/',
        img:"/images/locatii/CastelulCorvinilor.jpg"
    },
    { Oras: 'Harghita ',
        Titlu_obiectiv: 'Lacul Roșu ',
        Categorie: 2,
       descriere: ' Lacul Roșu, cunoscut de localnici și sub numele de Lacul Ghilcoș, este un lac de acumulare format în mod natural, la poalele muntelui Hășmașul Mare. Acesta avea, la ultimele măsurători, un perimetru de 2830 m. S-a format în urma prăbușirii unui vârf de munte, în anul 1837 sau 1838 (deși este un lac tânăr, anul de formare al acestuia este neclar). După ce valea a fost blocată de alunecarea de teren, pădurea de brazi a fost inundată, iar în timp, arborii s-au pietrificat. Lacul Roșu este cel mai mare lac montan natural din România și este un loc preferat de turiști pentru recreere. De aici, vizitatorii se pot aventura pe diverse trasee turistice sau se pot plimba cu barca pe lac.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'  https://www.infoghidromania.com/lacul_rosu.html',
        img:"/images/locatii/LaculRosu.jpg"
    },
    { Oras: 'Maramures ',
        Titlu_obiectiv: ' Cimitirul Vesel de la Săpânța' ,
        Categorie: 3,
       descriere: 'Se presupune ca atitudinea vesela in fata mortii era un obicei al Dacilor. Acestia credeau in viata vesnica, moartea fiind pentru ei doar o trecere intr-o alta lume. Nu vedeau moartea ca un sfarsit tragic ci ca pe o sansa de a se intalni cu zeul Zamolxe. In multe zone ale Romaniei, dupa datina traditionala, despartirea de cel mort se face prin voie buna. Priveghiul este considerat ca fiind ultima petrecere la care participa atat mortul ca si cei pe care ii lasa in urma. Privind lucrurile din aceasta perspectiva, Ioan Stan Patras a incercat sa transpuna in lucrarile sale, esenta vietii decedatului, intr-un mod mai vesel, care sa-l faca pe om sa priveasca moartea cu mai multa usurinta. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://www.travelguideromania.com/ro/cimitirul-vesel-din-satul-sapanta-maramures/ ',
        img:"/images/locatii/CimitirulSapanta.jpg"
    },
    { Oras: 'Mures ',
        Titlu_obiectiv: ' Castelul Teleki ',
        Categorie: 3,
       descriere: ' Superbul ansamblu arhitectonic construit pentru familia Teleki se gaseste in localitatea Gornesti, la 17 kilometri de Targu Mures, chiar in mijlocul unui parc dendrologic.Se spune despre el ca este cel mai frumos castel din intregul Ardeal, avand, de asemenea, porecla de “Comoara Muresului”. Cladirea prezinta caracteristici arhitecturale in stilul Grassalkovich, proiectul acesteia fiind facut de arhitectul austriac Andreas Mayerhoffer. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' http://castelintransilvania.ro/castelul-teleki-gornesti-.html ',
        img:"/images/locatii/CastelulTeleki.jpg"
    },
    { Oras: 'Neamt',
        Titlu_obiectiv: 'Barajul și lacul Bicaz',
        Categorie: 3,
       descriere: 'Dacă ajungeți în județul Neamț trebuie neapărat să treceți și pe la Barajul Bicaz. Acesta este considerat a fi cel mai mare baraj artificial din țara noastră construit pe un râu interior (Râul Bistrița), iar ridicarea lui a durat 10 ani (1950–1960). În urma construirii Barajului Bicaz a apărut și lacul artificial Bicaz, cunoscut și ca Lacul Izvorul Muntelui. Aici se varsă mai multe râuri din apropiere, iar apa acumulată este folosită pentru a produce energie în centrala hidroelectrică „Bicaz-Stejaru”. În apropierea lacului se află și „Piatra Teiului”, un monument al naturii format dintr-o singură stâncă. Barajul și lacul Bicaz se află la patru kilometri amonte de orașul Bicaz. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://bicazkayakfest.ro/despre-lacul-bicaz/ ',
        img:"/images/locatii/Barajul_laculBicaz.jpg"
    },
    { Oras: 'Sibiu ',
        Titlu_obiectiv: ' Muzeul Brukenthal ',
        Categorie: 3,
       descriere: 'Baronul Samuel von Brukenthal, fostul Guvernator al Marelui Principat al Transilvaniei între anii 1777 și 1787 și-a ridicat la Sibiu un palat care îi poartă numele și care adăpostește peste 800 de tablouri și alte obiecte de artă, dispuse în cele 13 săli ale muzeului. Etajele 1 și 2 ale Palatului Brukenthal găzduiesc cele mai importante galerii de artă europeană din România. În afară de picturi, muzeul mai deține și o colecție de artă decorativă, care conține piese unice precum altare, sculpturi, argintărie laică sau de cult, sticlărie, covoare orientale și mobilier. Tot acolo vei putea admira o bibliotecă impresionantă, cu peste 16.000 de volume, la care s-au adăugat, de-a lungul anilor, colecții precum biblioteca capelei. Astăzi, colecția de carte cuprinde peste 280.000 de volume. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:'https://www.brukenthalmuseum.ro/  ',
        img:"/images/locatii/MuzeulBrukenthal.jpg"
    },
    {  Oras: 'Suceava ',
        Titlu_obiectiv: 'Cetățile Sucevei ',
        Categorie: 3,
       descriere: ' În orașul Suceava au existat două dintre cele mai importante cetăți medievale din Moldova. Este vorba despre Cetatea de Scaun a Sucevei și Cetatea Șcheia. Acestea datează de la sfârșitul secolului al XIV-lea și au fost ridicate de către domnitorul român Petru al II-lea Mușat, pentru a servi drept centre de apărare împotriva invaziei otomane. Cetatea de Scaun a Sucevei, cunoscută și ca Cetatea Sucevei, a fost inclusă pe lista monumentelor istorice din județul Suceava din anul 2004 și în urmă cu câțiva ani a intrat într-un proces de renovare. În prezent, aceasta poate fi vizitată de turiști.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://muzeulbucovinei.ro/cetatea-de-scaun-a-sucevei/ ',
        img:"/images/locatii/CetatileSucevei.jpg"
    },
    {Oras: 'Teleorman',
        Titlu_obiectiv: 'Turnu Măgurele',
        Categorie: 3,
       descriere: ' Localitatea Turnu Măgurele a fost un important port din Lunca Dunării. Aceasta datează încă din epoca romană. Orașul are o istorie bogată, de-a lungul timpului aici fiind ridicate mai multe cetăți. Prima cetate din Turnu Măgurele a fost construită în perioada romană, în jurul secolul al II-leaPe ruinele acesteia a fost ridicată, câteva secole mai târziu, cetatea lui Constantin cel Mare, în secolul al IV-lea. Istoria localității continuă și în Evul Mediu, pe ruinele vechilor cetăți fiind ridicată o nouă cetate, în timpul domniei lui Mircea cel Bătrân, care avea rol de apărare împotriva invaziei Otomane. Aceasta a fost însă arsă și din ea a rămas doar niște ruine. În prezent în Turnu Măgurele se mai pot vedea o parte din zidurile cetății medievale. De asemenea, legendele spun că sub poarta cetății există un tunel vechi de peste 2.000 de ani (n.r. din timpul romanilor), ce leagă cele două maluri ale Dunării. În afară de ruinele cetății Turnu, aici puteți admira și o statuie a domnitorului Mircea cel Bătrân și Bustul generalului David Praporgescu, precum și Monumentul Independenţei cunoscut și ca Dorobanţul de la 1877. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://ro.wikipedia.org/wiki/Turnu_M%C4%83gurele ',
        img:"/images/locatii/TurnuMagurele.jpg"
    },
     { Oras: 'Vaslui ',
        Titlu_obiectiv: 'Rezervația arheologică Curtea Domnească',
        Categorie: 3,
       descriere: 'Un alt obiectiv turistic important aflat tot în municipiul Vaslui este Rezervația arheologică „Curtea Domnească”. Aceasta include ruinele curții domnești din oraș, ce au fost construite în Evul Mediu, între anii 1472-1490, și biserica domnească „Tăierea Capului Sf. Ioan Botezătorul”, ce datează din aceeași perioadă. Cetatea a fost ridicată inițial de către domnitorul Alexandru cel Bun, apoi lucrările de extindere au fost realizate la ordinul lui Ștefan cel Mare. În urma săpăturilor arheologice, aici au fost descoperite câteva obiecte valoroase din punct de vedere artistic, printre care se remarcă coșurile ce prezintă scene ale vieții țărănești. În prezent, Rezervația arheologică „Curtea Domnească” a fost restaurată și aici pot fi admirate câteva ruine ce includ și zidurile cetății.',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://planiada.ro/destinatii/vaslui/situl-arheologic-curtea-domneasca-538 ',
        img:"/images/locatii/RezervatiaCurteaDomneasca.jpg"
    },
    { Oras: 'Valcea',
        Titlu_obiectiv: 'Transalpina',
        Categorie: 3,
       descriere: 'O parte a județului Vâlcea este străbătut de una dintre cele două șosele alpine ale României. Este vorba despre șoseaua Transalpina, considerată a fi cea mai înaltă șosea din țara noastră. Acesta leagă regiunile istorice Oltenia și Transilvania și străbate, în total, patru județe: Gorj, Vâlcea, Sibiu și Alba. Transalpina este unul dintre drumurile montane vechi, ce străbat Carpații, despre acesta spunându-se că a fost, inițial, un coridor roman. Transalpina este cunoscută și ca „Drumul Regelui” deoarece, în timpului celui de-al Doilea Război Mondial, regele Carol al 2-lea a ordinat refacerea acestuia. ',
        price: '$$',
        type:"Point",
        latitude:"",
        longitude:"",
        link:' https://www.transalpina.biz/ ',
        img:"/images/locatii/transalpina.jpg"
    }

]

function make_locations(locatii)
{
    locatii.forEach( async (locatie)=>{

    const geodata  = await  geocoder.forwardGeocode({
        query: locatie.Titlu_obiectiv+ "," + locatie.Oras,
        limit:1
        }).send()
        // console.log(geodata.body.features);
        // console.log(geodata.body.features[0].geometry.coordinates)
       let longitude = geodata.body.features[0].geometry.coordinates[0];
        let latitude = geodata.body.features[0].geometry.coordinates[1];
      
        q = "INSERT INTO locatii (oras,titlu_obiectiv,categorie,descriere,price,latitude,longitude,link,img) VALUES(?,?,?,?,?,?,?,?,?)"
        db.query(q,[locatie.Oras,locatie.Titlu_obiectiv,locatie.Categorie,locatie.descriere,locatie.price,latitude,longitude,locatie.link,locatie.img],(err,rows,fields)=>{
            if(err)
            {
                console.log("avem eraore")
                throw(err);

            }
            console.log("am adaugat in " + locatie.Oras + " " + locatie.Titlu_obiectiv + " si are coord" + latitude +" "+longitude);
        })
    })
}

*/

//make_locations(obiective);
