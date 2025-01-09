import mapboxgl, { MercatorCoordinate } from "mapbox-gl"
import { Shader } from "./webGL/Shader"
import { VertexArray } from "./webGL/Buffer"

import demLayerCode from './shader/demLayer.glsl?raw'
import { Texture } from "./webGL/Texture"
import { lnglat2MyWorld, calcMatrix } from './lib/LargeWorld'
// import { loadImage } from "./glUtils"


export default class DemLayer {
    id: string
    type: string
    renderingMode: string
    isReady: boolean = false
    pointBottomLeft: [number, number]
    pointTopRight: [number, number]
    pointOrigin: [number, number]
    map: mapboxgl.Map | null = null

    demVAO: VertexArray | null = null
    demTexturesNum: number
    demTextures: Texture[]
    demLayerProgram: Shader | null = null
    rampTexture: Texture | null = null
    maskTexture: Texture | null = null

    currentTime: number
    deltaStep: number
    count: number
    index: number

    constructor() {
        // console.log(demLayerCode)
        this.id = 'terrainLayer'
        this.type = 'custom'
        this.renderingMode = '3d'

        this.pointBottomLeft = [113.905570, 22.355942]
        this.pointTopRight = [114.202741, 22.534970]
        this.pointOrigin = [0.0, 0.0]
        this.currentTime = 0.0
        this.count = 0
        this.index = 0
        this.deltaStep = 100
        this.demTexturesNum = 60
        this.demTextures = []
    }

    async onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext) {
        this.map = map
        this.pointOrigin = lnglat2MyWorld(this.pointBottomLeft) as [number, number]
        let lb = lnglat2MyWorld(this.pointBottomLeft)
        let rt = lnglat2MyWorld(this.pointTopRight)
        let lb_relative = [lb[0] - this.pointOrigin[0], lb[1] - this.pointOrigin[1]]
        let rt_relative = [rt[0] - this.pointOrigin[0], rt[1] - this.pointOrigin[1]]

        this.demVAO = new VertexArray(gl, new Float32Array([
            // position, uv
            lb_relative[0], lb_relative[1], 0, 0, 0,
            rt_relative[0], lb_relative[1], 0, 1, 0,
            rt_relative[0], rt_relative[1], 0, 1, 1,

            lb_relative[0], lb_relative[1], 0, 0, 0,
            rt_relative[0], rt_relative[1], 0, 1, 1,
            lb_relative[0], rt_relative[1], 0, 0, 1,
        ]), null)
        this.demVAO.setAttribute(0, 3, gl.FLOAT, 5 * 4, 0)
        this.demVAO.setAttribute(1, 2, gl.FLOAT, 5 * 4, 3 * 4)
        this.demLayerProgram = new Shader(gl, demLayerCode)

        const waterHeightBitmap0 = await loadImage('textures/YLWaterHeight/TIN_WaterDepth_0.png')
        const waterHeightBitmap1 = await loadImage('textures/YLWaterHeight/TIN_WaterDepth_1.png')
        const waterHeightBitmap2 = await loadImage('textures/YLWaterHeight/TIN_WaterDepth_2.png')

        this.demTextures.push(new Texture(gl, waterHeightBitmap0, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA))
        this.demTextures.push(new Texture(gl, waterHeightBitmap1, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA))
        this.demTextures.push(new Texture(gl, waterHeightBitmap2, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA))

        const rampBitmap = await loadImage('textures/rampTextures/rampTexture0.png')
        this.rampTexture = new Texture(gl, rampBitmap, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA)
        const maskBitmap = await loadImage('textures/YLMask1.png')
        this.maskTexture = new Texture(gl, maskBitmap, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA)

        this.isReady = true
    }

    async render(gl: WebGL2RenderingContext, matrix: any) {

        ///////////// tick logic
        if (!this.isReady) {
            this.map?.triggerRepaint()
            return
        }

        this.count += 1
        this.currentTime += 1.0 / this.deltaStep
        let myWorldMatrix = calcMatrix(this.map!.transform.clone(), this.pointOrigin)


        ///////////// tick render
        this.demLayerProgram = ensureNonNull(this.demLayerProgram)
        this.rampTexture = ensureNonNull(this.rampTexture)
        this.maskTexture = ensureNonNull(this.maskTexture)
        this.demLayerProgram.use()
        // this.demLayerProgram.setUniform('uMatrix', matrix)
        this.demLayerProgram.setUniform('uMatrix', myWorldMatrix.elements)
        this.demLayerProgram.setUniformTexture('uRampTexture', this.rampTexture, 2)
        this.demLayerProgram.setUniformTexture('uMaskTexture', this.maskTexture, 3)

        if (this.count % this.deltaStep === 0 && this.count < (this.demTexturesNum - 1) * this.deltaStep) {
            this.index = (this.index + 1) % 3

            loadImage('textures/YLWaterHeight/TIN_WaterDepth_' + String(Math.min(this.demTexturesNum - 1, Math.trunc(this.count / this.deltaStep) + 2)) + '.png').then((waterHeightBitmap) => {
                this.demTextures[(this.index + 2) % 3] = new Texture(gl, waterHeightBitmap, null, null, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.RGBA, gl.RGBA)
            })
        }

        if (this.count < (this.demTexturesNum - 1) * this.deltaStep) {
            this.demLayerProgram.setUniformTexture('uWaterHeight0', this.demTextures[(this.index) % 3], 0)
            this.demLayerProgram.setUniformTexture('uWaterHeight1', this.demTextures[(this.index + 1) % 3], 1)
            this.demLayerProgram.setUniformFloat('uCurTime', this.currentTime)
        } else {
            this.demLayerProgram.setUniformTexture('uWaterHeight0', this.demTextures[(this.index + 2) % 3], 0)
            this.demLayerProgram.setUniformTexture('uWaterHeight1', this.demTextures[(this.index + 2) % 3], 1)
            this.demLayerProgram.setUniformFloat('uCurTime', 0.999)
        }

        this.demVAO!.bind()
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        this.demVAO!.unbind()

        this.map!.triggerRepaint()
    }

}

async function loadImage(url: string) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const blob = await response.blob()
        const imageBitmap = await createImageBitmap(blob, { imageOrientation: "flipY", premultiplyAlpha: "none", colorSpaceConversion: "default" })
        return imageBitmap

    } catch (error) {
        console.error(`Error loading image (url: ${url})`, error)
        throw error
    }
}


function ensureNonNull<T>(value: T): NonNullable<T> {
    if (value == null) {
        throw new Error("is null");
    }
    return value as NonNullable<T>;
}