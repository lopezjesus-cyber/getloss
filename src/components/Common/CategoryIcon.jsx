import React from 'react';
import {
  Home,
  Zap,
  ShoppingCart,
  Car,
  HeartPulse,
  Film,
  ShoppingBag,
  GraduationCap,
  CreditCard,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  PlusCircle,
  Tag,
  ShieldAlert,
  Wallet,
  Building,
  Coffee,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  Home,
  Zap,
  ShoppingCart,
  Car,
  HeartPulse,
  Film,
  ShoppingBag,
  GraduationCap,
  CreditCard,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  PlusCircle,
  Tag,
  ShieldAlert,
  Wallet,
  Building,
  Coffee
};

export const CategoryIcon = ({ iconName, size = 18, className = '', color }) => {
  const IconComponent = ICON_MAP[iconName] || HelpCircle;
  return <IconComponent size={size} className={className} style={color ? { color } : {}} />;
};
