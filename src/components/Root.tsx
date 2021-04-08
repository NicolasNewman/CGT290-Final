import * as React from 'react';
import {
    Router,
    Switch,
    Route,
    NavLink,
    useHistory,
    Redirect,
    RouteComponentProps,
    withRouter,
} from 'react-router-dom';
import App from '../App';
import DataParser from '../classes/DataParser';

interface IProps extends RouteComponentProps<any> {}

class Root extends React.Component<IProps> {
    props!: IProps;
    parser: DataParser;

    constructor(props: IProps) {
        super(props);
        this.parser = new DataParser(this.redirect);
        console.log(props);
    }

    redirect = () => {
        console.log('here');
        this.props.history.push('/app');
        console.log(this.props.history);
    };

    render() {
        return (
            <Switch>
                <Route
                    path="/app"
                    component={() => {
                        return <App data={this.parser.getDataTable()} />;
                    }}
                />
                <Route path="/loading">
                    <div>
                        <p>Please wait while the app processes the data</p>
                    </div>
                </Route>
                <Redirect from="/" to="/loading" />
            </Switch>
        );
    }
}

export default withRouter(Root);
