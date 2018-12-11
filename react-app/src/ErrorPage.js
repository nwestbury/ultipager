import React, { Component } from 'react';

import NavBar from './NavBar';
import ErrorTable from './ErrorTable';
import Button from '@material-ui/core/Button';

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
                            <div className="filter-row">
                                <form onSubmit={this.applyFilters}>
                                    <div>
                                        <span className="date-filter-from">
                                            <b>Date From</b>
                                            <input
                                                type="datetime-local"
                                                onChange={this.handleDateFromChange}
                                                value={this.state.errorFilter.startDate} 
                                            />
                                        </span>
                                        <span className="date-filter-to">
                                            <b>To</b>
                                            <input
                                                type="datetime-local"
                                                onChange={this.handleDateToChange}
                                                value={this.state.errorFilter.endDate} 
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <span className="content-filter">
                                            <b>Content Filter</b>
                                            <input
                                                placeholder="Content"
                                                onChange={this.handleContentChange}
                                                value={this.state.errorFilter.content} 
                                            />  
                                        </span>
                                        <span className="filter-apply">
                                            <Button type="submit" variant="contained" color="primary">
                                                Apply
                                            </Button>
                                        </span>
                                    </div>
                                </form>
                            </div>
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