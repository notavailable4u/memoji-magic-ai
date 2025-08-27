import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    height="1em" 
    width="1em" 
    {...props}
  >
    <path d="M12 2l1.09 3.29h3.48l-2.82 2.03 1.09 3.29-2.82-2.03-2.82 2.03 1.09-3.29-2.82-2.03h3.48L12 2zM6.5 12.5l-.94 2.89h3.01l-2.43 1.76.94 2.89-2.43-1.76-2.43 1.76.94-2.89-2.43-1.76h3.01l.94-2.89zM17.5 12.5l.94-2.89h-3.01l2.43 1.76-.94 2.89 2.43-1.76 2.43 1.76-.94-2.89 2.43-1.76h-3.01l-.94-2.89z" />
  </svg>
);

export default SparklesIcon;