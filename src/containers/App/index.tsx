import * as React from 'react';
import * as style from './style.css';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import Ping from "ping.js";

export interface AppProps extends RouteComponentProps<any> {
    //
}

export interface AppState {
    //
}

@inject('uiStore')
@observer
export default class App extends React.Component<any, any> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            ipv4Value: "127.0.0.1",
        };
    }


    _handleIpv4change = (e) => {
        this.setState({ipv4Value: e.target.value});
    };

    _handlePingButton = (e) => {
        e.preventDefault();

        const p = new Ping();

        console.log(this.state.ipv4Value);

        p.ping("http://" + this.state.ipv4Value, function(err, data) {
            console.log(data, err);
        });
    };

    _handleSubmit = (e) => {
        e.preventDefault();
        const { uiStore } = this.props;
        uiStore.initiateNewAddress(this.state.ipv4Value);
    };

    public ping(host, port, pong) {

        var started = new Date().getTime();

        var http = new XMLHttpRequest();

        http.open("GET", "http://" + host + ":" + port, /*async*/true);
        http.onreadystatechange = function() {
            if (http.readyState == 4) {
                var ended = new Date().getTime();

                var milliseconds = ended - started;

                if (pong != null) {
                    pong(milliseconds);
                }
            }
        };
        try {
            http.send(null);
        } catch(exception) {
            // this is expected
        }

    };


    render() {
        const { uiStore } = this.props;

        return (
            <div>
                <div className="main-input text-center">
                    <form onSubmit={ this._handleSubmit }>
                        <input type="text"
                               className=""
                               value={this.state.ipv4Value}
                               onChange={this._handleIpv4change}
                        />
                        <button onClick={ this._handlePingButton }
                                className="btn btn-secondary"
                                formNoValidate>Ping
                        </button>
                        <button type="submit"
                                className="btn btn-primary"
                                formNoValidate>Submit
                        </button>
                    </form>
                </div>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>IP Address</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.printOctets() : "-" }</td>
                        </tr>
                        <tr>
                            <td>Class</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.addressClass : "-" }</td>
                        </tr>
                        <tr>
                            <td>Is Public?</td>
                            <td>{ uiStore.currentIPAddress && uiStore.currentIPAddress.determineIsInPublicPool() ? "Yes" : "No" }</td>
                        </tr>
                        <tr>
                            <td>Network Mask</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.mask.printOctets() : "-" }</td>
                        </tr>
                        <tr>
                            <td>Broadcast</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.broadcast.printOctets() : "-" }</td>
                        </tr>
                        <tr>
                            <td>First Host</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.firstHostAddress.printOctets() : "-" }</td>

                    </tr>
                        <tr>
                            <td>Last Host</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.lastHostAddress.printOctets() : "-" }</td>
                        </tr>
                        <tr>
                            <td>Max Host Ammount</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.maxHostAmmount : "-" }</td>
                        </tr>
                        <tr>
                            <td>Is Host?</td>
                            <td>true</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
