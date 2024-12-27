export class Buffer {
    private gl: WebGL2RenderingContext
    public ID: WebGLBuffer
    private type: number

    constructor(gl: WebGL2RenderingContext, data: number[] | Float32Array, type: number, usage: number = gl.STATIC_DRAW) {
        this.gl = gl
        this.type = type
        this.ID = this.createBufferWithData(data, type, usage)
    }

    createBuffer(): WebGLBuffer {
        const buffer: WebGLBuffer = this.gl.createBuffer()
        return buffer
    }

    bindBufferData(data: number[] | Float32Array, type: number, usage: number): void {
        const bufferData = data instanceof Array ? (type == this.gl.ARRAY_BUFFER ? new Float32Array(data) : new Uint16Array(data)) : data
        this.gl.bufferData(type, bufferData, usage)
    }

    bind(): void {
        this.gl.bindBuffer(this.type, this.ID)
    }

    unbind(): void {
        this.gl.bindBuffer(this.type, null)
    }

    deleteBuffer(): void {
        this.gl.deleteBuffer(this.ID)
    }

    private createBufferWithData(data: number[] | Float32Array, type: number, usage: number): WebGLBuffer {
        const buffer: WebGLBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(type, buffer)
        const bufferData = data instanceof Array ? (type == this.gl.ARRAY_BUFFER ? new Float32Array(data) : new Uint16Array(data)) : data
        if (type == this.gl.ARRAY_BUFFER) { // VBO
            this.gl.bufferData(type, bufferData, usage);
        }
        else {  // EBO
            this.gl.bufferData(type, bufferData, usage, 0, data.length);
        }
        return buffer
    }
}

export class VertexArray {
    private gl: WebGL2RenderingContext
    public VAO: WebGLVertexArrayObject
    private VBO: Buffer
    private EBO: Buffer | null

    constructor(gl: WebGL2RenderingContext, verticesData: number[] | Float32Array, indicesData: number[] | Float32Array | null) {
        this.gl = gl
        this.VBO = new Buffer(this.gl, verticesData, gl.ARRAY_BUFFER)
        this.EBO = indicesData ? new Buffer(this.gl, indicesData, gl.ELEMENT_ARRAY_BUFFER) : null
        this.VAO = this.createVertexArray()
    }

    bind(): void {
        this.gl.bindVertexArray(this.VAO)
    }

    unbind(): void {
        this.gl.bindVertexArray(null)
    }

    destroy(): void {
        this.VBO.deleteBuffer()
        this.EBO?.deleteBuffer()
        this.gl.deleteVertexArray(this.VAO)
    }

    setAttribute(index: number, size: number, type: number, stride: number, offset: number, normalized: boolean = false): void {
        this.bind()
        this.VBO.bind()
        this.EBO?.bind()
        this.gl.enableVertexAttribArray(index)
        this.gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
        this.unbind()
    }

    private createVertexArray(): WebGLVertexArrayObject {
        const vao = this.gl.createVertexArray()
        if (!vao)
            throw new Error("Failed to create vertex array object");
        return vao
    }
}