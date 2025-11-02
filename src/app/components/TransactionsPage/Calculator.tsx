"use client";

import { X } from "lucide-react";
import React, { useState } from "react";

interface CalculatorProps {
  onClose: () => void;
  onSelect: (value: number) => void;
  initialValue?: number
}

const CalculatorModal : React.FC<CalculatorProps>= ({onClose, onSelect, initialValue = 0}) => {
  const [display, setDisplay] = useState(initialValue > 0 ? initialValue.toString() : "0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num : string) => {
    if (newNumber){
        setDisplay(num);
        setNewNumber(false)
    } else {
        setDisplay(display === '0' ? num : display + num);
    }
  }

  const handleDecimal = () => {
    if (newNumber){
        setDisplay('0.');
        setNewNumber(false);
    } else if(!display.includes('.')){
        setDisplay(display + '.');
    }
  };

  const handleOperation = (op : string) => {
    const current = parseFloat(display);
    if (prevValue === null){
        setPrevValue(current);
    } else if (operation){
        const result = calculate(prevValue, current, operation)
        setDisplay(result.toString());
        setPrevValue(result);
    }

    setOperation(op);
    setNewNumber(true);
  }

  const calculate = (a: number, b: number, op: string) => {
    switch(op){
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  }

  const handleEquals = () => {
    if (operation && prevValue !== null){
        const result = calculate(prevValue, parseFloat(display), operation);
        setDisplay(result.toString());
        setPrevValue(null);
        setOperation(null);
        setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setNewNumber(true);
  }

  const handleUse = () => {
    onSelect(parseFloat(display));
    onClose();
  }

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-xs shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-900">Calculator</h4>
          <button 
          onClick={() => onClose()}
          className="p-1 hover:bg-gray-100 rounded">
            <X size={16} />
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg mb-3 text-right">
          <div className="text-xs text-gray-500 h-4">
            {prevValue !== null && `${prevValue} ${operation || ""}`}
          </div>
          <div className="text-2xl font-mono font-semibold text-gray-900 truncate">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {buttons.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === '=') handleEquals();
                    else if (['+', '-', '×', '÷'].includes(btn)) handleOperation(btn);
                    else if (btn === '.') handleDecimal();
                    else handleNumber(btn);
                  }}
                  className={`p-3 rounded-lg font-semibold ${
                    ["+", "-", "×", "÷"].includes(btn)
                      ? "bg-teal-500 text-white hover:bg-teal-600"
                      : btn === "="
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-2">
          <button
          onClick={handleClear}
          className="flex-1 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
          >Clear</button>
          <button 
          onClick={handleUse}
          className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
            Use amount
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;
