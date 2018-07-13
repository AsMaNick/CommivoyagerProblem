#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

int n, steps;
vector<point> points;
vector<int> p, pos, dir;
vector<pair<double, pair<int, int>>> all;

int get_pos(int v) {
    int res = pos[v];
    if (dir[v] == -1) {
        res += (n - 1);
        res %= n;
    }
    return res;
}

void update(int pos1, int pos2) {
    ++pos1;
    for (int i = pos1; i < pos2 - i + pos1; ++i) {
        swap(pos[p[i]], pos[p[pos2 - i + pos1]]);
        dir[p[i]] *= -1;
        dir[p[pos2 - i + pos1]] *= -1;
        swap(p[i], p[pos2 - i + pos1]);
    }
}

void recalculate_all() {
    for (int pos1 = 0; pos1 < n; ++pos1) {
        pos[p[pos1]] = pos1;
        dir[p[pos1]] = 1;
    }
    for (int pos1 = 0; pos1 < n; ++pos1) {
        for (int pos2 = pos1 + 2; pos2 < n; ++pos2) {
            double cur_dist = dist(points[p[pos1]], points[p[(pos1 + 1) % n]]) + dist(points[p[pos2]], points[p[(pos2 + 1) % n]]);
            double upd_dist = dist(points[p[pos1]], points[p[pos2]]) + dist(points[p[(pos1 + 1) % n]], points[p[(pos2 + 1) % n]]);
            if (cur_dist > upd_dist) {
                all.push_back(make_pair(cur_dist - upd_dist, make_pair(p[pos1], p[pos2])));
            }
        }
    }
    sort(all.begin(), all.end());
}

void improve() {
    while (all.size()) {
        int u = all.back().second.first, v = all.back().second.second;
        int pos1 = get_pos(u);
        int pos2 = get_pos(v);
        if (pos1 > pos2) {
            swap(pos1, pos2);
        }
        all.pop_back();
        if (pos1 + 1 >= pos2) {
            continue;
        }
        double cur_dist = dist(points[p[pos1]], points[p[(pos1 + 1) % n]]) + dist(points[p[pos2]], points[p[(pos2 + 1) % n]]);
        double upd_dist = dist(points[p[pos1]], points[p[pos2]]) + dist(points[p[(pos1 + 1) % n]], points[p[(pos2 + 1) % n]]);
        if (cur_dist > upd_dist) {
            update(pos1, pos2);
            ++steps;
        }
    }
    recalculate_all();
    if (all.size()) {
        improve();
    }
}

int main(int argc, char *argv[]) {
    points = read_points();
    ifstream file_with_path(argv[1]);
    p = read_path(file_with_path);
    cout.precision(2);
    cout << fixed << evaluate(points, p) << endl;
    n = points.size();
    pos.resize(n);
    for (int i = 0; i < n; ++i) {
        pos[p[i]] = i;
    }
    dir.resize(n, 1);
    improve();
    cout << steps << endl;
    write_path(points, p);
    return 0;
}
