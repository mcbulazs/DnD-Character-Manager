import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import type React from "react";
import { useRef, useState } from "react";

const Accordion: React.FC<{
  head: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ head, children, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const contentRef = useRef<HTMLDivElement>(null); // To measure content height

  const toggleAccordion = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left-click

    const target = e.target as HTMLElement;
    const interactiveTags = ["INPUT", "BUTTON", "TEXTAREA", "SELECT", "svg"];
    if (interactiveTags.includes(target.tagName)) {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col w-full rounded-lg">
      <div
        className="flex items-center p-1 bg-gray-800 text-white cursor-pointer rounded-3xl hover:bg-gray-700 "
        onMouseDown={toggleAccordion}
      >
        {isOpen ? (
          <ExpandLessIcon className="mr-2" />
        ) : (
          <ExpandMoreIcon className="mr-2" />
        )}
        <div className="text-lg font-semibold">{head}</div>
      </div>
      {/* Dynamic height transition */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <div ref={contentRef} className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
