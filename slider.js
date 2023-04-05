//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibmVicmF0bmEiLCJhIjoiY2xjdmZ6Z3I0MDdoODNycWtvNDVuYjJydCJ9.MU8-uPe3u6ya0aTiMr079g'; //default public map token from my Mapbox account

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nebratna/clf2y6xcs002r01o5kcpwugoc',
    center: [-79.408, 43.7056],
    zoom: 10,
});


/*--------------------------------------------------------------------
ADD NDVI and LST DATA AS CHOROPLETH MAP ON MAP LOAD
Use get expression to categorise data based on NDVI values
--------------------------------------------------------------------*/
let ndvigeojson; //new empty NDVI variable
let lstgeojson; //new empty LST variable

fetch('https://raw.githubusercontent.com/nebratna/GGR472_GroupProject/main/Data/NDVI_neighb_TO_2019_v3.geojson') // access NDVI GeoJSON via GitHub
    .then(response => response.json()) // converts the response to JSON format
    .then(response => {
        console.log(response); // checking response in console
        ndvigeojson = response; //store GeoJSON as a variable using URL from fetch response
    });

fetch('https://raw.githubusercontent.com/nebratna/GGR472_GroupProject/main/Data/LST_neighb_TO_3Y_2019_v3.geojson') // access LST GeoJSON via GitHub
    .then(response => response.json()) // converts the response to JSON format
    .then(response => {
        console.log(response); // checking response in console
        lstgeojson = response; //store GeoJSON as a variable using URL from fetch response
    });
    
/*----------------------------------------------------------------
CREATING THE TWO MAPS FOR COMPARISON------------------------------
-----------------------------------------------------------------*/
const NDVImap = new mapboxgl.Map({
    container: 'before',
    style: 'mapbox://styles/nebratna/clf2y6xcs002r01o5kcpwugoc',
    center: [-79.408, 43.7056],
    zoom: 10,
});

const LSTmap = new mapboxgl.Map({
    container: 'after',
    style: 'mapbox://styles/nebratna/clf2y6xcs002r01o5kcpwugoc',
    center: [-79.408, 43.7056],
    zoom: 10,
});

NDVImap.on('load', () => {

    /*----------------------------
    NDVI layer
    ------------------------------*/

    NDVImap.addSource('neighbNDVI', {
        type: 'geojson',
        data: ndvigeojson
    });

    NDVImap.addLayer({
        'id': 'NDVI2',
        'type': 'fill',
        'source': 'neighbNDVI',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'mean_ndvi_'], // 
                '#a64dff', // Colour assigned to any values < first step
                0.10, '#eff3ff', // Colours assigned to values >= each step
                0.24, '#bae4b3',
                0.36, '#74c476',
                0.43, '#31a354', //0.43 to 0.48
                0.48, '#006d2c', //0.48 and higher

            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'black'
        },

    });

});

LSTmap.on('load', () => {
    LSTmap.addSource('neighbLST', {
        type: 'geojson',
        data: lstgeojson
    });

    LSTmap.addLayer({
        'id': 'LST2',
        'type': 'fill',
        'source': 'neighbLST',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'mean_lst_3'], // 
                '#a64dff', // Colour assigned to any values < first step
                27.0, '#fee5d9',// Colours assigned to values >= each step
                28.0, '#fcbba1',
                29.0, '#fc9272',
                30.0, '#fb6a4a',
                31.0, '#de2d26', //30.90 and higher
                32.0, '#a50f15',
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'black'
        },

    });
});

const container = '#comparison-container';

const comparemap = new mapboxgl.Compare(NDVImap, LSTmap, container, {});
