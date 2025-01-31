import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from './signin';
import SignUp from './signup';
import Home from './Home';
import './signin.css'; // Reuse the same CSS file for styling

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;