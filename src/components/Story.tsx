/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';
import TransactionHistory from './Charts/TransactionHistory';
import SellerBars from './Charts/SellerBars';
import ItemTreemap from './Charts/ItemTreemap';
import MotifTracker from './Charts/MotifTracker';
import ChordChart from './Charts/ChordChart';

interface IProps {
    data: DataTable;
}

export default class Story extends Component<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Transaction History</h1>
                <TransactionHistory data={this.props.data} />
                <h1>Top Sellers</h1>
                <SellerBars data={this.props.data.sellerMap} count={10} />
                <h1>Item Marketshare</h1>
                <ItemTreemap data={this.props.data.itemMap} count={75} />
                <div style={{ paddingBottom: '2rem' }}> </div>
                <h1>Changes in Price as a Result of Changes in Supply</h1>
                <MotifTracker data={this.props.data.itemMap} />
                <em>
                    April 1st was the start of the Anniversary event, where
                    compleating any quest has a chance to give you any motif
                    (recipe that teaches you how to craft a unique style of
                    armor) in the game. This substatially increases the supply
                    as they are normally very rare. As a result, we should
                    expect the price to decrease
                </em>
                <h1>Interactions between Sellers {'&'} Buyers</h1>
                <ChordChart
                    buyers={this.props.data.buyerMap}
                    sellers={this.props.data.sellerMap}
                    count={250}
                />
            </div>
        );
    }
}
