import { useState, useEffect } from "react";
import "../styles/sign-up.css";
import { SignUp } from "./sign_up";

export function Login({ onLogin }) {
    const initialValues = {
        username: "",
        password: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        onLogin();
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors, formValues, isSubmit]);

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
            {currentPage === "signup" ? <SignUp /> : (
                <div className="container">
                    {Object.keys(formErrors).length === 0 && isSubmit ? (
                        <div className="ui message success">
                            Signed in successfully
                        </div>
                    ) : (
                        console.log("Entered Details", formValues)
                    )}

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
                            <p>{formErrors.username}</p>
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
                            <p>{formErrors.password}</p>
                            <button className="fluid ui button">Submit</button>
                        </div>
                    </form>
                    <div className="text">
                        Dont have an account? <span onClick={handleCreateAccountClick}>Create Account</span>
                    </div>
                </div>
            )}
        </>
    );
}
