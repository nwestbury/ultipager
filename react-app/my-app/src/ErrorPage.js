import React, { Component } from 'react'

class ErrorPage extends Component {
    constructor() {
        super()
        this.state = {
            dataToDisplay: {},
            index: 0,
            limit: 50,
            sort_order: '',
            sort_by: '',
            type: '',
            errorFilter: {
                startDate: '',
                endDate: '',
                content: ''
            },
        }
    }
    getErrorData = (options={}) => {
        console.log('get error data', options)

        // fetch('https://mywebsite.com/endpoint/', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(options)
        // }).then(res => res.json())
        //     .then(
        //         (result) => {
        //             this.setState({
        //                 dataToDisplay: result
        //         });
        //         },
        //         // Note: it's important to handle errors here
        //         // instead of a catch() block so that we don't swallow
        //         // exceptions from actual bugs in components.
        //         (error) => {
        //             this.setState({});
        //         }
        //     )
    }
    componentDidMount() {
        this.getErrorData()
    }
    createErrorRow = item => {
        return (
            <li key={item} onClick={()=>{}}>{item}</li>
        )
    }
    applyFilters = e => {
        e.preventDefault()
        const startDate = this.state.errorFilter.startDate;
        const endDate = this.state.errorFilter.endDate;
        console.log(new Date(startDate).getTime())
        console.log(new Date(endDate).getTime())
        if ((new Date(startDate).getTime() > new Date(endDate).getTime())) {
            alert('please input valid date range')
        }
        console.log('apply filters', this.state)
        // send api call, also re-render the component
        const options = {
            sort_order: this.state.sort_order,
            sort_by: this.state.sort_by,
            index: this.state.index,
            limit: this.state.limit,
            start_date: new Date(this.state.errorFilter.startDate).toISOString(),
            end_date: new Date(this.state.errorFilter.endDate).toISOString(),
            message: this.state.errorFilter.content,
            type: this.state.type
        }
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
        const errorlist = ["error 1", "error 2", "error 3"]
        const listItems = errorlist.map(this.createErrorRow)
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
        )
    }
}

export default ErrorPage