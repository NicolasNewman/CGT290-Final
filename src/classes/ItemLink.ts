export interface IItemLink {
    id: number;
    subType: number;
    internalLevel: number;
    enchantID: number;
    enchantSubType: number;
    enchantLevel: number;
    transmuteTrait: number;
    writ1: number;
    writ2: number;
    writ3: number;
    writ4: number;
    writ5: number;
    writ6: number;
    itemStyle: number;
    crafted: boolean;
    bound: boolean;
    stolen: boolean;
    charges: number;
    potionEffect: number;
    writReward: number;
}

export type WritType =
    | 'ALCHEMY'
    | 'ENCHANTING'
    | 'PROVISIONING'
    | 'BLACKSMITHING'
    | 'CLOTHIER'
    | 'WOODWORKING'
    | 'JEWELRY';

export default class ItemLink {
    readonly itemLink: IItemLink;
    readonly itemType: 'ENCHANT' | 'POTION' | 'GEAR' | 'WRIT' | 'OTHER';
    readonly writType: undefined | WritType;

    private inRange(min: number, max: number, val: number) {
        return val >= min && val <= max;
    }

    private equals(num: number, ...args: number[]) {
        let found = false;
        args.forEach((arg) => {
            if (arg === num) {
                found = true;
            }
        });
        return found;
    }

    constructor(link: string) {
        const split = link.split(':');
        this.itemLink = {
            id: parseInt(split[2]),
            subType: parseInt(split[3]),
            internalLevel: parseInt(split[4]),
            enchantID: parseInt(split[5]),
            enchantSubType: parseInt(split[6]),
            enchantLevel: parseInt(split[7]),
            transmuteTrait: parseInt(split[8]),
            writ1: parseInt(split[8]),
            writ2: parseInt(split[9]),
            writ3: parseInt(split[10]),
            writ4: parseInt(split[11]),
            writ5: parseInt(split[12]),
            writ6: parseInt(split[13]),
            itemStyle: parseInt(split[14]),
            crafted: parseInt(split[15]) > 0 ? true : false,
            bound: parseInt(split[16]) > 0 ? true : false,
            stolen: parseInt(split[17]) > 0 ? true : false,
            charges: parseInt(split[18]),
            potionEffect: parseInt(split[19]),
            writReward: parseInt(split[19]),
        };
        this.writType = undefined;
        // console.log(props.writs['BLACKSMITHING'].length);
        // console.log(props.writs['CLOTHIER'].length);
        // console.log(props.writs['JEWELRY'].length);
        // console.log(props.writs['WOODWORKING'].length);
        if (this.itemLink.enchantID > 0) {
            this.itemType = 'ENCHANT';
        } else if (
            this.itemLink.id === 119696 ||
            this.inRange(119698, 119705, this.itemLink.id) ||
            this.inRange(119818, 119820, this.itemLink.id)
        ) {
            this.itemType = 'WRIT';
            this.writType = 'ALCHEMY';
        } else if (this.itemLink.id === 119564 || this.itemLink.id === 121528) {
            this.itemType = 'WRIT';
            this.writType = 'ENCHANTING';
        } else if (this.itemLink.id === 119693) {
            this.itemType = 'WRIT';
            this.writType = 'PROVISIONING';
        } else if (
            this.equals(this.itemLink.id, 119563, 119680, 121527, 121529)
        ) {
            this.itemType = 'WRIT';
            this.writType = 'BLACKSMITHING';
        } else if (this.equals(this.itemLink.id, 119694, 119695, 121532)) {
            this.itemType = 'WRIT';
            this.writType = 'CLOTHIER';
        } else if (
            this.equals(this.itemLink.id, 119681, 119682, 121530, 121531)
        ) {
            this.itemType = 'WRIT';
            this.writType = 'WOODWORKING';
        } else if (this.equals(this.itemLink.id, 138789, 138799)) {
            this.itemType = 'WRIT';
            this.writType = 'JEWELRY';
        } else if (this.itemLink.potionEffect > 0) {
            this.itemType = 'POTION';
        } else if (this.itemLink.subType > 1) {
            this.itemType = 'GEAR';
        } else {
            this.itemType = 'OTHER';
        }
    }
}
