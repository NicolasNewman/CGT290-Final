/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';
import MotifTracker from './Charts/MotifTracker';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import ImgPerfectCompetition from '../perfect_comp.png';
import PlayerBarChart from './Analysis/PlayerBarChart';
import PlayerScatterPlot from './Analysis/PlayerScatterPlot';
import ItemScatterPlot from './Analysis/ItemScatterPlot';

interface IProps {
    data: DataTable;
}

export default class Analysis extends Component<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { data } = this.props;
        return (
            <div>
                <h1>Preface</h1>
                <p>
                    In order to determine wheather or not the economy can be
                    modeled by perfect competition, we need to assess if the
                    following conditions hold true
                </p>
                <h1>1) Many firms</h1>
                <p>
                    In a perfectly competitive market, this condition is
                    important as the more sellers you have, the harder it is to
                    colude on fixing prices. Without the ability to colude,
                    sellers are forced to sell at the markets asking price. From
                    this data set alone, {data.sellers.length} unique sellers
                    were recorded across {data.guilds.length} guilds. With over
                    200 guild traders available, there could be anywhere from{' '}
                    {(100 * 200).toLocaleString()} to{' '}
                    {(500 * 200).toLocaleString()} sellers.
                </p>
                <h1>2) Freedom of entry and exit</h1>
                <p>
                    The 2nd condition for a perfectly competitive market is
                    there are no barries of entry or exit into or out of the
                    market. If any barriers exist, it will limit new firms from
                    entering the market due to high costs of entry, or fear of
                    costs from leaving.
                </p>
                <h2>Freedom of entry</h2>
                <p>
                    As mentioned previously, in order to sell on the market, one
                    must be a member of a guild who owns a trader. Due to the
                    high costs required by a guild to bid on one, most require
                    weekly dues from their members. If one is a new player
                    starting out, their fees are often to high, forcing them to
                    join a guild in a remote location that receives little foot
                    traffic. As a result of this, barriers exist for entry into
                    the market which lowers the amount of sellers present in the
                    economy
                </p>
                <h2>Freedom of exit</h2>
                <p>
                    In order to list an item on the market, a tax must be paid,
                    based on the value of the item you are selling, which goes
                    to oblivion (this is a measure implemented by the developers
                    of many MMOs as one method of a{' '}
                    <a href="https://en.wikipedia.org/wiki/Gold_sink">
                        gold sink
                    </a>
                    ). If a player is listing multiple high value items but
                    suddenly has to exist the market, that gold will be
                    permenetly lost as they won't make it back once the item(s)
                    sell.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Listing Price</th>
                            <th>Listing Tax (1%)</th>
                            <th>Sale Tax (7%)</th>
                            <th>Profit with sale</th>
                            <th>Profit without sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>100g</td>
                            <td>1g</td>
                            <td>7g</td>
                            <td>92g</td>
                            <td>-1g</td>
                        </tr>
                        <tr>
                            <td>1,000g</td>
                            <td>10g</td>
                            <td>70g</td>
                            <td>920g</td>
                            <td>-10g</td>
                        </tr>
                        <tr>
                            <td>10,000g</td>
                            <td>100g</td>
                            <td>700g</td>
                            <td>9,200g</td>
                            <td>-100g</td>
                        </tr>
                        <tr>
                            <td>100,000g</td>
                            <td>1,000g</td>
                            <td>7,000g</td>
                            <td>92,000g</td>
                            <td>-1,000g</td>
                        </tr>
                        <tr>
                            <td>1,000,000g</td>
                            <td>10,000g</td>
                            <td>70,000g</td>
                            <td>920,000g</td>
                            <td>-10,000g</td>
                        </tr>
                        <tr>
                            <td>10,000,000g</td>
                            <td>100,000g</td>
                            <td>700,000g</td>
                            <td>9,200,000g</td>
                            <td>-100,000g</td>
                        </tr>
                    </tbody>
                </table>
                <h1>3) All firms produce an identical product</h1>
                <p>
                    The products that can be sold are determined by what items
                    the developers create. Players are not able to create their
                    own unique products, making this requirement true.
                </p>
                <h1>4) All firms are price takers</h1>
                <p>
                    In order for this condition to be true, an individual seller
                    should have no influence over the price . The easiest way to
                    determine this is by checking if a seller's demand curve is
                    perfectly elastic{' '}
                    <Popover
                        content={
                            <div style={{ width: '21vw' }}>
                                <p>
                                    In economics, elasticity is the measure of
                                    the sensitivity to change between two
                                    variables. In our scenario, perfect
                                    elasticity implies that if a seller where to
                                    change their price, all of the demand for
                                    their items will disapear. In other words,
                                    ploting a curve for demand would result in a
                                    horizontal line with a slope of 0.
                                </p>
                                <img
                                    src={ImgPerfectCompetition}
                                    alt="Perfect competition"
                                    style={{ width: '20vw' }}
                                />
                            </div>
                        }
                        title="Econommics: Elasticity"
                        trigger="hover"
                    >
                        <QuestionCircleOutlined />
                    </Popover>
                </p>
                <p>
                    The easiest way to check this is to find a seller with a
                    large number of distinct quantities sold for a particular
                    item
                </p>
                <PlayerBarChart
                    data={this.props.data.sellerMap}
                    item="dreugh wax"
                    computeStat={(arr: number[]) =>
                        [...((new Set(arr) as unknown) as number[])].length
                    }
                    show={10}
                    title={
                        'Unique quantities for the quantity of dreugh wax sold, per player'
                    }
                />
                <p>
                    Looking at the above chart, player @358 sold 11 different
                    quantities of the item
                </p>
                {/* <PlayerBarChart
                    data={this.props.data.sellerMap}
                    item="dreugh wax"
                    computeStat={(arr: number[]) =>
                        arr.reduce((prev, curr) => prev + curr) / arr.length
                    }
                    show={10}
                /> */}
                <PlayerScatterPlot
                    data={this.props.data.sellerMap}
                    item="dreugh wax"
                    players={['@358']}
                />
                <p>
                    If we make a Quantity v. Price chart, we can see that the
                    line of best fit would have a slope near 0, making this
                    true.
                </p>
                <h1>5) There is perfect information and knowledge</h1>
                <h2>Update 29 Analysis</h2>
                {/* <MotifTracker data={this.props.data.itemMap} /> */}
                <p>
                    For this condition to be true, everyone must be aware of the
                    most up-to-date info on prices and events that could effect
                    prices
                </p>
                <p>
                    On March 8th, U29: <em>The Flames of Ambition</em> was
                    released. With this update, the max level was raised for the
                    first time in over 3 years. As a result of this, many
                    competitive players wanted to get to the new level cap as
                    fast as possible. One way to do this is with a potion called
                    Mythic Ambrosia, which increases the rate at which you level
                    up by 150%.
                </p>
                <p>
                    By now, many who are knowledgeable of ecomonics will know
                    that with a drastic increase in demand, prices will
                    skyrocket. If this condition was true, every seller would
                    have been aware of this and have accounted for it
                    accordingly.
                </p>
                <ItemScatterPlot
                    item="Aetherial Dust"
                    data={this.props.data.itemMap}
                    dateStart={new Date('3/05/2021')}
                    dateEnd={new Date('3/30/2021')}
                />
                <p>
                    Looking at the above chart, some interesting trends surface:
                </p>
                <ol>
                    <li>
                        The point at which the price will be highest is right
                        when it becomes available. Looking at sales before the
                        8th, we see some people sold too early and lost a
                        substantial amount of money
                    </li>
                    <li>
                        Lucian Allegiance is one of the most competitive trading
                        guilds in the game, holding their trader at the most
                        populous city of Mournhold. Looking at all of the sales
                        at the peak (March 7th), this was the only guild which
                        sold the item at an inflated price. The only sale from
                        another guild was at the original price before the price
                        increase
                    </li>
                    <li>
                        As the time since the updates draw out, we start seeing
                        more and more sales from other guilds. This is most
                        likely due to word of mouth, as players who were
                        initially not aware of the increased demand start trying
                        to obtain the item to sell
                    </li>
                </ol>
                <p>
                    Based on these observations, the spread of information
                    doesn't appear to immedietly reach everyone, making this
                    condition untrue
                </p>
                <h2>Addons</h2>
                <p>
                    Another factor that effects the validity of this condition
                    are price tracking addons. By default, there are no tools
                    provided by the creators of the game to efficiently track
                    prices of items. As a result, players of the game created
                    addons and tools such as{' '}
                    <a href="https://esouimods.github.io/3-master_merchant.html">
                        Master Merchant
                    </a>{' '}
                    (MM) and{' '}
                    <a href="https://tamrieltradecentre.com/">
                        Tamriel Trade Center
                    </a>{' '}
                    (TTC). As helpful as these may be, many casual players are
                    unaware of these addons, and have no basis on which to judge
                    the true value of an item. As a result of this, we see many
                    outliers within the data where an item was sold well below
                    the average, or was bought well above it.
                </p>
                <h1>Conclusion</h1>
                <p>
                    After careful analysis, the only conditions which hold true
                    are 1, 3, and 4. Since 2 and 5 don't, we cannot use this
                    economy as a model for perfect competition
                </p>
                <h2>Differences from World of Warcraft</h2>
                <p>
                    In Eli Kosminsky's paper, he determined that the econonmy
                    within WoW infact does follow the model of perfect
                    competition. The reason for these two different conclusions
                    are that WoW has a centralized economy, with only one
                    central auction house with which you can buy and sell items.
                    Furthurmore, anyone has access to the auction house and no
                    3rd party is needed. While WoW also needs 3rd party addons
                    to track prices, a novice seller can easily search for what
                    they are selling and see every single listing of that item,
                    and immedietly know the true value. Compared to ESO, you
                    only see the listings for that trader, which could have
                    prices that vastly differ from another
                </p>
            </div>
        );
    }
}
