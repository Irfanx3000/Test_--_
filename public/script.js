/* ================= CONFIGURATION ================= */
// Ensure this is your Backend URL (where your API runs)
const BASE_URL = "https://login-demo-o1hu.onrender.com"; 

console.log("Script.js loaded successfully!");

/* ================= MODAL CONTROLS ================= */

window.openRegister = function () {
    console.log("Opening Register Modal...");
    const modal = document.getElementById("registerModal");
    if (modal) {
        modal.style.display = "flex";
    } else {
        console.error("Error: Could not find element with ID 'registerModal'");
    }
};

window.closeRegister = function () {
    const modal = document.getElementById("registerModal");
    if (modal) {
        modal.style.display = "none";
    }
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registration successful! Now login.");
            window.closeRegister();
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (err) {
        console.error("Registration Error:", err);
        alert("Server error while registering. Check console.");
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            location.reload();
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Login server error");
    }
};

/* ================= GOOGLE LOGIN ================= */

window.handleCredentialResponse = function (response) {
    fetch(`${BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Google login successful!");
            location.reload();
        } else {
            alert("Google login failed.");
        }
    })
    .catch(err => console.error("Google Login Error:", err));
};

/* ================= PASSWORD TOGGLES ================= */

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

window.toggleRegPassword = function () {
    const passwordInput = document.getElementById('regPassword');
    const eyeOpen = document.getElementById('reg-eye-open');
    const eyeClosed = document.getElementById('reg-eye-closed');

    if (passwordInput && passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if(eyeOpen) eyeOpen.style.display = 'none';
        if(eyeClosed) eyeClosed.style.display = 'block';
    } else if (passwordInput) {
        passwordInput.type = 'password';
        if(eyeOpen) eyeOpen.style.display = 'block';
        if(eyeClosed) eyeClosed.style.display = 'none';
    }
};

/* ================= SLIDER & INITIALIZATION ================= */

const slides = [
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop"
];

let currentIndex = 0;

window.addEventListener('load', () => {
    const img = document.getElementById("slideImage");
    const indicators = document.querySelectorAll(".indicator");

    if (img && indicators.length > 0) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            img.src = slides[currentIndex];

            indicators.forEach(i => i.classList.remove("active"));
            indicators[currentIndex].classList.add("active");
        }, 3000);
    }
});