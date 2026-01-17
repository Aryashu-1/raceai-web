"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Point {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  col: number
  row: number
}

export default function UnifiedInteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouse = useRef({ x: 0, y: 0 })
  const points = useRef<Point[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPoints()
    }

    const gap = 50
    const speed = 0.5 // Speed of the moving grid

    const initPoints = () => {
      points.current = []
      // Add extra rows/cols for smooth scrolling buffer
      const cols = Math.ceil(canvas.width / gap) + 2 
      const rows = Math.ceil(canvas.height / gap) + 2

      for (let i = 0; i <= cols; i++) {
        for (let j = -1; j <= rows; j++) { // Start from -1 to handle incoming top row
          const x = i * gap
          const y = j * gap
          points.current.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            col: i,
            row: j,
          })
        }
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const isDark = theme === "dark"
      const primaryColor = isDark ? "59, 130, 246" : "0, 82, 204" // Blue
      const baseAlpha = isDark ? 0.15 : 0.1
      
      // Update Physics & Grid Movement
      points.current.forEach((point) => {
        // 1. Move the Origin (Diagonal: Top-Left to Bottom-Right)
        point.originX += speed * 0.5 // Add X movement
        point.originY += speed * 0.5 // Y movement maintained
        
        // Wrap around logic - Check both X and Y
        const gridHeight = (Math.ceil(canvas.height / gap) + 2) * gap
        const gridWidth = (Math.ceil(canvas.width / gap) + 2) * gap

        if (point.originY > canvas.height + gap) {
            point.originY -= gridHeight
            point.y -= gridHeight 
        }
        if (point.originX > canvas.width + gap) {
            point.originX -= gridWidth
            point.x -= gridWidth
        }

        // 2. Mouse Interaction (Rubber Band)
        const dx = mouse.current.x - point.x
        const dy = mouse.current.y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 200

        if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist
            const angle = Math.atan2(dy, dx)
            const push = -force * 2 // Push away strength
            
            point.vx += Math.cos(angle) * push
            point.vy += Math.sin(angle) * push
        }

        // 3. Spring back to Moving Origin
        const spring = 0.05
        const friction = 0.90
        
        point.vx += (point.originX - point.x) * spring
        point.vy += (point.originY - point.y) * spring
        
        point.vx *= friction
        point.vy *= friction

        point.x += point.vx
        point.y += point.vy
      })

      // Draw Grid Lines connecting the points
      ctx.strokeStyle = `rgba(${primaryColor}, ${baseAlpha})`
      ctx.lineWidth = 1

      // We need to draw horizontal and vertical lines based on grid connectivity.
      // Since 'points' is a flat array, we can use a map or index math. 
      // Simpler: Just map by col/row index.
      const gridMap = new Map<string, Point>()
      points.current.forEach(p => gridMap.set(`${p.col},${p.row}`, p))

      points.current.forEach(p => {
        // Draw Right Neighbor Line
        // Since rows shift due to wrap around, we rely on the stable 'col' and 'row' indices.
        // Wait, if originY wraps, the 'row' index logic gets messy if we don't update 'row'.
        // Actually, simple proximity drawing is better for "organic" rubber band grids, 
        // but for a strict grid, we want structural integrity.
        
        // Let's rely on array order? The array order is constant: col loops outer, row loops inner.
        // But wrap-around breaks visual order if we aren't careful.
        
        // Alternative: Re-sort or purely visual connections?
        // Let's try drawing lines to neighbors: (col+1, row) and (col, row+1)
        // We need to find the point that *represents* that neighbor.
        // Since we wrap originY, the point objects persist.
      })

      // Better Line Drawing:
      const cols = Math.ceil(canvas.width / gap) + 2
      const rows = Math.ceil(canvas.height / gap) + 2
      
      // Horizontal Lines
      for (let j = -1; j <= rows; j++) {
         ctx.beginPath()
         let started = false;
         for (let i = 0; i <= cols; i++) {
             const p = points.current.find(pt => pt.col === i && pt.row === j)
             // This find is O(N^2) effectively inside the loops. Bad for perf.
             // Optimization: The points array is generated in order. 
             // index = i * (rows + 2) + (j + 1) roughly.
         }
      }

      // Optimized Draw:
      // We know the structure is Collumn-Major.
      // Index = i * (rowCount) + j_offset
      // Let's just iterate the points array and draw line to "down" and "right" neighbors if they exist.
      
      const numRows = Math.ceil(canvas.height / gap) + 3 // Buffer
      const numCols = Math.ceil(canvas.width / gap) + 2
      
      // Actually, since we wrap logic resets originY, the 'row' property should logically wrap too?
      // No, let's just draw lines based on index math if the array is stable.
      // BUT, because we want the "bottom" row to connect to the "top" row for infinite scroll? 
      // No, infinite scroll usually means new lines appear.
      // My logic: "point.originY -= gridHeight". This moves the point to top physically.
      // So it IS the same point.
      
      // Connection strategy:
      // Store points in a 2D array for fast access?
      
      // Let's rebuild the `grid` accessor each frame or just trust indices?
      // The array is never reordered.
      // points[i] corresponds to a specific col/row.
      // i goes 0..totalPoints.
      // Structure: Col 0 (Row -1..N), Col 1 (Row -1..N)...
      
      // Correct stride calculation matches initialization:
      // rows loop was: j = -1 to rows. Count = rows + 2.
      // initial 'rows' var was Math.ceil(h/gap) + 2.
      // So stride is rows + 1? No.
      // Let's recalculate explicitly.
      
      const gridRows = Math.ceil(canvas.height / gap) + 2
      const stride = gridRows + 2 // j goes from -1 to gridRows. (-1, 0, ..., gridRows) -> gridRows + 2 items.

      for (let i = 0; i < points.current.length; i++) {
          const p = points.current[i]
          
          // Connect to point below (same col, next row)
          // i + 1. Check if not at bottom of column.
          // Since we are iterating consecutively, just check if (i+1) is not start of new col.
          // Start of new col is when (i+1) % stride == 0.
          if ((i + 1) % stride !== 0 && (i + 1) < points.current.length) {
             const nextP = points.current[i+1]
             // Don't draw if wrapping a huge vertical distance (visual artifact check)
             if (Math.abs(nextP.y - p.y) < gap * 3) {
                 ctx.beginPath()
                 ctx.moveTo(p.x, p.y)
                 ctx.lineTo(nextP.x, nextP.y)
                 ctx.stroke()
             }
          }

          // Connect to point to right (same row, next col)
          // Index + stride. Check if valid.
          if (i + stride < points.current.length) {
              const rightP = points.current[i + stride]
              if (Math.abs(rightP.x - p.x) < gap * 3) {
                  ctx.beginPath()
                  ctx.moveTo(p.x, p.y)
                  ctx.lineTo(rightP.x, rightP.y)
                  ctx.stroke()
              }
          }
      }

      // Draw Dots at intersections (Subtler)
      points.current.forEach(p => {
        // Use very low opacity for subtlety
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, 0.15)` : `rgba(0, 0, 0, 0.1)`
        ctx.beginPath()
        // Smaller radius (1.5 -> 1.0)
        ctx.arc(p.x, p.y, 1.0, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", (e) => {
        mouse.current.x = e.clientX
        mouse.current.y = e.clientY
    })

    const frame = requestAnimationFrame(animate)

    return () => {
        window.removeEventListener("resize", resize)
        cancelAnimationFrame(frame)
    }
  }, [theme])

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
