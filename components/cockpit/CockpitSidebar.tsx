'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { useNellimoStore, useRelances } from '@/lib/store';
import { computeRelances } from '@/lib/relances';
import {
  getNavSections,
  SidebarHeader,
  SidebarNavItem,
  SidebarFooter
} from './sidebar';

export function CockpitSidebar() {
  const pathname = usePathname();
  const currentUser = getSessionUser();
  const { properties, visits, transactions, buyers, settings } = useNellimoStore();
  const { relanceStatuses } = useRelances();

  const pendingRelancesCount = useMemo(() => {
    try {
      const actions = computeRelances({ properties, visits, transactions, buyers, settings });
      return actions.filter((a) => {
        const status = relanceStatuses[a.id];
        return status !== 'faite' && status !== 'ignoree';
      }).length;
    } catch {
      return 0;
    }
  }, [properties, visits, transactions, buyers, settings, relanceStatuses]);

  const navSections = useMemo(
    () => getNavSections(pendingRelancesCount),
    [pendingRelancesCount]
  );

  return (
    <aside className="w-64 bg-[#131B26] text-white flex flex-col justify-between shrink-0 border-r border-gray-800 min-h-screen">
      <SidebarHeader />

      <nav className="p-3 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pt-1 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {section.title}
              </span>
              {sIdx === 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/40">
                  Live
                </span>
              )}
            </div>

            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/cockpit' && pathname.startsWith(item.href));

              return (
                <SidebarNavItem
                  key={item.name}
                  item={item}
                  isActive={isActive}
                />
              );
            })}
          </div>
        ))}
      </nav>

      <SidebarFooter currentUser={currentUser} />
    </aside>
  );
}
