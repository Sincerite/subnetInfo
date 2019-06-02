import * as React from 'react';
import * as style from './style.css';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import Ping from "ping.js";
import IPv4 from "../../domain/IPv4";

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
            pingTime: 0,
        };
    }


    _handleIpv4change = (e) => {
        this.setState({ipv4Value: e.target.value});
    };

    _handlePingButton = (e) => {
        e.preventDefault();

        // const p = new Ping();
        //
        // console.log(this.state.ipv4Value);
        //
        // p.ping("http://" + this.state.ipv4Value, function(err, data) {
        //     console.log(data);
        // });

        this.ping(this.state.ipv4Value, 80, console.log);
    };

    _handleSubmit = (e) => {
        e.preventDefault();
        const { uiStore } = this.props;

        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.state.ipv4Value)) {
            uiStore.initiateNewAddress(this.state.ipv4Value);
        } else {
            console.error("Invalid IP Address..")
        }
    };

    public ping(host, port, pong) {

        var started = new Date().getTime();

        var http = new XMLHttpRequest();

        const _that = this;

        http.open("GET", "http://" + host + ":" + port, /*async*/true);
        var time = http.onreadystatechange = function() {
            if (http.readyState == 4) {
                var ended = new Date().getTime();

                var milliseconds = ended - started;

                if (pong != null) {
                    pong(milliseconds);
                    return milliseconds;
                }
            }
        };
        try {
            http.send(null);
            console.log(time);
        } catch(exception) {
            // console.error(exception);
        }

    };

    // ping(ip) {
    //
    //     let inUse = true;
    //     var _that = this;
    //
    //     const img = new Image();
    //
    //     img.onload = function() { console.log("Good"); };
    //     img.onerror = function() { console.log("Good"); };
    //
    //     const start = new Date().getTime();
    //     img.src = "http://" + ip;
    //     const timer = setTimeout(function() { console.log("Bad"); }, 5000);
    //
    // }


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
                            <td>{ uiStore.currentIPAddress ? IPv4.printAsBinString(uiStore.currentIPAddress.toAddressValue()) : "-" }</td>
                        </tr>
                        <tr>
                            <td>Class</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.addressClass : "-" }</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Is Public?</td>
                            <td>{ uiStore.currentIPAddress && uiStore.currentIPAddress.determineIsInPublicPool() ? "Yes" : "No" }</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Network Mask</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.mask.printOctets() : "-" }</td>
                            <td>{ uiStore.currentIPAddress ? IPv4.printAsBinString(uiStore.currentIPAddress.mask.toAddressValue()) : "-" }</td>
                        </tr>
                        <tr>
                            <td>Broadcast</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.broadcast.printOctets() : "-" }</td>
                            <td>{ uiStore.currentIPAddress ? IPv4.printAsBinString(uiStore.currentIPAddress.broadcast.toAddressValue()) : "-" }</td>
                        </tr>
                        <tr>
                            <td>First Host</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.firstHostAddress.printOctets() : "-" }</td>
                            <td>{ uiStore.currentIPAddress ? IPv4.printAsBinString(uiStore.currentIPAddress.firstHostAddress.toAddressValue()) : "-" }</td>

                    </tr>
                        <tr>
                            <td>Last Host</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.lastHostAddress.printOctets() : "-" }</td>
                            <td>{ uiStore.currentIPAddress ? IPv4.printAsBinString(uiStore.currentIPAddress.lastHostAddress.toAddressValue()) : "-" }</td>
                        </tr>
                        <tr>
                            <td>Max Host Ammount</td>
                            <td>{ uiStore.currentIPAddress ? uiStore.currentIPAddress.maxHostAmmount : "-" }</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Is Host?</td>
                            <td>{ uiStore.currentIPAddress ? (uiStore.currentIPAddress.isHost ? "Yes" : "No") : "-" }</td>
                            <td>n/a</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
