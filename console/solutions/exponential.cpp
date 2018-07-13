#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

const int inf = 100011122;

bool get_bit(int mask, int pos) {
    return (bool) (mask & (1 << pos));
}

int main() {
    vector<point> points = read_points();
    int n = points.size();
    vector<int> p;
    if (n <= 2 || n > 20) {
        for (int i = 0; i < n; ++i) {
            p.push_back(i);
        }
        write_path(points, p);
        return 0;
    }
    vector<vector<double>> d(n + 1, vector<double> (n + 1));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            d[i][j] = dist(points[i], points[j]);
        }
        d[n][i] = 3 * inf;
        d[i][n] = d[i][0] + 2 * inf;
    }
    d[0][n] = 3 * inf;
    vector<vector<double>> dp(1 << (n + 1), vector<double> (n + 1, 3 * inf));
    vector<vector<int>> parent(1 << (n + 1), vector<int> (n + 1));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << (n + 1)); ++mask) {
        for (int last = 0; last < n + 1; ++last) {
            if (get_bit(mask, last)) {
                for (int to = 0; to < n + 1; ++to) {
                    if (!get_bit(mask, to)) {
                        if (dp[mask | (1 << to)][to] > dp[mask][last] + d[last][to]) {
                            dp[mask | (1 << to)][to] = dp[mask][last] + d[last][to];
                            parent[mask | (1 << to)][to] = last;
                        }
                    }
                }
            }
        }
    }
    int mask = (1 << (n + 1)) - 1, last = n;
    while (mask) {
        p.push_back(last);
        int nlast = parent[mask][last];
        mask -= (1 << last);
        last = nlast;
    }
    reverse(p.begin(), p.end());
    p.pop_back();
    write_path(points, p);
    ofstream os("files/optimal.txt");
    os.precision(2);
    os << fixed << evaluate(points, p) << endl;
    return 0;
}
