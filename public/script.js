/* ================= BASE URL ================= */
const BASE_URL = "https://YOUR-RENDER-APP.onrender.com";


/* ================= REGISTER MODAL ================= */

window.openRegister = function () {
  document.getElementById("registerModal").style.display = "flex";
};

window.closeRegister = function () {
  document.getElementById("registerModal").style.display = "none";
};


/* ================= REGISTER USER ================= */

window.registerUser = async function () {

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Now login.");
      closeRegister();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Server error while registering");
  }
};


/* ================= LOGIN USER ================= */

window.loginUser = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      location.reload();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Login server error");
  }
};


/* ================= GOOGLE LOGIN ================= */

window.handleCredentialResponse = function (response) {

  fetch(`${BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken: response.credential }),
  })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("token", data.token);
      alert("Google login successful!");
      location.reload();
    })
    .catch(err => console.log(err));
};


/* ================= PASSWORD TOGGLE ================= */

window.togglePassword = function () {
  const pass = document.getElementById("password");
  const open = document.getElementById("eye-open");
  const closed = document.getElementById("eye-closed");

  if (pass.type === "password") {
    pass.type = "text";
    open.style.display = "none";
    closed.style.display = "block";
  } else {
    pass.type = "password";
    open.style.display = "block";
    closed.style.display = "none";
  }
};


/* ================= SLIDER ================= */

const slides = [
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop"
];

let index = 0;

window.onload = () => {
  const img = document.getElementById("slideImage");
  const indicators = document.querySelectorAll(".indicator");

  setInterval(() => {
    index = (index + 1) % slides.length;
    img.src = slides[index];

    indicators.forEach(i => i.classList.remove("active"));
    indicators[index].classList.add("active");
  }, 3000);
};