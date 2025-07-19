/* eslint-disable react/prop-types */
// components/ScrollFadeIn.jsx
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const ScrollFadeIn = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 } // Increased threshold for better timing
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getInitialAnimation = () => {
    switch (direction) {
      case "left": return { opacity: 0, x: -200, scale: 0.8 };
      case "right": return { opacity: 0, x: 200, scale: 0.8 };
      default: return { opacity: 0, y: 100, scale: 0.8 };
    }
  };

  const getFinalAnimation = () => {
    switch (direction) {
      case "left":
      case "right": return { opacity: 1, x: 0, scale: 1 };
      default: return { opacity: 1, y: 0, scale: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialAnimation()}
      animate={inView ? getFinalAnimation() : {}}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing curve
        delay,
        scale: {
          duration: 0.4,
          ease: "easeOut"
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFadeIn;
