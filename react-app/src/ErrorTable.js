import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class ErrorTable extends React.Component {

    constructor() {
        super();

        this.state = {
            page: 0,
            limit: 10,
            dataToDisplay: [],
            totalData: 0,
            sort_order: 'desc',
            sort_by: 'time',
            type: '',
            errorFilter: {
                startDate: '',
                endDate: '',
                content: '',
            },
        };

        this.getRealtimeErrorData = this.getRealtimeErrorData.bind(this);
        this.getErrorData = this.getErrorData.bind(this);

        const projectName = document.location.pathname.split('/')[1];
        this.socket = io(document.location.origin + '/' + projectName);
        this.socket.on('message', this.getRealtimeErrorData);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    componentDidMount() {
        const {errorid} = this.props;

        const options = {
            limit: this.state.limit,
        };
        if (errorid) options.error_id = parseInt(errorid);
        this.getErrorData(options);
    }

    componentWillUnmount() {
        this.socket.off('message');
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

    getErrorData(options) {
        const projectName = this.props.projectname;
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
                    dataToDisplay: result.errors,
                    totalData: result.num_errors,
                });
            },
            (error) => {
                console.error('HANDLE THIS ERROR BETTER!');
            }
        );
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
            index: this.state.limit * this.state.page,
            limit: this.state.limit,
            type: this.state.type,
        };

        if (startDate) options.start_date = new Date(startDate).toISOString();
        if (endDate) options.end_date = new Date(endDate).toISOString();
        if (content) options.message = content;
        if (this.state.type) options.type = this.state.type;

        console.log('options', options);

        this.getErrorData(options);
    }

    handleChangePage(event, page) {
        this.setState({ page }, this.applyFilters);
    }

    handleChangeRowsPerPage(event) {
        this.setState({ limit: parseInt(event.target.value) }, this.applyFilters);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errorFilter !== this.state.errorFilter || 
            nextProps.errorFilter.startDate !== this.state.startDate ||
            nextProps.errorFilter.endDate !== this.state.endDate ||
            nextProps.errorFilter.content !== this.state.content) {
            console.log('NEW ???!??!', nextProps.errorFilter);
            this.setState({ errorFilter: nextProps.errorFilter }, this.applyFilters);
        }
    }

    render() {
        const { classes } = this.props;
        const { limit, page, index, dataToDisplay, totalData } = this.state;
        const emptyRows = limit - Math.min(limit, totalData - index);

        console.log('test', dataToDisplay);

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>User Agent</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataToDisplay.map(row => {
                            const utc = moment.utc(row.time).toDate();
                            const local = moment(utc).local().format('YYYY-MM-DD HH:mm:ss');
                        return (
                            <TableRow key={row.id}>
                            <TableCell>{local}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.message}</TableCell>
                            <TableCell>{row.user_agent}</TableCell>
                            </TableRow>
                        );
                        })}
                        {emptyRows > 0 && (
                        <TableRow style={{ height: 48 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            colSpan={3}
                            count={totalData}
                            rowsPerPage={limit}
                            page={page}
                            SelectProps={{
                                native: true,
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                        </TableRow>
                    </TableFooter>
                    </Table>
                </div>
            </Paper>
            );
    }
}

ErrorTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorTable);