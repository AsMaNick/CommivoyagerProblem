#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

int n, steps;
vector<point> points;
vector<int> p, pos, dir;
vector<pair<double, pair<int, pair<int, int>>>> all;

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

double get_diff(int pos1, int pos2, int pos3) {
    double cur_dist = dist(points[p[pos1]], points[p[(pos1 + 1) % n]]) +
                      dist(points[p[pos2]], points[p[(pos2 + 1) % n]]) +
                      dist(points[p[pos3]], points[p[(pos3 + 1) % n]]);
    double upd_dist = dist(points[p[pos1]], points[p[pos2]]) +
                      dist(points[p[(pos1 + 1) % n]], points[p[pos3 % n]]) +
                      dist(points[p[(pos2 + 1) % n]], points[p[(pos3 + 1) % n]]);
    return cur_dist - upd_dist;
}

void recalculate_all() {
    for (int pos1 = 0; pos1 < n; ++pos1) {
        pos[p[pos1]] = pos1;
        dir[p[pos1]] = 1;
    }
    for (int pos1 = 0; pos1 < n && all.size() < n * n; ++pos1) {
        for (int pos2 = pos1 + 1; pos2 < n; ++pos2) {
            for (int pos3 = pos2 + 1; pos3 < n; ++pos3) {
                double diff = get_diff(pos1, pos2, pos3);
                if (diff > 0) {
                    all.push_back(make_pair(diff, make_pair(p[pos1], make_pair(p[pos2], p[pos3]))));
                }
            }
        }
    }
    sort(all.begin(), all.end());
}

void improve() {
    while (all.size()) {
        int u = all.back().second.first;
        int v = all.back().second.second.first;
        int z = all.back().second.second.second;
        int pos1 = get_pos(u);
        int pos2 = get_pos(v);
        int pos3 = get_pos(z);
        if (pos2 > pos3) {
            swap(pos2, pos3);
        }
        if (pos1 > pos2) {
            swap(pos1, pos2);
        }
        if (pos2 > pos3) {
            swap(pos2, pos3);
        }
        all.pop_back();
        if (pos1 == pos2 || pos2 == pos3) {
            continue;
        }
        double diff = get_diff(pos1, pos2, pos3);
        if (diff > 0) {
            update(pos1, pos2);
            update(pos2, pos3);
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
    if (points.size() != p.size()) {
        cout << "FAIL, points.size() is not equal to path.size()" << endl;
        return 0;
    }
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
