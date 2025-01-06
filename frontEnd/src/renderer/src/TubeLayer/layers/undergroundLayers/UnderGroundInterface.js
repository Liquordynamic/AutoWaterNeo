import * as THREE from 'three'
import { lnglat2MyWorld, calcMatrix, mercatorFromLngLat } from '../../../lib/LargeWorld';
import * as util from '../../../lib/glLib'
import shaderCode from '../shaders/Channel.glsl?raw'

export default class ChannelLayer {

    /**
     * @param {string} id layer id
     */
    constructor(id, options) {

        // base
        this.id = id || "channel-layer";
        this.type = "custom";
        this.geotype = "line"


        // config


        // state
        this.initialized = false
        this.visible = true

    }

    show() {
        this.visible = true
        this.map.triggerRepaint()
    }
    hide() {
        this.visible = false
        this.map.triggerRepaint()
    }

    /**
     * @param {mapboxgl.Map} map 
     * @param {WebGL2RenderingContext} canvas_gl
     */
    async initialize(map, canvas_gl) {
        console.log(this.id + "initializing")
        this.map = map
        const gl = this.gl = canvas_gl

        ////////////// shader and program


        ////////////// data and buffer


        ////////////// vao 


        this.initialized = true
        console.log("channel layer initialized !")

    }

    render() {
        if (!this.initialized) {
            this.map.triggerRepaint()
            return
        }

        const gl = this.gl
        const map = this.map

}

    remove() {
        console.log(this.id + " removed! (^_^)");
    }

}

/////////// Helpers