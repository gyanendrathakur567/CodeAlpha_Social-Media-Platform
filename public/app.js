const authForm = document.getElementById("auth-form");
const title = document.getElementById("title");
const btn = document.getElementById("btn");
const toggleLink = document.getElementById("toggle-link");

let isLogin = true;


/* ==============================
   SWITCH LOGIN / REGISTER
============================== */

toggleLink.addEventListener("click", () => {

    isLogin = !isLogin;

    if (!isLogin) {

        title.innerText = "Create Account";

        btn.innerText = "Join Platform";

        toggleLink.innerText =
            "Already have an account? Sign in here.";

        document.getElementById("password").value = "";

    } else {

        title.innerText = "Welcome Back";

        btn.innerText = "Sign In";

        toggleLink.innerText =
            "New to the platform? Join here.";

        document.getElementById("password").value = "";

    }

});


/* ==============================
   FORM SUBMISSION
============================== */

authForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const username =
        document
            .getElementById("username")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    /* BASIC VALIDATION */

    if (!username || !password) {

        alert("Please enter username and password.");

        return;

    }


    if (username.length < 3) {

        alert(
            "Username must contain at least 3 characters."
        );

        return;

    }


    if (password.length < 4) {

        alert(
            "Password must contain at least 4 characters."
        );

        return;

    }


    /* API URL */

    const url =
        isLogin
            ? "/api/auth/login"
            : "/api/auth/register";


    /* BUTTON LOADING STATE */

    const originalText = btn.innerText;

    btn.disabled = true;

    btn.innerText =
        isLogin
            ? "Signing In..."
            : "Creating Account...";


    try {

        const response =
            await fetch(url, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })

            });


        const data =
            await response.json();


        /* SUCCESS */

        if (response.ok) {


            if (isLogin) {

                /*
                 * Save username
                 */

                localStorage.setItem(
                    "username",
                    data.user
                );


                /*
                 * Go to feed
                 */

                window.location.href =
                    "index.html";


            } else {

                /*
                 * Registration successful
                 */

                alert(
                    data.message ||
                    "Account created successfully!"
                );


                /*
                 * Switch to login
                 */

                isLogin = true;


                title.innerText =
                    "Welcome Back";

                btn.innerText =
                    "Sign In";

                toggleLink.innerText =
                    "New to the platform? Join here.";


                /*
                 * Clear password
                 */

                document.getElementById(
                    "password"
                ).value = "";

            }


        } else {

            alert(
                data.message ||
                "Something went wrong."
            );

        }


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        alert(
            "Unable to connect to the server. " +
            "Make sure your Node.js server is running."
        );


    } finally {

        /*
         * Restore button
         */

        btn.disabled = false;

        if (isLogin) {

            btn.innerText =
                "Sign In";

        } else {

            btn.innerText =
                "Join Platform";

        }

    }

});