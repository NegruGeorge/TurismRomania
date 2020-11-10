const previosBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const content = document.getElementById('content');
const bullets = [...document.querySelectorAll('.bullet')];

const MAX_STEPS = 4;
let currentStep =1;

let putere=10;

finishBtn.addEventListener('click',()=>{
    const currentBullet = bullets[currentStep - 1];
    currentBullet.classList.add('completed2');

    content.innerText = `Felicitari ati incheiat!!!`;
})

nextBtn.addEventListener('click',()=>{
    const currentBullet = bullets[currentStep - 1];
    currentBullet.classList.add('completed');

    currentStep++;
    previosBtn.disabled= false;
    if(currentStep === MAX_STEPS)
    {
        nextBtn.disabled= true;
        finishBtn.disabled = false;
    }

    putere=putere*10;

    content.innerText = `Felicitari ati ajuns la pasul numarul ${currentStep} pentru a avansa trebuie sa adunati ${putere} de puncte`;
})

previosBtn.addEventListener('click',()=>{
    const currentBullet = bullets[currentStep - 2];
    currentBullet.classList.remove('completed');

    currentStep--;
    nextBtn.disabled= false;
    finishBtn.disabled = true;
    putere/=10;
    if(currentStep === 1)
    {
        previosBtn.disabled= false;     
        
    }

    content.innerText = `Felicitari ati ajuns la pasul numarul ${currentStep} pentru a avansa trebuie sa adunati ${putere} de puncte`;
})


