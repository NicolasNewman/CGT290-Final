/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MMSampleText from '../text/mmSample';
import PythonMain from '../text/pyMain';
import PythonAnon from '../text/pyAnon';
import PythonRead from '../text/pyRead';
import PythonCSV from '../text/pyTableau';

interface IProps {
    data: DataTable;
}

export default class Home extends Component<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Overview</h1>
                <p>
                    In the Elder Scrolls Online (ESO), trading is done through
                    traders owned by guilds. Each week guilds can bid on a
                    trader and the guild with the highest bid gets to use that
                    trader for the week. Traders are located in every major
                    town, and since some are more populated then others, the
                    average bid on a trader varies grately by location.
                    <br />
                    <br />
                    Any player can go to these traders and use their gold to
                    purchase items they desire, but only members of the guild
                    can sell items through that trader. When a player purchases
                    an item, a majority of the gold goes to the seller, but a
                    small portion is taken as tax for the guild.
                </p>
                <h1>Analysis</h1>
                <p>
                    The goal of my analysis is to determine if ESO follows an
                    economic model of perfect competition. For those unfimilar
                    with economics, a market that is perfectly competitive has
                    the following characteristics:
                </p>
                <ol>
                    <li>Competition is at its greatest possible level</li>
                    <li>
                        There is perfect knowledge, with no time lags in the
                        flow of information
                    </li>
                    <li>
                        There are no barries to entry into or exit out of the
                        market
                    </li>
                    <li>
                        No single seller can influence the market price or
                        conditions
                    </li>
                </ol>
                <h1>Data</h1>
                <p>
                    In ESO, guild trader data is only visible to members within
                    that guild, and only the past 10 days of sales are kept. A
                    player by the name of Sharlikran created a program called{' '}
                    <a href="https://www.esoui.com/downloads/info2753-MasterMerchant3.0.html">
                        Master Merchant
                    </a>{' '}
                    to analyze and collect this data. Unfortunetly, this means
                    the data set used is limited to traders I have access too.
                </p>
                <p>A sample of a record within the data set is as follows: </p>
                <SyntaxHighlighter
                    style={a11yDark}
                    language="lua"
                    wrapLongLines
                >
                    {MMSampleText}
                </SyntaxHighlighter>
                <p>
                    Overall, data was recorded for{' '}
                    {this.props.data.guilds.length} guilds, with{' '}
                    {this.props.data.global.length} transactions being recorded
                </p>
                <h1>Processing</h1>
                <p>
                    A python script was used to process the data. Since the data
                    was a lua file,{' '}
                    <a href="https://pypi.org/project/lupa/">lupa</a> was a very
                    useful module to quickly import the data into a format
                    recognizable to Python
                </p>
                <h2>Main.py</h2>
                <SyntaxHighlighter
                    style={a11yDark}
                    language="python"
                    wrapLongLines
                >
                    {PythonMain}
                </SyntaxHighlighter>
                <h2>anonymizer.py</h2>
                <SyntaxHighlighter
                    style={a11yDark}
                    language="python"
                    wrapLongLines
                >
                    {PythonAnon}
                </SyntaxHighlighter>
                <h2>read.py</h2>
                <SyntaxHighlighter
                    style={a11yDark}
                    language="python"
                    wrapLongLines
                >
                    {PythonRead}
                </SyntaxHighlighter>
                <h2>convert_tableau.py</h2>
                <SyntaxHighlighter
                    style={a11yDark}
                    language="python"
                    wrapLongLines
                >
                    {PythonCSV}
                </SyntaxHighlighter>
            </div>
        );
    }
}
