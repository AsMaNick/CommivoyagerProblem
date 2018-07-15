# This is a project for visualization of different approaches to the commivoyager problem.

## Console version

The console version is located in the directory 'console'. To run console version you should first compile all c++ source code. It can be done via script 'compile_all.bat'. After that, you can run console utility by executing file 'utility.bat'.

In this utility you can perform the following commands:

* `gener n mx` - generate test with `n` random points each of them has coordinates `x y` (`1 <= x, y <= mx`)
* `gener_circle n rad_1 rad_2 ... rad_k` - generate test with `n` random points each of them is lies on some of `k` circles
* `show` - show the generated graph
* `run solution_name` - execute one of the compiled solutions on the generated graph
* `run all` - execute all of the compiled solutions
* `apply optimization_name solution_name` - apply specified optimization to the specified solution
* `apply optimization_name all` - apply specified optimization to all solutions that were previously run
* `show solution_name_1 solution_name_2 ... solution_name_k` - show the results of all specified solutions; to show the result of optimized solution you should write solution_name_optimization_name
* `show all` - show the results of all solutions
* `show solution_name*` - show the result of solution and all its optimizations

## Web version

The web version is located in the directory 'web'. To run web version you should just open file 'index.html' in your browser.

In this version you can visualize different approaches to the commivoyager problem. 

But before this you should first generate a graph. You can do it in 4 ways:

1. Generate `n` (`3 <= n <= 100`) random points. For this you have to enter `n` value and click 'Build random'.
1. Load one of the five prepared samples. For this you have to select a sample and click 'Load sample'.
1. Switch to the manual adding city mode. For this you have to click a button 'Add city manually'. In this mode you can click on some point on the map and new city will appear. After you add all cities click button 'Ready'
1. Specify test in the text area at the bottom of the page and click a button 'Build'.

After you build the map you can visualize some method of building the route. You can make visualization in 'auto' mode or 'manual' mode. In auto mode you can regulate the speed of the visualization.

After you build the route you can apply some method of local optimization. For this just click the corresponding button and enjoy visualization.