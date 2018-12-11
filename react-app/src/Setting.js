import React, { Component } from 'react'

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
        });
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
        return (
        <div className="settings">
            <div className="header"><h1>Settings</h1></div>
            <div className="body">
                <form onSubmit={this.saveSettings}>
                    <div className="dev-name">
                        <h2>Person Name</h2>
                        <input
                            onChange={this.handleNameChange}
                            value={this.state.personInfo.name} 
                            placeholder="Please input the person you want to alert for production error."
                        />
                    </div>
                    <div className="dev-phone">
                        <h2>Phone Number</h2>
                        <input
                            onChange={this.handleNumberChange}
                            value={this.state.personInfo.number} 
                            placeholder="(xxx) xxx-xxxx"
                        />
                    </div>
                    <div className="setting-ok">
                        <button type="submit"> OK </button>
                    </div>
                </form>
            </div>
        </div>
        )
    }
}

export default Settings;