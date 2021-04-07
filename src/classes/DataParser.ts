// import { Record } from '../data_dump';
import { parse, ParseResult } from 'papaparse';

interface Record {
    buyer: string;
    guild: string;
    item: string;
    price: string;
    quant: string;
    seller: string;
    timestamp: string;
}

export default class DataParser {
    global: Record[] = [];
    buyerMap: { [name: string]: Record[] } = {};
    buyers: string[] = [];
    sellerMap: { [name: string]: Record[] } = {};
    sellers: string[] = [];
    itemMap: { [item: string]: Record[] } = {};
    items: string[] = [];

    private insert(
        key: string,
        record: Record,
        map: { [key: string]: Record[] }
    ) {
        if (map[key] === undefined) {
            map[key] = [];
        }
        map[key].push(record);
    }

    constructor(redirect: () => void) {
        fetch('NicolasNewman/CGT290-Final/master/data/data.csv')
            .then((res) => res.text())
            .then((text) => {
                parse<Record>(text, {
                    worker: true,
                    header: true,

                    step: (row) => {
                        const data = (row.data as unknown) as Record;
                        this.global.push(data);

                        const name = data.item;
                        this.insert(name, data, this.itemMap);
                        const buyer = data.buyer;
                        // this.insert(buyer, data, this.buyerMap);
                        const seller = data.seller;
                        // this.insert(seller, data, this.sellerMap);
                    },
                    complete: () => {
                        console.log('Done!');
                        console.log(this.global[0]);
                        console.log(this.global.length);
                        this.items = Object.keys(this.itemMap);
                        this.buyers = Object.keys(this.buyerMap);
                        this.sellers = Object.keys(this.sellerMap);
                        redirect();
                    },
                    delimiter: '#',
                });
            });
        // parse(
        //     'https://raw.githubusercontent.com/NicolasNewman/CGT290-Final/master/data/data.csv',
        //     {
        //         worker: true,
        //         download: true,
        //         downloadRequestHeaders: {
        //             'User-Agent': 'NicolasNewman',
        //         },
        //         step: (row) => {
        //             console.log(row.data);
        //         },
        //         complete: () => {
        //             console.log('Done!');
        //         },
        //         delimiter: '#',
        //     }
        // );
    }
}
