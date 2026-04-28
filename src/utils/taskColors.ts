// Category and Priority Color System
// Each category has a base color, and priority determines the shade intensity

export const getCategoryColor = (category: string, priority: 'low' | 'medium' | 'high'): { bg: string; text: string } => {
  const normalizedCategory = category.toLowerCase();

  // General - Blue shades
  if (normalizedCategory === 'general') {
    switch (priority) {
      case 'high': return { bg: '#1e40af', text: '#ffffff' }; // dark blue
      case 'medium': return { bg: '#3b82f6', text: '#ffffff' }; // medium blue
      case 'low': return { bg: '#93c5fd', text: '#1e3a8a' }; // light blue
    }
  }

  // Work - Orange shades
  if (normalizedCategory === 'work') {
    switch (priority) {
      case 'high': return { bg: '#c2410c', text: '#ffffff' }; // dark orange
      case 'medium': return { bg: '#f97316', text: '#ffffff' }; // medium orange
      case 'low': return { bg: '#fdba74', text: '#7c2d12' }; // light orange
    }
  }

  // Study - Purple shades
  if (normalizedCategory === 'study') {
    switch (priority) {
      case 'high': return { bg: '#6b21a8', text: '#ffffff' }; // dark purple
      case 'medium': return { bg: '#9333ea', text: '#ffffff' }; // medium purple
      case 'low': return { bg: '#d8b4fe', text: '#581c87' }; // light purple
    }
  }

  // Personal - Green shades
  if (normalizedCategory === 'personal') {
    switch (priority) {
      case 'high': return { bg: '#15803d', text: '#ffffff' }; // dark green
      case 'medium': return { bg: '#22c55e', text: '#ffffff' }; // medium green
      case 'low': return { bg: '#86efac', text: '#14532d' }; // light green
    }
  }

  // Default fallback
  return { bg: '#64748b', text: '#ffffff' };
};

export const getCategoryIconColor = (category: string, priority: 'low' | 'medium' | 'high'): string => {
  const normalizedCategory = category.toLowerCase();

  // Always use dark green for task icons
  return '#005047';
};

// Helper function to calculate luminance of a hex color
const getLuminance = (hex: string): number => {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Calculate relative luminance
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Get icon color based on background luminance
export const getTaskIconColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  // If background is dark (luminance < 0.5), use white icon
  // Otherwise use dark icon
  return luminance < 0.5 ? '#ffffff' : '#1e293b';
};

// Get icon SVG path based on category
export const getCategoryIconPath = (category: string): string => {
  const normalizedCategory = category.toLowerCase();

  switch (normalizedCategory) {
    case 'work':
      // Briefcase icon
      return 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z';

    case 'study':
      // Book icon
      return 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z';

    case 'personal':
      // Person icon
      return 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z';

    case 'general':
    default:
      // Document/File icon
      return 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
  }
};
