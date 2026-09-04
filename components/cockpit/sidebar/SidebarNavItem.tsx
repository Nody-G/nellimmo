'use client';

import React from 'react';
import Link from 'next/link';
import { NavItem } from './navigation-items';

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
        isActive
          ? 'bg-[#E12B7B] text-white shadow-md'
          : item.highlight
          ? 'bg-white/10 text-white hover:bg-white/15 border border-[#C59A45]/30'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <Icon
          className={`w-4 h-4 shrink-0 ${
            isActive
              ? 'text-white'
              : item.highlight
              ? 'text-[#C59A45]'
              : 'text-gray-400'
          }`}
        />
        <span className="truncate">{item.name}</span>
      </div>

      {item.highlight && !isActive && (
        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C59A45]/20 text-[#C59A45] shrink-0">
          LAB
        </span>
      )}

      {item.badge && !isActive && (
        <span
          className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
            item.badgeUrgent
              ? 'bg-[#E12B7B] text-white shadow-xs font-mono'
              : 'bg-[#E12B7B]/20 text-[#F44293]'
          }`}
        >
          {item.badgeUrgent && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
          {item.badge}
        </span>
      )}

      {item.badge && isActive && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white font-mono shrink-0">
          {item.badge}
        </span>
      )}
    </Link>
  );
};
