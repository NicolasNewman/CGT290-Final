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
import spinner from '../spinner.png';

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
        this.props.history.push('/app/home');
        console.log(this.props.history);
    };

    render() {
        console.log(this.parser.getDataTable());
        console.log(this.props.history);
        if (
            this.parser.getDataTable().global.length === 0 &&
            this.props.history.location.pathname !== '/loading'
        ) {
            this.props.history.push('/loading');
        }
        return (
            <Switch>
                <Route
                    path="/app"
                    component={() => {
                        return <App data={this.parser.getDataTable()} />;
                    }}
                />
                <Route path="/loading">
                    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
                        <h2>Please wait while the app processes the data</h2>
                        <img
                            src={spinner}
                            style={{
                                width: '20%',
                                marginTop: '2rem',
                                animationName: 'spinner',
                                animationDuration: '4s',
                                animationIterationCount: 'infinite',
                            }}
                            alt="Spinner"
                        />
                    </div>
                </Route>
                {/* <Redirect from="/" to="/loading" /> */}
            </Switch>
        );
    }
}

export default withRouter(Root);
