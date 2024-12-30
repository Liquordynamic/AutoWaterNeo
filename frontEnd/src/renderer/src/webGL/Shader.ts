import { Texture } from './Texture'

export class Shader {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram

  constructor(gl: WebGL2RenderingContext, shaderSourceCode: string) {
    this.gl = gl
    this.program = this.createProgram(shaderSourceCode)
  }

  use(): void {
    this.gl.useProgram(this.program)
  }

  unuse(): void {
    this.gl.useProgram(null)
  }

  setUniform(
    name: string,
    value:
      | number
      | [number, number]
      | [number, number, number]
      | [number, number, number, number]
      | Float32Array
  ): void {
    const location = this.gl.getUniformLocation(this.program, name)
    if (typeof value === 'number') {
      if (Number.isInteger(value)) this.gl.uniform1i(location, value)
      else this.gl.uniform1f(location, value)
    } else if (Array.isArray(value)) {
      if (value.length === 2) this.gl.uniform2f(location, value[0], value[1])
      else if (value.length === 3) this.gl.uniform3f(location, value[0], value[1], value[2])
      else if (value.length === 4)
        this.gl.uniform4f(location, value[0], value[1], value[2], value[3])
      else if ((value as number[]).length === 9) this.gl.uniformMatrix3fv(location, false, value)
      else if ((value as number[]).length === 16) this.gl.uniformMatrix4fv(location, false, value)
      else console.error(`Unsupported uniform array size: ${(value as number[]).length}`)
    } else if (value instanceof Float32Array) {
      if (value.length === 16) {
        this.gl.uniformMatrix4fv(location, false, value)
      } else if (value.length === 9) {
        this.gl.uniformMatrix3fv(location, false, value)
      } else {
        console.error(`Unsupported Float32Array size: ${value.length}`)
      }
    } else {
      console.error(`Unsupported uniform type: ${typeof value}`)
    }
  }

  setUniformInt(name: string, value: number): void {
    const location = this.gl.getUniformLocation(this.program, name)
    this.gl.uniform1i(location, value)
  }

  setUniformFloat(name: string, value: number): void {
    const location = this.gl.getUniformLocation(this.program, name)
    this.gl.uniform1f(location, value)
  }

  setUniformTexture(name: string, texture: Texture, slot: number) {
    const location = this.gl.getUniformLocation(this.program, name)
    texture.bind(slot)
    this.gl.uniform1i(location, slot)
  }

  destroy(): void {
    if (this.program) {
      this.gl.deleteProgram(this.program)
    }
  }

  private createShader(type: GLenum, sourceCode: string): WebGLShader {
    const shader: WebGLShader = this.gl.createShader(type)!
    const versionDefinition = '#version 300 es\n'
    if (type === this.gl.VERTEX_SHADER)
      sourceCode = versionDefinition + '#define VERTEX_SHADER\n' + sourceCode
    else if (type === this.gl.FRAGMENT_SHADER)
      sourceCode = versionDefinition + '#define FRAGMENT_SHADER\n' + sourceCode
    this.gl.shaderSource(shader, sourceCode)
    this.gl.compileShader(shader)
    return shader
  }

  private createProgram(shaderSourceCode: string): WebGLProgram {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, shaderSourceCode)
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, shaderSourceCode)
    const shaderProgram = this.gl.createProgram()
    this.gl.attachShader(shaderProgram, vertexShader)
    this.gl.attachShader(shaderProgram, fragmentShader)
    this.gl.linkProgram(shaderProgram)
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error(
        'An error occurred linking shader stages: ' + this.gl.getProgramInfoLog(shaderProgram)
      )
    }
    this.gl.deleteShader(vertexShader)
    this.gl.deleteShader(fragmentShader)
    return shaderProgram
  }
}
