#include "testlib.h"
#include <bits/stdc++.h>

using namespace std;

int main(int argc, char *argv[]) {
    registerGen(argc, argv, 1);
    if (argc < 3) {
        cout << "Fail, there should be at least 3 arguments of command line: number of points and radius\n";
        return 0;
    }
    int n = atoi(argv[1]), sum = 0;
    vector<int> rs, ns;
    vector<vector<pair<int, int>>> all;
    for (int i = 2; i < argc; ++i) {
        rs.push_back(atoi(argv[i]));
    }
    sort(rs.begin(), rs.end());
    int sd = rs.back() + 1;
    for (int i = 0; i < rs.size(); ++i) {
        vector<pair<int, int>> points;
        int r = rs[i];
        for (int x = -r; x <= r; ++x) {
            int y = sqrt(r * r - x * x);
            points.push_back(make_pair(x + sd, y + sd));
            if (y) {
                points.push_back(make_pair(x + sd, -y + sd));
            }
        }
        all.push_back(points);
        sum += points.size();
    }
    n = min(n, sum);
    int tot = 0;
    for (int i = 0; i + 1 < rs.size(); ++i) {
        ns.push_back(1.0 * n * all[i].size() / sum);
        tot += ns.back();
    }
    ns.push_back(min((int) all.back().size(), n - tot));
    n = accumulate(ns.begin(), ns.end(), 0);
    cout << n << endl;
    for (int i = 0; i < ns.size(); ++i) {
        shuffle(all[i].begin(), all[i].end());
        for (int j = 0; j < ns[i]; ++j) {
            cout << all[i][j].first << " " << all[i][j].second << endl;
        }
    }
    return 0;
}
