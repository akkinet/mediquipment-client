'use client'
import React, { useState, useEffect } from "react";
import { IoColorPaletteSharp } from "react-icons/io5";

const ColorPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('customBlue');

  // Toggle the color palette sidebar
  const togglePalette = () => {
    setIsOpen(!isOpen);
  };

  // Update CSS variables directly
  const updateCSSVariable = (color) => {
    if (color === 'customBlue') {
      document.documentElement.style.setProperty("--customColor", "#00b0f0");
    } else if (color === 'customPink') {
      document.documentElement.style.setProperty("--customColor", "#f03385");
    } else if (color === 'customGreen') {
      document.documentElement.style.setProperty("--customColor", "#10B981");
    }
  };

  // Handle color change
  const changeThemeColor = (color) => {
    setSelectedColor(color);
    localStorage.setItem('themeColor', color);
    updateCSSVariable(color);
  };

  // Load the persisted theme color from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      setSelectedColor(savedColor);
      updateCSSVariable(savedColor);
    }
  }, []);

  return (
    <div>
      {/* Icon to open the color palette */}
      <IoColorPaletteSharp
        size={50}
        className={`z-50 fixed bottom-6 right-6 text-`}
        onClick={togglePalette}
      />

      {/* Side color palette */}
      {isOpen && (
        <div className="fixed right-0 bottom-6 w-64 h-1/3 bg-white shadow-lg z-40 p-4">
          <h3>Select Theme Color</h3>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => changeThemeColor('customBlue')}
              className="w-full h-10 bg-customBlue"
            />
            <button
              onClick={() => changeThemeColor('customPink')}
              className="w-full h-10 bg-customPink"
            />
            <button
              onClick={() => changeThemeColor('customGreen')}
              className="w-full h-10 bg-customGreen"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
