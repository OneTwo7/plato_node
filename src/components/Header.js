import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function useFetch (data, setData) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => {
        return res.json();
    }).then(json => {
        if (json.success) {
            setData(json.user);
        }
    });
}

export default function Header () {
    const email = useFormInput('');
    const password = useFormInput('');
    const [user, setUser] = useState(null);

    function useFormInput (initialValue) {
        const [value, setValue] = useState(initialValue);

        function onChange (event) {
            setValue(event.target.value);
        }

        return {
            value,
            onChange,
        };
    }

    function signin () {
        useFetch({
            email: email.value,
            password: password.value,
        }, setUser);
    }

    console.log(user); // eslint-disable-line no-console

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark" id="navbar-header">
                <div className="container">
                    <Link to="/" className="navbar-brand">Plato</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbar-header"
                        aria-controls="navbar-header"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar-header">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item active">
                                <Link to="/courses" className="nav-link">Courses</Link>
                            </li>
                        </ul>
                        {user ?
                            (
                                <ul className="navbar-nav">
                                    <li className="navbar-item active">
                                        <Link to="#" className="nav-link">{`${user.firstName} ${user.lastName}`}</Link>
                                    </li>
                                </ul>
                            )
                            :
                            (
                                <form className="form-inline">
                                    <ul className="navbar-nav">
                                        <li className="nav-item active">
                                            <Link to="/signup" className="nav-link">Sign Up</Link>
                                        </li>
                                    </ul>
                                    <input
                                        className="form-control"
                                        type="email"
                                        placeholder="email"
                                        spellCheck="false"
                                        {...email}
                                    />
                                    <input
                                        className="form-control"
                                        type="password"
                                        placeholder="password"
                                        {...password}
                                    />
                                    <button type="button" className="btn btn-primary" onClick={signin}>Sign In</button>
                                </form>
                            )
                        }
                    </div>
                </div>
            </nav>
        </header>
    );
}
