/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component, CSSProperties } from 'react';

interface IProps {}

const listStyle: CSSProperties = {
    textAlign: 'initial',
    width: 'max-content',
    margin: '0 auto',
};

export default class Home extends Component<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Website Tools</h1>
                <ul style={listStyle}>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://reactjs.org/"
                        >
                            React
                        </a>{' '}
                        - Framework
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://ant.design/ni"
                        >
                            Antd
                        </a>{' '}
                        - Components
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://nivo.rocks/"
                        >
                            Nivo
                        </a>{' '}
                        - Visualizations
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.papaparse.com/"
                        >
                            Papaparse
                        </a>{' '}
                        - Data Loader
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.npmjs.com/package/gh-pages"
                        >
                            gh-pages
                        </a>{' '}
                        - Site Deployment
                    </li>
                </ul>
                <h1>Data Collection {'&'} Processing Tools</h1>
                <ul style={listStyle}>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.esoui.com/downloads/info2753-MasterMerchant3.0.html"
                        >
                            Master Merchant
                        </a>{' '}
                        - Data Collection
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.python.org/"
                        >
                            Python
                        </a>{' '}
                        - Data Processing
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://pypi.org/project/lupa/"
                        >
                            Lupa
                        </a>{' '}
                        - Python Lua Syntax Parser
                    </li>
                </ul>
            </div>
        );
    }
}
