let btnIdAndVal = [
    [
      'equals', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'add', 'subtract', 'multiply', 'divide', 'decimal', 'clear'
    ],
    [
      '=', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', 'clear'
    ]
  ]
  
  let letBtnObj = []
  
  for (let i = 0; i < btnIdAndVal[0].length; i++) {
      letBtnObj.push({
          id: btnIdAndVal[0][i],
          value: btnIdAndVal[1][i]
      })
  }
  
  class App extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
        equation: [],
        display: [],
        finalDisplay: [],
        history: [
          '-',
          '-',
          '-',
          '-',
          '-'
        ]
      }
      this.clickHandler = this.clickHandler.bind(this)
      this.adder = this.adder.bind(this)
      this.replacer = this.replacer.bind(this)
      this.symbolHandler= this.symbolHandler.bind(this)
      this.displayReplacer = this.displayReplacer.bind(this)
      this.historyLogs = this.historyLogs.bind(this)
    }
  
    adder(btn) {
      this.setState(state => ({
        display: [...(state.display), ...(btn)]
      }))
    }
  
    replacer(btn) {
      this.setState(state => ({
        display: [...btn]
      }))
    }
  
    symbolHandler(btn) {
  
      console.log('symbol handler ran')
      console.log(/[a-z]]/i.test(this.state.equation.join('')))
      if (/[a-z]/i.test(this.state.equation.join(''))) {
        return 
      } else if (this.state.finalDisplay.length !== 0 && typeof (parseInt(this.state.finalDisplay.join(''))) == 'number') {
        this.setState(state => ({
          equation: [...(this.state.finalDisplay)],
          display: [...(btn)],
          finalDisplay: []
        }))
      } else if (btn == '-' && /[-]|[*]|[/]|[+]/.test(this.state.display) && !(/[-]|[*]|[/]|[+]/.test(this.state.equation[this.state.equation.length - 1]))) {
        this.displayReplacer(btn)
      } else if (this.state.display.join('') == '-' && /[-]|[*]|[/]|[+]/.test(this.state.equation[this.state.equation.length - 1]) && btn !== '-') {
        console.log('symbol handler ran 2')
        this.setState(state => ({
          equation: [...(state.equation.splice(0, state.equation.length - 1))],
          display: [...(btn)]
        }))
      } else if (/[-]|[*]|[/]|[+]/.test(this.state.display)) {
        console.log('symbol handler ran 3')
        this.replacer(btn)
      } else if (/[-]|[*]|[/]|[+]/.test(btn)) {
        console.log('symbol handler ran 4')
        this.displayReplacer(btn)
      }
    }
  
    displayReplacer(btn) {
      this.setState(state => ({
        equation: [...(state.equation),...(state.display)],
        display: [...(btn)]
      }))
    }
  
    clickHandler(btn) {
      
      let display = this.state.display
      let equation = this.state.equation
      let fdisplay = this.state.finalDisplay
      
      if (/[0-9]/.test(btn)) {             
        if (fdisplay.length !== 0) {
          this.setState(state => ({
            equation: [],
            display: [...btn],
            finalDisplay: []
          }))
        } else if (/[-]|[*]|[/]|[+]/.test(display)) {
          this.displayReplacer(btn)
        } else if (display[0] == '0' && /[0]/.test(display[display.length - 1]) && (display.join('').indexOf('.') < 0) /* display[display.length - 1] !== 0 */) {
          // Deals with the zero in the start
          console.log('wha?')
          this.replacer(btn)
        } else {
          this.adder(btn)
        }
      }
  // UP: for Numbers, DOWN: for the Decimal
      if (/[.]/.test(btn) && !(display.some(char => {
        return /[.]/.test(char)
      }))) {
  
        if ((!(/[0]/.test(display[0])) && display.length == 0) /**/) {
          console.log('this ran 3')
          this.replacer([0, btn])
        } else if (/[-]|[*]|[/]|[+]/.test(display[display.length - 1])) {
          this.displayReplacer([0, btn])
        } else {
          this.adder(btn)
        }
      }
  // UP: for Decimal, DOWN: for the clear Btn
      if (btn == 'clear') {
        this.setState({
          display: [0],
          equation: [],
          fdisplay: []
        })
      }
  // UP: for Clear Btn, DOWN: for the Minus Btn - ABANDONED
      /*
      if (btn == '-') {
        this.symbolHandler(btn)
      }
      */
  // UP: for Minus Btn, DOWN: for other symbols
      if (/[-]|[*]|[/]|[+]/.test(btn)) {
        if (equation.length == 0) {
          if (display.length == 0) {
            if (btn == '-' && /[a-z]/i.test(equation.join(''))) {
              this.adder(btn)
            }
          } else if ((display.join('') !== '-')){
            console.log('this ran 6')
            this.symbolHandler(btn)
          }
        } else {
          console.log('ran else')
          this.symbolHandler(btn)
        }
      }
      console.log(btn)
      
  // UP: for the symbols, DOWN: for the equal Btn
  
      if (btn == '=') {
        if (/[-]|[*]|[/]|[+]/.test(display)) {
          if (/[-]|[*]|[/]|[+]/.test(equation[equation.length - 1])) {
            let result = equation.splice(0, equation.length - 1)
            console.log(result.join(''))
            console.log(`test ${eval(result.join(''))}`)
            this.historyAdder((eval(result.join(''))))
            this.setState({
              display: [eval(result.join(''))],
              finalDisplay: [eval(result.join(''))],
              equation: []
              
            })
            console.log(`wha ${this.state.display}`)
            
          } else if (/[-]|[*]|[/]|[+]/.test(display.join('')) && display.length !== 0) {
            this.setState({
              display: [eval(equation.join(''))],
              equation: [],
              finalDisplay: [eval(equation.join(''))]
            })
            this.historyAdder([equation])
          } else {
            this.historyAdder([equation, display, '=', eval([...(equation), ...(display)].join(''))])
            this.setState(state => ({
               display: [(eval(equation.concat(display).join('')))],
               equation: [],
               finalDisplay: [(eval(equation.concat(display).join('')))]
           }))
          } 
          
          
        } else {
          this.historyAdder([equation, display, '=', eval([...(equation), ...(display)].join(''))])
          this.setState(state => ({
            display: [(eval(equation.concat(display).join('')))],
            equation: [],
            finalDisplay: [(eval(equation.concat(display).join('')))]
        }))
        
        }
      }
    }
  
    animatePress(elem) {
      let test = (/btnPress/).test(document.getElementById(elem).className)
      if (test) {
        console.log('ran')
        document.getElementById(elem).className = 'item'
        setTimeout(() => {
          document.getElementById(elem).className = 'item btnPress'
        }, 0);
      } else if (!test){
        document.getElementById(elem).className = 'item btnPress'
      } 
    }
  
    historyLogs() {
      let items = []
      for (let i = 0; i < 5; i++) {
        if (i == 0) {
          items.push({hisLogs: this.state.history[i], class: 'hisLog bottom'})
        } else if (i == 4) {
          items.push({hisLogs: this.state.history[i], class: 'hisLog top'})
        } else {
          items.push({hisLogs: this.state.history[i], class: 'hisLog'})
        }
      }
      return items.map(item => <div className={item.class}>{item.hisLogs}</div>)
    }
  
    historyAdder(log) {
      this.setState (state => ({
        history: [log, ...(state.history)]
      }))
    }
  
    render() {
      return (
        <div value='test' src='hehe' id='main' className='calculator'>
            <div className='btns'>
              {letBtnObj.map(item => {
                return <div id={item.id} className={`item`} style={{gridArea: `${item.id}`}} onClick={() => {this.clickHandler(item.value); this.animatePress(item.id)}}>{item.value}</div>
              })}
            </div>
            <div className='side'>
              <div className='logCon'>
                {this.historyLogs()}
              </div>
              <div className='displayCon'>
                <div id='display'>{this.state.equation.concat(this.state.display)}</div>
              </div>
              
            </div>
            {/* add below the 'for deletion' for debugging lmao */}
            
        </div>
      ) 
    }
  }
  

ReactDOM.createRoot(document.getElementById('root')).render(<App />)