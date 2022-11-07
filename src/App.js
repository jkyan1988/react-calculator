import { useReducer } from 'react';
import Buttons from "./Buttons.js"
import OperationButtons from "./OperationButtons.js"
import './styles.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentValue === "0")  {
        return state
      }
      if (payload.digit === "." && state.currentValue.includes(".")) {
        return state
      }
      return {
        ...state,
        currentValue: `${state.currentValue || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentValue == null && state.previousValue == null) {
        return state
      }

      if (state.currentValue == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousValue == null) {
        return {
          ...state, 
          operation: payload.operation,
          previousValue: state.currentValue,
          currentValue: null,
        }
      }
      return {
        ...state,
        previousValue: evaluate(state),
        operation: payload.operation,
        currentValue: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentValue: null
        }
      }
      if (state.currentValue == null) return state
      if (state.currentValue.length === 1) {
        return {...state, currentValue: null}
      }
      return {
        ...state,
        currentValue: state.currentValue.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || 
          state.currentValue == null || 
          state.previousValue == null
          ) { 
          return state
      }
      return {
        ...state,
        overwrite: true,
        previousValue: null,
        operation: null,
        currentValue: evaluate(state)
      }
  }
}

function evaluate( { currentValue, previousValue, operation } ) { 
  const prev = parseFloat(previousValue)
  const current = parseFloat(currentValue)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0})

function formatValue(value) {
  if (value == null) return
  const [integer, decimal] = value.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [ { currentValue, previousValue, operation }, dispatch ] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
     <div className="output">
      <div className="prev-value">{formatValue(previousValue)} {operation}</div>
      <div className="current-value">{formatValue(currentValue)}</div>
     </div>
     <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
     <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
     <OperationButtons operation="÷" dispatch={dispatch}/>
     <Buttons digit="1" dispatch={dispatch}/>
     <Buttons digit="2" dispatch={dispatch}/>
     <Buttons digit="3" dispatch={dispatch}/>
     <OperationButtons operation="*" dispatch={dispatch}/>
     <Buttons digit="4" dispatch={dispatch}/>
     <Buttons digit="5" dispatch={dispatch}/>
     <Buttons digit="6" dispatch={dispatch}/>
     <OperationButtons operation="+" dispatch={dispatch}/>
     <Buttons digit="7" dispatch={dispatch}/>
     <Buttons digit="8" dispatch={dispatch}/>
     <Buttons digit="9" dispatch={dispatch}/>
     <OperationButtons operation="-" dispatch={dispatch}/>
     <Buttons digit="." dispatch={dispatch}/>
     <Buttons digit="0" dispatch={dispatch}/>
     <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
