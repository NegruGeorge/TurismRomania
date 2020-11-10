const form = document.getElementById('form');
const Nume = document.getElementById('Nume');
const Prenume = document.getElementById('Prenume');
const Mail = document.getElementById('Mail');

const Password = document.getElementById('Password');
const Password2 = document.getElementById('Password2');
const telefon = document.getElementById("telefon");


form.addEventListener('submit',(e) =>{
    e.preventDefault();

    checkInputs();
});

function checkInputs() {

    const NumeVal = Nume.value.trim();
    const PrenumeVal = Prenume.value.trim();
    const MailVal = Mail.value.trim();
    const PassVal = Password.value.trim();
    const Pass2Val = Password2.value.trim();
    const telefonVal = telefon.value.trim();

    console.log(telefonVal)
    
    // we need a ch
    let check=0;


    if(PassVal == '')
    {
        setErrorFor(Password,'Password cannot be empty');
    }
    else
    {
        setSuccessFor(Password);
        check++;
    }

    if(Pass2Val == '')
    {
        setErrorFor(Password2,'Password2 cannot be empty');
    }
    else
    if(PassVal!=Pass2Val)
    {
        setErrorFor(Password2,'Password and Password2 must be the same');
    }
    else
    {
        setSuccessFor(Password2);
        check++;
    }

    if(NumeVal == '')
    {
        setErrorFor(Nume,'Name cannot be empty');
    }
    else
    {
        setSuccessFor(Nume);
        check++;
    }

    if(PrenumeVal == '')
    {
        setErrorFor(Prenume,'Prenume cannot be empty');
    }
    else
    {
        setSuccessFor(Prenume);
        check++;
    }

    if(MailVal == '')
    {
        setErrorFor(Mail,'Mail cannot be empty');
    }
    if (!isEmail(MailVal)) {
		setErrorFor(Mail, 'Not a valid email');
	}
    else
    {
        setSuccessFor(Mail);
        check++;
    }


    if(telefonVal == '')
    {
        setErrorFor(telefon,'nr de telefon nu trebuie sa fie gol');
    }
    else if(!isDouble(telefonVal))
    {
        setErrorFor(telefon,'telefon must have only numbers ');
    }
    else
    {
        setSuccessFor(telefon);
        check++;
    }

    console.log(check);
    if(check===6){
         
        Swal.fire({
            title:"account was created",
            text:"Thank you!!",
            confirmButtonText:"ok"
        }).then((result)=>{ 
            if(result.value)
            {
            form.submit();
            }
            })
          
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