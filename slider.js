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
            'fill-opacity': 0.7,
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
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
        },

    });
});

const container = '#comparison-container';

const comparemap = new mapboxgl.Compare(NDVImap, LSTmap, container, {});


/*-----------------------------------------------------------------
    ADDING MOUSE CLICK EVENT FOR LAYER
 -----------------------------------------------------------------*/

/*----------------------------------
for NDVI layer
------------------------------------*/

// Change the cursor to a pointer when the mouse is over the NDVI layer.
NDVImap.on('mouseenter', 'NDVI2', () => {
    NDVImap.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
NDVImap.on('mouseleave', 'NDVI2', () => {
    NDVImap.getCanvas().style.cursor = '';
});

NDVImap.on('click', 'NDVI2', (e) => {
    let NDVI = e.features[0].properties.mean_ndvi_ // NDVI variable that needs to be rounded 
    let roundedNDVI = NDVI.toFixed(2); // rounding NDVI variable to 2 decimal places
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood:</b> " + "<br>" + e.features[0].properties.FIELD_7 + "<br>" + "<b>NDVI:</b> " + roundedNDVI) //Use click event properties to write text for popup
        .addTo(map); //Show  popup on map
});

/*----------------------------------
for LST layer
------------------------------------*/

// Change the cursor to a pointer when the mouse is over the LST layer.
LSTmap.on('mouseenter', 'LST2', () => {
    LSTmap.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
LSTmap.on('mouseleave', 'LST2', () => {
    LSTmap.getCanvas().style.cursor = '';
});

LSTmap.on('click', 'LST2', (e) => {
    let LST = e.features[0].properties.mean_lst_3 // LST variable that needs to be rounded 
    let roundedLST = LST.toFixed(1); // rounding LST variable to 1 decimal places
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood:</b> " + "<br>" + e.features[0].properties.FIELD_7 + "<br>" + "<b>LST:</b> " + roundedLST) //Use click event properties to write text for popup
        .addTo(map); //Show  popup on map
});


/*--------------------------------------------------------------------
   ADDING INTERACTIVITY BASED ON HTML EVENT
   --------------------------------------------------------------------*/

//Add event listeneer which returns map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.408, 43.7056],
        zoom: 10,
        essential: true
    });
});

//NDVI legend checkbox
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});

//LST legend checkbox
let LSTlegendcheck = document.getElementById('LSTlegendcheck');

LSTlegendcheck.addEventListener('click', () => {
    if (LSTlegendcheck.checked) {
        LSTlegendcheck.checked = true;
        LSTlegend.style.display = 'block';
    }
    else {
        LSTlegend.style.display = "none";
        LSTlegendcheck.checked = false;
    }
});

/*--------------------------------------------------------------------
   ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
   --------------------------------------------------------------------*/
//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(NDVImap));


//Add zoom and rotation controls to the map.
NDVImap.addControl(new mapboxgl.NavigationControl());
LSTmap.addControl(new mapboxgl.NavigationControl());


