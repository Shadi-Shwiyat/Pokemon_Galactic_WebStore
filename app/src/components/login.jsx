import { useState, useEffect } from "react";
import logo from '../assets/logo.png'
import "../styles/sign-up.css";
import { SignUp } from "./sign_up";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';

export function Login({ setIsLoggedIn }) {
    const initialValues = {
        email: "",
        password: "",
    };
    const loginUrl = 'https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/signin';
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [failed, setFailed] = useState(false);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");
    const loggedIn = localStorage.getItem('isLoggedIn');

    // Instantiate the auth service SDK
    const auth = getAuth(app);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));

        if (Object.keys(formErrors).length === 0) {
            try {
                // Sign in with email and password in firebase auth service
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    formValues.email,
                    formValues.password
                );
        
                // The signed-in user info
                const user = userCredential.user;
                console.log(user);

                const uid = userCredential.user.uid;
                const loginPost = {
                    email: formValues.email,
                    uid: uid
                }
                try {
                    fetch(loginUrl, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(loginPost)
                    })
                    .then(res => res.json())
                    .then((data) =>{
                        console.log(data);
                    })
                } catch (error) {
                    console.log('FAILED TO ADD POKEDOLLAR ON SIGNIN');
                    console.log(error);
                }

                // Store logged-in state and login timestamp in local storage
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('loginTimestamp', new Date().getTime());

                setIsLoggedIn(true);
            } catch (err) {
                // Handle Errors here.
                const errorMessage = err.message;
                setError(errorMessage);
                setFailed(true);
                setTimeout(() => {
                    setFailed(false);
                }, 2600)
            }
        }
    };

    // Function to handle click event of "Create Account" span
    const handleCreateAccountClick = () => {
        setCurrentPage("signup");
    };

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.email) {
            errors.email = "email is required!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    };

    return (
        <>
            <a href="/">
                <img src={logo} alt="logo.png" className='logo' />
            </a>
            {!failed && <div>
                {currentPage === "signup" ? <SignUp setIsLoggedIn={setIsLoggedIn} /> : (
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <h1>Log In</h1>
                            <div className="ui divider"></div>
                            <div className="ui form">
                                <div className="field">
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Choose a email"
                                        value={formValues.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="error">{formErrors.email}</p>
                                <div className="field">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="error">{formErrors.password}</p>
                                <button className="fluid ui signup-button">Submit</button>
                            </div>
                        </form>
                        <div className="create-account">
                            Dont have an account? <span onClick={handleCreateAccountClick}>Create Account</span>
                        </div>
                    </div>
                )}
            </div>}
            {failed && <div className="success">
                <h1 className="success-text">{error}</h1>
            </div>}
        </>
    );
}
