# GGR472_GroupProject
 
This website was created in April 2023 by two undergraducate students at the University of Toronto as part of their final project in a web mapping course. 
The website allows a user to investigate the level of Toronto's greenery and land surface temeperatures (LST) in the summer of 2019. 
Both LST and greeness were assessed using satellite remote sensing techniques, and Landsat satellite imagery in particular. To estimate the level of greenness the Normalised Difference Vegetation Index (NDVI) was used, which can have values between -1 and +1 with +1 being the highest level of greenness and -1 the lowest. Another band of Landsat satellite imagery is used to estimate LST. 
The data used for this project was obtrained from the Canadian Urban Environmental Health Research Consortium (CANUE) in Februaary 2023 (https://www.canuedata.ca/). LST and NDVI values for each postal code in Toronto for 2019 were obtained from CANUE in a .csv file format, and agreagaed into neighbourhoods using ArcGIS Pro. 
NDVI data is annual, while LST is a 3 year average. For NDVI dataset we used the “mean of growing season mean within 250 m”; and for LST the “average of the highest mean warm-season temperature in the last three years across all pixels within 250m of postal code location”.

