import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ErrorPage from './ErrorPage'
import Settings from './Setting'


// const Index = () => <h2>Error Page</h2>;
// const Settings = () => <h2>Settings</h2>;

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Error Log</Link>
          </li>
          <li>
            <Link to="/settings/">Settings</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={ErrorPage} />
      <Route path="/settings/" component={Settings} />
    </div>
  </Router>
);

export default AppRouter;