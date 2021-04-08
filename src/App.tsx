/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from 'react-router-dom';

import Home from './components/Home';
import Story from './components/Story';
import { DataTable } from './classes/DataParser';

interface IProps {
    data: DataTable;
}

export default class App extends React.PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <h1>The Economy of ESO</h1>
                <nav className="nav">
                    <ul>
                        <li>
                            <NavLink
                                exact
                                activeClassName="activeNav"
                                to="/app/home"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                activeClassName="activeNav"
                                to="/app/story"
                            >
                                Story
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                activeClassName="activeNav"
                                to="/temp"
                            >
                                Explore
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/app/story">
                        <Story />
                    </Route>
                    <Route path="/app/home">
                        <Home data={this.props.data} />
                    </Route>
                </Switch>
            </div>
        );
    }
}
