# This is a project for visualization of different approaches to the commivoyager problem.

## Console version

The console version is located in directory 'console'. To run console version you should firstly compile all c++ source code in directory solutions. After that you can run console utilite by executing file 'utilite.bat'.

In this utilite you can perform following commands:

* `gener n mx` - generate test with `n` random points each of them has coordinates `x y` (`1 <= x, y <= mx`)
* `gener_circle n rad_1 rad_2 ... rad_k` - generate test with `n` random points each of them is lies on some of `k` circles
* `show` - show generated graph
* `run solution_name` - execute one of the compiled solution
* `run all` - execute all of the compiled solutions
* `apply optimization_name solution_name` - apply specified optimization to the specified solution
* `apply optimization_name all` - apply specified optimization to all solutions that were previously run
* `show solution_name_1 solution_name_2 ... solution_name_k` - show the results of all specified solutions; to show the result of optimized solution you should write solution_name_optimization_name
* `show all` - show the results of all solutions
* `show solution_name*` - show the result of solution and all its optimizations

## Web version

Web version is located in directory 'web'. To run web version you should just open file 'index.html' in your browser.

In this version you can visualize different approaches to the commivoyager problem. 

But before this you should firstly generate graph. You can do it in 4 ways:

1. Generate `n` (`3 <= n <= 100`) random points. For this you have to enter `n` value and click 'Build random'.
1. Load one of the five prepared samples. For this you have to select sample and click 'Load sample'.
1. Switch to the manual adding city mode. For this you have to click button 'Add city manually'. In this mode you can click in some point at the map and new city will appeared.
1. Specify test in text area at the bottom of the page.

After you build the map you can visualize some method of building the route. You can make visualization in 'auto' mode and 'manual' mode. In auto mode you can regulate the speed of the visualization.

After you build the route you can apply some method of local optimization. For this just click the corresponding button and enjoy visualization.