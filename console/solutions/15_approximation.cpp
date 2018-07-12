#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"
#include "minimum_spanning_tree.cpp"

using namespace std;

struct edge {
    int from, to;

    edge(int from, int to): from(from), to(to) {
    }

    bool operator < (const edge &e) const {
        return (from < e.from) || (from == e.from && to < e.to);
    }
};

vector<char> deleted, taken;
vector<int> ans;
vector<edge> edges;
vector<vector<int>> g;

void find_euler_path(int v) {
    while (!g[v].empty()) {
        int id = g[v].back();
        g[v].pop_back();
        if (!deleted[id]) {
            deleted[id] = true;
            int to = v ^ edges[id].from ^ edges[id].to;
            find_euler_path(to);
        }
    }
    if (!taken[v]) {
        ans.push_back(v);
        taken[v] = true;
    }
}

int main() {
    vector<point> points = read_points();
    int root = 0, n = points.size();
    vector<int> parents = find_minimum_spanning_tree(points, root);
    vector<int> degree(n);
    for (int i = 0; i < parents.size(); ++i) {
        if (i != root) {
            edges.push_back(edge(parents[i], i));
            ++degree[parents[i]];
            ++degree[i];
        }
    }
    vector<int> all_vertices;
    for (int i = 0; i < n; ++i) {
        if (degree[i] % 2) {
            all_vertices.push_back(i);
        }
    }
    vector<pair<double, edge>> all_edges;
    for (int i = 0; i < all_vertices.size(); ++i) {
        for (int j = i + 1; j < all_vertices.size(); ++j) {
            all_edges.push_back(make_pair(dist(points[all_vertices[i]], points[all_vertices[j]]),
                                          edge(all_vertices[i], all_vertices[j])));
        }
    }
    sort(all_edges.begin(), all_edges.end());
    vector<char> used(points.size());
    for (const pair<double, edge> &p : all_edges) {
        const edge &e = p.second;
        if (!used[e.from] && !used[e.to]) {
            used[e.from] = 1;
            used[e.to] = 1;
            edges.push_back(e);
        }
    }
    deleted.resize(edges.size());
    taken.resize(n);
    g.resize(n);
    for (int i = 0; i < edges.size(); ++i) {
        g[edges[i].from].push_back(i);
        g[edges[i].to].push_back(i);
    }
    find_euler_path(root);
    write_path(points, ans);
    return 0;
}
