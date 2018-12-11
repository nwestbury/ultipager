import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ErrorPage from './ErrorPage';
import Settings from './Setting';


const AppRouter = () => {
    const projectName = document.location.pathname.split('/')[1];
    return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to={`/${projectName}`}>Error Log</Link>
            </li>
            <li>
              <Link to={`/${projectName}/settings`}>Settings</Link>
            </li>
          </ul>
        </nav>

        <Route path="/:projectname" exact component={ErrorPage} />
        <Route path="/:projectname/settings/" component={Settings} />
      </div>
    </Router>
  );
}

export default AppRouter;