/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';
import TransactionHistory from './Charts/TransactionHistory';
import SellerBars from './Charts/SellerBars';
import ItemTreemap from './Charts/ItemTreemap';

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
            </div>
        );
    }
}
