import React from "react";
import { Link } from "react-router-dom";

import IconButton from '@material-ui/core/IconButton';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import { withStyles } from '@material-ui/core/styles';
import { grey400 } from "material-ui/styles/colors";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  FlightTakeoff: {
      fontSize: "180px",
      color: grey400
  }
};

const Welcome = (props) => {
    const { classes } = props;
    const projectName = document.location.pathname.split('/')[1];
    const linkTo = `/${projectName}/errors`;
    return (
        <div className="welcome-page">
            <div className="welcome-text">Welcome 
                <br></br>
                to 
                <br></br>
                {projectName}
                <br></br>
                <Link to={linkTo} className="linkNoStyle">
                    <IconButton color="inherit" aria-label="Menu">
                        <FlightTakeoff className={classes.FlightTakeoff} />
                    </IconButton>
                </Link>
            </div>
        </div>
    );
}

export default withStyles(styles)(Welcome);
        
        