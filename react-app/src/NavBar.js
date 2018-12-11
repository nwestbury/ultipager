import React from "react";
import { Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const AppRouter = (props) => {
    const { classes, isSettings} = props;
    const projectName = document.location.pathname.split('/')[1];
    const name = 'UltiPager' + (isSettings ? ': Settings' : '');
    const icon = isSettings ? <HomeIcon /> : <SettingsIcon />;
    const linkTo = isSettings ? `/${projectName}` : `/${projectName}/settings`;
    return (
    <AppBar position="static">
        <Toolbar className="nav-bar">
            <Typography variant="h6" color="inherit" className={classes.grow}>
               {name}
            </Typography>
            <Link to={linkTo} className="linkNoStyle">
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    {icon}
                </IconButton>
            </Link>
        </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(AppRouter);
        
        