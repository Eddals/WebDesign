import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Portfolio from './components/Portfolio/Portfolio';
import AdminLogin from './components/AdminLogin/AdminLogin';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/portfolio" component={Portfolio} />
                <Route path="/admin-login" component={AdminLogin} />
            </Switch>
        </Router>
    );
};

export default App;