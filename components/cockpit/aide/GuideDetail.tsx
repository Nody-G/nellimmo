'use client';

import Link from 'next/link';
import {
    AlertTriangle,
    ArrowRight,
    BookOpen,
    Check,
    Clock,
    Copy,
    FileText,
    HelpCircle,
    Info,
    Layers,
    MapPin,
    MessageSquare,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';
import type { HelpGuide, ReadyToUseScript } from '@/lib/help-content';

interface GuideDetailProps {
    guide: HelpGuide | null;
    completedSteps: Record<string, boolean>;
    copiedScriptId: string | null;
    onToggleStep: (stepNumber: number) => void;
    onCopyScript: (script: ReadyToUseScript) => void;
}

/** Right column: full detail of the active guide. */
export function GuideDetail({
    guide,
    completedSteps,
    copiedScriptId,
    onToggleStep,
    onCopyScript,
}: GuideDetailProps) {
    if (!guide) {
        return (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-700">
                    Sélectionnez un guide dans la liste
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0">
            <GuideHeader guide={guide} />

            <ObjectiveCard objective={guide.objective} />

            {guide.prerequisites.length > 0 && <PrerequisitesList items={guide.prerequisites} />}

            <StepsSection
                guide={guide}
                completedSteps={completedSteps}
                onToggleStep={onToggleStep}
            />

            <ConcreteExampleCard example={guide.concreteExample} />

            {guide.legalAlerts.length > 0 && <LegalAlertsSection alerts={guide.legalAlerts} />}

            {guide.scripts.length > 0 && (
                <ScriptsSection
                    scripts={guide.scripts}
                    copiedScriptId={copiedScriptId}
                    onCopyScript={onCopyScript}
                />
            )}

            {guide.faqs.length > 0 && <FaqsSection faqs={guide.faqs} />}

            <BottomCta guide={guide} />
        </div>
    );
}

function GuideHeader({ guide }: { guide: HelpGuide }) {
    return (
        <div className="space-y-3 border-b border-gray-100 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF5F8] text-[#E12B7B] text-[11px] font-bold uppercase tracking-wider">
                        {guide.categoryLabel}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {guide.readTimeMinutes} minutes
                    </span>
                </div>

                <Link
                    href={guide.toolRoute}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold shadow-xs transition"
                >
                    <span>Accéder à : {guide.toolLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                {guide.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{guide.summary}</p>
        </div>
    );
}

function ObjectiveCard({ objective }: { objective: string }) {
    return (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5F8] to-white border border-[#F3E8EE] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E12B7B] block">
                    Objectif Stratégique pour Nelly
                </span>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{objective}</p>
            </div>
        </div>
    );
}

function PrerequisitesList({ items }: { items: string[] }) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>Prérequis & Documents Indispensables</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((prereq, idx) => (
                    <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-700"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E12B7B] mt-1.5 shrink-0" />
                        <span className="leading-snug">{prereq}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface StepsSectionProps {
    guide: HelpGuide;
    completedSteps: Record<string, boolean>;
    onToggleStep: (stepNumber: number) => void;
}

function StepsSection({ guide, completedSteps, onToggleStep }: StepsSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E12B7B]" />
                    <span>Procédure Pas-à-Pas (À Cocher)</span>
                </h3>
                <span className="text-[11px] text-gray-400">
                    Cochez les étapes au fur et à mesure de votre progression
                </span>
            </div>

            <div className="space-y-3">
                {guide.steps.map((step) => {
                    const stepKey = `${guide.id}-step-${step.number}`;
                    const isDone = !!completedSteps[stepKey];

                    return (
                        <div
                            key={step.number}
                            className={`p-4 rounded-2xl border transition-all ${isDone
                                    ? 'bg-emerald-50/40 border-emerald-200/80'
                                    : 'bg-white border-gray-200/80 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3.5">
                                <button
                                    onClick={() => onToggleStep(step.number)}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition cursor-pointer ${isDone
                                            ? 'bg-emerald-500 text-white shadow-xs'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
                                        }`}
                                    title={isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                                >
                                    {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
                                </button>

                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4
                                            className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-gray-500' : 'text-gray-900'
                                                }`}
                                        >
                                            {step.title}
                                        </h4>
                                        {isDone && (
                                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                                Validé ✓
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {step.tips && (
                                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2 mt-2">
                                            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{step.tips}</span>
                                        </div>
                                    )}

                                    {step.proTip && (
                                        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-950 flex items-start gap-2 mt-2">
                                            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                            <span className="leading-snug">
                                                <strong>Conseil Pro :</strong> {step.proTip}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ConcreteExampleCard({ example }: { example: HelpGuide['concreteExample'] }) {
    return (
        <div className="p-6 rounded-3xl bg-[#0E141D] text-white border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#C59A45] text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#E12B7B]" />
                    <span>Cas Concret Vécut en Pays Salonais</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {example.location}
                </span>
            </div>

            <h4 className="text-base font-serif font-bold text-white">{example.title}</h4>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                        Le Contexte :
                    </span>
                    <p>{example.context}</p>
                </div>

                <div>
                    <span className="text-[#C59A45] font-bold uppercase tracking-wider text-[10px] block mb-1">
                        L{"\u2019"}Action de Nelly avec le Cockpit :
                    </span>
                    <p>{example.solution}</p>
                </div>

                <div>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                        Le Résultat Obtenu :
                    </span>
                    <p className="text-emerald-200 font-semibold">{example.outcome}</p>
                </div>
            </div>

            {example.keyFigures && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-800">
                    {example.keyFigures.map((fig, idx) => (
                        <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center"
                        >
                            <span className="text-[10px] text-gray-400 block truncate">
                                {fig.label}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#F44293] block mt-0.5">
                                {fig.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function LegalAlertsSection({ alerts }: { alerts: HelpGuide['legalAlerts'] }) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Points de Vigilance Juridique & Risques Évités</span>
            </h3>

            <div className="space-y-3">
                {alerts.map((alert, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-2xl border ${alert.type === 'danger'
                                ? 'bg-red-50/70 border-red-200 text-red-950'
                                : 'bg-amber-50/70 border-amber-200 text-amber-950'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {alert.type === 'danger' ? (
                                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1 text-xs">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-sm leading-snug">
                                        {alert.title}
                                    </span>
                                    {alert.lawReference && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 font-mono font-bold text-gray-600 border border-gray-200">
                                            {alert.lawReference}
                                        </span>
                                    )}
                                </div>
                                <p className="leading-relaxed opacity-90">{alert.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ScriptsSectionProps {
    scripts: HelpGuide['scripts'];
    copiedScriptId: string | null;
    onCopyScript: (script: ReadyToUseScript) => void;
}

function ScriptsSection({ scripts, copiedScriptId, onCopyScript }: ScriptsSectionProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E12B7B]" />
                <span>Modèles de Messages & Scripts Prêts à Copier</span>
            </h3>

            <div className="space-y-3">
                {scripts.map((script) => {
                    const isCopied = copiedScriptId === script.id;

                    return (
                        <div
                            key={script.id}
                            className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2.5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900">
                                        {script.title}
                                    </span>
                                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-white border border-gray-200 text-gray-600">
                                        {script.channel}
                                    </span>
                                </div>

                                <button
                                    onClick={() => onCopyScript(script)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${isCopied
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-2xs'
                                        }`}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Copié !</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copier le texte</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-gray-200 font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {script.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FaqsSection({ faqs }: { faqs: HelpGuide['faqs'] }) {
    return (
        <div className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Questions Fréquentes sur cette Fonctionnalité</span>
            </h3>

            <div className="space-y-2">
                {faqs.map((faq, idx) => (
                    <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 space-y-1"
                    >
                        <span className="text-xs font-bold text-gray-900 block">{faq.question}</span>
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BottomCta({ guide }: { guide: HelpGuide }) {
    return (
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
                Besoin d{"\u2019"}aide supplémentaire ? Contactez Niels ou ouvrez le{" "}
                <strong>Nell{"\u2019"}IA Infinite Lab</strong>.
            </div>
            <Link
                href={guide.toolRoute}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
                <span>Lancer : {guide.toolLabel}</span>
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
