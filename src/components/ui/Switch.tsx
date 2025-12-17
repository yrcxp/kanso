"use client";

import React, { useState, useEffect } from "react";

/**
 * Kindle-style Switch Component
 * Toggle switch with 0 border radius like real Kindle
 * Supports both controlled and uncontrolled modes
 */

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [isPressed, setIsPressed] = useState(false);

  // Sync with external controlled state
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        relative inline-flex items-center
        w-12 h-6
        select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{
        backgroundColor: isChecked ? 'var(--eink-ink)' : 'var(--eink-border)',
        border: '1px solid var(--eink-ink)',
        borderRadius: 0,
      }}
    >
      {/* Thumb */}
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: isChecked ? 'calc(100% - 22px)' : '2px',
          width: '18px',
          height: '18px',
          backgroundColor: isChecked ? 'var(--eink-paper)' : 'var(--eink-ink)',
          borderRadius: 0,
          boxShadow: isPressed ? 'none' : '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
};

export default Switch;

