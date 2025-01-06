import * as util from '../../lib/glLib'


export default class TubeLayer {
    /**
     * @param {string} id 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(id, canvas) {

        // base
        this.id = id || "tube-layer"
        this.type = "custom"
        this.canvas = canvas

        // gl
        this.gl = this.canvas.getContext("webgl2")

        // state
        this.subLayers = []
        this.prepared = false
        this.map = null

    }



    addSubLayer(subLayer) {
        console.log(this.subLayers)
        console.log("add sublayer", subLayer.id)
        // logic
        if (this.subLayers.find(_subLayer => _subLayer.id === subLayer.id)) {
            console.warn(`sublayer with id ${subLayer.id} already exist`)
            return
        }
        this.subLayers.push(subLayer)

        // if map setted , initialize
        this.map && subLayer.initialize(this.map, this.gl)

        this.sortByGeoType(this.subLayers)

        // render
        this.map && this.map.triggerRepaint()
    }

    removeSubLayer(id) {
        console.log("remove sublayer", id);
        
        // logic
        let targetSubLayer = this.subLayers.find(subLayer => subLayer.id === id);
        if (!targetSubLayer) {
            console.warn(`sublayer with id ${id} not exist`);
            return;
        }
        targetSubLayer.remove();
        this.subLayers = this.subLayers.filter(subLayer => subLayer.id !== id);

        // this.subLayers = this.subLayers.filter(subLayer => {
        //     if (subLayer.id === id) {
        //         subLayer.remove()
        //         return false
        //     }
        //     return true
        // })

        // render
        this.map && this.map.triggerRepaint()
    }

    showLayer(id) {
        // logic
        const subLayer = this.subLayers.find(subLayer => subLayer.id === id)
        subLayer.show()

        // render
        this.map && this.map.triggerRepaint()

    }

    hideLayer(id) {
        // logic
        const subLayer = this.subLayers.find(subLayer => subLayer.id === id)
        subLayer.hide()

        // render
        this.map && this.map.triggerRepaint()
    }


    /**
     * @param {mapboxgl.Map} map 
     * @param {WebGL2RenderingContext} mapbox_gl 
     */
    async onAdd(map, mapbox_gl) {
        this.map = map
        const gl = this.gl
        util.resizeCanvasToDisplaySize(gl.canvas)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // if add subLayer after onAdd
        for (let i = 0; i < this.subLayers.length; i++) {
            if (!this.subLayers[i].initialized)
                this.subLayers[i].initialize(map, gl)
        }

    }
    /**
       * 
       * @param {WebGL2RenderingContext} mapbox_gl 
       */
    render(mapbox_gl, matrix) {

        const gl = this.gl
        const map = this.map

        //////////////TICK LOGIC
        // gl.clearColor(0.46, 0.29, 0.1, 1.0)
        gl.clearColor(0.1, 0.1, 0.1, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)


        //////////////RENDER
        // sorted ?
        this.subLayers.forEach(subLayer => {
            if (subLayer.initialized) {
                subLayer.render(gl, matrix)
            }
        })

        this.map.triggerRepaint()

    }

    onRemove() {

        const gl = this.gl;
        gl.clearColor(0.1, 0.1, 0.1, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        console.log(this.id + " removed! (^_^)");

    }

    sortByGeoType(subLayerArray) {

        const order = { "point": 1, "line": 2, "polygon": 3 };
        return subLayerArray.sort((a, b) => {
            return order[a.geotype] - order[b.geotype];
        });

    }

}