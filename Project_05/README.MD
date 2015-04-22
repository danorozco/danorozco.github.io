UPDATE: Added Updates made from feedback after Information section.


WELCOME!!

To Run Application: Click on link: http://danorozco.github.io/Project_05/

Information:

Welcome to the neighborhood map application.  This neighborhood map is centered around Wrigley Field. Home of the Chicago Cubs Baseball team.  Wrigley Field is in the center of a neighborhood called Wrigleyville which is surrounded by many Pubs and Restaurants.  

This application pulls in a list of top restaurants and bars within walking distance of Wrigley Field. Upon page loading, this list becomes the list for the session and any searching in search bar is performed on this list.

The search bar filters the list based on the characters entered.  Only matches will appear in the list and their corresponding map markers.

You may hover each item on list and the marker will bounce for easy identification before selecting.  Markers rest after moving away from item.

You may select a location either by clicking the name on the list or clicking he actual marker.  The marker will turn green and info window will appear above marker.  Information in marker window is courtesy of FourSquare.  Information shows address and number of individuals checked in.  As expected, check in counts are highest during baseball games.

Application is viewable via desktop and mobile devices.



Updates made from feedback:

From Project Feedback:
- Updated media query (font size and infowindow properties) and viewport for proper rendering on mobile devices.
- Used JSHint to fix Javascript syntax.

From Code Review Suggestions:

- Added "use strict" to script.
- Fixed missing semicolons and other syntax.
- Implemented CDN packages for jquery and knockout.


Resources:

- https://developers.google.com/maps/documentation/javascript/tutorial
- https://developer.foursquare.com/
- http://knockoutjs.com/
- http://stackoverflow.com/
- http://jquery.com/
- http://jqueryui.com/
- http://enable-cors.org/
- http://discussions.udacity.com/c/nd001-2014-11-05/project-5
- Udacity Intro to Ajax Videos
- Udacity Javascript Design Patterns Videos