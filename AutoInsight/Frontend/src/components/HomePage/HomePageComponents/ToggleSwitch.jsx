/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function ToggleSwitch({ 
  initialState = false,
  width = 60,
  height = 34,
  padding = 4,
  onColor = "#693696", 
  offColor = "#ccc",
  toggleColor = "#fff",
  disabled = false,
  onChange = () => {}
}) {
  const [isToggled, setIsToggled] = useState(initialState);
  
  const handleToggle = () => {
    if (disabled) return;
    const newState = !isToggled;
    setIsToggled(newState);
    onChange(newState);
  };
  
  // Calculate sizes based on provided dimensions
  const toggleSize = height - (padding * 2);
  const togglePosition = isToggled ? width - toggleSize - padding : padding;
  
  // Scale all values for display (this is just for demonstration)
  const displayScale = 1;
  const scaledWidth = width * displayScale;
  const scaledHeight = height * displayScale;
  
  return (
    <div className="flex flex-col gap-4 items-center p-4">
      <div 
        onClick={handleToggle}
        style={{
          position: 'relative',
          width: scaledWidth,
          height: scaledHeight,
          backgroundColor: isToggled ? onColor : offColor,
          borderRadius: scaledHeight / 2,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'background-color 0.3s ease'
        }}
        className="flex items-center"
      >
        <div
          style={{
            position: 'absolute',
            left: togglePosition * displayScale,
            width: toggleSize * displayScale,
            height: toggleSize * displayScale,
            backgroundColor: toggleColor,
            borderRadius: '50%',
            transition: 'left 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
      
    </div>
  );
}