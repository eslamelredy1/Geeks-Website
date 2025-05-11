import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FilterSection {
  title: string;
  isOpen: boolean;
  options?: string[];
  selectedOptions?: string[];
}

interface SidebarProps {
  onFiltersChange: (filters: {
    priceRange: [number, number];
    productType: string[];
    gender: string[];
  }) => void;
}

const PriceSlider: React.FC<{
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}> = ({ min, max, value, onChange }) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPositionFromValue = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (position: number) => {
    const percentage = position / 100;
    return Math.round((percentage * (max - min) + min) / 50) * 50;
  };

  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let position = ((e.clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    const newValue = getValueFromPosition(position);
    const [currentMin, currentMax] = value;

    if (isDragging === 'min') {
      if (newValue < currentMax - 100) {
        onChange([newValue, currentMax]);
      }
    } else {
      if (newValue > currentMin + 100) {
        onChange([currentMin, newValue]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative px-2">
      <div className="flex justify-between mb-4">
        <div className="text-center">
          <span className="block text-sm font-medium text-gray-900">{value[0]} EGP</span>
          <span className="text-xs text-gray-500">Min</span>
        </div>
        <div className="text-center">
          <span className="block text-sm font-medium text-gray-900">{value[1]} EGP</span>
          <span className="text-xs text-gray-500">Max</span>
        </div>
      </div>

      <div 
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-lg"
      >
        {/* Active range */}
        <div
          className="absolute h-full bg-orange-500 rounded-lg"
          style={{
            left: `${getPositionFromValue(value[0])}%`,
            right: `${100 - getPositionFromValue(value[1])}%`
          }}
        />

        {/* Min handle */}
        <div
          className="absolute w-4 h-4 bg-black rounded-full border-2 border-black hover:bg-orange-500 hover:border-orange-500 cursor-pointer transform -translate-y-1/2 transition-colors"
          style={{
            left: `${getPositionFromValue(value[0])}%`,
            top: '50%'
          }}
          onMouseDown={handleMouseDown('min')}
        />

        {/* Max handle */}
        <div
          className="absolute w-4 h-4 bg-black rounded-full border-2 border-black hover:bg-orange-500 hover:border-orange-500 cursor-pointer transform -translate-y-1/2 transition-colors"
          style={{
            left: `${getPositionFromValue(value[1])}%`,
            top: '50%'
          }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onFiltersChange }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2400]);
  const [sections, setSections] = useState<FilterSection[]>([
    { 
      title: 'Product type',
      isOpen: true,
      options: ['T-Shirt', 'Shorts', 'Pants', 'Jackets', 'Shoes', 'Sweater'],
      selectedOptions: []
    },
    { 
      title: 'Gender',
      isOpen: true,
      options: ['Male', 'Female', 'Unisex'],
      selectedOptions: []
    },
  ]);

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    updateFilters(newRange, sections);
  };

  const toggleOption = (sectionIndex: number, option: string) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      const section = { ...newSections[sectionIndex] };
      
      if (!section.selectedOptions) {
        section.selectedOptions = [];
      }

      const optionIndex = section.selectedOptions.indexOf(option);
      if (optionIndex === -1) {
        section.selectedOptions = [...section.selectedOptions, option];
      } else {
        section.selectedOptions = section.selectedOptions.filter(opt => opt !== option);
      }
      
      newSections[sectionIndex] = section;
      updateFilters(priceRange, newSections);
      return newSections;
    });
  };

  const updateFilters = (range: [number, number], currentSections: FilterSection[]) => {
    onFiltersChange({
      priceRange: range,
      productType: currentSections[0].selectedOptions || [],
      gender: currentSections[1].selectedOptions || []
    });
  };

  useEffect(() => {
    updateFilters(priceRange, sections);
  }, []);

  const clearFilters = () => {
    const clearedSections = sections.map(section => ({
      ...section,
      selectedOptions: []
    }));
    setPriceRange([0, 2400]);
    setSections(clearedSections);
    updateFilters([0, 2400], clearedSections);
  };

  return (
    <aside className="w-64 p-6 border-r">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-orange-500"
        >
          Clear all
        </button>
      </div>

      <div className="filter-section">
        <h3 className="filter-title mb-6">Price Range</h3>
        <PriceSlider
          min={0}
          max={2400}
          value={priceRange}
          onChange={handlePriceChange}
        />
      </div>

      {sections.map((section, index) => (
        <div key={section.title} className="filter-section mt-6">
          <button
            className="w-full flex items-center justify-between filter-title"
            onClick={() => setSections(prev => prev.map((s, i) => 
              i === index ? { ...s, isOpen: !s.isOpen } : s
            ))}
          >
            <span>{section.title}</span>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${
                section.isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          {section.isOpen && (
            <div className="mt-2 space-y-2">
              {section.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.selectedOptions?.includes(option) || false}
                    onChange={() => toggleOption(index, option)}
                    className="form-checkbox h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar; 