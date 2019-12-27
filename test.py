
from __future__ import unicode_literals

if __name__ == '__main__':
    aList=[{"1":"hello"},{"2":"world"}]
    del aList[-1]
    print('2' in aList[-1].keys())