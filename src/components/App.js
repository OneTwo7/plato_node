import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Footer from './Footer';

export default function App () {
    return (
        <React.Fragment>
            <Header />
            <main className="container">
                <Route exact path="/" component={Home} />
            </main>
            <Footer />
        </React.Fragment>
    );
}
