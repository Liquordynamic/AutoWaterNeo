import { Texture } from "./Texture"

export class Framebuffer {
    private gl: WebGL2RenderingContext
    private ID: WebGLFramebuffer

    constructor(gl: WebGL2RenderingContext, textures: Texture[], depthTexture: Texture | null, renderBuffer: Texture | null) {
        this.gl = gl
        this.ID = this.createFrameBuffer(textures, depthTexture, renderBuffer)
    }

    bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.ID)
    }

    unbind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    }

    destroy(): void {
        this.gl.deleteFramebuffer(this.ID);
    }

    private createFrameBuffer(textures: Texture[], depthTexture: Texture | null = null, renderBuffer: Texture | null = null): WebGLFramebuffer {
        const framebuffer = this.gl.createFramebuffer()
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
        textures?.forEach((texture, index) => {
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0 + index, this.gl.TEXTURE_2D, texture.getID(), 0)
        })
        if (depthTexture) {
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, depthTexture.getID(), 0)
        }
        if (renderBuffer) {
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, renderBuffer.getID())
        }

        const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
        if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
            console.error(`Framebuffer is not complete: ${status}`);
            throw new Error(`Framebuffer is not complete. Status: ${status}`);
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)

        return framebuffer
    }
}