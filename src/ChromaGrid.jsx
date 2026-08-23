import { useRef } from 'react'

export default function ChromaGrid({items=[],radius=300,damping=.45,fadeOut=.6,ease='power3.out'}){
  const gridRef=useRef(null)
  const move=event=>{
    const grid=gridRef.current
    if(!grid)return
    const box=grid.getBoundingClientRect()
    grid.style.setProperty('--pointer-x',`${event.clientX-box.left}px`)
    grid.style.setProperty('--pointer-y',`${event.clientY-box.top}px`)
    grid.style.setProperty('--pointer-opacity','1')
  }
  const leave=()=>gridRef.current?.style.setProperty('--pointer-opacity','0')
  return <div className="chroma-grid" ref={gridRef} onPointerMove={move} onPointerLeave={leave} style={{'--radius':`${radius}px`,'--damping':damping,'--fade-out':fadeOut,'--ease':ease}}>
    {items.map((item,index)=><article className="chroma-card" key={item.title} style={{'--card-border':item.borderColor,'--card-gradient':item.gradient}}>
      <div className="chroma-card-top"><span>{String(index+1).padStart(2,'0')}</span><small>{item.handle}</small></div>
      <div className="chroma-card-icon">{item.icon}</div>
      <h3>{item.title}</h3>
      <p>{item.subtitle}</p>
    </article>)}
  </div>
}
