#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

const double inf = 1e9;

int n, steps;
vector<point> points;
vector<int> p, closest;

double dist(int a, int b) {
    return dist(points[a], points[b]);
}

void update(int pos1, int pos2) {
    ++pos1;
    for (int i = pos1; i < pos2 - i + pos1; ++i) {
        swap(p[i], p[pos2 - i + pos1]);
    }
}

double get_diff(int pos1, int pos2) {
    double cur_dist = dist(p[pos1], p[(pos1 + 1) % n]) + dist(p[pos2], p[(pos2 + 1) % n]);
    double upd_dist = dist(p[pos1], p[pos2]) + dist(p[(pos1 + 1) % n], p[(pos2 + 1) % n]);
    return cur_dist - upd_dist;
}

void improve() {
    for (int i = 0; i < n; ++i) {
        closest[i] = i + 1;
        for (int j = i + 1; j < n; ++j) {
            //if (dist(p[i], p[j]) < dist(p[i], p[closest[i]])) {
            if (get_diff(i, closest[i]) < get_diff(i, j)) {
                closest[i] = j;
            }
        }
    }
    double best = -inf;
    int start = -1, len = 0;
    for (int i = 0; i < n; ++i) {
        double cur = 0;
        int pos = i, cnt = 0;
        while (pos < n && closest[pos] != pos + 1) {
            cur += get_diff(pos, closest[pos]);
            ++cnt;
            if (cur > best) {
                best = cur;
                start = i;
                len = cnt;
            }
            pos = closest[pos] + 1;
            //break;
        }
    }
    if (best > 0) {
        while (len--) {
            update(start, closest[start]);
            start = closest[start] + 1;
        }
        ++steps;
        improve();
    }
}

int main(int argc, char *argv[]) {
    points = read_points();
    ifstream file_with_path(argv[1]);
    p = read_path(file_with_path);
    if (points.size() != p.size()) {
        cout << "Fail, points.size() is not equal to path.size()" << endl;
        return 0;
    }
    cout.precision(2);
    cout << fixed << evaluate(points, p) << endl;
    n = points.size();
    closest.resize(n);
    improve();
    cout << steps << endl;
    write_path(points, p);
    return 0;
}
