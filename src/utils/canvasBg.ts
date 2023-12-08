/**
 *3D海洋效应与 Canvas2D
 * 您可以更改注释 "效果属性" 下的属性
 */

// Init Context
export const canvasBg = () => {
  const c = document.createElement('canvas').getContext('2d')
  const cDom = document.body.appendChild(document.createElement('canvas'))

  console.log(cDom.classList.add('c-login-bg'))
  const postctx = cDom.getContext('2d')
  if (!c || !postctx) return
  const canvas = c.canvas
  const vertices: any[] = []

  // Effect Properties
  const vertexCount = 7000
  const vertexSize = 3
  const oceanWidth = 204
  const oceanHeight = -80
  const gridSize = 32
  const waveSize = 16
  const perspective = 100

  // Common variables
  const depth = (vertexCount / oceanWidth) * gridSize
  let frame = 0
  const { sin, cos, PI } = Math

  // Render loop
  const loop = () => {
    const canvasBg = document.querySelector('.c-login-bg')
    if (!canvasBg) return
    const rad = (sin(frame / 100) * PI) / 20
    const rad2 = (sin(frame / 50) * PI) / 10
    frame++
    if (
      postctx.canvas.width !== postctx.canvas.offsetWidth ||
      postctx.canvas.height !== postctx.canvas.offsetHeight
    ) {
      postctx.canvas.width = canvas.width = postctx.canvas.offsetWidth
      postctx.canvas.height = canvas.height = postctx.canvas.offsetHeight
    }

    c.fillStyle = `hsl(200deg, 100%, 2%)`
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.save()
    c.translate(canvas.width / 2, canvas.height / 2)

    c.beginPath()
    vertices.forEach((vertex, i) => {
      let x = vertex[0] - (frame % (gridSize * 2))
      let z = vertex[2] - ((frame * 2) % gridSize) + (i % 2 === 0 ? gridSize / 2 : 0)
      const wave =
        cos(frame / 45 + x / 50) - sin(frame / 20 + z / 50) + sin(frame / 30 + (z * x) / 10000)
      let y = vertex[1] + wave * waveSize
      const a = Math.max(0, 1 - Math.sqrt(x ** 2 + z ** 2) / depth)
      let tx, ty, tz

      y -= oceanHeight

      // Transformation variables
      tx = x
      ty = y
      tz = z

      // Rotation Y
      tx = x * cos(rad) + z * sin(rad)
      tz = -x * sin(rad) + z * cos(rad)

      x = tx
      y = ty
      z = tz

      // Rotation Z
      tx = x * cos(rad) - y * sin(rad)
      ty = x * sin(rad) + y * cos(rad)

      x = tx
      y = ty
      z = tz

      // Rotation X

      ty = y * cos(rad2) - z * sin(rad2)
      tz = y * sin(rad2) + z * cos(rad2)

      x = tx
      y = ty
      z = tz

      x /= z / perspective
      y /= z / perspective

      if (a < 0.01) return
      if (z < 0) return

      c.globalAlpha = a
      c.fillStyle = `hsl(${180 + wave * 20}deg, 100%, 50%)`
      c.fillRect(x - (a * vertexSize) / 2, y - (a * vertexSize) / 2, a * vertexSize, a * vertexSize)
      c.globalAlpha = 1
    })
    c.restore()

    // Post-processing
    postctx.drawImage(canvas, 0, 0)

    postctx.globalCompositeOperation = 'screen'
    postctx.filter = 'blur(16px)'
    postctx.drawImage(canvas, 0, 0)
    postctx.filter = 'blur(0)'
    postctx.globalCompositeOperation = 'source-over'

    requestAnimationFrame(loop)
  }

  // Generating dots
  for (let i = 0; i < vertexCount; i++) {
    const x = i % oceanWidth
    const y = 0
    const z = (i / oceanWidth) >> 0
    const offset = oceanWidth / 2
    vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize])
  }

  loop()
}

export const unCanvasBg = () => {
  const canvasBg = document.querySelector('.c-login-bg')
  const parent = document.body
  if (parent && canvasBg) {
    parent.removeChild(canvasBg)
  }
}
