#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"

using namespace std;

int main() {
    vector<point> points = read_points();
    vector<int> p(points.size()), best;
    for (int i = 0; i < p.size(); ++i) {
        p[i] = i;
    }
    for (int it = 0; it < points.size(); ++it) {
        random_shuffle(p.begin(), p.end());
        if (it == 0 || evaluate(points, best) > evaluate(points, p)) {
            best = p;
        }
    }
    write_path(points, best);
    return 0;
}
