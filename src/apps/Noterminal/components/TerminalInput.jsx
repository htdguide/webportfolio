import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useDraggableWindow } from '../../../components/DraggableWindow/DraggableWindowProvider';
import '../Noterminal.css';

function TerminalInput({ onCommandSubmit, onCtrlC, onInputFocus, fontSize, fontFamily, fontColor }) {
  const [currentInput, setCurrentInput] = useState('');
  const [caretIndex, setCaretIndex] = useState(0);
  const inputRef = useRef(null);
  const dummyRef = useRef(null);
  const promptRef = useRef(null);
  const [cursorLeft, setCursorLeft] = useState(10);
  const [cursorWidth, setCursorWidth] = useState(7);

  // Get the focused state from our draggable window provider.
  const { isWindowFocused } = useDraggableWindow();

  // Whenever the window becomes focused, force focus the input.
  useEffect(() => {
    if (isWindowFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWindowFocused]);

  // Initially focus the input when the component mounts.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const updateCaretIndex = () => {
    if (inputRef.current) {
      let newIndex = inputRef.current.selectionStart;
      if (newIndex > currentInput.length) {
        newIndex = currentInput.length;
      }
      setCaretIndex(newIndex);
    }
  };

  useLayoutEffect(() => {
    if (inputRef.current && promptRef.current) {
      const textToMeasure = currentInput.slice(0, caretIndex);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize} ${fontFamily}`;
      const textWidth = context.measureText(textToMeasure).width;
      const scrollLeft = inputRef.current.scrollLeft || 0;
      const promptWidth = promptRef.current.offsetWidth;
      const promptMarginRight = 5;
      setCursorLeft(promptWidth + promptMarginRight + (textWidth - scrollLeft));
    }
  }, [currentInput, caretIndex, fontSize, fontFamily]);

  useEffect(() => {
    if (dummyRef.current) {
      setCursorWidth(dummyRef.current.offsetWidth);
    }
  }, [fontSize, fontFamily]);

  const handleKeyDown = (e) => {
    // Handle Ctrl+C to exit an active app.
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      if (onCtrlC) onCtrlC();
      setCurrentInput('');
      setCaretIndex(0);
      return;
    }
    // On Enter, submit the command.
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentInput.trim()) {
        onCommandSubmit(currentInput);
      }
      setCurrentInput('');
      setCaretIndex(0);
    }
  };

  const handleSelect = () => {
    updateCaretIndex();
  };

  const handleKeyUp = () => {
    updateCaretIndex();
  };

  return (
    <div className="terminal-input-wrapper">
      <span ref={promptRef} className="terminal-prompt" style={{ color: fontColor }}>
        {'>'}
      </span>
      <input
        ref={inputRef}
        type="text"
        className="terminal-input"
        value={currentInput}
        onChange={(e) => {
          setCurrentInput(e.target.value);
          updateCaretIndex();
        }}
        onFocus={() => {
          if (onInputFocus) onInputFocus();
        }}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        autoFocus
        style={{ caretColor: 'transparent' }}
      />
      {/* Dummy element for measuring "M" */}
      <span
        ref={dummyRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize,
          fontFamily,
        }}
      >
        M
      </span>
      {/* Custom blinking cursor */}
      <div
        className="terminal-cursor"
        style={{
          position: 'absolute',
          left: cursorLeft,
          top: 1,
          width: cursorWidth,
          height: fontSize,
          backgroundColor: '#888888',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default TerminalInput;
