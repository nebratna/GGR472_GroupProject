
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
