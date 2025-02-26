import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import DraggableWindow from '../../components/DraggableWindow/DraggableWindow';
import './SortingAlgorithms.css';

function SortingAlgorithms({ onClose }) {
  const [isWindowMounted, setIsWindowMounted] = useState(false);
  const [wasmScriptLoaded, setWasmScriptLoaded] = useState(false);
  const canvasRef = useRef(null);
  const script = useRef(null);

  // DraggableWindow ref to call .showLoading() / .hideLoading()
  const draggableWindowRef = useRef(null);

  // Attempt to load the WASM script if not already loaded
  const loadWasmScript = useCallback(() => {
    if (wasmScriptLoaded) return;

    console.log('Creating <script> for sorting_algorithms.js...');
    script.current = document.createElement('script');
    script.current.src = '/WebintoshHD/Applications/wasm/sorting_algorithms.js';
    script.current.async = false;

    script.current.onload = () => {
      console.log('WASM script loaded successfully.');
      setWasmScriptLoaded(true);
      // We are NOT calling hideLoading() here anymore.
      // We'll do it in the effect below, right after "WASM is loaded..." log.
    };

    document.body.appendChild(script.current);
  }, [wasmScriptLoaded]);

  useEffect(() => {
    // Only load WASM script after the window is mounted
    if (isWindowMounted) {
      console.log('Window is mounted => loadWasmScript()');
      loadWasmScript();
    }
  }, [isWindowMounted, loadWasmScript]);

  useEffect(() => {
    // Initialize WASM only when the script is loaded and canvas is available
    if (wasmScriptLoaded && canvasRef.current) {
      console.log('WASM is loaded and canvasRef is valid => initialize WASM...');

      // <-- Hide the loading cover right AFTER this console log.
      // So we've confirmed the script is loaded and the canvas is ready.
      if (draggableWindowRef.current) {
        console.log('Hiding loading overlay now...');
        draggableWindowRef.current.hideLoading();
      }

      setTimeout(() => {
        if (window.Module) {
          const canvas = canvasRef.current;
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;

          console.log('Canvas ready for WASM:', {
            width: canvas.width,
            height: canvas.height,
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
          });

          window.Module.canvas = canvas;

          if (window.Module._initializeWindow) {
            console.log('Calling window.Module._initializeWindow()...');
            window.Module._initializeWindow();
          }
        } else {
          console.warn('window.Module is not defined yet.');
        }
      }, 100);
    }
  }, [wasmScriptLoaded]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      console.log('SortingAlgorithms unmounting...');
      if (window.Module && window.Module._cancelLoop) {
        console.log('Cancelling WASM loop on window close.');
        window.Module._cancelLoop();
      }

      if (script.current) {
        console.log('Removing script from DOM:', script.current);
        document.body.removeChild(script.current);
      }
    };
  }, []);

  return (
    <DraggableWindow
      ref={draggableWindowRef}
      title="Sorting Algorithms"
      wasmWidth={400}
      wasmHeight={530}
      onClose={onClose}
      onMount={() => {
        console.log('DraggableWindow onMount => setIsWindowMounted(true)');
        setIsWindowMounted(true);
        // Show loading screen when the window first mounts
        if (draggableWindowRef.current) {
          console.log('Showing loading screen...');
          draggableWindowRef.current.showLoading();
        }
      }}
      onUnmount={() => {
        console.log('DraggableWindow onUnmount => setIsWindowMounted(false)');
        setIsWindowMounted(false);
      }}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        className="emscripten"
        tabIndex="-1"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          display: 'block',
        }}
      />
    </DraggableWindow>
  );
}

export default SortingAlgorithms;
