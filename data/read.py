import os
import re

import lupa
from lupa import LuaRuntime

lua = LuaRuntime(unpack_returned_tuples=True)


def find_all_files(path='../mm'):
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


def remove_duplicates(lines):
    unique_lines = set(lines)
    print(f'Removed {len(lines) - len(unique_lines)} duplicate entries')
    return unique_lines


def process_files(files, func, counter):
    lines = []
    skipped = 0
    file_count = len(files)
    process_name = f'{counter[0]}/{counter[1]}'

    for i, file in enumerate(files):
        print(f'[{process_name}] Parsing {file}')
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
                    print(f'[{process_name}] Warning: Could not parse record {record}')
                    skipped += 1
                    continue

                item_desc = ''
                table_sales = ''
                if len(record) == 7:
                    item_desc = record[1][1]
                    table_sales = record[4][1]
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

    print(f'[{process_name}] Parsed {len(lines)} sale records')
    print(f'[{process_name}] Skipped {skipped} records due to incomplete data')
    return lines
