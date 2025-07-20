import React, { useState, useRef, useEffect } from "react";
import ToggleButton from "./ToggleButton";
import RuleItem from "./RuleItem";

const MAX_HEIGHT = 500; // макс висота в px

export default function RulesSection({ section }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      if (isOpen) {
        setMaxHeight(`${Math.min(scrollHeight, MAX_HEIGHT)}px`);
      } else {
        setMaxHeight("0px");
      }
    }
  }, [isOpen]);

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <ToggleButton
          title={section.title}
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div
          ref={contentRef}
          className="rules-container bg-gray-900"
          style={{
            maxHeight: maxHeight,
            overflowY: isOpen && contentRef.current && contentRef.current.scrollHeight > MAX_HEIGHT ? "auto" : "hidden",
            transition: "max-height 0.5s ease",
          }}
        >
          {section.rules.map((rule) => (
            <RuleItem key={rule.id} {...rule} />
          ))}
        </div>
      </div>
    </div>
  );
}
