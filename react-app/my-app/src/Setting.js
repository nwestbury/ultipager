import React, { Component } from 'react'

class Settings extends Component {
    constructor() {
        super()
        this.state = {
            personInfo: {
                name: '',
                number: ''
            }
        }
        this.getSettings()
    }
    componentDidUpdate() {}
    getSettings = () => {
        console.log('get settings')
        // fetch("https://api.example.com/items")
        //     .then(res => res.json())
        //     .then(
        //         (result) => {
        //             this.setState({
        //                 personInfo: result
        //             });
        //         },
        //         (error) => {
        //             this.setState({});
        //         }
        //     )
    }
    saveSettings = e => {
        console.log('save settings', this.state)
        e.preventDefault()
        fetch('https://mywebsite.com/endpoint/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.personInfo)
        })
    }
    handleNameChange = e => {
        const personInfo = { name: e.target.value, number: this.state.personInfo.number }
        this.setState({
            personInfo
        })
    }
    handleNumberChange = e => {
        const personInfo = { name: this.state.personInfo.name, number: e.target.value }
        this.setState({
            personInfo
        })
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
                            placeholder="(xxx)xxx-xxxx"
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

export default Settings