const str = `from convert_tableau import dump_tableau
from anonymizer import save
from anonymizer import load

if __name__ == '__main__':
    load()
    dump_tableau()
    save()`;

export default str;
