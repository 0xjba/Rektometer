import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search projects..." }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg bitmap-border 
                 focus:outline-none focus:ring-1 focus:ring-red-500
                 text-white placeholder-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}   