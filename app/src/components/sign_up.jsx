import { useState, useEffect } from "react";
import logo from '../assets/logo.png'
import "../styles/sign-up.css";
import { Login } from './login.jsx'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';

export function SignUp({ onLogin }) {
    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [requestErrors, setRequestErrors] = useState({});
    const [currentPage, setCurrentPage] = useState("signup");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);

        if (Object.keys(formErrors).length === 0) {
            setLoading(true);
            try {
                const auth = getAuth(app);
                const { email, password } = formValues;
                await createUserWithEmailAndPassword(auth, email, password);
                setTimeout(() => {
                    setLoading(false);
                    setSuccess(true);
                }, 1300)
                setTimeout(() => {
                    setSuccess(false);
                    setCurrentPage("login");
                }, 3333)
            } catch (error) {
                console.log('FAILED');
                setRequestErrors({error: error});
                setLoading(false);
                setFailed(true);
                setTimeout(() => {
                    setFailed(false);
                }, 3000)
            }
        }
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            // console.log(formValues);
        }
    }, [formErrors, formValues, isSubmit]);

    // Function to handle click event of "Login" span
    const handleLoginClick = () => {
        setCurrentPage("login");
    };

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.username) {
            errors.username = "Username is required!";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 16) {
            errors.password = "Password cannot exceed more than 10 characters";
        }
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Those passwords didn’t match. Try again.";
        }
        return errors;
    };

    return (
        <> 
            {loading && <div className="ring">Loading<span className='ring-span'></span></div>}
            <a href="/">
                <img src={logo} alt="logo.png" className='logo' />
            </a>
            {!loading && !success && !failed && <div>
                {currentPage === "login" ? 
                    <Login onLogin={onLogin}/> : (
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <h1>Sign Up</h1>
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
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Email"
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
                                <div className="field">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={formValues.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="error">{formErrors.confirmPassword}</p>
                                <button className="fluid ui signup-button">Submit</button>
                            </div>
                        </form>
                        <div className="create-account">
                            Already have an account? <span onClick={handleLoginClick}>Login</span>
                        </div>
                    </div>
                )}
            </div>}
            {success && !loading && <div className="success">
                <h1 className="success-text">Thank you for joining {formValues.username}!</h1>
            </div>}
            {failed && !loading && <div className="success">
                <h1 className="success-text">Cannot create account, {requestErrors.error}</h1>
            </div>}
        </>
    );
}