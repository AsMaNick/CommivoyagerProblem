#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

int main() {
    vector<point> points = read_points();
    vector<int> p, used(points.size());
    p.push_back(0);
    used[0] = 1;
    for (int i = 1; i < points.size(); ++i) {
        int to = -1;
        int cur = p.back();
        for (int j = 0; j < points.size(); ++j) {
            if (used[j] == 0 && (to == -1 || dist(points[cur], points[to]) > dist(points[cur], points[j]))) {
                to = j;
            }
        }
        p.push_back(to);
        used[to] = 1;
    }
    write_path(points, p);
    return 0;
}
