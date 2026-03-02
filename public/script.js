/* ================= CONFIGURATION ================= */
const BASE_URL = "https://login-demo-o1hu.onrender.com"; 

console.log("Script.js loaded successfully!");

/* ================= AUTH CHECK & REDIRECTION ================= */
// This runs on every page load
window.addEventListener('load', () => {
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname;

    // If on home.html without token, kick back to login
    if (currentPage.includes("home.html") && !token) {
        window.location.href = "index.html";
    }
    
    // If on home.html and logged in, show admin link (for testing)
    if (currentPage.includes("home.html") && token) {
        const adminLink = document.getElementById('adminLink');
        if(adminLink) adminLink.style.display = 'inline-block';
    }

    // Initialize Slider only if on index page
    const img = document.getElementById("slideImage");
    if (img) {
        initSlider();
    }
});

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
            // CHANGED: Redirect to home.html instead of reloading
            window.location.href = "home.html"; 
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
            // CHANGED: Redirect to home.html
            window.location.href = "home.html";
        } else {
            alert("Google login failed.");
        }
    })
    .catch(err => console.error("Google Login Error:", err));
};

/* ================= HOME & ADMIN PANEL LOGIC ================= */
window.logout = function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
};

window.openAdminPanel = async function () {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'flex';

    try {
        const res = await fetch(`${BASE_URL}/api/auth/users`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();

        if (res.ok) {
            const tbody = document.getElementById('userTableBody');
            const totalDisplay = document.getElementById('totalUsers');
            
            if (tbody) tbody.innerHTML = ""; 
            
            // Handle the getAdminStats object structure { totalAccounts, users }
            if (totalDisplay) totalDisplay.innerText = data.totalAccounts || 0;

            if (data.users && data.users.length > 0) {
                data.users.forEach(user => {
                    const row = `<tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>`;
                    if (tbody) tbody.innerHTML += row;
                });
            }
        }
    } catch (err) {
        console.error("Admin Fetch Error:", err);
    }
};

window.closeAdminPanel = function () {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'none';
};

/* ================= MODAL & UI CONTROLS ================= */
window.openRegister = function () {
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "flex";
};

window.closeRegister = function () {
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "none";
};

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
    }
};

window.togglePassword = function () {
    const pass = document.getElementById("password");
    const open = document.getElementById("eye-open");
    const closed = document.getElementById("eye-closed");
    if (pass.type === "password") {
        pass.type = "text";
        open.style.display = "none"; closed.style.display = "block";
    } else {
        pass.type = "password";
        open.style.display = "block"; closed.style.display = "none";
    }
};

/* ================= SLIDER LOGIC ================= */
function initSlider() {
    const slides = [
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200",
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200"
    ];
    let currentIndex = 0;
    const img = document.getElementById("slideImage");
    const indicators = document.querySelectorAll(".indicator");

    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        if(img) img.src = slides[currentIndex];
        indicators.forEach(i => i.classList.remove("active"));
        if(indicators[currentIndex]) indicators[currentIndex].classList.add("active");
    }, 3000);
}