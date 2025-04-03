import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 50
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.04
      }
    }
  };
  
  const child = {
    hidden: { 
      opacity: 0,
      filter: "blur(10px)",
      y: 20
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.span
      className={`${className} inline-flex flex-wrap`}
      variants={container}
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block mr-1"
          style={{ 
            display: 'inline-block', 
            marginRight: '0.25rem',
            whiteSpace: 'nowrap'
          }}
          transition={{
            delay: i * delay / 1000
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default BlurText;