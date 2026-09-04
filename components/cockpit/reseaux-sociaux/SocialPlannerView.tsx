'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, Trash2, CheckCircle2, Clock } from 'lucide-react';
import type { SocialPost } from '@/lib/types';
import { getBadgeLabel } from './social-types';

interface SocialPlannerViewProps {
  posts: SocialPost[];
  onDeletePost: (id: string) => void;
  onToggleStatus: (id: string, newStatus: SocialPost['status']) => void;
}

export function SocialPlannerView({
  posts,
  onDeletePost,
  onToggleStatus,
}: SocialPlannerViewProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'planifie' | 'publie' | 'brouillon'>('all');

  const filteredPosts = posts.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
              Planning Éditorial
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{posts.length} Post(s) Programmés</span>
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
            Calendrier & Publications Prévues
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'planifie', label: 'Planifiés' },
            { id: 'publie', label: 'Publiés' },
            { id: 'brouillon', label: 'Brouillons' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as typeof filterStatus)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-[#131B26] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center text-gray-400 space-y-3 bg-[#FCFAF7] rounded-2xl border border-dashed border-gray-200">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-sm font-medium">Aucune publication dans cette vue.</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Utilisez l’onglet « Générateur Visuel HD » pour concevoir et planifier un post en 1 clic.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl border border-[#F3E8EE] bg-[#FCFAF7] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E12B7B] bg-rose-50 px-2 py-0.5 rounded-md">
                    {post.channel.toUpperCase()} • {post.format.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      post.status === 'publie'
                        ? 'bg-emerald-100 text-emerald-800'
                        : post.status === 'planifie'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {post.status === 'publie' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    <span>{post.status.toUpperCase()}</span>
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {post.image_url && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={post.image_url}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs text-gray-900 truncate">
                      {post.property_title}
                    </h4>
                    <span className="text-[10px] text-gray-500 block font-medium">
                      Badge : {getBadgeLabel(post.badge)}
                    </span>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 italic">
                      « {post.content.slice(0, 100)}... »
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-gray-400">
                  {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onToggleStatus(post.id, post.status === 'publie' ? 'planifie' : 'publie')
                    }
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {post.status === 'publie' ? 'Repasser en planifié' : 'Marquer comme publié'}
                  </button>
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
