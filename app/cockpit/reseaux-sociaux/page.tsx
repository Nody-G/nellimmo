'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import {
  SocialHeader,
  SocialVisualGenerator,
  SocialCopywriterTabs,
  SocialPlannerView,
  InstagramGridPreview,
  SocialViewMode,
  SocialFormat,
  SocialBadge,
  SocialTheme,
  SocialPost,
} from '@/components/cockpit/reseaux-sociaux';

const STORAGE_KEY_POSTS = 'nellimo_social_posts_v1';

const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    property_id: 'prop-244',
    property_title: 'Villa contemporaine d’architecte avec piscine',
    channel: 'instagram',
    format: 'square',
    badge: 'exclusivite',
    content: '✨ EXCLUSIVITÉ NELL’IMMO — Villa contemporaine d’architecte avec piscine à Salon-de-Provence...',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    status: 'planifie',
    created_at: new Date().toISOString(),
  },
  {
    id: 'post-2',
    property_id: 'prop-237',
    property_title: 'Maison de Maître XIXe avec parc arboré',
    channel: 'facebook',
    format: 'landscape',
    badge: 'coup_de_coeur',
    content: '🏡 NOUVELLE OPPORTUNITÉ EN PROVENCE : Maison de Maître XIXe à Pélissanne...',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    status: 'publie',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

function ReseauxSociauxContent() {
  const { properties, settings } = useNellimoStore();
  const searchParams = useSearchParams();
  const mandateParam = searchParams.get('mandate');

  const activeProperties = properties.filter((p) => p.status === 'actif' || p.status === 'sous_compromis');

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => {
    if (mandateParam && properties.some((p) => p.id === mandateParam)) {
      return mandateParam;
    }
    return activeProperties[0]?.id || properties[0]?.id || '';
  });

  const [viewMode, setViewMode] = useState<SocialViewMode>('studio');
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>('square');
  const [selectedBadge, setSelectedBadge] = useState<SocialBadge>('exclusivite');
  const [selectedTheme, setSelectedTheme] = useState<SocialTheme>('dark_gold');

  const [posts, setPosts] = useState<SocialPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_POSTS);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SOCIAL_POSTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  const currentProperty = properties.find((p) => p.id === selectedPropertyId) || activeProperties[0] || properties[0];

  const handleAddToPlanner = (postData: Omit<SocialPost, 'id' | 'created_at'>) => {
    const newPost: SocialPost = {
      ...postData,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string, newStatus: SocialPost['status']) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  if (!currentProperty) {
    return <div className="p-8 text-center text-gray-500">Aucun mandat actif disponible.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <SocialHeader
        activeTab={viewMode}
        onTabChange={setViewMode}
        scheduledCount={posts.filter((p) => p.status === 'planifie').length}
        activePropertiesCount={activeProperties.length}
      />

      {/* Property Selector Bar (visible in studio and grid modes) */}
      {viewMode !== 'planner' && (
        <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-gray-500">Bien Sélectionné :</span>
            <select
              value={currentProperty.id}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="p-2 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl text-xs font-bold text-[#131B26] focus:outline-[#E12B7B]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.mandate_number} — {p.title} ({p.city}) — {p.price_fai.toLocaleString('fr-FR')} €
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-medium text-gray-400">
            {currentProperty.images?.length || 0} photo(s) disponible(s)
          </span>
        </div>
      )}

      {/* View Mode Switching */}
      {viewMode === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <SocialVisualGenerator
              property={currentProperty}
              settings={settings}
              selectedFormat={selectedFormat}
              selectedBadge={selectedBadge}
              selectedTheme={selectedTheme}
              onFormatChange={setSelectedFormat}
              onBadgeChange={setSelectedBadge}
              onThemeChange={setSelectedTheme}
            />
          </div>
          <div className="lg:col-span-6">
            <SocialCopywriterTabs
              property={currentProperty}
              selectedBadge={selectedBadge}
              selectedFormat={selectedFormat}
              onAddToPlanner={handleAddToPlanner}
            />
          </div>
        </div>
      )}

      {viewMode === 'planner' && (
        <SocialPlannerView
          posts={posts}
          onDeletePost={handleDeletePost}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {viewMode === 'grid' && (
        <InstagramGridPreview
          currentProperty={currentProperty}
          allProperties={activeProperties}
          settings={settings}
          activeBadge={selectedBadge}
        />
      )}
    </div>
  );
}

export default function ReseauxSociauxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-400">Chargement du Studio Réseaux Sociaux...</div>}>
      <ReseauxSociauxContent />
    </Suspense>
  );
}
