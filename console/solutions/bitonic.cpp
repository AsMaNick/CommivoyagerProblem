#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

const int inf = 1000111222;

int main() {
    vector<point> points = read_points();
    vector<point> kpoints = points;
    if (points.size() == 1) {
        write_path(points, {0});
        return 0;
    }
    vector<pair<point, int>> pids;
    for (int i = 0; i < points.size(); ++i) {
        pids.push_back(make_pair(points[i], i));
    }
    sort(points.begin(), points.end());
    sort(pids.begin(), pids.end());
    int n = points.size();
    vector<vector<double>> dp(n, vector<double> (n, inf));
    vector<vector<pair<int, int>>> parent(n, vector<pair<int, int>> (n));
    dp[0][0] = 0;
    for (int mx = 0; mx + 1 < n; ++mx) {
        for (int i = 0; i <= mx; ++i) {
            int x = i, y = mx;
            for (int it = 0; it < 2; ++it) {
                int to = mx + 1;
                if (dp[to][y] > dp[x][y] + dist(points[x], points[to])) {
                    dp[to][y] = dp[x][y] + dist(points[x], points[to]);
                    parent[to][y] = make_pair(x, y);
                }
                if (dp[x][to] > dp[x][y] + dist(points[x], points[to])) {
                    dp[x][to] = dp[x][y] + dist(points[y], points[to]);
                    parent[x][to] = make_pair(x, y);
                }
                swap(x, y);
            }
        }
    }
    for (int i = 0; i + 1 < n; ++i) {
        if (dp[n - 1][n - 1] > dp[i][n - 1] + dist(points[i], points[n - 1])) {
            dp[n - 1][n - 1] = dp[i][n - 1] + dist(points[i], points[n - 1]);
            parent[n - 1][n - 1] = make_pair(i, n - 1);
        }
    }
    vector<int> up, down, p;
    int a = n - 1, b = n - 1;
    while (a || b) {
        int na = parent[a][b].first;
        int nb = parent[a][b].second;
        if (a != na) {
            up.push_back(a);
        } else {
            down.push_back(b);
        }
        a = na;
        b = nb;
    }
    up.push_back(0);
    reverse(up.begin(), up.end());
    up.pop_back();
    for (int id : up) {
        p.push_back(pids[id].second);
    }
    for (int id : down) {
        p.push_back(pids[id].second);
    }
    write_path(kpoints, p);
    return 0;
}
