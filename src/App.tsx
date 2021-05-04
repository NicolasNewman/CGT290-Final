/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Switch, Route, NavLink } from 'react-router-dom';

import Home from './components/Home';
import Story from './components/Story';
import Resources from './components/Resources';
import { DataTable } from './classes/DataParser';
import Analysis from './components/Analysis';

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
                                to="/app/overview"
                            >
                                Overview
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                activeClassName="activeNav"
                                to="/app/analysis"
                            >
                                Analysis
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                activeClassName="activeNav"
                                to="/app/resources"
                            >
                                Tools
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/app/analysis">
                        <Analysis data={this.props.data} />
                    </Route>
                    <Route path="/app/overview">
                        <Story data={this.props.data} />
                    </Route>
                    <Route path="/app/home">
                        <Home data={this.props.data} />
                    </Route>
                    <Route path="/app/resources">
                        <Resources />
                    </Route>
                </Switch>
            </div>
        );
    }
}
