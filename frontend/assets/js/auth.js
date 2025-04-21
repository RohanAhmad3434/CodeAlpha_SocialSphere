// assets/js/auth.js

const baseURL = "http://localhost:3000/api/auth";

// REGISTER functionality
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${baseURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registered successfully. Please login.");
        window.location.href = "login.html";
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  });
}

// LOGIN functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");
        localStorage.setItem("userId", data.user.id);
        console.log(data.user.id);    
        window.location.href = "feed.html";
      } else {
        document.getElementById("errorMsg").textContent = data.error || "Login failed.";
      }
    } catch (err) {
      document.getElementById("errorMsg").textContent = "Something went wrong.";
      console.error(err);
    }
  });
}
