import { useEffect, useState } from 'react';
import './App.css';
import { tailwindToCss, originClasses } from "./utils"
import run from "./utils/framework"
import { vue, jsx, classnames } from "./constant"



function App() {
  const [compileWay, setCompileWay] = useState("inline")
  const [framework, setFramework] = useState("classnames")
  const [inputValue, setInputValue] = useState(classnames)
  const [outputValue, setOutputValue] = useState()
  const [cssValue, setCssValue] = useState("")
  const [originalClasses, setOriginalClasses] = useState("")

  function startCompile() {
    if (framework == "classnames") {
      setOutputValue(tailwindToCss(inputValue))
      inputValue && setOriginalClasses(Array.from(originClasses).join(","))
    }
    else if (compileWay == "native") {
      const { content, css } = run(inputValue, framework, compileWay)
      setCssValue(css)
      setOutputValue(content)
    }
    else {
      setOutputValue(run(inputValue, framework, compileWay))
    }
  }

  useEffect(() => {
    startCompile()
  }, [inputValue, framework, compileWay])

  const chooseFramework = (e) => {
    const fw = e.target.value;

    if (fw == 'classnames') {
      setInputValue(classnames)
    } else if (fw == "vue") {
      setInputValue(vue)
      setCompileWay(compileWay == 'cssinjs' ? 'inline' : compileWay)
    } else {
      setInputValue(jsx)
    }

    setFramework(fw)
  }

  const clear = () => {
    setInputValue("")
    setCssValue("")
    setOriginalClasses("")
    setOutputValue("")
  }

  return (
    <div>
      <div className='flex jc tit my-20'>Wanna perform bulk conversion and formatting of content in Vue or React? <a href='https://github.com/PuddingJoker/tailwindcss2css' className='ml-10' target='_blank'>click me</a></div>
      <div className='flex jc pt-10'>
        <span>Framework selection:</span>
        <select className='ml-10' onChange={chooseFramework} defaultValue='classnames'>
          <option value="jsx">jsx</option>
          <option value="vue">vue</option>
          <option value="classnames">classnames</option>
        </select>

        {
          framework !== "classnames" && <div>
            <span className='ml-30'>Compile Method:</span>
            <select className='ml-10' onChange={e => setCompileWay(e.target.value)}>
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

          <textarea className='p-10' value={inputValue} onChange={e => setInputValue(e.target.value)}></textarea>
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
    </div >
  );
}

export default App;
