import React from 'react';

interface DSPCoderIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const DSPCoderIcon: React.FC<DSPCoderIconProps> = ({ className, ...props }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Custom DSPCoder icon - simplified embedded system chip design */}
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Pin connectors */}
      <line x1="2" y1="7" x2="4" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="17" x2="4" y2="17" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="17" x2="22" y2="17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

export default DSPCoderIcon;