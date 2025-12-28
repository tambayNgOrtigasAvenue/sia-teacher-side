import React from 'react';
import { Filter, Search, Star } from 'lucide-react';

/**
 * Icon Library
 * 
 * Centralized icon exports for the class management application.
 * Uses lucide-react for consistent, customizable SVG icons.
 */

/**
 * FilterIcon Component
 * Used in filter dropdowns to indicate filtering functionality.
 */
export const FilterIcon = (props) => (
  <Filter {...props} />
);

/**
 * SearchIcon Component
 * Used in search input fields to indicate search functionality.
 */
export const SearchIcon = (props) => (
  <Search {...props} />
);

/**
 * StarIcon Component
 * Used to indicate favorited/starred classes.
 * Pre-styled with yellow fill and stroke for consistency.
 */
export const StarIcon = (props) => (
  <Star 
    className="fill-yellow-500 text-yellow-500" 
    {...props} 
  />
);

