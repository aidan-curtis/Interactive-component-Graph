This interactive graph shows the relationships between attributes of a given csv file.
The user can chose two numerical attributes for the x and y axis and one nominal attribute for the color value. 

Python files contain the mechanism used to scrape data from the digikey.com website but data from any other website will require a custom built spider.

D3 is used to visualize the data in various forms.
The first form is a scatter plot which is used to show the basic relationship between the three selected attributes.

The second form is a Voronoi Tessellation that is used to see the domains dominated by the   nominal attribute.

The Third form is a centroid map that is used to show where the nominal attributes lie on the spectrum of the x and y axis and how many data points they are represented by. 

The fourth form is a Delaunay Triangulation in which the maximum alpha can be adjusted. This will show the user the areas in which the nominal attribute is densely populated.

You can use the seleniumdigikey.py python script to scrape the data from digikey or you can do it manually. Either way, you will have to end up merging all of the cvs files using a bash script or other program. Once the csv is merged, you can use csvchanger as a template for converting the integers with prefixes and suffixes into just plain integers.
When you put these files on the server you can make a request to manufacturerextension.html to start the web application.




