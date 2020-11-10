const toggleButton = document.getElementsByClassName("toggle-button")[0]
const navbarLinks = document.getElementsByClassName("nav__links")[0]
toggleButton.addEventListener("click",()=>{
    navbarLinks.classList.toggle("active");
   
})
console.log(toggleButton);
console.log(navbarLinks);
console.log("george");