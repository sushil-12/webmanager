import React, { useState, useRef, useEffect } from 'react';

interface TooltipMessageProps {
  title?: string; // Optional title
  message?: string;
  position?: 'top' | 'bottom' | 'right'; // Optional message
  children: React.ReactNode; // The element that triggers the tooltip
}

const TooltipMessage: React.FC<TooltipMessageProps> = ({ title, message, children, position = 'bottom' }) => {
  const [showTooltip, setShowTooltip] = useState(false); // Default set to `false`
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'right'>(position); // Set based on the passed prop
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Ensure that at least one of `title` or `message` is provided
  if (!title && !message) {
    throw new Error('Either `title` or `message` must be provided.');
  }

  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const hasSpaceOnRight = rect.right + tooltipRef.current.offsetWidth <= window.innerWidth;
      const hasSpaceOnTop = rect.top >= tooltipRef.current.offsetHeight;
      const hasSpaceOnBottom = rect.bottom + tooltipRef.current.offsetHeight <= window.innerHeight;

      // Dynamically check space and override the position if needed, but prioritize the passed `position` prop
      if (position === 'right' && !hasSpaceOnRight) {
        setTooltipPosition('bottom'); // Fallback to bottom if no space on the right
      } else if (position === 'top' && !hasSpaceOnTop) {
        setTooltipPosition('bottom'); // Fallback to bottom if no space on the top
      } else if (position === 'bottom' && !hasSpaceOnBottom) {
        setTooltipPosition('top'); // Fallback to top if no space on the bottom
      } else {
        setTooltipPosition(position); // Use the passed prop
      }
    }
  }, [showTooltip, position]);

  return (
    <div className="relative flex items-center">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`absolute ${tooltipPosition === 'right' ? 'left-full ml-2 z-50' : ''} 
                     ${tooltipPosition === 'top' ? 'bottom-full mb-2' : ''} 
                     ${tooltipPosition === 'bottom' ? 'top-full mt-2' : ''} 
                     w-max bg-light-blue text-main-bg-900 text-sm p-2 rounded shadow-lg z-50 max-w-[250px]`}
        >
          {title === 'password' && (
            <ul>
              <li>Password must be of minimum 8 characters</li>
              <li>Upper & lowercase letters</li>
              <li>At least one number</li>
            </ul>
          )}
          {message && <p>{message}</p>}
          {/* Tooltip arrow */}
          <div
            className={`absolute ${tooltipPosition === 'right' ? 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-full' : ''} 
                       ${tooltipPosition === 'top' ? 'left-1/2 transform -translate-x-1/2 bottom-0' : ''} 
                       ${tooltipPosition === 'bottom' ? 'left-1/2 transform -translate-x-1/2 top-0' : ''} 
                       w-3 h-3 bg-light-blue rotate-45`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TooltipMessage;