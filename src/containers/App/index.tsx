import * as React from 'react';
import * as style from './style.css';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';


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

    _handleSubmit = (e) => {
        e.preventDefault();
        const { uiStore } = this.props;
        uiStore.initiateNewAddress(this.state.ipv4Value);
    };


    render() {
        return (
            <div className={style.normal}>
                <form onSubmit={ this._handleSubmit }>
                    <input type="text"
                           className=""
                           value={this.state.ipv4Value}
                           onChange={this._handleIpv4change}
                    />
                    <button type="submit"
                            className="btn btn-primary"
                            formNoValidate>Submit
                    </button>
                </form>
            </div>
        );
    }
}
