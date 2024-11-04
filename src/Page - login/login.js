const loginForm = document.querySelector(".box-login")
const registerForm = document.querySelector(".box-register")
const registerChanger = document.querySelector(".register-changer")
const loginChanger = document.querySelector(".login-changer")

registerChanger.addEventListener("click", () => {
    loginForm.classList.add("hidden")
    registerForm.classList.remove("hidden")
    console.log("Register form")
})

loginChanger.addEventListener("click", () => {
    registerForm.classList.add("hidden")
    loginForm.classList.remove("hidden")
    console.log("Login form")
})

