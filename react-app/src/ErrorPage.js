import React, { Component } from 'react';
import io from 'socket.io-client';

class ErrorPage extends Component {
    constructor() {
        super();

        this.state = {
            dataToDisplay: [],
            index: 0,
            limit: 50,
            sort_order: 'desc',
            sort_by: 'time',
            type: '',
            errorFilter: {
                startDate: '',
                endDate: '',
                content: ''
            },
            errorlist: [],
        };

        this.getRealtimeErrorData = this.getRealtimeErrorData.bind(this);
        this.getErrorData = this.getErrorData.bind(this);

        const projectName = document.location.pathname.split('/')[1];
        this.socket = io(document.location.origin + '/' + projectName);
        this.socket.on('message', this.getRealtimeErrorData);
    }
    getErrorData(options) {
        const projectName = this.props.match.params.projectname;

        fetch(`/${projectName}/errors`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then((result) => {
                this.setState({
                    dataToDisplay: result
                });
            },
            (error) => {
                console.error('HANDLE THIS ERROR BETTER!');
            }
        );
    }

    getRealtimeErrorData(errorObj) {
        const {sort_by, sort_order} = this.state;
        if (sort_by === 'time' && sort_order === 'desc') {
            // Prepend error object to display and limit
            const dataToDisplay = [errorObj, ...this.state.dataToDisplay]
                                  .slice(0, this.state.limit);

            this.setState({dataToDisplay});
        }
    }

    componentDidMount() {
        const {errorid} = this.props.match.params;

        const options = {
            index: this.state.index,
            limit: this.state.limit,
        };
        if (errorid) options.error_id = parseInt(errorid);
        this.getErrorData(options);
    }

    componentWillUnmount() {
        this.socket.off('message');
    }

    createErrorRow(errorItem) {
        return (<li key={errorItem.id} onClick={()=>{}}>{errorItem.message}</li>);
    }

    applyFilters = e => {
        if (e) e.preventDefault();
        const {startDate, endDate, content} = this.state.errorFilter;

        if (startDate !== '' && endDate !== '' &&
            (new Date(startDate) > new Date(endDate))) {
            alert('Please input valid date range');
        }
        // send api call, also re-render the component
        const options = {
            sort_order: this.state.sort_order,
            sort_by: this.state.sort_by,
            index: this.state.index,
            limit: this.state.limit,
            type: this.state.type,
        }

        if (startDate) options.start_date = new Date(startDate).toISOString();
        if (endDate) options.end_date = new Date(endDate).toISOString();
        if (content) options.message = content;
        if (this.state.type) options.type = this.state.type;

        console.log('options', options);

        this.getErrorData(options)
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
        }
        this.setState({
            errorFilter
        })
    }
    handleContentChange = e => {
        const errorFilter = { 
            startDate: this.state.errorFilter.startDate,
            endDate: this.state.errorFilter.endDate,
            content: e.target.value 
        }
        this.setState({
            errorFilter
        })
    }
    render() {
        const listItems = this.state.dataToDisplay.map(this.createErrorRow);
        return (
            <div className="error-page-main">
                <div className="header"><h1>ULTI PAGER</h1></div>
                <div className="body">
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
                                            <button type="submit"> Apply </button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="error-log">
                        <div className="error-log-header"><h2>Error Log</h2></div>
                        <div className="error-log-body">
                            <ul className="error-list">{listItems}</ul>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default ErrorPage