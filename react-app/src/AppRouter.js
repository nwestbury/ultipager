import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ErrorPage from './ErrorPage';
import Setting from './Setting';
import Welcome from './Welcome'

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/:projectname" exact component={Welcome} />
      <Route path="/:projectname/errors" exact component={ErrorPage} />
      <Route path="/:projectname/settings/" component={Setting} />
      <Route path="/:projectname/:errorid(\d+)" exact component={ErrorPage} />
    </div>
  </Router>
);

export default AppRouter;