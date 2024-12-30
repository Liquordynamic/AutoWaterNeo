export class Texture {
  private gl: WebGL2RenderingContext
  private ID: WebGLTexture

  constructor(
    gl: WebGL2RenderingContext,
    image: ImageBitmap | null,
    width: number | null,
    height: number | null,
    wrapMode: number = gl.REPEAT,
    filterMode: number = gl.LINEAR,
    internalFormat: number = gl.RGB,
    format: number = gl.RGB,
    generateMips: boolean = false,
    type: number = gl.UNSIGNED_BYTE
  ) {
    if (!image && (width === null || height === null)) {
      throw new Error('Width and height must be provided if image is null.')
    }
    this.gl = gl
    this.ID = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapMode)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapMode)
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      generateMips ? this.gl.LINEAR_MIPMAP_LINEAR : filterMode
    )
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filterMode)
    if (image)
      // if image isn't null, use image as resource
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        internalFormat,
        image.width,
        image.height,
        0,
        format,
        type,
        image
      ) // else use null adn input width, heigh
    else
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        internalFormat,
        width!,
        height!,
        0,
        format,
        type,
        null
      )

    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  destroy(): void {
    if (this.ID) this.gl.deleteTexture(this.ID)
  }

  setWrapMode(wrapMode: number): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapMode)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapMode)
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0)
  }

  setAxisWrapMode(axis: number, wrapMode: number): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
    this.gl.texParameteri(this.gl.TEXTURE_2D, axis, wrapMode)
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0)
  }

  setFilterMode(filterMode: number): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, filterMode)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filterMode)
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0)
  }

  setMinFilterMode(filterMode: number): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, filterMode)
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0)
  }

  setMagFilterMode(filterMode: number): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filterMode)
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0)
  }

  bind(slot: number): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + slot)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.ID)
  }
  unbind(): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0)
  }
  getID(): WebGLTexture {
    return this.ID
  }
}
