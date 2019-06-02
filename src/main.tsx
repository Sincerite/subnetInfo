import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import * as stores from "./stores";

import App from "./containers/App";

import "./assets/styles/index.scss";


ReactDOM.render(
    <Provider { ...stores }>
        <App />
    </Provider>,
    document.getElementById("root")
);
