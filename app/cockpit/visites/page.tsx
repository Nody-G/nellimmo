'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  PenTool,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  User,
  Home,
  PlusCircle,
  Printer
} from 'lucide-react';

export default function VisitSheetsPage() {
  const { properties, buyers, visits, createVisitSheet } = useNellimoStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#131B26';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveVisit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL('image/png');

    createVisitSheet({
      property_id: selectedPropertyId,
      buyer_id: selectedBuyerId,
      visit_date: new Date().toISOString(),
      signature_data_url: signatureDataUrl,
      ip_address: '82.65.144.21',
      notes: notes,
    });

    setIsSigned(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <PenTool className="w-4 h-4" />
            <span>Gestion des Visites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Bons de Visite
          </h1>
          <p className="text-xs text-gray-500">
            Faites signer vos acquéreurs sur smartphone ou tablette lors des visites.
          </p>
        </div>

        <button
          onClick={() => {
            setIsSigned(false);
            clearCanvas();
          }}
          className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          Nouveau Bon de Visite
        </button>
      </div>

      {/* Main Form & Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols : Tactile Form & Canvas */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
                Bien à Visiter (Mandat)
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#E12B7B]" />
                Acquéreur / Visiteur
              </label>
              <select
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.first_name} {b.last_name} ({b.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legal clause */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] text-xs text-gray-700 space-y-2">
            <span className="font-bold text-gray-900 block">Engagement Juridique du Visiteur :</span>
            <p className="leading-relaxed text-[11px] text-gray-600">
              « Je soussigné(e) {selectedBuyer?.first_name} {selectedBuyer?.last_name}, reconnais que l&apos;agence Nellimo Immobilier m&apos;a fait visiter ce jour le bien désigné ci-dessus au prix de {selectedProperty?.price_fai.toLocaleString('fr-FR')} € FAI. Je m&apos;interdis formellement de traiter directement ou indirectement avec le mandant sans le concours de l&apos;agence. »
            </p>
          </div>

          {/* Tactile Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-[#E12B7B]" />
                Signature Tactile de l&apos;Acquéreur sur l&apos;Écran
              </span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-gray-400 hover:text-[#E12B7B] flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Effacer
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 overflow-hidden touch-none relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-48 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 pointer-events-none">
                Signez avec le doigt ou stylet
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Impressions & Remarques de Visite
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Intérêt prononcé pour le jardin, demande de contre-visite..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
            />
          </div>

          {/* Action Button */}
          <div>
            {isSigned ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">Bon de visite signé et archivé avec succès !</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveVisit}
                className="w-full py-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                Valider & Archiver le Bon de Visite Horodaté
              </button>
            )}
          </div>

        </div>

        {/* Right col : History of Visit Sheets */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#131B26]">
              Bons de Visite Récents ({visits.length})
            </h3>

            <div className="space-y-3">
              {visits.map((v) => {
                const prop = properties.find((p) => p.id === v.property_id);
                const buyer = buyers.find((b) => b.id === v.buyer_id);

                return (
                  <div key={v.id} className="p-3.5 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{buyer?.first_name} {buyer?.last_name}</span>
                      <span className="text-[10px] text-gray-400">{new Date(v.visit_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {prop ? (
                      <Link
                        href={`/cockpit/mandats/${prop.id}`}
                        className="text-[11px] font-semibold text-[#E12B7B] hover:underline block truncate"
                      >
                        {formatMandateRef(prop.mandate_number)} - {prop.title} ({prop.city})
                      </Link>
                    ) : (
                      <span className="text-[11px] text-gray-500 block truncate">Bien visité</span>
                    )}
                    {v.signature_data_url && (
                      <div className="h-10 bg-white rounded border border-gray-200 p-1 flex items-center justify-center">
                        <img src={v.signature_data_url} alt="Signature" className="max-h-full" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
