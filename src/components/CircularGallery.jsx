import { useRef, useEffect } from 'react'
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl'

import './CircularGallery.css';

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

function createTextTexture(gl, text, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  context.font = font
  const metrics = context.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const sizeMatch = font.match(/(\d+)px/)
  const fontSize = sizeMatch ? parseInt(sizeMatch[1], 10) : 30
  const textHeight = Math.ceil(fontSize * 1.2)
  canvas.width = textWidth + 20
  canvas.height = textHeight + 20
  context.font = font
  context.fillStyle = color
  context.textBaseline = "middle"
  context.textAlign = "center"
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "30px sans-serif" }) {
    autoBind(this)
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.text = text
    this.textColor = textColor
    this.font = font
    this.createMesh()
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    )
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const textHeight = this.plane.scale.y * 0.15
    const textWidth = textHeight * aspect
    this.mesh.scale.set(textWidth, textHeight, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    preserveAspectRatio = false,
    showTitles = true
  }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.preserveAspectRatio = preserveAspectRatio
    this.createShader()
    this.createMesh()
    if (showTitles) {
      this.createTitle()
    }
    this.onResize()
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uIsMobile;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          if (uIsMobile > 0.5) {
            p.z = 0.0;
          } else {
            // Apply z-axis distortion only, no x/y distortion to maintain perfect circles
            p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        // Rounded box SDF mask function
        float roundedRectangle(vec2 uv, vec2 size, float radius) {
          vec2 d = abs(uv - 0.5) - size + vec2(radius);
          return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
        }
        
        void main() {
          // Object-fit: cover implementation on the GPU
          vec2 ratio = vec2(
            uPlaneSizes.x / uPlaneSizes.y,
            uImageSizes.x / uImageSizes.y
          );
          
          vec2 uv = vUv;
          if (ratio.x > ratio.y) {
            float s = ratio.y / ratio.x;
            uv.y = (uv.y - 0.5) * s + 0.5;
          } else {
            float s = ratio.x / ratio.y;
            uv.x = (uv.x - 0.5) * s + 0.5;
          }
          
          vec4 color = texture2D(tMap, uv);
          
          // Apply rounded rectangle mask
          float d = roundedRectangle(vUv, vec2(0.5), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uIsMobile: { value: 0.0 }
      },
      transparent: true
    })
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    
    this.program.uniforms.uBorderRadius.value = this.borderRadius
    this.program.uniforms.uPlaneSizes.value = [1, 1]
    
    this.texture = new Texture(this.gl)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = (_) => {
      this.texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
      
      if (this.preserveAspectRatio) {
        const meshSize = Math.max(this.plane.scale.x, this.plane.scale.y);
        this.plane.scale.set(meshSize, meshSize, 1);
        this.program.uniforms.uPlaneSizes.value = [meshSize, meshSize]
      }
    }
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font // Fixed parameter name from fontFamily to font
    })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    const isMobile = this.screen.width <= 768
    const effectiveBend = isMobile ? 0.0 : this.bend

    if (effectiveBend === 0.0) {
      this.plane.position.y = 0.0
      this.plane.rotation.z = 0.0
    } else {
      const B_abs = Math.abs(effectiveBend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (effectiveBend > 0.0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
  onResize({ screen, viewport, scrollCurrent = 0 } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    
    this.scale = this.screen.height / 1500
    const isMobile = this.screen.width <= 768
    this.program.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0
    
    if (isMobile) {
      // Mobile-optimized sizing: width around 180px, height around 135px relative to container
      this.plane.scale.x = (this.viewport.width * 180) / this.screen.width
      this.plane.scale.y = (this.viewport.height * 135) / this.screen.height
      this.padding = 0.8
    } else {
      // Landscape rectangular layout sizing
      this.plane.scale.x = (this.viewport.width * (850 * this.scale)) / this.screen.width
      this.plane.scale.y = (this.viewport.height * (600 * this.scale)) / this.screen.height
      this.padding = 1.8
    }
    
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
    
    // Calculate correct extra wrapping offset based on current scroll
    this.extra = Math.floor((this.x - scrollCurrent + this.widthTotal / 2) / this.widthTotal) * this.widthTotal
  }
}

class App {
  constructor(container, { items, bend, textColor = "#ffffff", borderRadius = 0, font = "bold 30px DM Sans", showTitles = true } = {}) {
    document.documentElement.classList.remove('no-js')
    this.container = container
    this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 }
    this.autoSpeed = 0.02
    this.currentSpeed = this.autoSpeed
    this.dragHistory = []
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font, showTitles)
    this.update()
    this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene() {
    this.scene = new Transform()
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }
  createMedias(items, bend = 1, textColor, borderRadius, font, showTitles = true) {
    const { gl, scene, screen, viewport } = this
    const geometry = this.planeGeometry
 
    let galleryItems = items && items.length ? items : []
    const originalLength = galleryItems.length
    if (originalLength > 0) {
      const isMobile = this.screen.width <= 768
      const scale = this.screen.height / 1500
      
      const cardWidth = isMobile 
        ? (this.viewport.width * 180) / this.screen.width 
        : (this.viewport.width * (850 * scale)) / this.screen.width
      
      const padding = isMobile ? 0.8 : 1.8
      const itemWidth = cardWidth + padding
      
      // We want the total width to cover at least 2.5x the viewport width to prevent gaps
      const targetWidth = this.viewport.width * 2.5
      const targetLength = Math.ceil(targetWidth / itemWidth)
      
      if (galleryItems.length < targetLength) {
        const multiplier = Math.ceil(targetLength / originalLength)
        galleryItems = []
        for (let i = 0; i < multiplier; i++) {
          galleryItems.push(...items)
        }
      }
    }
    this.items = galleryItems
 
    this.medias = galleryItems.map((item, index) => {
      const media = new Media({
        geometry,
        gl,
        image: item.image,
        index,
        length: galleryItems.length,
        renderer: this.renderer,
        scene,
        screen,
        text: item.text,
        viewport,
        bend,
        textColor,
        borderRadius,
        font,
        preserveAspectRatio: false,
        showTitles
      })
      return media
    })
  }
  onTouchDown(e) {
    this.isDown = true
    this.isDragging = false
    this.isSwipeRejected = false
    this.scroll.position = this.scroll.current
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    this.start = clientX
    this.startY = clientY
    this.dragHistory = [{ time: Date.now(), target: this.scroll.target }]
  }
  onTouchMove(e) {
    if (!this.isDown || this.isSwipeRejected) return
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    if (e.touches) {
      if (!this.isDragging && !this.isSwipeRejected) {
        const dx = Math.abs(clientX - this.start)
        const dy = Math.abs(clientY - this.startY)
        
        // 5px threshold to determine intent
        if (dx > 5 || dy > 5) {
          if (dx > dy) {
            this.isDragging = true
          } else {
            this.isSwipeRejected = true
            this.isDown = false
            return
          }
        } else {
          return
        }
      }
    } else {
      this.isDragging = true
    }
    
    const distance = (this.start - clientX) * 0.05
    this.scroll.target = this.scroll.position + distance
    
    this.dragHistory.push({ time: Date.now(), target: this.scroll.target })
    const now = Date.now()
    this.dragHistory = this.dragHistory.filter(item => now - item.time < 150)
    
    if (e.cancelable && this.isDragging) {
      e.preventDefault()
    }
  }
  onTouchUp() {
    if (!this.isDown) return
    this.isDown = false
    
    if (this.dragHistory && this.dragHistory.length > 1) {
      const first = this.dragHistory[0]
      const last = this.dragHistory[this.dragHistory.length - 1]
      const dt = last.time - first.time
      const dx = last.target - first.target
      
      if (dt > 10) {
        this.currentSpeed = (dx / dt) * 16.67
        this.currentSpeed = Math.max(-0.3, Math.min(0.3, this.currentSpeed))
      } else {
        this.currentSpeed = this.autoSpeed
      }
    } else {
      this.currentSpeed = this.autoSpeed
    }
    
    this.dragHistory = []
  }
  onResize() {
    if (!this.container) return
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport, scrollCurrent: this.scroll.current })
      )
    }
  }
  update() {
    if (!this.isDown) {
      this.currentSpeed = lerp(this.currentSpeed, this.autoSpeed, 0.05)
      this.scroll.target += this.currentSpeed
    }
    
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    )
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction))
    }
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    window.addEventListener('resize', this.boundOnResize)
    
    if (this.container) {
      this.container.addEventListener('mousedown', this.boundOnTouchDown)
      window.addEventListener('mousemove', this.boundOnTouchMove)
      window.addEventListener('mouseup', this.boundOnTouchUp)
      
      this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true })
      this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: false })
      window.addEventListener('touchend', this.boundOnTouchUp)
    }
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    
    if (this.container) {
      this.container.removeEventListener('mousedown', this.boundOnTouchDown)
      this.container.removeEventListener('touchstart', this.boundOnTouchDown)
      this.container.removeEventListener('touchmove', this.boundOnTouchMove)
    }
    
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#163A2D",
  borderRadius = 0.05,
  font = "bold 24px Georgia",
  showTitles = true
}) {
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, showTitles })
    return () => {
      app.destroy()
    }
  }, [items, bend, textColor, borderRadius, font, showTitles])

  return (
    <div className='circular-gallery-wrapper'>
      <div className='circular-gallery' ref={containerRef} />
    </div>
  )
}
