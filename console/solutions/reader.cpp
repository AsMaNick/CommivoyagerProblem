#ifndef READER
#define READER

#include <bits/stdc++.h>

using namespace std;

struct point {
    int x, y;

    point(): x(0), y(0) {
    }

    point(int x, int y): x(x), y(y) {
    }

    point operator - (const point &p) const {
        return point(x - p.x, y - p.y);
    }

    bool operator < (const point &p) const {
        return (x < p.x) || (x == p.x && y < p.y);
    }
};

vector<point> read_points() {
    int n;
    cin >> n;
    vector<point> res(n);
    for (point &c : res) {
        cin >> c.x >> c.y;
    }
    return res;
}

vector<int> read_path(ifstream &in) {
    double score;
    vector<int> path;
    int vertex;
    in >> score;
    while (in >> vertex) {
        path.push_back(vertex);
    }
    return path;
}

#endif // READER
