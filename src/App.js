import { useState } from 'react';
import './App.css';
import { tailwindToCss, originClasses } from "./utils"
import run from "./utils/framework"
import { vue, jsx, classnames } from "./constant"



function App() {
  const [compileWay, setCompileWay] = useState("inline")
  const [framework, setFramework] = useState("jsx")
  const [inputValue, setInputValue] = useState(jsx)
  const [outputValue, setOutputValue] = useState(run(jsx))
  const [cssValue, setCssValue] = useState("")
  const [originalClasses, setOriginalClasses] = useState("")

  function startCompile(contents, fw, way) {
    if (fw == "classnames") {
      setOutputValue(tailwindToCss(contents))
      setOriginalClasses(Array.from(originClasses).join(","))
    } else if (way == "native") {
      const { content, css } = run(contents, fw, way)
      setCssValue(css)
      setOutputValue(content)
    }
    else {
      setOutputValue(run(contents, fw, way))
    }
  }

  const chooseFramework = (e) => {
    const fw = e.target.value;

    if (fw == 'classnames') {
      startCompile(classnames, fw, compileWay)
      setInputValue(classnames)

    } else if (fw == "vue") {
      startCompile(vue, fw, compileWay == 'cssinjs' ? 'inline' : compileWay)
      setInputValue(vue)
      setCompileWay(compileWay == 'cssinjs' ? 'inline' : compileWay)

    } else {
      startCompile(jsx, fw, compileWay)
      setInputValue(jsx)
    }
    setFramework(fw)
  }

  const chooseCompileWay = (e) => {
    const way = e.target.value
    startCompile(inputValue, framework, way)
    setCompileWay(way)
  }

  const handleInput = e => {
    setInputValue(e.target.value)
    startCompile(e.target.value, framework, compileWay)
  }

  const clear = () => {
    setInputValue("")
    startCompile("", framework, compileWay)
  }

  return (
    <div>
      <div className='flex jc tit my-20'>Format content via prettier and batch convert in projects: <a href='https://github.com/PuddingJoker/tailwindcss2css' className='ml-10' target='_blank'>click me</a></div>
      <div className='flex jc pt-10'>
        <span>Framework selection:</span>
        <select className='ml-10' onChange={chooseFramework}>
          <option value="jsx">jsx</option>
          <option value="vue">vue</option>
          <option value="classnames">classnames</option>
        </select>

        {
          framework !== "classnames" && <div>
            <span className='ml-30'>Compile Method:</span>
            <select className='ml-10' onChange={chooseCompileWay}>
              <option value="inline">inline</option>
              <option value="native">native</option>
              {framework == "jsx" && <option value="cssinjs">cssinjs(linaria)</option>}
            </select>
          </div>
        }
      </div>

      <div className='flex mt-30 jc'>
        <div>
          <div className='mb-10 tit'>
            <span>put your code here</span>
            <button className='ml-10 btn' onClick={clear}> clear contents</button>
          </div>

          <textarea className='p-10' value={inputValue} onChange={handleInput}></textarea>
        </div>

        {(compileWay == "native" && framework == "jsx") &&
          <div className='ml-30'>
            <div className='mb-10 tit'>native css content </div>
            <textarea className='p-10' value={cssValue} onChange={() => { }}></textarea>
          </div>}

        {framework == "classnames" &&
          <div className='ml-30'>
            <div className='mb-10 tit'>original classnames</div>
            <textarea className='p-10' value={originalClasses} onChange={() => { }}></textarea>
          </div>}

        <div className='ml-30'>
          <div className='mb-10 tit'>final compilation result</div>
          <textarea className='p-10' value={outputValue} onChange={() => { }}></textarea>
        </div>

      </div>
    </div>
  );
}

export default App;
