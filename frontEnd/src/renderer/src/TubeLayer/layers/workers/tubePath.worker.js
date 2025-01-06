import * as THREE from 'three'
import { lnglat2MyWorld, calcMatrix } from '../../../lib/LargeWorld';

self.onmessage = function (e) {
    // console.log("worker get", e)

    // postMessage("hello from worker")
    // self.close()
    
    const { geojson, refPos, heightProp, radiusProp, MAX_VERTEX_NUM } = e.data;

    function generateTube(path, refPos, radius = 0.01, H = -0.2) {
        let points = []
        path.forEach((p) => {
            // test in mercator coordinate
            const w = lnglat2MyWorld(p)
            // relative to origin!!!
            points.push(new THREE.Vector3(w[0] - refPos[0], w[1] - refPos[1], H))
        })

        const pathCurve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(pathCurve, points.length, radius, 15);

        const idxU32 = new Uint32Array(Array.from(geometry.index.array))

        return {
            vertices: geometry.attributes.position.array,
            normals: geometry.attributes.normal.array,
            uvs: geometry.attributes.uv.array,
            indices: idxU32, // Uint32Array for batch render
        }
    }
    
    function generateBatchTubes(geojson, refPos, heightProp = null, radiusProp = null) {

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
    // Process and return the result
    const result = generateBatchTubes(geojson, refPos, heightProp, radiusProp);
    postMessage(result); // Send the processed data back to the main thread
    
};

// 在文件末尾添加
export default self;

