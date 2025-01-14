import * as THREE from 'three'
import { lnglat2MyWorld, calcMatrix } from '../../../lib/LargeWorld';
import * as util from '../../../lib/glLib'
import shaderCode from '../shaders/Channel.glsl?raw'
import { GUI } from 'dat.gui'
import worker from '../workers/tubePath.worker.js'


export default class ChannelLayer {

    /**
     * @param {string} id layer id
     * @param {Object} options.line_geojson geojson line data
     * @param {number} options.minZoom
     * @param {number} options.maxZoom
     * @param {Function} options.initializedCallback
     */
    constructor(id, options) {

        // base
        this.id = id || "channel-layer"
        this.type = "custom"
        this.geotype = "line"
        this.worker = new Worker(new URL("../workers/tubePath.worker.js", import.meta.url), {
            type: "module"
        })


        // config
        this.geojson = options.line_geojson
        this.minZoom = options.minZoom || 10
        this.maxZoom = options.maxZoom || 20
        this.initializedCallback = options.initializedCallback


        // state
        this.initialized = false
        this.visible = true
        this.curTime = 0.0
        this.deltaTime = 0.01

        this.controller = {
            threshold: 0.5,
            density: 30,
            flowSpeed: 0.5,
            colorDarkness: 0.5
        }


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
        console.log(this.id + " initializing")
        this.map = map
        const gl = this.gl = canvas_gl
        util.resizeCanvasToDisplaySize(gl.canvas)
        this.initGUI()


        ////////////// shader and program
        this.program = util.createShaderFromCode(gl, shaderCode)

        ////////////// data and buffer
        const onePoint = this.geojson.features[0].geometry.coordinates[0][0] //multiLineString 的第一个点，作为参考点, 有点粗鲁
        const refPos = this.refPos = lnglat2MyWorld(onePoint)

        this.worker.postMessage({
            geojson: this.geojson,
            refPos: refPos,
            heightProp: null,
            radiusProp: null,
            MAX_VERTEX_NUM: 5000000
        })
        console.log("tube_path worker start::", Date.now())

        this.worker.onmessage = async (e) => {
            console.log(e.data)
            const tubeData = e.data
            console.log("tube_path worker end::", Date.now())

            const tubeVertBuffer = this.tubeVertBuffer = util.createVBO(gl, tubeData.vertices)
            const tubeBIGVertBuffer = this.tubeBIGVertBuffer = util.createVBO(gl, tubeData.bigVertices)
            const tubeNormBuffer = this.tubeNormBuffer = util.createVBO(gl, tubeData.normals)
            const tubeUVBuffer = this.tubeUVBuffer = util.createVBO(gl, tubeData.uvs)
            const tubeIdxBuffer = this.tubeIdxBuffer = util.createIBO(gl, tubeData.indices)
            const tubeLengthBuffer = this.tubeLengthBuffer = util.createVBO(gl, tubeData.lengths)

            this.tubeIdxNum = tubeData.indices.length
            this.tubeIdxType = gl.UNSIGNED_INT // Uint32

            ////////////// vao 
            const tubeVAO = this.tubeVao = gl.createVertexArray()
            gl.bindVertexArray(tubeVAO)

            gl.bindBuffer(gl.ARRAY_BUFFER, tubeVertBuffer)
            gl.enableVertexAttribArray(0)
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, tubeNormBuffer)
            gl.enableVertexAttribArray(1)
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * 4, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, tubeUVBuffer)
            gl.enableVertexAttribArray(2)
            gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 2 * 4, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, tubeBIGVertBuffer)
            gl.enableVertexAttribArray(3)
            gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 3 * 4, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, tubeLengthBuffer)
            gl.enableVertexAttribArray(4)
            gl.vertexAttribPointer(4, 1, gl.FLOAT, false, 1 * 4, 0)

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tubeIdxBuffer)
            gl.bindVertexArray(null)

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

            ////////////// texture
            const rampBitmap = await util.loadImage('images/ramp1.png')
            this.rampTexture = util.createTexture2D(gl, 439, 21, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rampBitmap)


            this.initialized = true
            this.initializedCallback && this.initializedCallback()
            console.log("channel layer initialized !")
        }

    }
    /**
       * 
       * @param {WebGL2RenderingContext} canvas_gl
       * @param {number[]} umatrix
       */
    render(canvas_gl, umatrix) {
        if (!this.visible) return
        if (!this.initialized) {
            this.map.triggerRepaint()
            return
        }

        const gl = this.gl
        const map = this.map
        const program = this.program

        //////////////TICK LOGIC
        if (this.map.transform.zoom < this.minZoom) {
            gl.clearColor(0.1, 0.1, 0.1, 1.0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            return
        }
        const xMVP = calcMatrix(map.transform.clone(), this.refPos).elements
        const scaleRate = (map.transform.zoom - this.minZoom) / (this.maxZoom - this.minZoom)
        this.curTime += this.deltaTime

        //////////////RENDER
        gl.enable(gl.DEPTH_TEST)

        gl.useProgram(program)
        gl.bindVertexArray(this.tubeVao)
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_matrix'), false, xMVP)
        gl.uniform1f(gl.getUniformLocation(program, 'scaleRate'), scaleRate)
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), this.curTime)
        if (this.map.transform.zoom < 15)
            gl.uniform1f(gl.getUniformLocation(program, 'u_threshold'), 1.0)
        else
            gl.uniform1f(gl.getUniformLocation(program, 'u_threshold'), this.controller.threshold)
        gl.uniform1f(gl.getUniformLocation(program, 'u_density'), this.controller.density)
        gl.uniform1f(gl.getUniformLocation(program, 'u_flow_speed'), this.controller.flowSpeed)
        gl.uniform1f(gl.getUniformLocation(program, 'u_color_darkness'), this.controller.colorDarkness)
        gl.uniform1f(gl.getUniformLocation(program, 'u_flow'), 0.5)
        gl.uniform1f(gl.getUniformLocation(program, 'u_max_flow'), 3.0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.rampTexture)
        gl.uniform1i(gl.getUniformLocation(program, 'u_ramp_texture'), 0);

        gl.drawElements(gl.TRIANGLES, this.tubeIdxNum, this.tubeIdxType, 0)

    }

    remove() {
        this.gui.destroy()

        const gl = this.gl;
        gl.clearColor(0.1, 0.1, 0.1, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        if (this.program) {
            gl.deleteProgram(this.program);
            this.program = null;
        }

        if (this.tubeVao) {
            gl.deleteVertexArray(this.tubeVao);
            this.tubeVao = null;
        }

        if (this.tubeVertBuffer) {
            gl.deleteBuffer(this.tubeVertBuffer);
            this.tubeVertBuffer = null;
        }

        if (this.tubeBIGVertBuffer) {
            gl.deleteBuffer(this.tubeBIGVertBuffer);
            this.tubeBIGVertBuffer = null;
        }

        if (this.tubeNormBuffer) {
            gl.deleteBuffer(this.tubeNormBuffer);
            this.tubeNormBuffer = null;
        }

        if (this.tubeUVBuffer) {
            gl.deleteBuffer(this.tubeUVBuffer);
            this.tubeUVBuffer = null;
        }

        if (this.tubeIdxBuffer) {
            gl.deleteBuffer(this.tubeIdxBuffer);
            this.tubeIdxBuffer = null;
        }

        this.geojson = null;
        this.map = null;
        this.gl = null;
        this.refPos = null;
        this.tubeIdxNum = null;
        this.tubeIdxType = null;

        console.log(this.id + " removed! (^_^)");

    }

    initGUI() {
        console.log("initGUI")
        this.gui = new GUI()
        this.gui.add(this.controller, "colorDarkness", 0, 1)
        this.gui.add(this.controller, "threshold", 0, 1)
        this.gui.add(this.controller, "density", 1, 40)
        this.gui.add(this.controller, "flowSpeed", 0.01, 3)
        // this.gui.destroy()
        // this.gui.domElement.style.zIndex = '9999'
        this.gui.domElement.parentElement.style.zIndex = '1'
        this.gui.domElement.parentElement.style.top = '50px'
        this.gui.close();
    }

    showGUI() {
        this.gui.open();
        console.log(1)
    }

    hideGUI() {
        this.gui.close();
    }
}
