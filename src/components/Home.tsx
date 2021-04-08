/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';

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
                    <br />
                    <br />
                    Overall, data was recorded for{' '}
                    {this.props.data.guilds.length} guilds, with{' '}
                    {this.props.data.global.length} transactions being recorded
                </p>
            </div>
        );
    }
}
