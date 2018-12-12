import React, { Component } from 'react';
import NavBar from './NavBar';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '400', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        background: 'linear-gradient(45deg, #4fa82f 30%, #4fa82f 90%)'
    },
});
class Settings extends Component {
    constructor() {
        super();
        this.state = {
            personInfo: {
                name: '',
                number: ''
            }
        };
        this.saveSettings = this.saveSettings.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
    }
    componentDidMount() {
        this.getSettings();
    }
    getSettings() {
        const projectName = this.props.match.params.projectname;

        fetch(`/${projectName}/number`)
            .then(res => res.json())
            .then(
            (result) => {
                if (result.errors) {
                    console.error('Failed with', result);
                    return;
                }
                const {name, number} = result;
                this.setState({
                    personInfo: {name, number}
                });
            },
            (error) => {
                console.error('HANDLE ME BETTER PLZ');
            }
        );
    }
    saveSettings(e) {
        e.preventDefault();

        const {name, number} = this.state.personInfo;
        const projectName = this.props.match.params.projectname;
        const validatedNumber = number.replace(/\D/g, ''); // remove all non-digits

        fetch(`/${projectName}/add_number`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                number: validatedNumber,
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.errors) {
                    // handle this please
                }
            },
            (error) => {
            }
        );
    }
    handleNameChange(e) {
        const personInfo = { name: e.target.value, number: this.state.personInfo.number };
        this.setState({
            personInfo
        });
    }
    handleNumberChange(e) {
        const personInfo = { name: this.state.personInfo.name, number: e.target.value };
        this.setState({
            personInfo
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <NavBar isSettings="true"></NavBar>
                <CssBaseline />
                <div className="settings-wrapper">
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Person Information
                        </Typography>
                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                <Input
                                    onChange={this.handleNameChange}
                                    value={this.state.personInfo.name}
                                    id="name" name="name" autoComplete="name" autoFocus />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="phone">Phone Number</InputLabel>
                                <Input
                                    onChange={this.handleNumberChange}
                                    value={this.state.personInfo.number}
                                    name="phone" type="phone" id="phone" autoComplete="current-phone" />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={this.saveSettings}
                            >
                                Save
                            </Button>
                        </form>
                    </Paper>
                </div>
            </main>
        );
    }
}

export default withStyles(styles)(Settings);
