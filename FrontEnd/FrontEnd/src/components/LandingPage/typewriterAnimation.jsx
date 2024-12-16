import React, { useState, useEffect } from 'react';
import './typewriterAnimation.css';

const TypewriterHeader = () => {
  const words = ['Review', 'Check', 'Review', 'Revise']; 
  const colors = ['#41436A', '#ff9677', '#28a745', '#ff4500']; 
  const typingSpeed = 150; 
  const pauseTime = 2000;  

  const [index, setIndex] = useState(0); 
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false); 

  useEffect(() => {
    let typingTimeout;
    if (!deleting && text === words[index]) {
     
      typingTimeout = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && text === '') {
      
      setDeleting(false);
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    } else {
      
      typingTimeout = setTimeout(() => {
        const currentWord = words[index];
        setText((prevText) =>
          deleting ? currentWord.slice(0, prevText.length - 1) : currentWord.slice(0, prevText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(typingTimeout); 
  }, [text, deleting, index, words, typingSpeed, pauseTime]);

  return (
    <div className="header">
      <h1>
        Syllabus <span style={{ color: colors[index] }}>{text}</span>
        <span className="dummyWord">Syllabus</span> {/* Hidden dummy word for layout stability */}
      </h1>
    </div>
  );
};

export default TypewriterHeader;
