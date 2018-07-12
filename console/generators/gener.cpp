#include "testlib.h"
#include <bits/stdc++.h>

using namespace std;

int main(int argc, char *argv[]) {
    registerGen(argc, argv, 1);
    if (argc < 3) {
        cout << "Fail, there should be at least 3 arguments of command line: number of points and maximum value of coordinate\n";
        return 0;
    }
    int n = atoi(argv[1]);
    int mx = atoi(argv[2]);
    mx = max(mx, (int) sqrt(n) + 2);
    set<pair<int, int>> all_points;
    cout << n << "\n";
    for (int i = 0; i < n; ++i) {
        int x = rnd.next(1, mx);
        int y = rnd.next(1, mx);
        while (all_points.count({x, y})) {
            x = rnd.next(1, mx);
            y = rnd.next(1, mx);
        }
        cout << x << " " << y << "\n";
        all_points.insert({x, y});
    }
    return 0;
}
