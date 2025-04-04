import React, { useState, useRef } from 'react';

const RichTextEditor = () => {
  const [content, setContent] = useState('');
  const [history, setHistory] = useState([]); // Store previous content for undo/redo
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedFontSize, setSelectedFontSize] = useState("3");
  const editorRef = useRef(null); // Ref to access the contentEditable div

  // Handle input change (updates content and saves history)
  const handleInputChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    saveHistory(newContent);
  };

  // Save history (for undo/redo)
  const saveHistory = (newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Bold action
  const applyBold = () => {
    document.execCommand('bold');
    setContent(editorRef.current.innerHTML); // Sync with editor content
  };

  // Italic action
  const applyItalic = () => {
    document.execCommand('italic');
    setContent(editorRef.current.innerHTML); // Sync with editor content
  };

  // Underline action
  const applyUnderline = () => {
    document.execCommand('underline');
    setContent(editorRef.current.innerHTML); // Sync with editor content
  };

  // Change text color
  const applyTextColor = (color) => {
    document.execCommand('foreColor', false, color);
  };

  // Change font size
  const applyFontSize = (size) => {
    document.execCommand('fontSize', false, size);
    setSelectedFontSize(size);
  };

  // Text alignment
  const alignText = (alignment) => {
    document.execCommand('justify' + alignment, false, null);
  };

  // Insert a link
  const insertLink = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const url = prompt("Enter the URL");
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else {
      alert("Please select the text you want to turn into a link.");
    }
  };

  // Undo action
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  // Redo action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  // Check if the current selection has the style applied
  const isActive = (command) => {
    return document.queryCommandState(command);
  };

  // Check if the current selection has the correct font size
  const isFontSizeActive = (size) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fontSize = range.startContainer.parentElement.style.fontSize;
      return fontSize === size + 'px';
    }
    return false;
  };

  return (
    <div>
      <div className="toolbar">
        <button
          className={`toolbar-btn ${isActive('bold') ? 'active' : ''}`}
          onClick={applyBold}
        >
          <b>B</b>
        </button>
        <button
          className={`toolbar-btn ${isActive('italic') ? 'active' : ''}`}
          onClick={applyItalic}
        >
          <i>I</i>
        </button>
        <button
          className={`toolbar-btn ${isActive('underline') ? 'active' : ''}`}
          onClick={applyUnderline}
        >
          <u>U</u>
        </button>

        {/* Color Picker Dropdown */}
        <select
          className="toolbar-btn"
          onChange={(e) => applyTextColor(e.target.value)}
        >
          <option value="black" style={{ color: 'black' }}>Black</option>
          <option value="red" style={{ color: 'red' }}>Red</option>
          <option value="blue" style={{ color: 'blue' }}>Blue</option>
          <option value="green" style={{ color: 'green' }}>Green</option>
          <option value="yellow" style={{ color: 'yellow' }}>Yellow</option>
          <option value="orange" style={{ color: 'orange' }}>Orange</option>
          <option value="purple" style={{ color: 'purple' }}>Purple</option>
        </select>

        {/* Font Size Dropdown */}
        <select
          className="toolbar-btn"
          onChange={(e) => applyFontSize(e.target.value)}
          value={selectedFontSize}
        >
          <option value="1">Small</option>
          <option value="3">Medium</option>
          <option value="5">Large</option>
        </select>

        {/* Text Alignment Buttons with Icons */}
        <button className="toolbar-btn" onClick={() => alignText('Left')}>
          <span style={{ fontWeight: 'bold' }}>L</span>
        </button>
        <button className="toolbar-btn" onClick={() => alignText('Center')}>
          <span style={{ fontWeight: 'bold' }}>C</span>
        </button>
        <button className="toolbar-btn" onClick={() => alignText('Right')}>
          <span style={{ fontWeight: 'bold' }}>R</span>
        </button>

        <button className="toolbar-btn" onClick={insertLink}>
          <span style={{ fontWeight: 'bold' }}>🔗</span>
        </button>

        {/* Structuring Buttons with Symbols */}
        <button className="toolbar-btn" onClick={() => document.execCommand('insertUnorderedList', false, null)}>
          •
        </button>
        <button className="toolbar-btn" onClick={() => document.execCommand('formatBlock', false, 'blockquote')}>
          “
        </button>

        <button className="toolbar-btn" onClick={undo}>
          Undo
        </button>
        <button className="toolbar-btn" onClick={redo}>
          Redo
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInputChange}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '150px',
          fontFamily: 'Arial, sans-serif',
          direction: 'ltr', // Ensure text is written left-to-right
        }}
      ></div>
    </div>
  );
};

export default RichTextEditor;
