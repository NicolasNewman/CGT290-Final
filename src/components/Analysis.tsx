/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';
import MotifTracker from './Charts/MotifTracker';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import ImgPerfectCompetition from '../perfect_comp.png';
import PlayerBarChart from './Analysis/PlayerBarChart';

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
                    To make the analysis easier, we will assume both buyers and
                    sellers are only making use of tool provided by the game
                    itself. This means we will not account for tools such as{' '}
                    <a href="https://esouimods.github.io/3-master_merchant.html">
                        Master Merchant
                    </a>{' '}
                    (MM) and{' '}
                    <a href="https://tamrieltradecentre.com/">
                        Tamriel Trade Center
                    </a>{' '}
                    (TTC), which only a small portion of the player base make
                    use of.
                </p>
                <h1>1) Many firms</h1>
                <p>
                    From this data set alone, {data.sellers.length} unique
                    sellers were recorded across {data.guilds.length} guilds.
                    With over 200 guild traders available, there could be
                    anywhere from {(100 * 200).toLocaleString()} to{' '}
                    {(500 * 200).toLocaleString()} sellers.
                </p>
                <h1>2) Freedom of entry and exit</h1>
                <h2>Freedom of entry</h2>
                <p>
                    Barriers to entry can go both ways. In order to sell items,
                    one must be a member of a guild to have access to a trader.
                    Depending on the guild, they may require a weekly fee to
                    maintain membership, causing a barrier to enter the market
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
                <h1>3) All firms produce an identical product</h1>
                <p>
                    The products that can be sold are determined by what items
                    the developers create. Players are not able to create their
                    own unique products, making this requirement true.
                </p>
                <h1>4) All firms are price takers</h1>
                <p>
                    In order for this condition to be true, the buyers must be
                    the ones controling the price. The easiest way to determine
                    this is by checking if a firms demand curve is perfectly
                    elastic{' '}
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
                <PlayerBarChart
                    data={this.props.data.sellerMap}
                    item="dreugh wax"
                    computeStat={(arr: number[]) =>
                        [...((new Set(arr) as unknown) as number[])].length
                    }
                    show={10}
                    title={
                        'Unique values for the quantity of dreugh wax sold, per player'
                    }
                />
                {/* <PlayerBarChart
                    data={this.props.data.sellerMap}
                    item="dreugh wax"
                    computeStat={(arr: number[]) =>
                        arr.reduce((prev, curr) => prev + curr) / arr.length
                    }
                    show={10}
                /> */}
                <h1>5) There is perfect information and knowledge</h1>
                <MotifTracker data={this.props.data.itemMap} />
            </div>
        );
    }
}
