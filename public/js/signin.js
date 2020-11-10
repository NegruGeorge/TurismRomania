const form = document.getElementById('form');

const Mail = document.getElementById('Mail');

const Password = document.getElementById('Password');

form.addEventListener('submit',(e) =>{
    e.preventDefault();

    checkInputs();
});

function checkInputs() {

    const MailVal = Mail.value.trim();
    const PassVal = Password.value.trim();
 

  let check =0;

    if(PassVal == '')
    {
        setErrorFor(Password,'Password cannot be empty');
    }
    else
    {
        setSuccessFor(Password);
        check+=1;
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
        check+=1
    }


    console.log(check);
    if(check===2){
            form.submit();  
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

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}