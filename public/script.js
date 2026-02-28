/* ---------------- SLIDER ---------------- */

document.addEventListener("DOMContentLoaded", () => {

  const slides = [
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565514020179-026b92b2d0b6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop"
  ];

  let index = 0;
  const slideImage = document.getElementById("slideImage");
  const indicators = document.querySelectorAll(".indicator");

  function changeSlide(){
    index = (index + 1) % slides.length;

    slideImage.src = slides[index];

    indicators.forEach(ind => ind.classList.remove("active"));
    indicators[index].classList.add("active");
  }

  setInterval(changeSlide,3000);
});


/* ---------------- EMAIL LOGIN ---------------- */

window.loginUser = async function(){

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if(res.ok){
    localStorage.setItem("token", data.token);
    alert("Login Successful!");
  } else {
    alert(data.message);
  }
};


/* ---------------- GOOGLE LOGIN ---------------- */

window.handleCredentialResponse = async function(response){

  const res = await fetch("/api/auth/google",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ idToken: response.credential })
  });

  const data = await res.json();

  if(res.ok){
    localStorage.setItem("token", data.token);
    alert("Google Login Successful!");
  } else {
    alert("Google login failed");
  }
};


/* ---------------- PASSWORD TOGGLE ---------------- */

window.togglePassword = function(){
  const password = document.getElementById("password");
  const eyeOpen = document.getElementById("eye-open");
  const eyeClosed = document.getElementById("eye-closed");

  if(password.type === "password"){
    password.type = "text";
    eyeOpen.style.display="none";
    eyeClosed.style.display="block";
  }else{
    password.type = "password";
    eyeOpen.style.display="block";
    eyeClosed.style.display="none";
  }
};


window.closeModal = function(){
  document.querySelector(".overlay").style.display="none";
};