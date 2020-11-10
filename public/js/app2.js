const form = document.getElementById('form');
const Localitate = document.getElementById('Localitate');
const Judet = document.getElementById('Judet');
const Pret = document.getElementById('Pret');
const DateStart = document.getElementById('DateStart');
const DateEnd = document.getElementById('DateEnd');
const titlu = document.getElementById('titlu');
const nr_adulti = document.getElementById("nr_adulti");
const nr_copii = document.getElementById("nr_copii");
const descriere = document.getElementById("descriere");

form.addEventListener('submit',(e) =>{
    e.preventDefault();

    checkInputs();
});

function checkInputs() {

    const JudetVal = Judet.value.trim();
    const LocalitateVal = Localitate.value.trim();
    const PretVal = Pret.value.trim();
    const DateStartVal = DateStart.value.trim();
    const DateEndVal = DateEnd.value.trim();
    const titluVal = titlu.value.trim();
    const descriereVal = descriere.value.trim();
    const nr_adultiVal = nr_adulti.value.trim();
    const nr_copiiVal  = nr_copii.value.trim();

    if(DateStartVal == '')
    {
        setErrorFor(DateStart,'DateStart cannot be empty');
    }
    else
    {
        setSuccessFor(DateStart);
    }

    if(DateEndVal == '')
    {
        setErrorFor(DateEnd,'DateStart cannot be empty');
    }
    else
    {
        setSuccessFor(DateEnd);
    }
    
    
    if(LocalitateVal == '')
    {
        setErrorFor(Localitate,'Localitate cannot be empty');
    }
    else
    {
        setSuccessFor(Localitate);
    }
    
    if(JudetVal == '')
    {
        setErrorFor(Judet,'Judet cannot be empty');
    }
    else
    {
        setSuccessFor(Judet);
    }

    if(PretVal == '')
    {
        setErrorFor(Pret,'Pret cannot be empty');
    }
    else if(!isDouble(PretVal))
    {
        setErrorFor(Pret,'Pret must be a number');
    }
    else
    {
        setSuccessFor(Pret);
    }

    if(descriereVal == '')
    {
        setErrorFor(descriere,'descriere cannot be empty');
    }
    else
    {
        setSuccessFor(descriere);
    }

    if(titluVal == '')
    {
        setErrorFor(titlu,'titlu cannot be empty');
    }
    else
    {
        setSuccessFor(titlu);
    }


    if(nr_adultiVal == '')
    {
        setErrorFor(nr_adulti,'nr_adulti cannot be empty');
    }
    else if(!isDouble(nr_adultiVal))
    {
        setErrorFor(nr_adulti,'nr_adulti must be a number');
    }
    else
    {
        setSuccessFor(nr_adulti);
    }
   
    if(nr_copiiVal == '')
    {
        setErrorFor(nr_copii,'nr_copii cannot be empty');
    }
    else if(!isDouble(nr_copiiVal))
    {
        setErrorFor(nr_copii,'nr_copii must be a number');
    }
    else
    {
        setSuccessFor(nr_copii);
    }
    

}


function setErrorFor(input,message)
{
    const formControl=input.parentElement;
    const small=formControl.querySelector('small');

    small.innerText=message;
    formControl.className= 'form-control error';

}


function setSuccessFor(input)
{
    const formControl=input.parentElement;
    
    formControl.className= 'form-control success';
    
}

function isDouble(nr)
{
    return /^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?/.test(nr);
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

