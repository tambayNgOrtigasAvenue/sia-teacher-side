import React from 'react';
import { 
  Filter, 
  Search, 
  Star, 
  KeyRound as LucideKeyRound, 
  ScrollText as LucideScrollText, 
  CreditCard as LucideCreditCard, 
  MessageSquareText as LucideMessageSquareText, 
  ChevronDown as LucideChevronDown, 
  Facebook as LucideFacebook, 
  Mail as LucideMail, 
  Phone as LucidePhone 
} from 'lucide-react';

/**
 * Icon Library
 * 
 * Centralized icon exports for the entire application.
 * Uses lucide-react for consistent, customizable SVG icons.
 */

// Class Management Icons
export const FilterIcon = (props) => <Filter {...props} />;
export const SearchIcon = (props) => <Search {...props} />;
export const StarIcon = (props) => <Star className="fill-yellow-500 text-yellow-500" {...props} />;

// Help & Support Icons
export const KeyRound = (props) => <LucideKeyRound {...props} />;
export const ScrollText = (props) => <LucideScrollText {...props} />;
export const CreditCard = (props) => <LucideCreditCard {...props} />;
export const MessageSquareText = (props) => <LucideMessageSquareText {...props} />;
export const ChevronDown = (props) => <LucideChevronDown {...props} />;

// Contact Icons
export const Facebook = (props) => <LucideFacebook {...props} />;
export const Mail = (props) => <LucideMail {...props} />;
export const Phone = (props) => <LucidePhone {...props} />;
