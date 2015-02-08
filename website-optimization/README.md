## Below are the notes for the changes performed for optimization and resources used for this project:

Instructions:

To launch website please click below:

http://danorozco.github.io/website-optimization/


Resources:

- http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html
- http://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall/
- http://jsperf.com/queryselectorall-vs-getelementsbytagname
- https://developers.google.com/web/fundamentals/performance/
- https://www.udacity.com/ (Udacity Videos)
- https://piazza.com/class/i23vpy8h7l27la
- http://www.html5rocks.com/en/tutorials/webperformance/usertiming/
- http://andydavies.me/blog/2013/10/22/how-the-browser-pre-loader-makes-pages-load-faster/
- http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
- http://gruntjs.com/
- https://www.erianna.com/using-grunt-to-minify-and-compress-assets


Notes on Changes Made:

Index.html
	- Removed WebFonts

	- Used GRUNT to concatenate all CSS files and minify it.  Then in-lined them to put into style tag.

	- Added 'async' to script tag line for 'perfmatters.js'

	- Resized pizzeria.jpg image to 100px.  Picture is too large and needs to be only 100px.  Size went from 2.4mb to 16kb
	- Removed style="width: 100px;" from pizzeria.jpg line.  Style tags in the html is not recommended.  Picture is sized to 100px so no longer needed


project-2048.html
	- Removed WebFonts note

	- Used GRUNT to concatenate all CSS files and minify it.  Then in-lined them to put into style tag.

	- Added 'async' to script tag line for 'perfmatters.js' and 'analytics.js'


project-webperf.html
	- Removed WebFonts note

	- Used GRUNT to concatenate all CSS files and minify it.  Then in-lined them to put into style tag.

	- Added 'async' to script tag line for 'analytics.js'


project-mobile.html
	- Removed WebFonts note

	- Used GRUNT to concatenate all CSS files and minify it.  Then in-lined them to put into style tag.

	- Added 'async' to script tag line for 'analytics.js'

	- Compressed mobilewebdev.jpg to a smaller size


Pizza.html (html file)
	- Used GRUNT to concatenate all CSS files and minify it.  Then in-lined them to put into style tag.

	- Compressed pizza.jpg to a smaller size


Pizza.html (main.js)
	- Performed the following modifications in for loop line 514

		Broke up the following line:

			var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));

		into the two following lines:

			var scrollTop = (document.body.scrollTop / 1250);
			var phase = Math.sin(scrollTop + (i % 5));

		Then moved the following newly created line above the for loop:

			var scrollTop = (document.body.scrollTop / 1250);

			*Note on his move:  scrollTop causes a reflow.  Broke formula apart and put this portion of the formula above the loop.  Source:  http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html


		Changed the following line from:

			var items = document.querySelectorAll('.mover');

		To:

			var items = document.getElementsByClassName('mover');


			*Note:  getElementsByClassName is faster then querySelectorAll
			Source: http://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall/
			Source: http://jsperf.com/queryselectorall-vs-getelementsbytagname

			These speak about TagName,  however I am getting by ClassName

		In the changePizzaSizes() function:

		-created rndPizzaCont to call the classname outside the for loop.
		-updated the document.querySelectorAll(".randomPizzaContainer") by replacing it with the variable rndPizzaCont that we 	created before the for loop.

		Since all the pizzas are the same size there is no need to iterate over each element in the array to get the pizza size.  Therefore we can move the assignments of dx and newwidth outside the for loop and get the dx and newwidth of the first element in the array.  Therefore change the i to 0.  This removes the unnecessary cycling of assignments in the for loop.  I enclosed the revised lines in an if statement to check if array length is greater than 0. This will ignore the revised lines that reference the first element if that first element does not exist.
		
		- Moved the following from:
			    var dx = determineDx(rndPizzaCont[i], size);
    			var newwidth = (rndPizzaCont[i].offsetWidth + dx) + 'px';

    	- To outside the for loop and changed the i to 0 to get the first element in the array and put it in an if statement to insure the array is not empty.
    		if (rndPizzaCont.length > 0) {
    			var dx = determineDx(rndPizzaCont[0], size);
    			var newwidth = (rndPizzaCont[0].offsetWidth + dx) + 'px';
    		}


		On around line 475 :

		Moved:  var pizzasDiv = document.getElementById("randomPizzas");   outside and above the for loop.
			This assignment only needs to be called once and does not need to be in for loop.