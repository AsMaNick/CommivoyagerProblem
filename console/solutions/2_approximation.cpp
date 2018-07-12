#include <bits/stdc++.h>
#include "reader.cpp"
#include "evaluator.cpp"
#include "minimum_spanning_tree.cpp"

using namespace std;

vector<vector<int>> g;
vector<int> ans;

void dfs(int v) {
    ans.push_back(v);
    for (int to : g[v]) {
        dfs(to);
    }
}

int main() {
    vector<point> points = read_points();
    int root = 0;
    vector<int> parents = find_minimum_spanning_tree(points, root);
    g = build_adjacency_list(parents);
    dfs(root);
    write_path(points, ans);
    return 0;
}
