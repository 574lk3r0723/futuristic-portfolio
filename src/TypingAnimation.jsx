// TypingAnimation.jsx
import React, { useState, useEffect } from "react";

const TypingAnimation = () => {
  const messages = ["Hey, I'm Ryan,", "Let's work together"];
  const [displayedText, setDisplayedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const speed = deleting ? 50 : 150; // faster when deleting
    const timeout = setTimeout(() => {
      const currentMessage = messages[messageIndex];

      if (!deleting) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex + 1 === currentMessage.length) {
          setDeleting(true);
        }
      } else {
        setDisplayedText(currentMessage.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setMessageIndex((messageIndex + 1) % messages.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, messageIndex]);

  return (
    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-cyan-400 mb-2">
      {displayedText}
      <span className="animate-blink">|</span>
      <style jsx>{`
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TypingAnimation;
