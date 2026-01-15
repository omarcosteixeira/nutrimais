import React from 'react';
import { Gender } from '../types';

interface Props {
  bmi: number;
  gender: Gender;
}

export const BodyVisualizer: React.FC<Props> = ({ bmi, gender }) => {
  // Determine scale factors based on BMI
  // Base scales for "Normal" BMI ~22
  // We will modulate width (x-scale) based on deviation from 22
  
  const baseBMI = 22;
  // Calculate a scaling factor.
  // Example: BMI 40 / 22 = 1.8x width
  let widthFactor = Math.sqrt(bmi / baseBMI); 
  
  // Cap extreme values for visual sanity
  if (widthFactor < 0.8) widthFactor = 0.8;
  if (widthFactor > 1.8) widthFactor = 1.8;

  const isMale = gender === 'male';

  // Shapes Logic: We use simple SVG shapes (rects/ellipses) centered at x=100
  // HEAD
  const headW = 30 * (1 + (widthFactor - 1) * 0.2); // Head grows slightly
  
  // TORSO
  const shoulderW = isMale ? 70 : 60;
  const waistW = isMale ? (60 * widthFactor) : (50 * widthFactor);
  const hipW = isMale ? (65 * widthFactor) : (75 * widthFactor);
  
  // Specific adjustments for obesity visualization (stomach area)
  const stomachBulge = bmi > 25 ? (bmi - 25) * 1.5 : 0;

  // Colors
  let status = 'Normal';
  let color = '#10b981'; // Emerald
  if (bmi < 18.5) { status = 'Abaixo do Peso'; color = '#3b82f6'; } // Blue
  else if (bmi >= 25 && bmi < 30) { status = 'Sobrepeso'; color = '#f59e0b'; } // Orange
  else if (bmi >= 30) { status = 'Obesidade'; color = '#ef4444'; } // Red

  // Generate SVG Path for Body Silhouette
  const generateSilhouette = () => {
     // Center X is 100
     const topY = 40;
     const neckW = 20 + (widthFactor * 2);
     
     // Shoulders
     const sLeft = 100 - shoulderW/2;
     const sRight = 100 + shoulderW/2;
     const sY = 65;

     // Waist (Narrowest point usually)
     const wLeft = 100 - waistW/2 - (stomachBulge/2);
     const wRight = 100 + waistW/2 + (stomachBulge/2);
     const wY = 130;

     // Hips
     const hLeft = 100 - hipW/2 - (stomachBulge/3);
     const hRight = 100 + hipW/2 + (stomachBulge/3);
     const hY = 160;

     // Feet/Legs
     const legW = 15 * widthFactor;
     const fLeft = 100 - 15 - (widthFactor * 10);
     const fRight = 100 + 15 + (widthFactor * 10);
     const fY = 280;

     // Build Path
     return `
       M ${100 - neckW/2} ${topY + 15} 
       Q ${100 - neckW/2} ${sY} ${sLeft} ${sY + 10} 
       L ${sLeft - 5} ${sY + 20} 
       C ${sLeft - 5} ${wY}, ${wLeft} ${wY - 10}, ${wLeft} ${wY} 
       C ${wLeft} ${wY + 20}, ${hLeft} ${hY - 10}, ${hLeft} ${hY} 
       L ${fLeft} ${fY} 
       L ${fLeft + legW} ${fY} 
       L ${100} ${185} 
       L ${fRight - legW} ${fY} 
       L ${fRight} ${fY} 
       L ${hRight} ${hY} 
       C ${hRight} ${hY - 10}, ${wRight} ${wY + 20}, ${wRight} ${wY} 
       C ${wRight} ${wY - 10}, ${sRight + 5} ${wY}, ${sRight + 5} ${sY + 20} 
       L ${sRight} ${sY + 10} 
       Q ${100 + neckW/2} ${sY} ${100 + neckW/2} ${topY + 15} 
       Z
     `;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Estimativa Visual</h3>
      
      <div className="relative">
        <svg width="200" height="320" viewBox="0 0 200 320" className="transition-all duration-500">
          <defs>
             <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" style={{stopColor: color, stopOpacity: 0.6}} />
                 <stop offset="100%" style={{stopColor: color, stopOpacity: 1}} />
             </linearGradient>
             <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
          </defs>

          {/* Head */}
          <ellipse cx="100" cy="40" rx={headW/2} ry={headW/1.8} fill={color} filter="url(#glow)" />

          {/* Body */}
          <path 
            d={generateSilhouette()} 
            fill="url(#bodyGrad)" 
            stroke={color} 
            strokeWidth="2"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-in-out"
            filter="url(#glow)"
          />

          {/* Height Line (Decorative) */}
          <line x1="180" y1="20" x2="180" y2="280" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
          <text x="185" y="150" className="text-[10px] fill-slate-400" style={{writingMode: 'vertical-rl'}}>Altura</text>
        </svg>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="text-sm font-medium px-4 py-1.5 rounded-full text-white capitalize shadow-sm transition-colors duration-300" style={{ backgroundColor: color }}>
          {status}
        </span>
        <span className="text-xs text-slate-400 mt-2">Representação Esquemática</span>
      </div>
    </div>
  );
};