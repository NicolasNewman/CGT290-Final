import os
import re

import lupa
from lupa import LuaRuntime

lua = LuaRuntime(unpack_returned_tuples=True)


def find_all_files(path='./mm'):
    data_files = []
    dir_count = 0
    file_count = 0
    for root, dirs, files in os.walk(path):
        dir_count += len(dirs)
        for name in files:
            if name.endswith(".lua"):
                file_count += 1
                full_path = os.path.join(root, name)
                data_files.append(os.path.join(root, name))
    print(f"Found {file_count} files across {dir_count} directories")
    return data_files


'''
[88065] = <- lv0
{
    ["50:16:4:13:0"] = <- lv1
    {
        ["totalCount"] = 2,
        ["wasAltered"] = false,
        ["sales"] = <- lv2
        {
            [1] = <- sale
            {
                ["guild"] = "AK Tamriel Trade",
                ["id"] = "1434753847",
                ["itemLink"] = "|H0:item:88065:363:50:0:0:0:0:0:0:0:0:0:0:0:0:24:0:0:0:10000:0|h|h",
                ["seller"] = "@iSteve",
                ["quant"] = 1,
                ["timestamp"] = 1607380911,
                ["price"] = 3000,
                ["wasKiosk"] = true,
                ["buyer"] = "@YoDa72758",
            },
        },
        ["itemDesc"] = "Alessian Pauldron",
        ["itemIcon"] = "/esoui/art/icons/gear_ebonheart_heavy_shoulders_a.dds",
        ["itemAdderText"] = "cp160 purple epic heavy apparel armor set alessian order shoulders reinforced",
        ["oldestTime"] = 1607380911,
    },
},
'''


def process_files(files, func):
    # files = find_all_files()
    lines = []
    skipped = 0
    file_count = len(files)
    for i, file in enumerate(files):
        print(f'[{i + 1}/{file_count}] Parsing {file}')
        file = open(file, 'r')
        file_str = file.read()
        # Replace the MM file header
        file_str = re.sub(r'MM[0-9]{2}DataSavedVariables =', '', file_str)
        table = lua.eval(file_str)["Default"]["MasterMerchant"]["$AccountWide"]["SalesData"]
        for _, lv0 in enumerate(sorted(table.items())):
            item_hash = lv0[0]
            table_items = lv0[1]

            for _, lv1 in enumerate(sorted(table_items.items())):
                unknown_id = lv1[0]
                table_grouping = lv1[1]

                record = sorted(table_grouping.items())
                if not (len(record) == 7 or len(record) == 4 or len(record) == 6):
                    print(f'Warning: Could not parse record {record}')
                    skipped += 1
                    continue

                item_desc = ''
                table_sales = ''
                if len(record) == 7:
                    # itemAdderText = record[0][1]
                    item_desc = record[1][1]
                    # itemIcon = record[2][1]
                    # oldestTime = record[3][1]
                    table_sales = record[4][1]
                    # total_count = record[5][1]
                    # was_altered = record[6][1]
                if len(record) == 6:
                    item_desc = record[1][1]
                    table_sales = record[4][1]
                if len(record) == 4:
                    item_desc = record[1][1]
                    table_sales = record[3][1]

                for _, lv2 in enumerate(sorted(table_sales.items())):
                    index = lv2[0]
                    table_sale = lv2[1]
                    sale = sorted(table_sale.items())
                    line = func(item_desc, sale)
                    lines.append(line)

    print(f'Parsed {len(lines)} sale records across all files')
    unique_lines = set(lines)
    # print(f'{len(lines) - len(pd.unique(lines).tolist())} duplicates')
    print(f'Skipped {skipped} records due to incomplete data')
    print(f'Removed {len(lines) - len(unique_lines)} duplicate entries')
    return unique_lines
