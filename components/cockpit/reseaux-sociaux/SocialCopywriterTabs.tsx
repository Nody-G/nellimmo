'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  CalendarPlus,
  Sparkles,
} from 'lucide-react';
import type { Property, SocialChannel, SocialBadge, SocialFormat, SocialPost } from '@/lib/types';
import { generateSocialCopy } from './social-types';

interface SocialCopywriterTabsProps {
  property: Property;
  selectedBadge: SocialBadge;
  selectedFormat: SocialFormat;
  onAddToPlanner: (post: Omit<SocialPost, 'id' | 'created_at'>) => void;
}

export function SocialCopywriterTabs({
  property,
  selectedBadge,
  selectedFormat,
  onAddToPlanner,
}: SocialCopywriterTabsProps) {
  const [activeChannel, setActiveChannel] = useState<SocialChannel>('instagram');
  const [customEdits, setCustomEdits] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [addedToPlanner, setAddedToPlanner] = useState(false);

  const editKey = `${property.id}_${activeChannel}_${selectedBadge}`;
  const defaultText = generateSocialCopy(property, activeChannel, selectedBadge);
  const postText = customEdits[editKey] ?? defaultText;

  const setPostText = (val: string) => {
    setCustomEdits((prev) => ({ ...prev, [editKey]: val }));
  };

  const propertyUrl = property.url || `https://www.nellimmo.fr/biens/${property.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: postText,
          url: propertyUrl,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      handleCopy();
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=500,scrollbars=yes');
  };

  const handleFacebookShare = () => {
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`);
  };

  const handleLinkedInShare = () => {
    openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(propertyUrl)}`);
  };

  const handleTwitterShare = () => {
    const snippet = postText.slice(0, 200);
    openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(snippet)}&url=${encodeURIComponent(propertyUrl)}`);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(postText)}`, '_blank');
  };

  const handleSchedulePost = () => {
    onAddToPlanner({
      property_id: property.id,
      property_title: property.title,
      channel: activeChannel,
      format: selectedFormat,
      badge: selectedBadge,
      content: postText,
      image_url: property.images?.[0]?.image_url,
      status: 'planifie',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    });
    setAddedToPlanner(true);
    setTimeout(() => setAddedToPlanner(false), 2500);
  };

  const channels: { id: SocialChannel; label: string; icon: string }[] = [
    { id: 'instagram', label: 'Instagram Feed', icon: '📸' },
    { id: 'facebook', label: 'Facebook Page', icon: '👥' },
    { id: 'linkedin', label: 'LinkedIn Pro', icon: '💼' },
    { id: 'tiktok', label: 'Script Reel / TikTok', icon: '🎬' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
            Rédaction Ciblée
          </span>
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Légende & Hashtags par Réseau
          </h3>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeChannel === ch.id
                  ? 'bg-white text-[#131B26] shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>{ch.icon}</span>
              <span className="hidden md:inline">{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <textarea
          rows={11}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="w-full p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl text-xs sm:text-sm text-gray-800 leading-relaxed focus:outline-[#E12B7B] resize-y shadow-inner font-sans"
        />
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>{postText.length} caractères • {postText.split(/\s+/).filter(Boolean).length} mots</span>
          <button
            onClick={() =>
              setCustomEdits((prev) => {
                const next = { ...prev };
                delete next[editKey];
                return next;
              })
            }
            className="text-[#E12B7B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Réinitialiser texte IA</span>
          </button>
        </div>
      </div>

      {/* 1-Click Multi-Sharing Bar */}
      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier texte'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Partager via le menu natif de votre appareil"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partage Direct</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Partager sur Facebook"
          >
            <span>Facebook</span>
          </button>

          <button
            onClick={handleLinkedInShare}
            className="px-3 py-2 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Partager sur LinkedIn"
          >
            <span>LinkedIn</span>
          </button>

          <button
            onClick={handleTwitterShare}
            className="px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Partager sur X / Twitter"
          >
            <span>X</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Partager sur WhatsApp"
          >
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Add to Social Planner CTA */}
        <button
          onClick={handleSchedulePost}
          className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          {addedToPlanner ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Post planifié !</span>
            </>
          ) : (
            <>
              <CalendarPlus className="w-4 h-4 text-[#C59A45]" />
              <span>Planifier dans le Social Planner</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
