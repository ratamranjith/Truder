import React, { useState } from "react";
import "./App.css";

function App() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [colorCombinations, setColorCombinations] = useState([]);

  const setGradient = () => {
    const gradient = `linear-gradient(to right, ${color1}, ${color2})`;
    return { backgroundImage: gradient };
  };

  const generateColorCombinations = () => {
    // Convert color strings to RGB values
    const color1RGB = hexToRgb(color1);
    const color2RGB = hexToRgb(color2);
  
    // Calculate intermediate colors for each combination
    const allCombinations = [];
  
    for (let j = 0; j <= 5; j++) {
      const intermediateColors = [];
  
        const r = Math.round(color1RGB.r + ((color2RGB.r - color1RGB.r) * j) / 3);
        const g = Math.round(color1RGB.g + ((color2RGB.g - color1RGB.g) * j) / 3);
        const b = Math.round(color1RGB.b + ((color2RGB.b - color1RGB.b) * j) / 3);
        intermediateColors.push(`rgb(${r},${g},${b})`);
  
      allCombinations.push(intermediateColors);
    }
  
    setColorCombinations(allCombinations);
  };
  
  

  // Function to convert an RGB color to its hexadecimal representation
  const hexColor = (color) => {
    const { r, g, b } = hexToRgb(color);
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  };

  // Function to convert a color component to a two-digit hexadecimal representation
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  return (
    <div className="App">
      <h1>Gradient Generator</h1>
      <div className="color-picker">
        <input
          type="color"
          value={color1}
          onChange={(e) => setColor1(e.target.value)}
        />
        <input
          type="color"
          value={color2}
          onChange={(e) => setColor2(e.target.value)}
        />
        <button onClick={() => generateColorCombinations(3)}>
          Generate 3 Combinations
        </button>
      </div>
      <div className="gradient-colors" style={setGradient()}></div>
      <div className="color-combinations">
  {colorCombinations.map((combination, combinationIndex) => (
    <div key={combinationIndex} className="row">
      <div className="color-boxes">
        {combination.slice(0, 5).map((color, colorIndex) => (
          <div
            key={colorIndex}
            className="color-box"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
      <div className="css-code">
        {combination.slice(0, 5).map((color, colorIndex) => (
          <div key={colorIndex}>
            background: {color};
            <br />
            background: -moz-linear-gradient(90deg, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            0%, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            35%, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            100%);
            <br />
            background: -webkit-linear-gradient(90deg, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            0%, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            35%, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            100%);
            <br />
            background: linear-gradient(90deg, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            0%, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            35%, rgba(
            {hexToRgb(color).r},{hexToRgb(color).g},{hexToRgb(color).b},1)
            100%);
            <br />
            filter:
            progid:DXImageTransform.Microsoft.gradient(startColorstr="#
            {hexColor(color)}",endColorstr="#{hexColor(color)}
            ",GradientType=1);
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default App;
