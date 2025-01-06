import * as THREE from 'three'
import { lnglat2MyWorld, calcMatrix } from '../../../lib/LargeWorld';
import * as util from '../../../lib/glLib'
import shaderCode from '../shaders/Catchpit.glsl?raw'
import { mat4 } from 'gl-matrix';

export default class CatchpitLayer {

    /**
     * @param {string} id layer id
     * @param {Object} options.point_geojson geojson point data
     * @param {number} options.minZoom
     * @param {number} options.maxZoom
     */
    constructor(id, options) {
        // base
        this.id = id || "catchpit-layer";
        this.type = "custom";
        this.geotype = "point"

        // config
        this.geojson = options.point_geojson
        this.minZoom = options.minZoom || 10
        this.maxZoom = options.maxZoom || 20

        // state
        this.initialized = false
        this.visible = true

    }

    show() {
        this.visible = true
    }
    hide() {
        this.visible = false
    }

    /**
     * @param {mapboxgl.Map} map 
     * @param {WebGL2RenderingContext} canvas_gl
     */
    async initialize(map, canvas_gl) {
        console.log(this.id, " initializing")
        this.map = map
        const gl = this.gl = canvas_gl

        ////////////// shader and program
        this.program = util.createShaderFromCode(gl, shaderCode)

        ////////////// data and buffer
        const cylinderData = generateOneCylinder(0.01 * 2, 0.2 + 0.01)
        console.log(cylinderData.vertices)
        const { vertices } = generateOneCylinder(0.01 * 220, 0.2 + 0.01)
        // 第一个点，作为参考点
        const onePoint = this.geojson.features[0].geometry.coordinates
        const refPos = this.refPos = lnglat2MyWorld(onePoint)
        const points = generatePoints(this.geojson, refPos)
        const depths = new Float32Array(points.length).fill(0.0)

        for(let i = 0; i < depths.length; i++) {
            depths[i] = Math.random() * 10
        }
        

        this.posBuffer = util.createVBO(gl, points)
        this.instanceNum = points.length / 3
        this.vertBuffer = util.createVBO(gl, cylinderData.vertices)
        this.BIGvertBuffer = util.createVBO(gl, vertices)
        this.normBuffer = util.createVBO(gl, cylinderData.normals)
        this.uvBuffer = util.createVBO(gl, cylinderData.uvs)
        this.idxBuffer = util.createIBO(gl, cylinderData.indices)
        this.depthBuffer = util.createVBO(gl, depths)
        this.idxNum = cylinderData.indices.length
        this.idxType = gl.UNSIGNED_SHORT



        ////////////// vao 
        const pitVao = this.pitVao = gl.createVertexArray()
        gl.bindVertexArray(pitVao)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer)
        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * 4, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
        gl.enableVertexAttribArray(2)
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 2 * 4, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer)
        gl.enableVertexAttribArray(3)
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 3 * 4, 0)
        gl.vertexAttribDivisor(3, 1)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.BIGvertBuffer)
        gl.enableVertexAttribArray(4)
        gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 3 * 4, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.depthBuffer)
        gl.enableVertexAttribArray(5)
        gl.vertexAttribPointer(5, 1, gl.FLOAT, false, 1 * 4, 0)
        gl.vertexAttribDivisor(5, 1)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuffer)
        gl.bindVertexArray(null)

        this.initialized = true
        console.log(this.id, " initialized!")
    }
    /**
       * 
       * @param {WebGL2RenderingContext} canvas_gl
       * @param {number[]} umatrix
       */
    render(canvas_gl, umatrix) {
        // console.log(this.id + " rendering")
        if (!this.initialized) {
            this.map.triggerRepaint()
            return
        }

        const gl = this.gl
        const map = this.map
        const program = this.program

        //////////////TICK LOGIC
        const xMVP = calcMatrix(map.transform.clone(), this.refPos).elements
        const u_modelMatrix = mat4.create()
        mat4.rotateX(u_modelMatrix, u_modelMatrix, Math.PI / 2)


        const scaleRate = (map.transform.zoom - this.minZoom) / (this.maxZoom - this.minZoom)

        //////////////RENDER
        gl.enable(gl.DEPTH_TEST)

        gl.useProgram(program)
        gl.bindVertexArray(this.pitVao)
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_matrix'), false, xMVP)
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_modelMatrix'), false, u_modelMatrix)
        gl.uniform1f(gl.getUniformLocation(program, 'scaleRate'), scaleRate)

        // gl.drawElements(gl.TRIANGLES, this.tubeIdxNum, this.tubeIdxType, 0)
        gl.drawElementsInstanced(gl.TRIANGLES, this.idxNum, this.idxType, 0, this.instanceNum)
        gl.bindVertexArray(null)
    }

    remove() {



        console.log(this.id + " removed! (^_^)");

    }

}

/////////// Helpers

function generateOneCylinder(radius = 0.01, height = 0.2) {
    // radius , height in MY_WORLD space
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    return {
        vertices: geometry.attributes.position.array,
        normals: geometry.attributes.normal.array,
        uvs: geometry.attributes.uv.array,
        indices: geometry.index.array, // Uint16Array
    }
}

function generatePoints(geojson, refPos) {
    const defaultHeight = -0.2
    const points = new Float32Array(geojson.features.length * 2)
    for (let i = 0; i < geojson.features.length; i++) {
        const feature = geojson.features[i];
        const lnglat = feature.geometry.coordinates
        const posinMyWorld = lnglat2MyWorld(lnglat)
        points[i * 3 + 0] = posinMyWorld[0] - refPos[0]
        points[i * 3 + 1] = posinMyWorld[1] - refPos[1]
        points[i * 3 + 2] = defaultHeight
    }
    return points
}