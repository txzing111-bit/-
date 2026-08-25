import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import heroVideo from '../封面背景/时间循环动画生成1.mp4'
import phoneUiComposite from './assets/phone-ui-composite-full-hand-transparent.png'
import evolutionManual from './assets/evolution-manual-ai.png'
import evolutionPrompt from './assets/evolution-prompt.png'
import evolutionKnowledge from './assets/evolution-knowledge.png'
import evolutionSkill from './assets/evolution-skill.png'
import transferMontage from './assets/transfer-output-montage.png'
import promptCaseUrl from '../素材/prompt资料包/worldcup_ai_design_chat_case.html?url'
import knowledgeCaseUrl from '../素材/gpts资料包/chebangzhu_brand_image_engine_case_v4.html?url'
import skillCaseUrl from '../素材/seklli/codex_theme_background_workflow_case.html?url'

const sections = [
  ['why','为什么工作流化'],['cost','重复的成本'],['evolution','工作方式演进'],['prompt','从 Prompt 到记忆'],
  ['skill','Skill 如何运行'],['system','沉淀设计规则'],['boundary','责任边界'],['efficiency','效率变化'],
  ['judge','如何判断'],['transfer','迁移场景'],['summary','结论']
]

const evolution = [
  {n:'01',tag:'MANUAL + AI',title:'传统 AI 制作',desc:'每次从零开始组织和判断',meta:'个人操作',score:'随机生成',image:evolutionManual},
  {n:'02',tag:'INSTRUCTION',title:'Prompt',desc:'把当前需求准确说清楚',meta:'表达提效',score:'单次优化',image:evolutionPrompt},
  {n:'03',tag:'MEMORY',title:'GPTs＋知识库',desc:'让 AI 长期记住设计规则',meta:'知识共享',score:'规则复用',image:evolutionKnowledge},
  {n:'04',tag:'EXECUTION',title:'Skill 工作流',desc:'让 AI 按固定流程执行规则',meta:'团队能力',score:'稳定交付',image:evolutionSkill}
]

const workflow = ['输入主题','判断类型','加载规则','调用资产','组合指令','生成图片','部分自动检查','人工验收']
const efficiency = [
  {name:'传统 AI 制作',hours:40,label:'40 小时',rate:'基准'},
  {name:'Prompt',hours:12,label:'12 小时',rate:'≈ 3.3×'},
  {name:'GPTs＋知识库',hours:1.5,label:'1—2 小时',rate:'≈ 20—40×'},
  {name:'Skill 工作流',hours:.5,label:'0.5 小时',rate:'≈ 80×'}
]
const layers = [
  ['01','主体规则','车辆型号 · 比例 · 工业结构 · 视角 · 材质'],
  ['02','版式与品牌规则','车辆位置 · 页面留白 · 品牌色彩 · 视觉气质'],
  ['03','主题变量','季节 · 节日 · 赛事 · 场景 · 光影 · 环境元素'],
  ['04','质量标准','车辆失真 · 构图偏移 · 主题准确 · 上线标准']
]
const transferCases = [
  ['运营 Banner','覆盖阶段运营节点','0% 0%'],
  ['节日启动页','主题氛围快速切换','50% 0%'],
  ['车型主题海报','强化产品主视觉表达','100% 0%'],
  ['会员活动视觉','延续品牌气质与层级','0% 100%'],
  ['社交媒体图片','适配轻量传播画面','50% 100%'],
  ['门店营销物料','统一线上线下展示标准','100% 100%']
]

function Reveal({children, className=''}) { return <div className={`reveal ${className}`}>{children}</div> }
function SectionHead({eyebrow,title,desc}) { return <Reveal className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{desc&&<p>{desc}</p>}</Reveal> }
function Placeholder({title,caption}) { return <div className="placeholder"><div className="placeholder-grid"/><span className="cross">＋</span><strong>{title}</strong><small>{caption} · 后续替换真实素材</small></div> }
function CaseCover({src,tag,title,caption}) { return <a className="case-cover" href={src} target="_blank" rel="noreferrer" title={`打开：${title}`}><div className="case-cover-bar"><span>{tag}</span><b>打开完整案例 ↗</b></div><div className="case-cover-frame"><iframe src={src} title={`${title}封面预览`} loading="lazy" tabIndex="-1"/></div><span className="case-cover-caption"><strong>{title}</strong><span>{caption}</span></span></a> }
function CostFeedback(){
  const ref=useRef(null)
  useEffect(()=>{
    const draw=()=>{
      const host=ref.current,cycle=host?.closest('.cost-cycle')
      const steps=cycle?.querySelectorAll('.cost-cycle-steps > div'),path=host?.querySelector('svg > path[data-feedback-path]')
      if(!host||!steps||steps.length<7||!path)return
      const box=host.getBoundingClientRect(),from=steps[6].getBoundingClientRect(),to=steps[1].getBoundingClientRect()
      const fromX=Math.round(from.left+from.width/2-box.left),toX=Math.round(to.left+to.width/2-box.left),bottom=Math.max(24,host.clientHeight-34)
      path.closest('svg').setAttribute('viewBox',`0 0 ${host.clientWidth} ${host.clientHeight}`)
      path.setAttribute('d',`M ${fromX} 2 V ${bottom} H ${toX} V 2`)
    }
    draw();const observer=new ResizeObserver(draw);observer.observe(ref.current);window.addEventListener('resize',draw)
    return()=>{observer.disconnect();window.removeEventListener('resize',draw)}
  },[])
  return <div className="cost-cycle-feedback" ref={ref}><svg preserveAspectRatio="none" aria-hidden="true"><defs><marker id="feedback-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs><path data-feedback-path="true" markerEnd="url(#feedback-arrow)"/></svg><div><b>验收未通过</b><span>从「找参考」重新调整方向，再进入下一轮生成</span><em>RETURN TO STEP 02</em></div></div>
}

function App(){
  const [active,setActive]=useState('why'); const [progress,setProgress]=useState(0); const [menu,setMenu]=useState(false)
  useEffect(()=>{
    const reveals=[...document.querySelectorAll('.reveal')]
    const ro=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12})
    reveals.forEach(x=>ro.observe(x))
    const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&setActive(e.target.id)),{rootMargin:'-40% 0px -50%'})
    sections.forEach(([id])=>{const el=document.getElementById(id);if(el)obs.observe(el)})
    const scroll=()=>{const h=document.documentElement;setProgress(100*h.scrollTop/(h.scrollHeight-h.clientHeight))}
    addEventListener('scroll',scroll,{passive:true}); scroll()
    const pages=[...document.querySelectorAll('main > section')]
    let wheelLocked=false
    const wheel=(event)=>{
      if(Math.abs(event.deltaY)<18||wheelLocked||event.ctrlKey)return
      event.preventDefault()
      const current=pages.reduce((best,page,index)=>Math.abs(page.getBoundingClientRect().top)<Math.abs(pages[best].getBoundingClientRect().top)?index:best,0)
      const target=Math.max(0,Math.min(pages.length-1,current+(event.deltaY>0?1:-1)))
      if(target===current)return
      wheelLocked=true
      pages[target].scrollIntoView({behavior:'smooth',block:'start'})
      window.setTimeout(()=>{wheelLocked=false},900)
    }
    addEventListener('wheel',wheel,{passive:false})
    return()=>{ro.disconnect();obs.disconnect();removeEventListener('scroll',scroll);removeEventListener('wheel',wheel)}
  },[])
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const root=document.documentElement
    const hero=document.querySelector('.hero')
    root.classList.add('motion-ready')
    const frame=requestAnimationFrame(()=>hero?.classList.add('is-open'))
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('motion-entered');observer.unobserve(entry.target)}
    }),{threshold:.24,rootMargin:'0px 0px -8% 0px'})
    document.querySelectorAll('main > section:not(.hero)').forEach(section=>observer.observe(section))
    return()=>{cancelAnimationFrame(frame);observer.disconnect();root.classList.remove('motion-ready')}
  },[])
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)}
  return <>
    <div className="progress" style={{width:`${progress}%`}} />
    <header className="nav"><a className="brand" href="#top"><i/> AI / DESIGN SYSTEM</a><nav className={menu?'open':''}>{sections.slice(0,6).map(([id,t])=><button key={id} onClick={()=>go(id)}>{t}</button>)}</nav><button className="menu" onClick={()=>setMenu(!menu)}>{menu?'×':'目录'}</button><button className="nav-cta" onClick={()=>go('summary')}>查看结论 ↗</button></header>
    <aside className="rail"><span>{String(sections.findIndex(s=>s[0]===active)+1).padStart(2,'0')}</span><div>{sections.map(([id,t])=><button aria-label={t} className={active===id?'on':''} onClick={()=>go(id)} key={id}/>)}</div><small>{sections.find(s=>s[0]===active)?.[1]}</small></aside>

    <main>
      <section id="top" className="hero">
        <div className="hero-bg"><video autoPlay muted loop playsInline preload="auto"><source src={heroVideo} type="video/mp4" /></video></div><div className="hero-lines"/><div className="hero-opening" aria-hidden="true"><i/><i/><i/></div>
        <div className="hero-content">
          <div className="hero-copy reveal visible"><span className="eyebrow">AI DESIGN WORKFLOW · CASE STUDY 01</span><h1>从重复劳动<br/><span>到稳定交付</span></h1><p>如何用 AI 工作流重构高频设计需求</p><div className="hero-actions"><button onClick={()=>go('why')}>开始阅读 <b>↓</b></button><span>分享人：刘明忠<br/><small>2026.08.19</small></span></div></div>
          <div className="hero-stat"><strong>29</strong><span>个主题视觉<br/><small>同一套规则 · 多组主题参数</small></span></div>
        </div><div className="scroll-cue">SCROLL TO EXPLORE <i/></div>
      </section>

      <section id="why" className="section why">
        <SectionHead eyebrow="01 / THE PATTERN" title={<>为什么高频设计需求<br/><em>值得工作流化？</em></>} desc="小程序首页主题视觉，看似每次不同，背后却共享着同一套生产逻辑。"/>
        <div className="why-v2 reveal">
          <figure className="why-v2-device"><div className="why-v2-glow"/><div className="device-ring"/><img src={phoneUiComposite} alt="手持手机中的小程序汽车首页场景"/></figure>
          <div className="why-v2-analysis">
            <div className="analysis-intro"><span>DEMAND ANATOMY / 需求结构</span><strong>固定产品骨架 ＋ 变化运营主题</strong><p>同一个界面容器，承载不断变化的主题视觉。</p></div>
            <div className="analysis-group fixed-group"><header><span>01</span><div><b>固定不变</b><small>每次交付都必须满足</small></div><em>06 RULES</em></header><div className="analysis-items">{['图片比例','车辆位置','车型结构','页面安全区','品牌气质','验收标准'].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,'0')}</small>{x}</span>)}</div></div>
            <div className="analysis-relation"><span>稳定规则</span><i>＋</i><span>有限变量</span><b>＝</b><strong>值得工作流化</strong></div>
            <div className="analysis-group variable-group"><header><span>02</span><div><b>持续变化</b><small>随运营节点持续更新</small></div><em>05 VARIABLES</em></header><div className="analysis-items">{['主题','场景','色彩','光影','环境元素'].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,'0')}</small>{x}</span>)}</div></div>
            <p className="analysis-note">更新时间取决于运营节点，但同类生产逻辑会持续重复。</p>
          </div>
        </div>
      </section>

      <section id="cost" className="section dark-grid"><SectionHead eyebrow="02 / THE HIDDEN COST" title="真正重复的，从来不只是出图" desc="围绕图片不断发生的理解、判断、检查和修改，才是被低估的重复成本。"/>
        <Reveal className="cost-story">
          <div className="cost-cycle">
            <div className="cost-cycle-head"><span>REWORK CYCLE / 07 STEPS</span></div>
            <div className="cost-cycle-steps">{['理解主题','找参考','写描述','生成','检查车辆','调整构图','修改输出'].map((x,i)=><React.Fragment key={x}><div className={i===3?'generation':''}><small>{String(i+1).padStart(2,'0')}</small><strong>{x}</strong></div>{i<6&&<i>→</i>}</React.Fragment>)}</div>
            <CostFeedback/>
          </div>
          <aside className="cost-insight"><span>THE REAL COST</span><strong>重复的不是<br/><em>生成动作</em></strong><p>而是每次围绕图片重新发生的理解、判断、检查和修改。</p><div><b>07</b><small>个反复发生的环节</small></div></aside>
        </Reveal>
        <div className="cost-impact-grid reveal">{['新人重新理解历史要求','参考与提示词反复组织','车辆与构图失真返工','设计经验依赖个人传递','好结果难以稳定复现'].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,'0')}</b><span>{x}</span><i>+</i></div>)}</div>
      </section>

      <section id="evolution" className="section evolution"><SectionHead eyebrow="03 / EVOLUTION" title="工作方式，如何一步步演进" desc="工具没有替代判断，而是在逐步承接那些可重复、可描述、可验证的执行过程。"/>
        <div className="evo-axis reveal"><span>个人操作</span><i/><b>团队能力</b><small>随机生成</small><i/><b>稳定交付</b></div>
        <div className="evo-grid">{evolution.map((e,i)=><Reveal className={`evo-card c${i}`} key={e.n}><div className="evo-top"><span>{e.n}</span><small>{e.tag}</small></div><div className="evo-visual"><img src={e.image} alt={`${e.title}阶段示意图`}/><b>{i===3?'✓':'+'}</b></div><h3>{e.title}</h3><p>{e.desc}</p><footer><span>{e.meta}</span><span>{e.score}</span></footer></Reveal>)}</div>
        <Reveal className="statement"><p><span>Prompt</span> 解决怎么说清楚，<span>GPTs</span> 解决怎么记住规则，<strong>Skill</strong> 解决怎么稳定执行。</p></Reveal>
      </section>

      <section id="prompt" className="section"><SectionHead eyebrow="04 / FROM WORDS TO MEMORY" title="更懂设计，还不等于稳定执行"/>
        <div className="compare-panels"><Reveal className="stage-panel"><span className="stage-num">01</span><div><small>PROMPT / INSTRUCTION</small><h3>把这一次，说清楚</h3><ul><li>快速探索主题方向</li><li>提高单次生成效率</li><li className="muted">依赖个人表达</li><li className="muted">规则散落在对话中</li></ul></div><CaseCover src={promptCaseUrl} tag="FIG. 01" title="世界杯主题视觉 · Prompt 对话案例" caption="从一次对话开始，反复校准主题、构图与表达。"/></Reveal><Reveal className="stage-panel accent"><span className="stage-num">02</span><div><small>GPTs / KNOWLEDGE</small><h3>让规则，被长期记住</h3><ul><li>保存车辆、构图、色彩规则</li><li>不同主题共享视觉基础</li><li>新人可直接调用历史规范</li><li className="muted">执行仍可能遗漏或漂移</li></ul></div><CaseCover src={knowledgeCaseUrl} tag="FIG. 02" title="车帮主 Image Engine · GPTs 配置案例" caption="将 Instructions 与 Knowledge 拆成可复用的设计规则。"/></Reveal></div>
      </section>

      <section id="skill" className="section skill"><SectionHead eyebrow="05 / THE WORKFLOW" title="Skill 工作流如何运行" desc="不是更长的 Prompt，而是把理解、生成、检查和修改组织成固定流程。"/>
        <div className="flow-labels"><span>INPUT / 输入</span><span>EXECUTION / 执行</span><span>OUTPUT / 输出</span></div><Reveal className="workflow">{workflow.map((x,i)=><React.Fragment key={x}><div className={i===6?'check':''}><small>{String(i+1).padStart(2,'0')}</small><i>{i===6?'◇':i===7?'✓':'+'}</i><strong>{x}</strong>{i===6&&<span>失败 ↩ 重新处理</span>}</div>{i<workflow.length-1&&<b>→</b>}</React.Fragment>)}</Reveal>
        <div className="flow-notes reveal"><div><b>输入</b><p>主题类型 / 车辆参考 / 场景要求 / 输出尺寸 / 特殊限制</p></div><div><b>执行</b><p>调用规则与资产 / 组织指令 / 生成 / 检查 / 重新处理</p></div><div><b>输出</b><p>符合基础规范 / 可继续修改 / 进入人工验收 / 形成交付</p></div></div><CaseCover src={skillCaseUrl} tag="FIG. 03" title="设计主题背景生成工作流 · Skill 配置案例" caption="查看完整对话、配置规则、文件修改记录与最终主题成果。"/>
      </section>

      <section id="system" className="section"><SectionHead eyebrow="06 / THE SYSTEM" title="工作流里，沉淀了什么？" desc="将隐性的设计经验拆成可读取、可执行、可检查的四层结构。"/>
        <div className="layers">{layers.map((l,i)=><Reveal className="layer" key={l[0]}><small>{l[0]}</small><h3>{l[1]}</h3><p>{l[2]}</p><span style={{width:`${100-i*11}%`}}/></Reveal>)}</div><Reveal className="quote">把“我觉得不对”<br/>转化为“<em>具体哪里</em>不符合标准”。</Reveal>
      </section>

      <section id="boundary" className="section boundary"><SectionHead eyebrow="07 / HUMAN × AI" title={<>自动化的是重复执行，<br/><em>不是设计责任。</em></>}/>
        <div className="roles"><Reveal className="role ai"><div className="role-head"><span>AI</span><small>负责高频、明确、可复现的执行</small></div>{['读取主题','调用规则与参考资产','组织生成指令','执行图片生成','检查部分明确问题','根据问题重新处理'].map((x,i)=><p key={x}><b>0{i+1}</b>{x}</p>)}</Reveal><div className="plus">＋</div><Reveal className="role human"><div className="role-head"><span>设计师</span><small>负责标准、语境与最终质量</small></div>{['判断主题表达是否准确','判断品牌气质是否成立','检查车辆和画面细节','完成最终验收','更新和完善规则'].map((x,i)=><p key={x}><b>0{i+1}</b>{x}</p>)}</Reveal></div><div className="collab">AI 执行 <b>＋</b> 部分自动检查 <b>＋</b> 人工最终验收</div>
      </section>

      <section id="efficiency" className="section efficiency"><SectionHead eyebrow="08 / EFFICIENCY" title="从 40 小时，到 0.5 小时" desc="2026 年新春主题 · 单个背景案例的执行耗时对比"/>
        <Reveal className="big-metric"><strong>98.8<sup>%</sup></strong><p>单次执行耗时减少<br/><small>传统方式 → Skill 工作流</small></p></Reveal><div className="bars">{efficiency.map((e,i)=><Reveal className="bar-row" key={e.name}><div><span>{e.name}</span><small>{e.rate}</small></div><div className="bar-track"><i style={{width:`${Math.max(e.hours/40*100,1.25)}%`}}/><b style={{left:`${Math.max(e.hours/40*100,1.25)}%`}}>{e.label}</b></div></Reveal>)}</div>
        <div className="fineprint">人天按每天 8 小时折算 · 数据来自 2026 年新春背景单个案例 · 不代表所有主题的统一平均值 · 前期规则建设与资产整理成本未计入</div><Reveal className="cost-shift"><span>重复支付</span><i>→</i><strong>一次建设 · 持续复用</strong></Reveal>
      </section>

      <section id="judge" className="section judge"><SectionHead eyebrow="09 / DECISION FRAMEWORK" title="一个需求，是否适合工作流化？" desc="自动化不是默认答案。先判断重复价值，再决定建设深度。"/>
        <div className="check-grid">{['是否会反复出现？','是否存在稳定不变的规则？','变化内容能否被参数化？','是否有明确的质量标准？'].map((x,i)=><Reveal key={x}><span>0{i+1}</span><i>✓</i><h3>{x}</h3></Reveal>)}</div><Reveal className="formula"><span>高频重复</span><b>＋</b><span>稳定规则</span><b>＋</b><span>有限变量</span><b>＋</b><span>明确验收</span><strong>＝ 工作流化价值</strong></Reveal><div className="not-fit"><b>不适合工作流化</b><span>只发生一次</span><span>每次目标完全不同</span><span>创意方向高度开放</span><span>建设成本高于重复执行成本</span></div>
      </section>

      <section id="transfer" className="section transfer"><SectionHead eyebrow="10 / TRANSFER" title="沉淀的不是模板，是一种工作方法" desc="同一套固定规则与可变参数，可以迁移到不同的运营场景与视觉交付物。"/>
        <div className="transfer-layout">
          <Reveal className="transfer-method"><span>METHOD / REUSABLE SYSTEM</span><h3>一套方法，<br/><em>生成多种交付。</em></h3><p>不复制某一张成品，而是复用判断框架、视觉规则与验收方式。</p><div className="transfer-ledger"><div><b>01</b><strong>固定规则</strong><small>产品、版式、品牌气质</small></div><div><b>02</b><strong>可变参数</strong><small>主题、场景、光影、色彩</small></div><div><b>03</b><strong>质量验收</strong><small>生成后检查与人工判断</small></div></div><footer><i/> RULES → PARAMETERS → OUTPUT</footer></Reveal>
          <div className="transfer-gallery">{transferCases.map(([title,desc,position],i)=><Reveal className="transfer-tile" key={title}><div className="transfer-tile-image" style={{backgroundImage:`url(${transferMontage})`,backgroundPosition:position}}/><div className="transfer-tile-copy"><span>{String(i+1).padStart(2,'0')}</span><div><b>{title}</b><small>{desc}</small></div><i>↗</i></div></Reveal>)}</div>
        </div>
      </section>

      <section id="summary" className="summary"><span className="eyebrow">11 / CONCLUSION</span><div className="conclusions"><Reveal><small>01</small><h3>识别重复需求</h3><p>找到值得被工作流化的工作。</p></Reveal><Reveal><small>02</small><h3>沉淀设计规则</h3><p>把个人经验转化为结构化知识。</p></Reveal><Reveal><small>03</small><h3>固定执行流程</h3><p>让 AI 从随机生成走向稳定协作。</p></Reveal></div><Reveal className="final-quote">AI 工作流真正自动化的，<br/>不是设计判断，<br/><em>而是围绕设计判断反复发生的执行过程。</em></Reveal><p className="last-line">AI 负责重复执行　/　规则负责约束结果　/　设计师负责定义标准和最终质量</p><div className="end-actions"><button onClick={()=>scrollTo({top:0,behavior:'smooth'})}>返回顶部 ↑</button><a href="mailto:?subject=AI设计工作流交流">交流这个案例 ↗</a></div></section>

      <section className="appendix"><details><summary><span>APPENDIX / 备用内容与答疑</span><b>展开附录 ＋</b></summary><div className="appendix-grid"><div><small>A</small><h3>七份知识文件</h3><p>Layout System · Vehicle System · Theme System · Color System · Brand Visual DNA · Prompt System · Design QA System</p></div><div><small>B</small><h3>设计质量检查清单</h3><p>主体检查 · 构图检查 · 品牌检查 · 主题检查 · 交付检查</p></div><div><small>C</small><h3>29 个主题规模构成</h3><p>新春主题 2 · 世界杯主题 17 · 其他主题 10</p></div></div></details><footer>AI / DESIGN WORKFLOW　© 2026　INTERNAL SHARE</footer></section>
    </main>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
