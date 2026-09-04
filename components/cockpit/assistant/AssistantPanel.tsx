'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, Loader2, Flame, Snowflake, Sun, User, MapPin, Home, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { QualificationResult } from '@/lib/assistant';

interface AssistantPanelProps {
    /** Nom du prospect pré-rempli (optionnel). */
    initialName?: string;
    /** Message du prospect pré-rempli (optionnel). */
    initialMessage?: string;
}

const LEVEL_META: Record<QualificationResult['level'], { label: string; icon: React.ReactNode; badgeClass: string }> = {
    chaud: { label: 'Lead chaud', icon: <Flame className="w-3.5 h-3.5" />, badgeClass: 'bg-red-100 text-red-700' },
    tiède: { label: 'Lead tiède', icon: <Sun className="w-3.5 h-3.5" />, badgeClass: 'bg-amber-100 text-amber-700' },
    froid: { label: 'Lead froid', icon: <Snowflake className="w-3.5 h-3.5" />, badgeClass: 'bg-blue-100 text-blue-700' },
};

function scoreColor(score: number): string {
    if (score >= 70) return '#E11D48';
    if (score >= 45) return '#D97706';
    return '#3B82F6';
}

function ScoreGauge({ score }: { score: number }) {
    const color = scoreColor(score);
    const circumference = 2 * Math.PI * 26;
    const offset = circumference * (1 - score / 100);
    return (
        <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#F3E8EE" strokeWidth="6" />
                <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-serif font-bold" style={{ color }}>
                    {score}
                </span>
            </div>
        </div>
    );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2 text-xs">
            <span className="text-[#E12B7B] mt-0.5">{icon}</span>
            <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
            </div>
        </div>
    );
}

export function AssistantPanel({ initialName, initialMessage }: AssistantPanelProps) {
    const [name, setName] = useState(initialName || '');
    const [city, setCity] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [message, setMessage] = useState(initialMessage || '');
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<QualificationResult | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || busy) return;
        setBusy(true);
        setError('');
        setResult(null);
        try {
            const res = await fetch('/api/ai/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kind: 'contact',
                    name: name.trim() || undefined,
                    city: city.trim() || undefined,
                    propertyType: propertyType.trim() || undefined,
                    message: message.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error || 'Erreur lors de la qualification du lead.');
                return;
            }
            setResult(data.result as QualificationResult);
        } catch {
            setError('Impossible de contacter l\'assistant. Vérifiez votre connexion.');
        } finally {
            setBusy(false);
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result.suggestedReply);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* silencieux */
        }
    };

    const levelMeta = result ? LEVEL_META[result.level] : null;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E12B7B]" />
                    <CardTitle className="text-sm">Assistant IA — Qualification des Leads Entrants</CardTitle>
                </div>
                <p className="text-xs text-gray-500">
                    {'Collez le message d\u2019un prospect reçu (contact, estimation) : l\u2019assistant le qualifie et rédige une réponse à votre plume.'}
                </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <form onSubmit={handleAnalyze} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <User className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nom du prospect"
                                className="w-full pl-8 pr-3 py-2 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Secteur (ex: Pélissanne)"
                                className="w-full pl-8 pr-3 py-2 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                            />
                        </div>
                        <div className="relative">
                            <Home className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                placeholder="Type de bien (ex: villa)"
                                className="w-full pl-8 pr-3 py-2 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
                            />
                        </div>
                    </div>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder={'Collez ici le message du prospect (ex: "Bonjour, je souhaite vendre ma villa à Pélissanne, environ 350 000 €, nous ne sommes pas pressés...")'}
                        className="w-full px-3 py-2.5 text-xs border border-[#F3E8EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30 resize-y"
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">
                            {result?.source === 'deepseek' ? 'Analyse IA (DeepSeek)' : 'Analyse locale (hors-ligne)'}
                        </span>
                        <button
                            type="submit"
                            disabled={busy || !message.trim()}
                            className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            {busy ? 'Analyse...' : 'Qualifier le lead'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                        {error}
                    </div>
                )}

                {result && levelMeta && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Score & niveau */}
                        <div className="flex items-center gap-4 p-3.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl">
                            <ScoreGauge score={result.score} />
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${levelMeta.badgeClass}`}>
                                        {levelMeta.icon}
                                        {levelMeta.label}
                                    </span>
                                    <span className="text-xs font-bold text-gray-800">{result.intent}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                                    <InfoChip icon={<span className="text-[10px] font-bold">€</span>} label="Budget" value={result.budget} />
                                    <InfoChip icon={<span className="text-[10px] font-bold">⏱</span>} label="Délai" value={result.timeline} />
                                </div>
                            </div>
                        </div>

                        {/* Motivations & points d'attention */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-emerald-700 mb-2">
                                    <Lightbulb className="w-3.5 h-3.5" /> Motivations
                                </div>
                                {result.motivations.length > 0 ? (
                                    <ul className="space-y-1">
                                        {result.motivations.map((m, i) => (
                                            <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                                                <span className="text-emerald-500 mt-0.5">•</span> {m}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400">Aucune motivation explicite détectée.</p>
                                )}
                            </div>
                            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-amber-700 mb-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> {'Points d\u2019attention'}
                                </div>
                                {result.concerns.length > 0 ? (
                                    <ul className="space-y-1">
                                        {result.concerns.map((c, i) => (
                                            <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                                                <span className="text-amber-500 mt-0.5">•</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400">Aucun point bloquant détecté.</p>
                                )}
                            </div>
                        </div>

                        {/* Prochaine action */}
                        <div className="flex items-start gap-2 p-3 bg-[#131B26] text-white rounded-xl">
                            <ArrowRight className="w-4 h-4 text-[#C59A45] shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59A45] block">Prochaine action</span>
                                <span className="text-xs">{result.nextAction}</span>
                            </div>
                        </div>

                        {/* Réponse suggérée */}
                        <div className="p-3.5 bg-white border border-[#F3E8EE] rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase text-gray-500">Réponse suggérée (à votre plume)</span>
                                <button
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                >
                                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    {copied ? 'Copié' : 'Copier'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{result.suggestedReply}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
