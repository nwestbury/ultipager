import React, { Component } from 'react';

import NavBar from './NavBar';
import ErrorTable from './ErrorTable';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


class ErrorPage extends Component {
    constructor() {
        super();

        this.state = {
            errorFilter: {
                startDate: '',
                endDate: '',
                content: ''
            },
        };
    }

    handleDateFromChange = e => {
        const errorFilter = { 
            startDate: e.target.value, 
            endDate:  this.state.errorFilter.endDate,
            content: this.state.errorFilter.content 
        }
        this.setState({
            errorFilter
        })
    }
    handleDateToChange = e => {
        console.log('UPDATE to?!?!', e.target.value);
        const errorFilter = { 
            startDate: this.state.errorFilter.startDate, 
            endDate: e.target.value,
            content: this.state.errorFilter.content 
        };
        this.setState({
            errorFilter
        });
    }

    handleContentChange = e => {
        const errorFilter = { 
            startDate: this.state.errorFilter.startDate,
            endDate: this.state.errorFilter.endDate,
            content: e.target.value 
        };
        this.setState({
            errorFilter
        });
    }

    render() {
        // const listItems = this.state.dataToDisplay.map(this.createErrorRow);
        const {projectname, errorid} = this.props.match.params;
        return (
            <div className="error-page-main">
                <NavBar></NavBar>
                <div className="error-page-body">
                    <div className="error-filter">
                        <div className="error-filter-header"><h2>Log Filter</h2></div>
                        <div className="error-filter-body">
                            <form className="filter-row">
                                <Grid container spacing={16}>
                                    <Grid item xs={4}>
                                        <FormControl margin="normal" fullWidth>
                                            <TextField
                                                id="dateFrom"
                                                label="Date From"
                                                type="datetime-local"
                                                defaultValue=""
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={this.state.errorFilter.startDate}
                                                onChange={this.handleDateFromChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl margin="normal" fullWidth>
                                            <TextField
                                                id="dateTo"
                                                label="Date To"
                                                type="datetime-local"
                                                defaultValue=""
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={this.state.errorFilter.endDate}
                                                onChange={this.handleDateToChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl margin="normal" required fullWidth>
                                            <InputLabel htmlFor="name">Message Filter</InputLabel>
                                            <Input
                                                onChange={this.handleContentChange}
                                                placeholder="Exception"
                                                value={this.state.errorFilter.content}
                                                id="message" name="message" autoComplete="message" />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </div>
                    <div className="error-log">
                        <div className="error-log-header"><h2>Error Log</h2></div>
                        <div className="error-log-body">
                            <ErrorTable errorFilter={this.state.errorFilter}
                                projectname={projectname} errorid={errorid}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorPage