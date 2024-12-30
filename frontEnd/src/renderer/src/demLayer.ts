import mapboxgl, { MercatorCoordinate } from "mapbox-gl"
import { Shader } from "./webGL/Shader"
import { VertexArray } from "./webGL/Buffer"
import demLayerCode from './shader/demLayer.glsl?raw'
import { Texture } from "./webGL/Texture"
import { loadImage } from "./glUtils"

export default class DemLayer {
    id: string
    type: string
    renderingMode: string
    isReady: boolean = false
    pointBottomLeft: MercatorCoordinate
    pointTopRight: MercatorCoordinate
    map: mapboxgl.Map

    demVAO: VertexArray
    demTextures: Texture[] = []
    demLayerProgram: Shader
    rampTexture: Texture
    maskTexture: Texture

    currentTime: number
    deltaStep: number
    count: number

    constructor() {
        this.id = 'floodLayer'
        this.type = 'custom'
        this.renderingMode = '3d'

        this.pointBottomLeft = mapboxgl.MercatorCoordinate.fromLngLat([113.905704, 22.356183])
        this.pointTopRight = mapboxgl.MercatorCoordinate.fromLngLat([114.202387, 22.534759])
        this.currentTime = 0.0
        this.count = 0
        this.deltaStep = 20
    }

    async onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext) {
        this.map = map
        this.demVAO = new VertexArray(gl, new Float32Array([
            // position, uv
            this.pointBottomLeft.x, this.pointBottomLeft.y, 0, 0, 0,
            this.pointTopRight.x, this.pointBottomLeft.y, 0, 1, 0,
            this.pointTopRight.x, this.pointTopRight.y, 0, 1, 1,

            this.pointBottomLeft.x, this.pointBottomLeft.y, 0, 0, 0,
            this.pointTopRight.x, this.pointTopRight.y, 0, 1, 1,
            this.pointBottomLeft.x, this.pointTopRight.y, 0, 0, 1,
        ]), null)
        this.demVAO.setAttribute(0, 3, gl.FLOAT, 5 * 4, 0)
        this.demVAO.setAttribute(1, 2, gl.FLOAT, 5 * 4, 3 * 4)
        this.demLayerProgram = new Shader(gl, demLayerCode)

        for (let i = 0; i < 60; i += 1) {
            const waterHeightBitmap = await loadImage('textures/YLWaterHeight/TIN_WaterDepth_' + String(i) + '.png')
            this.demTextures.push(new Texture(gl, waterHeightBitmap, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA))
        }

        const rampBitmap = await loadImage('textures/rampTextures/rampTexture0.png')
        this.rampTexture = new Texture(gl, rampBitmap, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA)
        const maskBitmap = await loadImage('textures/YLMask.png')
        this.maskTexture = new Texture(gl, maskBitmap, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA)
        
        this.isReady = true
    }

    render(gl: WebGL2RenderingContext, matrix: any) {
        if (!this.isReady) {
            this.map.triggerRepaint()
            return
        }
        
        this.count += 1
        this.currentTime += 1.0 / this.deltaStep

        this.demLayerProgram.use()
        this.demLayerProgram.setUniform('uMatrix', matrix)
        this.demLayerProgram.setUniformTexture('uRampTexture', this.rampTexture, 2)
        this.demLayerProgram.setUniformTexture('uMaskTexture', this.maskTexture, 3)
        // console.log(this.count)

        if(this.count < (this.demTextures.length - 1) * this.deltaStep) {
            this.demLayerProgram.setUniformTexture('uWaterHeight0', this.demTextures[Math.trunc(this.count / this.deltaStep)], 0)
            this.demLayerProgram.setUniformTexture('uWaterHeight1', this.demTextures[Math.trunc(this.count / this.deltaStep) + 1], 1)
            this.demLayerProgram.setUniformFloat('uCurTime', this.currentTime)
        } else {
            this.demLayerProgram.setUniformTexture('uWaterHeight0', this.demTextures[this.demTextures.length - 1], 0)
            this.demLayerProgram.setUniformTexture('uWaterHeight1', this.demTextures[this.demTextures.length - 1], 1)
            this.demLayerProgram.setUniformFloat('uCurTime', 0.999)
        }


        this.demVAO!.bind()
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        this.demVAO!.unbind()

        this.map.triggerRepaint()
    }

}