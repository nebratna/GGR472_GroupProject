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

//Add data source and draw initial visiualization of layer
map.on('load', () => {

    /*----------------------------
    NDVI layer
    ------------------------------*/

    map.addSource('neighbNDVI', {
        type: 'geojson',
        data: ndvigeojson
    });

    map.addLayer({
        'id': 'NDVI',
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

    //Add another visualization of the neighbrouhood polygons when the mouse is hovering over it
    // map.addLayer({
    //     'id': 'NDVI-hl', //Update id to represent highlighted layer
    //     'type': 'fill',
    //     'source': 'neighbNDVI',
    //     'paint': {
    //         'fill-color': [
    //             'step',
    //             ['get', 'mean_ndvi_'],
    //             '#a64dff', // Colour assigned to any values < first step
    //             0.10, '#ffffcc', // Colours assigned to values >= each step
    //             0.24, '#c2e699',
    //             0.36, '#78c679',
    //             0.43, '#31a354', //0.43 to 0.48
    //             0.48, '#006837', //0.48 and higher

    //         ],
    //         'fill-opacity': 0.8,
    //         'fill-outline-color': 'black'
    //     },

    //     'filter': ['==', ['get', 'FIELD_1'], ''] //Set an initial filter to return nothing
    // });

    /*------------------------------------
    LST layer
    --------------------------------------*/

    map.addSource('neighbLST', {
        type: 'geojson',
        data: lstgeojson
    });

    map.addLayer({
        'id': 'LST',
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

    //Add another visualization of the neighbrouhood polygons when the mouse is hovering over it
    // map.addLayer({
    //     'id': 'LST-hl', //Update id to represent highlighted layer
    //     'type': 'fill',
    //     'source': 'neighbLST',
    //     'paint': {
    //         'fill-color': [
    //             'step',
    //             ['get', 'mean_ndvi_'],
    //             '#a64dff', // Colour assigned to any values < first step
    //             27.00, '#ffffd4', // Colours assigned to values >= each step
    //             28.29, '#fed98e',
    //             29.07, '#fe9929',
    //             29.82, '#d95f0e',
    //             30.90, '#993404', //30.90 and higher

    //         ],
    //         'fill-opacity': 0.6,
    //         'fill-outline-color': 'black'
    //     },
    //     'filter': ['==', ['get', 'mean_ndvi_'], ''] //Set an initial filter to return nothing
    // });



    /*-----------------------------------------------------------------
    ADDING MOUSE CLICK EVENT FOR LAYER
    -----------------------------------------------------------------*/

    /*----------------------------------
    for NDVI layer
    ------------------------------------*/

    // Change the cursor to a pointer when the mouse is over the NDVI layer.
    map.on('mouseenter', 'NDVI', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'NDVI', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'NDVI', (e) => {
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
    map.on('mouseenter', 'LST', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'LST', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'LST', (e) => {
        let LST = e.features[0].properties.mean_lst_3 // LST variable that needs to be rounded 
        let roundedLST = LST.toFixed(1); // rounding LST variable to 1 decimal places
        new mapboxgl.Popup() //Declare new popup object on each click
            .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
            .setHTML("<b>Neighbourhood:</b> " + "<br>" + e.features[0].properties.FIELD_7 + "<br>" + "<b>LST:</b> " + roundedLST) //Use click event properties to write text for popup
            .addTo(map); //Show  popup on map
    });

    /*---------------------------------------------------------------------
    SIMPLE HOVER EVENTs for NDVI and LST //need to fix reset!!!!
    ----------------------------------------------------------------------*/
    // map.on('mousemove', 'NDVI', (e) => {
    //     if (e.features.length > 0) {
    //         map.setFilter('NDVI-hl', ['==', ['get', 'FIELD_1'], e.features[0].properties.FIELD_1]);
    //     }
    // })

    // map.on('mousemove', 'LST', (e) => {
    //     if (e.features.length > 0) {
    //         map.setFilter('LST-hl', ['==', ['get', 'FIELD_1'], e.features[0].properties.FIELD_1]);
    //     }
    // })

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
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    //Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    //Add fullscreen option to the map
    map.addControl(new mapboxgl.FullscreenControl());



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

    //NDVI checkbox
    document.getElementById('NDVIcheck').addEventListener('change', (e) => {
        map.setLayoutProperty(
            'NDVI',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
    });

    //LST checkbox
    document.getElementById('LSTcheck').addEventListener('change', (e) => {
        map.setLayoutProperty(
            'LST',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
    });

    
    /*-----------------------------------------------------------------------------------
    Filter NDVI or LST data layer to show selected Neighbrourhood from dropdown selection
    -------------------------------------------------------------------------------------*/
    let neighbourhoodvalue;

    document.getElementById("neighbourhoodfieldset").addEventListener('change', (e) => {
        neighbourhoodvalue = document.getElementById('neighbourhood').value;
        console.log(neighbourhoodvalue);

        if (neighbourhoodvalue == 'All') {
            map.setFilter(
                'NDVI',
                ['has', 'FIELD_7'] //returns all polygons from layer that have a value in FIELD_7);
            );
        } else {
            map.setFilter(
                'NDVI',
                ['==', ['get', 'FIELD_7'], neighbourhoodvalue] //returns polygon with FIELD_7 value that matches dropdown selection);
            );
        };

        if (neighbourhoodvalue == 'All') {
            map.setFilter(
                'LST',
                ['has', 'FIELD_7'] //returns all polygons from layer that have a value in FIELD_7);
            );
        } else {
            map.setFilter(
                'LST',
                ['==', ['get', 'FIELD_7'], neighbourhoodvalue] //returns polygon with FIELD_7 value that matches dropdown selection);
            );
        };

    });

});

/*-----------------------------------------------------------------------------------
Filter neighbourhoods to show selected NDVI ranges from dropdown selection
-------------------------------------------------------------------------------------*/

let NDVIvalueselection;

document.getElementById("NDVIfieldset").addEventListener('change', (e) => {
    NDVIvalueselection = document.getElementById('NDVIvalueset').value;

    if (NDVIvalueselection == 'All') {
        map.setFilter(
            'NDVI',
            ['has', 'FIELD_7'] //returns all polygons from layer that have a value in FIELD_7;
        );
    } else {
        if (NDVIvalueselection == 'neighbourhoods1') {
            map.setFilter(
                'NDVI',
                ['all',
                    ['>=', ['get', 'mean_ndvi_'], 0.1],
                    ['<', ['get', 'mean_ndvi_'], 0.23]])
        };

        if (NDVIvalueselection == 'neighbourhoods2') {
            map.setFilter(
                'NDVI',
                ['all',
                    ['>=', ['get', 'mean_ndvi_'], 0.24],
                    ['<', ['get', 'mean_ndvi_'], 0.35]])
        };
        if (NDVIvalueselection == 'neighbourhoods3') {
            map.setFilter(
                'NDVI',
                ['all',
                    ['>=', ['get', 'mean_ndvi_'], 0.36],
                    ['<', ['get', 'mean_ndvi_'], 0.42]])
        };
        if (NDVIvalueselection == 'neighbourhoods4') {
            map.setFilter(
                'NDVI', ['all',
                ['>=', ['get', 'mean_ndvi_'], 0.43],
                ['<', ['get', 'mean_ndvi_'], 0.47]])
        };
        if (NDVIvalueselection == 'neighbourhoods5') {
            map.setFilter(
                'NDVI',
                ['all',
                    ['>=', ['get', 'mean_ndvi_'], 0.48],
                    ['<', ['get', 'mean_ndvi_'], 0.54]])
        };
    };

});

/*-----------------------------------------------------------------------------------
Filter LST to show selected LST ranges from dropdown selection
-------------------------------------------------------------------------------------*/

let LSTvalueselection;

document.getElementById("LSTfieldset").addEventListener('change', (e) => {
    LSTvalueselection = document.getElementById('LSTvalueset').value;

    if (LSTvalueselection == 'All') {
        map.setFilter(
            'LST',
            ['has', 'FIELD_7'] //returns all polygons from layer that have a value in FIELD_7;
        );
    } else {
        if (LSTvalueselection == 'LST1') {
            map.setFilter(
                'LST',
                ['all',
                    ['>=', ['get', 'mean_lst_3'], 27.0],
                    ['<', ['get', 'mean_lst_3'], 27.9]])
        };

        if (LSTvalueselection == 'LST2') {
            map.setFilter(
                'LST',
                ['all',
                    ['>=', ['get', 'mean_lst_3'], 28.0],
                    ['<', ['get', 'mean_lst_3'], 28.9]])
        };
        if (LSTvalueselection == 'LST3') {
            map.setFilter(
                'LST',
                ['all',
                    ['>=', ['get', 'mean_lst_3'], 29.0],
                    ['<', ['get', 'mean_lst_3'], 29.9]])
        };
        if (LSTvalueselection == 'LST4') {
            map.setFilter(
                'LST',
                ['all',
                    ['>=', ['get', 'mean_lst_3'], 30.0],
                    ['<', ['get', 'mean_lst_3'], 30.9]])
        };
        if (LSTvalueselection == 'LST5') {
            map.setFilter(
                'LST', ['all',
                ['>=', ['get', 'mean_lst_3'], 31.0],
                    ['<', ['get', 'mean_lst_3'], 31.9]])
        };
        if (LSTvalueselection == 'LST6') {
            map.setFilter(
                'LST',
                ['all',
                    ['>=', ['get', 'mean_lst_3'], 32.0],
                    ['<', ['get', 'mean_lst_3'], 32.9]])
        };
    };

});