#ifndef EVALUATOR
#define EVALUATOR

#include <bits/stdc++.h>
#include "reader.cpp"

using namespace std;

double dist(const point &a) {
    return sqrt(1LL * a.x * a.x + 1LL * a.y * a.y);
}

double dist(const point &a, const point &b) {
    return dist(b - a);
}

double evaluate(const vector<point> &points, const vector<int> &path) {
    if (path.size() != points.size()) {
        cout << "FAIL, path size isn't equal to the number of points" << endl;
        return -1;
    }
    vector<char> used(points.size());
    double res = 0;
    for (int i = 0; i < path.size(); ++i) {
        if (path[i] < 0 || path[i] >= points.size()) {
            cout << "FAIL, vertex " << path[i] << " violates range [0; " << points.size() << ")" << endl;
            return -1;
        }
        if (used[path[i]]) {
            cout << "FAIL, path contain one vertex more than one time" << endl;
            return -1;
        }
        used[path[i]] = 1;
        res += dist(points[path[i]], points[path[(i + 1) % path.size()]]);
    }
    return res;
}

void write_path(const vector<point> &points, const vector<int> &path) {
    cout.precision(2);
    cout << fixed << evaluate(points, path) << endl;
    for (int i = 0; i < path.size(); ++i) {
        if (i) {
            cout << " ";
        }
        cout << path[i];
    }
    cout << endl;
}

#endif // EVALUATOR
