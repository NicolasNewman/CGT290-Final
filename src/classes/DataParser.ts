// import { Record } from '../data_dump';
import { parse, ParseResult } from 'papaparse';

export interface DataTable {
    global: Record[];
    buyerMap: { [name: string]: Record[] };
    buyers: string[];
    sellerMap: { [name: string]: Record[] };
    sellers: string[];
    itemMap: { [item: string]: Record[] };
    items: string[];
    guildMap: { [guild: string]: Record[] };
    guilds: string[];
    dateMap: { [date: string]: Record[] };
    dates: string[];
}

export interface Record {
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
    guildMap: { [guild: string]: Record[] } = {};
    guilds: string[] = [];
    dateMap: { [date: string]: Record[] } = {};
    dates: string[] = [];

    i: number = 0;
    len: number = 1;

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

    getProgress() {
        return Math.ceil((this.i / this.len) * 100);
    }

    constructor(redirect: () => void, updateStage: (text: string) => void) {
        updateStage('Fetching data...');
        const isNode =
            typeof process !== 'undefined' &&
            process.versions != null &&
            process.versions.node != null;
        const url = isNode
            ? 'NicolasNewman/CGT290-Final/master/data/data.csv'
            : 'https://raw.githubusercontent.com/NicolasNewman/CGT290-Final/master/data/data.csv';

        fetch(url)
            .then((res) => res.text())
            .then((text) => {
                updateStage('Loading csv...');
                // const prog = setInterval(() => {
                //     console.log(this.i);
                //     console.log(this.len);
                //     updateStage(`Loading csv [${this.getProgress()}%]...`);
                // }, 100);
                // this.len = (text.match(/\n/g) || []).length;
                parse<Record>(text, {
                    worker: true,
                    header: true,

                    step: (row) => {
                        this.i = this.i + 1;
                        const data = (row.data as unknown) as Record;
                        // if (this.i % 50000 === 0) {
                        //     console.log(this.i);
                        //     updateStage(
                        //         `Loading csv [${this.getProgress()}%]...`
                        //     );
                        // }
                        this.global.push(data);
                        if (data.timestamp === undefined) {
                            return;
                        }

                        const name = data.item;
                        this.insert(name, data, this.itemMap);
                        const buyer = data.buyer;
                        this.insert(buyer, data, this.buyerMap);
                        const seller = data.seller;
                        this.insert(seller, data, this.sellerMap);
                        const guild = data.guild;
                        this.insert(guild, data, this.guildMap);

                        const date = data.timestamp.split(' ')[0];
                        if (!this.dateMap[date]) {
                            this.dates.push(date);
                        }
                        this.insert(date, data, this.dateMap);
                    },
                    complete: () => {
                        console.log('Done!');
                        console.log(this.i);
                        console.log(this.len);
                        updateStage('Done!');
                        console.log(this.global[0]);
                        console.log(this.global.length);
                        console.log(this.dateMap);
                        this.items = Object.keys(this.itemMap);
                        this.buyers = Object.keys(this.buyerMap);
                        this.sellers = Object.keys(this.sellerMap);
                        this.guilds = Object.keys(this.guildMap);
                        // clearTimeout(prog);
                        redirect();
                    },
                    delimiter: '#',
                });
            });
    }

    getDataTable(): DataTable {
        return {
            global: this.global,
            sellerMap: this.sellerMap,
            sellers: this.sellers,
            buyerMap: this.buyerMap,
            buyers: this.buyers,
            itemMap: this.itemMap,
            items: this.items,
            guildMap: this.guildMap,
            guilds: this.guilds,
            dateMap: this.dateMap,
            dates: this.dates,
        };
    }
}
