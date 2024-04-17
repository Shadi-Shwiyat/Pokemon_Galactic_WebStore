import { useState, useEffect } from "react";
import logo from '../assets/logo.png'
import "../styles/sign-up.css";
import { SignUp } from "./sign_up";

export function Login({ onLogin }) {
    const initialValues = {
        username: "",
        password: "",
    };
    const signinUrl = 'https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/signin';
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        try {
            const response = await fetch(signinUrl, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Store token in local storage
                onLogin(); // Trigger the onLogin function to update app state
            } else {
                // Handle login failure
                // You can set error state here
            }
        } catch (error) {
            // Handle network errors
        }
    };

    // Function to check if user is authenticated
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    // UseEffect hook to redirect authenticated users
    useEffect(() => {
        if (isAuthenticated()) {
            onLogin(); // Trigger the onLogin function to update app state
        }
    }, []);

    // Function to handle click event of "Create Account" span
    const handleCreateAccountClick = () => {
        setCurrentPage("signup");
    };

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.username) {
            errors.username = "Username is required!";
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
            {currentPage === "signup" ? <SignUp onLogin={onLogin}/> : (
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <h1>Log In</h1>
                        <div className="ui divider"></div>
                        <div className="ui form">
                            <div className="field">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formValues.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="error">{formErrors.username}</p>
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
        </>
    );
}
