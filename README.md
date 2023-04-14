# GGR472_GroupProject
 
This website was created in April 2023 by two undergraduate students at the University of Toronto as part of their final project in a web mapping course. It allows a user to investigate the level of Toronto's greenery and land surface temperatures (LST) in the summer of 2019.

Both LST and greenness were assessed using satellite remote sensing techniques and more specifically - Landsat satellite imagery. One of the most common methods to estimate the level of greenness in remote sensing is to use the Normalised Difference Vegetation Index (NDVI), which is what we used in this project. NDVI can have values between -1 and +1 with +1 being the highest level of greenness and -1 the lowest. Another band of Landsat satellite imagery was used to estimate LST. 

The website contains a web map designed for the general public that allows them to understand how NDVI and LST differ across Toronto’s neighbourhoods. It also contains links to news articles, additional tools, and relevant scientific articles that can provide more information to those with an interest in the topic. The web map is currently well-formatted for use on a regular size computer screen, although it still needs to be modified for devices with smaller screens.

The user can use the toggles and checkboxes on the panel on the left in the main map to see how NDVI and LST values vary for Toronto's neighbourhoods, and to see which neighbourhoods fall into specific ranges. They can choose to turn legends ON and OFF. If there is an overlap between the red (LST) and green (NDVI) layers, the resulting neighbourhoods are varying shades of orange and brown. They can also click on each neighbourhood to see its name and the corresponding LST and NDVI values. The "compare with slider" button allows the user to compare the NDVI and LST maps with a quick swipe.
 
The data used for this project was obtained from the Canadian Urban Environmental Health Research Consortium (CANUE) in February 2023 (https://www.canuedata.ca/). CANUE provided LST and NDVI values for each postal code in Toronto for 2019 in a .csv file format. ArcGIS Pro was then used to aggregate the NDVI and LST at each postal code into neighbourhoods. For NDVI dataset we used “mean of growing season mean within 250 m” and for LST the “average of the highest mean warm-season temperature in the last three years across all pixels within 250m of postal code location” (CANUE, 2023).

While we believe the website and web map achieves its purpose, we acknowledge that it does have a few limitations that should be addressed in the future version. Specifically, we would aim to address the following: 
1.	Develop the code to highlight the neighbourhoods that overlap when NDVI and LST ranges are selected at the same time and overlap.
2.	Incorporate the Slider into the main page instead of the required loading of a separate webpage. We expect that this would improve the performance of the website by removing a lot of the duplicate code in the slider.html and slider.js.
3.	Allow the user to click on a neighbourhood and see pop ups while the Slider is on.
4.	Combine NDVI and LST data into a single pop up for both NDVI and LST layers. 
5.	Incorporate patterns into our choropleth maps instead of colours (ideally colours with patterns) to allow colour-blind people easily differentiate between the ranges.
6.	Add an information icon in the overlay panel explaining the important terms such as NDVI and LST to the user instead of requiring them to navigate to a separate “Using this map” page.
7.	Make geocoder and the overlay panels collapsible for mobile devices.
8.	Find a way for the slider handle size to adjust with the screen size instead of being fixed. 
9.  Allow the user to select multiple ranges at the same time.

