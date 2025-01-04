import * as THREE from 'three'
import { lnglat2MyWorld, calcMatrix, mercatorFromLngLat } from '../../lib/LargeWorld';
import * as util from '../../lib/glLib'
import shaderCode from '../../shader/threeboxTry.glsl?raw'

export default class TubeLayer {

    /**
     * @param {string} id layer id
     * @param {Object} options.line_geojson geojson line data
     * @param {HTMLCanvasElement} options.canvas
     * @param {number} options.minZoom
     * @param {number} options.maxZoom
     */
    constructor(id, options) {
        // base
        this.id = id || "tube-layer";
        this.type = "custom";
        // config
        this.geojson = options.line_geojson
        this.canvas = options.canvas
        this.minZoom = options.minZoom || 10
        this.maxZoom = options.maxZoom || 20
        // gl
        this.gl = this.canvas.getContext("webgl2")

        // state
        this.prepared = false
        this.curTime = 0.0
        this.deltaTime = 0.01
    }

    /**
     * @param {mapboxgl.Map} map 
     * @param {WebGL2RenderingContext} mapbox_gl 
     */
    async onAdd(map, mapbox_gl) {
        this.map = map
        const gl = this.gl
        util.resizeCanvasToDisplaySize(gl.canvas)

        ////////////// shader and program
        this.program = util.createShaderFromCode(gl, shaderCode)

        ////////////// data and buffer
        const onePoint = this.geojson.features[0].geometry.coordinates[0][0] //multiLineString 的第一个点，有点粗鲁
        const refPos = this.refPos = lnglat2MyWorld(onePoint)
        const tubeData = generateBatchTubes(this.geojson, refPos)
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

        this.prepared = true
    }
    /**
       * 
       * @param {WebGL2RenderingContext} mapbox_gl 
       */
    render(mapbox_gl, matrix) {
        if (!this.prepared) {
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
        gl.clearColor(0.1, 0.1, 0.1, 1.0)
        gl.clearDepth(1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST)

        gl.useProgram(program)
        gl.bindVertexArray(this.tubeVao)
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_matrix'), false, xMVP)
        gl.uniform1f(gl.getUniformLocation(program, 'scaleRate'), scaleRate)
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), this.curTime)
        gl.uniform1f(gl.getUniformLocation(program, 'u_density'), 30.0)

        if(this.map.transform.zoom < 15)
            gl.uniform1f(gl.getUniformLocation(program, 'u_threshold'), 1.0)
        else
            gl.uniform1f(gl.getUniformLocation(program, 'u_threshold'), 0.5)
        gl.uniform1f(gl.getUniformLocation(program, 'u_flow_speed'), 1.0)
        gl.uniform1f(gl.getUniformLocation(program, 'u_flow'), 0.5)
        gl.uniform1f(gl.getUniformLocation(program, 'u_max_flow'), 3.0)
        gl.uniform1f(gl.getUniformLocation(program, 'u_color_darkness'), 0.5)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.rampTexture)

        gl.drawElements(gl.TRIANGLES, this.tubeIdxNum, this.tubeIdxType, 0)

        this.map.triggerRepaint()
    }

    onRemove() {

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
        this.canvas = null;
        this.map = null;
        this.gl = null;
        this.refPos = null;
        this.tubeIdxNum = null;
        this.tubeIdxType = null;

        console.log(this.id + " removed! (^_^)");

    }

}

/////////// Helpers
/**
 * @param {*} path a points array to describe the tube path
 * @param {[number,number]} refPos a reference position in MY_WORLD
 */
function generateTube(path, refPos, radius = 0.01, H = -0.3) {

    let points = []
    path.forEach((p) => {
        // test in mercator coordinate
        const w = lnglat2MyWorld(p)
        // relative to origin!!!
        points.push(new THREE.Vector3(w[0] - refPos[0], w[1] - refPos[1], H))
    })

    const pathCurve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(pathCurve, points.length * 3, radius, 6);

    const idxU32 = new Uint32Array(Array.from(geometry.index.array))

    return {
        vertices: geometry.attributes.position.array,
        normals: geometry.attributes.normal.array,
        uvs: geometry.attributes.uv.array,
        indices: idxU32, // Uint32Array for batch render
    }

}
/**
 * 
 * @param {*} geojson 
 * @param {[number,number]} refPos a reference position in MY_WORLD
 * @param {*} heightProp 
 * @param {*} radiusProp 
 * @returns 
 */
function generateBatchTubes(geojson, refPos, heightProp = null, radiusProp = null) {

    const MAX_VERTEX_NUM = 10000000
    const vertexArrayBuffer = new Float32Array(MAX_VERTEX_NUM * 3)//small xyz
    const BIGvertexArrayBuffer = new Float32Array(MAX_VERTEX_NUM * 3)//big xyz
    const normalArrayBuffer = new Float32Array(MAX_VERTEX_NUM * 3)
    const uvArrayBuffer = new Float32Array(MAX_VERTEX_NUM * 2)
    const indexArrayBuffer = new Uint32Array(MAX_VERTEX_NUM * 1)
    const lengthArrayBuffer = new Float32Array(MAX_VERTEX_NUM * 1)
    let vertexCount = 0

    for (let feature of geojson.features) {

        if (feature.geometry.type != 'MultiLineString') continue;
        let H
        heightProp && feature.properties[heightProp] ? H = feature.properties[heightProp] : H = -0.2
        let radius
        radiusProp && feature.properties[radiusProp] ? radius = feature.properties[radiusProp] : radius = 0.01

        // MultiLineString ::: pathes == array of path
        const pathes = feature.geometry.coordinates
        const pipelineLength = feature.properties.Shape_Leng
        for (let path of pathes) {
            const { vertices, normals, uvs, indices } = generateTube(path, refPos, radius * 200, H)
            const realVertices = generateTube(path, refPos, radius, H).vertices
            vertexArrayBuffer.set(realVertices, vertexCount * 3)
            BIGvertexArrayBuffer.set(vertices, vertexCount * 3)
            normalArrayBuffer.set(normals, vertexCount * 3)
            uvArrayBuffer.set(uvs, vertexCount * 2)
            indexArrayBuffer.set(indices.map(i => i + vertexCount), vertexCount)
            lengthArrayBuffer.fill(pipelineLength, vertexCount, vertexCount + indices.length)
            vertexCount += indices.length
        }

    }


    return {
        vertices: vertexArrayBuffer,
        bigVertices: BIGvertexArrayBuffer,
        normals: normalArrayBuffer,
        uvs: uvArrayBuffer,
        indices: indexArrayBuffer, // Uint32Array for batch render
        lengths: lengthArrayBuffer
    }
}
