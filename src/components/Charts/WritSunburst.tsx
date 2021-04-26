/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
// import { Record } from '../../classes/DataParser';
import ItemLink, { WritType } from '../../classes/ItemLink';
import { ResponsiveSunburst } from '@nivo/sunburst';

interface IProps {
    writs: { [key in WritType]: ItemLink[] };
}

interface IData {
    id: string | number;
    value?: number;
    children?: IData[];
}

export default class WritSunburst extends Component<IProps> {
    props!: IProps;
    data: IData;

    compileAlchemyData(alchemyWrits: ItemLink[]): IData {
        const potionData: IData = { id: 'Potion', value: 0 };
        const poisonData: IData = { id: 'Poison', value: 0 };
        alchemyWrits.forEach((writ) => {
            if (writ.itemLink.writ1 === 199 && potionData.value !== undefined) {
                potionData.value = potionData.value + 1;
            } else if (
                writ.itemLink.writ1 === 239 &&
                poisonData.value !== undefined
            ) {
                poisonData.value = poisonData.value + 1;
            }
        });

        return {
            id: 'Alchemy',
            children: [potionData, poisonData],
        };
    }

    compileBSData(bsWrits: ItemLink[]): IData {
        const bs_weapon_1h_yellowData: IData = { id: '1H Legendary', value: 0 };
        const bs_weapon_1h_purpleData: IData = { id: '1H Purple', value: 0 };
        const bs_weapon_1hData: IData = {
            id: 'One-handed',
            children: [bs_weapon_1h_purpleData, bs_weapon_1h_yellowData],
        };

        const bs_weapon_2h_yellowData: IData = { id: '2H Legendary', value: 0 };
        const bs_weapon_2h_purpleData: IData = { id: '2H Purple', value: 0 };
        const bs_weapon_2hData: IData = {
            id: 'Two-handed',
            children: [bs_weapon_2h_purpleData, bs_weapon_2h_yellowData],
        };

        const bs_weapon_Data: IData = {
            id: 'Blacksmithing Weapons',
            children: [bs_weapon_1hData, bs_weapon_2hData],
        };

        const bs_armor_yellowData: IData = { id: 'Legendary Armor', value: 0 };
        const bs_armor_purpleData: IData = { id: 'Purple Armor', value: 0 };
        const bs_armor_Data: IData = {
            id: 'Blacksmithing Armor',
            children: [bs_armor_purpleData, bs_armor_yellowData],
        };

        const updateBSData = (itemType: number, itemQuality: number) => {
            const update_quality = (purpleData: IData, yellowData: IData) => {
                switch (itemQuality) {
                    case 4:
                        purpleData.value !== undefined &&
                            (purpleData.value = purpleData.value + 1);
                        return;
                    case 5:
                        yellowData.value !== undefined &&
                            (yellowData.value = yellowData.value + 1);
                        return;
                    default:
                        console.log('SKIP');
                }
            };
            switch (itemType) {
                /* falls through */
                case 44:
                case 46:
                case 47:
                case 48:
                case 49:
                case 50:
                case 52:
                    update_quality(bs_armor_purpleData, bs_armor_yellowData);
                    return;
                case 53:
                case 56:
                case 59:
                case 62:
                    update_quality(
                        bs_weapon_1h_purpleData,
                        bs_weapon_1h_yellowData
                    );
                    return;
                case 67:
                case 68:
                case 69:
                    update_quality(
                        bs_weapon_2h_purpleData,
                        bs_weapon_2h_yellowData
                    );
                    return;
                default:
                    console.log('SKIP ' + itemType);
            }
        };
        bsWrits.forEach((writ) => {
            const itemType = writ.itemLink.writ1;
            const itemQuality = writ.itemLink.writ3;
            updateBSData(itemType, itemQuality);
        });
        return {
            id: 'Blacksmithing',
            children: [bs_armor_Data, bs_weapon_Data],
        };
    }

    compileClothierData(clothierWrits: ItemLink[]): IData {
        const clo_light_purple_armor: IData = { id: 'Light Purple', value: 0 };
        const clo_light_yellow_armor: IData = { id: 'Light Yellow', value: 0 };
        const clo_light_armor: IData = {
            id: 'Light Armor',
            children: [clo_light_purple_armor, clo_light_yellow_armor],
        };

        const clo_medium_purple_armor: IData = {
            id: 'Medium Purple',
            value: 0,
        };
        const clo_medium_yellow_armor: IData = {
            id: 'Medium Yellow',
            value: 0,
        };
        const clo_medium_armor: IData = {
            id: 'Medium Armor',
            children: [clo_medium_purple_armor, clo_medium_yellow_armor],
        };

        const updateData = (itemType: number, itemQuality: number) => {
            const update_quality = (purpleData: IData, yellowData: IData) => {
                switch (itemQuality) {
                    case 4:
                        purpleData.value !== undefined &&
                            (purpleData.value = purpleData.value + 1);
                        return;
                    case 5:
                        yellowData.value !== undefined &&
                            (yellowData.value = yellowData.value + 1);
                        return;
                    default:
                        console.log('SKIP');
                }
            };
            switch (itemType) {
                /* falls through */
                case 26:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 34:
                    update_quality(
                        clo_light_purple_armor,
                        clo_light_yellow_armor
                    );
                    return;
                case 35:
                case 37:
                case 38:
                case 39:
                case 40:
                case 41:
                case 43:
                    update_quality(
                        clo_medium_purple_armor,
                        clo_medium_yellow_armor
                    );
                    return;
                default:
                    console.log('SKIP ' + itemType);
            }
        };

        clothierWrits.forEach((writ) => {
            const itemType = writ.itemLink.writ1;
            const itemQuality = writ.itemLink.writ3;
            updateData(itemType, itemQuality);
        });

        return {
            id: 'Clothier',
            children: [clo_light_armor, clo_medium_armor],
        };
    }

    compileWoodworkingData(woodworkingWrits: ItemLink[]): IData {
        const wood_weapons_purple: IData = {
            id: 'Purple Wooden Weapons',
            value: 0,
        };
        const wood_weapons_yellow: IData = {
            id: 'Yellow Wooden Weapons',
            value: 0,
        };
        const wood_weapons: IData = {
            id: 'Wooden Weapons',
            children: [wood_weapons_purple, wood_weapons_yellow],
        };

        const wood_shield_purple_armor: IData = {
            id: 'Purple Shields',
            value: 0,
        };
        const wood_shield_yellow_armor: IData = {
            id: 'Yellow Shields',
            value: 0,
        };
        const wood_armor: IData = {
            id: 'Shields',
            children: [wood_shield_purple_armor, wood_shield_yellow_armor],
        };

        const updateData = (itemType: number, itemQuality: number) => {
            const update_quality = (purpleData: IData, yellowData: IData) => {
                switch (itemQuality) {
                    case 4:
                        purpleData.value !== undefined &&
                            (purpleData.value = purpleData.value + 1);
                        return;
                    case 5:
                        yellowData.value !== undefined &&
                            (yellowData.value = yellowData.value + 1);
                        return;
                    default:
                        console.log('SKIP');
                }
            };
            switch (itemType) {
                case 70: // bow
                case 71:
                case 72:
                case 73:
                case 74:
                    update_quality(wood_weapons_purple, wood_weapons_yellow);
                    return;
                case 65:
                    update_quality(
                        wood_shield_purple_armor,
                        wood_shield_yellow_armor
                    );
                    return;
                default:
                    console.log('SKIP ' + itemType);
            }
        };

        woodworkingWrits.forEach((writ) => {
            const itemType = writ.itemLink.writ1;
            const itemQuality = writ.itemLink.writ3;
            updateData(itemType, itemQuality);
        });

        return {
            id: 'Woodworking',
            children: [wood_armor, wood_weapons],
        };
    }

    compileEnchantingData(alchemyWrits: ItemLink[]): IData {
        return {
            id: 'Enchanting',
            value: alchemyWrits.length,
        };
    }

    constructor(props: IProps) {
        super(props);

        console.log(props.writs['ALCHEMY'].length);
        console.log(props.writs['BLACKSMITHING'].length);
        console.log(props.writs['CLOTHIER'].length);
        console.log(props.writs['ENCHANTING'].length);
        console.log(props.writs['JEWELRY'].length);
        console.log(props.writs['PROVISIONING'].length);
        console.log(props.writs['WOODWORKING'].length);

        this.data = {
            id: 'writs',
            children: [
                this.compileAlchemyData(props.writs['ALCHEMY']),
                this.compileBSData(props.writs['BLACKSMITHING']),
                this.compileClothierData(props.writs['CLOTHIER']),
                this.compileWoodworkingData(props.writs['WOODWORKING']),
                this.compileEnchantingData(props.writs['ENCHANTING']),
            ],
        };

        console.log(this.data);
    }

    // Title = (obj: any, title: string) => {
    //     const { center } = obj;
    //     console.log(obj);
    //     return (
    //         <text
    //             x={center[0]}
    //             textAnchor="middle"
    //             y={-60}
    //             fill="white"
    //             fontWeight="bold"
    //         >
    //             {title}
    //         </text>
    //     );
    // };

    render() {
        return (
            <div className="chart">
                <div style={{ width: '100%', height: '500px' }}>
                    <ResponsiveSunburst
                        data={this.data}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        colors={{ scheme: 'nivo' }}
                        tooltip={(data: any) => {
                            console.log(data);

                            return (
                                <div className="tooltip">
                                    <p>{data.id}</p>
                                    <p>{data.formattedValue}</p>
                                </div>
                            );
                        }}
                        enableArcLabels
                        arcLabelsSkipAngle={8}
                    />
                </div>
            </div>
        );
    }
}
