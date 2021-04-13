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

interface IState {
    stageText: string;
}

class Root extends React.Component<IProps, IState> {
    props!: IProps;
    parser: DataParser;

    constructor(props: IProps) {
        super(props);
        this.parser = new DataParser(this.redirect, this.setStageText);
        this.state = {
            stageText: 'Fetching data...',
        };
        console.log(props);
    }

    setStageText = (text: string) => {
        if (this.state) {
            this.setState({ stageText: text });
        }
    };

    redirect = () => {
        console.log('here');
        this.props.history.push('/app/home');
        console.log(this.props.history);
    };

    render() {
        console.log(this.parser.getDataTable());
        console.log(this.props.history);
        console.log(this.state);
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
                        <div>
                            <div>{this.state.stageText}</div>
                            <img
                                src={spinner}
                                style={{
                                    width: '15rem',
                                    marginTop: '2rem',
                                    animationName: 'spinner',
                                    animationDuration: '4s',
                                    animationIterationCount: 'infinite',
                                    background: 'transparent',
                                }}
                                alt="Spinner"
                            />
                        </div>
                    </div>
                </Route>
                {/* <Redirect from="/" to="/loading" /> */}
            </Switch>
        );
    }
}

export default withRouter(Root);
