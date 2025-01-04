

/////// Local Lib
import '../dragStyle.css'
import * as util from '../../lib/glLib'

export default class PenerateLayer {

    constructor(id, bboxinNDC) {
        this.id = id;
        this.type = "custom";
        this.bbox = bboxinNDC //[left,bottom,right,top]

    }



    /**
     * 
     * @param {mapboxgl.Map} map 
     * @param {WebGL2RenderingContext} gl 
     */
    async onAdd(map, gl) {

        this.map = map
        this.gl = gl
        this.initDragDom()

        this.program = util.createShaderFromCode(gl, this.shaderCode())



        this.vbo = util.createVBO(gl, this.bbox)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.bindVertexArray(null)

    }
    /**
       * 
       * @param {WebGL2RenderingContext} gl 
       */
    render(gl, matrix) {

        gl.useProgram(this.program)
        gl.disable(gl.BLEND)
        gl.bindVertexArray(this.vao)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    }

    onRemove() {
        const parent = document.querySelector('#tube')
        parent.removeChild(this.dragDiv)

        const gl = this.gl
        gl.deleteBuffer(this.vbo)
        gl.deleteVertexArray(this.vao)
        gl.deleteProgram(this.program)

        this.gl = null
        this.map = null
        this.vbo = null
        this.vao = null
        this.program = null
        this.dragDiv = null

        console.log(this.id + " removed! (^_^)");
    }

    update(bboxinNDC) {
        this.bbox = bboxinNDC
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bbox), gl.STATIC_DRAW)
        this.map.triggerRepaint()
    }

    set bbox(value) {
        if (value) {
            const [left, bottom, right, top] = value
            this.vertexData = [
                left, top,
                left, bottom,
                right, top,
                right, bottom
            ]
        } else {
            throw "invalid bbox"
        }
    }
    get bbox() {
        return this.vertexData
    }

    initDragDom() {
        ////// craete drag div
        const parent = document.querySelector('#tube')
        let dragDiv = this.dragDiv = document.createElement('div')
        dragDiv.classList.add('drag')
        dragDiv.style.left = '50%';
        dragDiv.style.top = 'calc(50% - 2.5rem)';
        dragDiv.style.transform = 'translate(-50%, 0%)';
        parent.appendChild(dragDiv)

        ////// drag states
        let dragging = this.dragging = false
        let startY = this.startY = 0
        let domStartY = this.domStartY = 0
        let deltaY = this.deltaY = 0

        const updateBBOX = () => {
            const parentRect = parent.getBoundingClientRect()
            let style = getComputedStyle(dragDiv)
            let [toppx, bottompx] = [
                parseInt(style.top, 10),
                parseInt(style.bottom, 10)
            ]
            let centerY = 1.0 - (((toppx + parentRect.height - bottompx) / 2 - parentRect.top) / parentRect.height) * 2.0


            const bbox = [-1, -1, 1, centerY]
            return bbox
        }

        ////// drag events
        function updatePosition() {
            if (dragging) {
                dragDiv.style.top = `${domStartY + deltaY}px`;
                requestAnimationFrame(updatePosition); // 每帧更新位置
            }
        }

        function stopDragging(e) {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
                deltaY = 0

            }
        }

        dragDiv.addEventListener('mousedown', e => {
            if (e.button === 0) {
                document.body.style.userSelect = 'none'
                startY = e.clientY
                domStartY = parseInt(getComputedStyle(dragDiv).top, 10)
                dragging = true
                updatePosition()
            }
        })
        dragDiv.addEventListener("mousemove", e => {
            if (dragging) {
                deltaY = e.clientY - startY;
                const bbox = updateBBOX()
                this.update(bbox)
            }
        })
        dragDiv.addEventListener('mouseleave', stopDragging);
        dragDiv.addEventListener('mouseup', stopDragging);
    }


    shaderCode() {
        return `

          #ifdef VERTEX_SHADER
          layout(location = 0) in vec2 i_pos;// NDC input
  
          void main() {
              vec4 posinCS = vec4(i_pos, 0.0, 1.0);
              gl_Position = posinCS;
          }
          #endif
  
          #ifdef FRAGMENT_SHADER
          precision highp float;
          out vec4 outColor; 
          void main() {
              outColor = vec4(0.0,0.0,0.0,0.0);
          }
  
          #endif
      `
    }
}
