'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Download,
  Filter,
  Landmark,
  PenTool,
  TrendingUp,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Navigation
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export type EventCategory = 'visite' | 'notaire' | 'estimation' | 'panneau_cle' | 'autre';

export interface AgendaEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  location: string;
  contactName: string;
  contactPhone: string;
  contactRole?: string;
  mandateNumber?: number;
  propertyId?: string;
  transactionId?: string;
  notes?: string;
  isUrgent?: boolean;
}

export default function AgendaPage() {
  const {
    properties,
    buyers,
    visits,
    transactions,
    keys,
    signboards,
    estimationLeads,
    settings
  } = useNellimoStore();

  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('visite');
  const [newEventDate, setNewEventDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [newEventTime, setNewEventTime] = useState<string>('14:30');
  const [newEventLocation, setNewEventLocation] = useState('Pélissanne');
  const [newEventContactName, setNewEventContactName] = useState('');
  const [newEventContactPhone, setNewEventContactPhone] = useState('06 ');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [customEvents, setCustomEvents] = useState<AgendaEvent[]>([]);

  // 1. Consolidated Events from Store
  const allEvents: AgendaEvent[] = useMemo(() => {
    const list: AgendaEvent[] = [...customEvents];

    // A. Visits
    visits.forEach((v, idx) => {
      const prop = properties.find((p) => p.id === v.property_id);
      const buyer = buyers.find((b) => b.id === v.buyer_id);
      const vDate = v.visit_date ? v.visit_date.slice(0, 10) : new Date().toISOString().slice(0, 10);
      const vTime = v.visit_date && v.visit_date.includes('T')
        ? v.visit_date.slice(11, 16)
        : `1${4 + (idx % 4)}:00`;

      list.push({
        id: `event-visit-${v.id}`,
        title: `Visite : ${prop?.title || 'Bien immobilier'}`,
        category: 'visite',
        date: vDate,
        time: vTime,
        durationMinutes: 45,
        location: prop ? `${prop.address}, ${prop.postal_code} ${prop.city}` : 'Pélissanne',
        contactName: buyer ? `${buyer.first_name} ${buyer.last_name}` : 'Acquéreur intéressé',
        contactPhone: buyer?.phone || '06 00 00 00 00',
        contactRole: 'Acquéreur',
        mandateNumber: prop?.mandate_number,
        propertyId: prop?.id,
        notes: v.notes || 'Visite qualifiée avec bon de visite dématérialisé',
      });
    });

    // B. Transactions (Notary dates, SRU, Loan, Final deed)
    transactions.forEach((t) => {
      const prop = properties.find((p) => p.id === t.property_id);
      const location = prop ? `${prop.address}, ${prop.city}` : 'Étude Notariale';

      if (t.compromis_date) {
        list.push({
          id: `event-tx-comp-${t.id}`,
          title: `Signature Compromis : ${t.buyer_name} / ${t.seller_name}`,
          category: 'notaire',
          date: t.compromis_date.slice(0, 10),
          time: '10:00',
          durationMinutes: 90,
          location: `${t.seller_notary_office || 'Étude Notariale'}, ${t.seller_notary_name}`,
          contactName: t.seller_notary_name || 'Maître Notaire',
          contactPhone: t.seller_notary_phone || '04 90 00 00 00',
          contactRole: 'Notaire Vendeur',
          mandateNumber: prop?.mandate_number,
          propertyId: prop?.id,
          transactionId: t.id,
          notes: `Signature du compromis de vente avec dépôt séquestre (${t.deposit_amount?.toLocaleString('fr-FR')} €).`,
        });
      }

      if (t.sru_expiry_date) {
        list.push({
          id: `event-tx-sru-${t.id}`,
          title: `Fin de délai SRU 10j : ${t.buyer_name}`,
          category: 'notaire',
          date: t.sru_expiry_date.slice(0, 10),
          time: '18:00',
          durationMinutes: 15,
          location,
          contactName: t.buyer_name,
          contactPhone: t.buyer_phone,
          contactRole: 'Acquéreur sous compromis',
          mandateNumber: prop?.mandate_number,
          propertyId: prop?.id,
          transactionId: t.id,
          notes: 'Expiration légale du délai de rétractation SRU de 10 jours.',
          isUrgent: true,
        });
      }

      if (t.loan_approval_deadline) {
        list.push({
          id: `event-tx-loan-${t.id}`,
          title: `Échéance Prêt (J+60) : ${t.buyer_name}`,
          category: 'notaire',
          date: t.loan_approval_deadline.slice(0, 10),
          time: '12:00',
          durationMinutes: 30,
          location,
          contactName: t.buyer_name,
          contactPhone: t.buyer_phone,
          contactRole: 'Acquéreur (Condition Suspensive)',
          mandateNumber: prop?.mandate_number,
          propertyId: prop?.id,
          transactionId: t.id,
          notes: `Date limite d'obtention de l'offre de prêt bancaire (${t.loan_amount_requested?.toLocaleString('fr-FR') || '300 000'} €).`,
          isUrgent: true,
        });
      }

      if (t.final_deed_target_date) {
        list.push({
          id: `event-tx-deed-${t.id}`,
          title: `Acte Authentique Définitif : ${t.buyer_name}`,
          category: 'notaire',
          date: t.final_deed_target_date.slice(0, 10),
          time: '14:30',
          durationMinutes: 120,
          location: `${t.seller_notary_office || 'Étude Notariale'}, ${t.seller_notary_name}`,
          contactName: t.seller_notary_name,
          contactPhone: t.seller_notary_phone,
          contactRole: 'Notaire Instrumentaire',
          mandateNumber: prop?.mandate_number,
          propertyId: prop?.id,
          transactionId: t.id,
          notes: `Régularisation de la vente et encaissement des honoraires (${t.agency_fees_amount?.toLocaleString('fr-FR')} €).`,
        });
      }
    });

    // C. Keys borrowed
    keys.forEach((k) => {
      if (k.status === 'prete' && k.current_borrower) {
        const prop = properties.find((p) => p.id === k.property_id);
        const returnDate = k.current_borrower.expected_return_at.slice(0, 10);
        list.push({
          id: `event-key-${k.id}`,
          title: `Retour Trousseau Clés #${k.keyring_number}`,
          category: 'panneau_cle',
          date: returnDate,
          time: '17:00',
          durationMinutes: 15,
          location: 'Agence Nell\'Immo - Armoire A',
          contactName: k.current_borrower.borrower_name,
          contactPhone: k.current_borrower.borrower_phone,
          contactRole: k.current_borrower.borrower_role.toUpperCase(),
          mandateNumber: prop?.mandate_number,
          propertyId: prop?.id,
          notes: `Trousseau emprunté pour : ${k.current_borrower.purpose}`,
          isUrgent: true,
        });
      }
    });

    // D. Signboards to remove (Grenelle II 3 months limit)
    signboards.forEach((s) => {
      if (s.status === 'a_deposer' || (s.removal_deadline && s.status === 'pose')) {
        const prop = properties.find((p) => p.id === s.property_id);
        const deadline = s.removal_deadline?.slice(0, 10) || new Date().toISOString().slice(0, 10);
        list.push({
          id: `event-sign-${s.id}`,
          title: `Dépose Panneau "VENDU" (Loi Grenelle II)`,
          category: 'panneau_cle',
          date: deadline,
          time: '09:00',
          durationMinutes: 30,
          location: prop ? `${prop.address}, ${prop.city}` : (s.location_details || 'Pélissanne'),
          contactName: prop?.seller_name || 'Propriétaire',
          contactPhone: prop?.seller_phone || '06 00 00 00 00',
          contactRole: 'Lieu d\'implantation',
          mandateNumber: prop?.mandate_number,
          propertyId: prop?.id,
          notes: 'Dépose légale obligatoire dans les 3 mois sous peine d\'astreinte administrative.',
          isUrgent: true,
        });
      }
    });

    // E. Estimation leads
    estimationLeads.forEach((lead) => {
      if (lead.status === 'nouveau' || lead.status === 'en_cours') {
        const leadDate = lead.created_at.slice(0, 10);
        list.push({
          id: `event-lead-${lead.id}`,
          title: `RDV Estimation : ${lead.first_name} ${lead.last_name}`,
          category: 'estimation',
          date: leadDate,
          time: '11:00',
          durationMinutes: 60,
          location: `${lead.address || 'Adresse à confirmer'}, ${lead.city}`,
          contactName: `${lead.first_name} ${lead.last_name}`,
          contactPhone: lead.phone,
          contactRole: 'Propriétaire Vendeur Prospect',
          notes: `Projet de vente : ${lead.property_type} de ${lead.living_area} m². Estimation DVF à présenter.`,
        });
      }
    });

    return list.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`).getTime();
      const dateB = new Date(`${b.date}T${b.time}:00`).getTime();
      return dateA - dateB;
    });
  }, [customEvents, visits, properties, buyers, transactions, keys, signboards, estimationLeads]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (categoryFilter !== 'all' && ev.category !== categoryFilter) return false;
      return true;
    });
  }, [allEvents, categoryFilter]);

  // Week calculation
  const currentWeekDays = useMemo(() => {
    const curr = new Date(selectedDate);
    const day = curr.getDay(); // 0 is Sun, 1 is Mon
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diffToMonday));

    const week: { date: Date; dateStr: string; dayName: string; dayNum: number }[] = [];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      week.push({
        date: nextDate,
        dateStr: nextDate.toISOString().slice(0, 10),
        dayName: dayNames[i],
        dayNum: nextDate.getDate(),
      });
    }
    return week;
  }, [selectedDate]);

  // Navigation helpers
  const handlePrevWeek = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // WhatsApp Quick Confirmation Helper
  const sendWhatsAppConfirmation = (event: AgendaEvent) => {
    const dateFormatted = new Date(`${event.date}T00:00:00`).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    let message = `Bonjour ${event.contactName.split(' ')[0]}, c'est Nelly Fernandez de l'agence Nell'Immo. Je vous confirme notre rendez-vous du ${dateFormatted} à ${event.time} concernant ${event.title} (${event.location}). En cas de retard ou d'imprévu, n'hésitez pas à me joindre directement. Très bonne journée à vous.`;
    
    if (event.category === 'visite') {
      message = `Bonjour ${event.contactName.split(' ')[0]}, c'est Nelly Fernandez de Nell'Immo. Je vous confirme notre visite prévue le ${dateFormatted} à ${event.time} au ${event.location}. Pensez à vous munir d'une pièce d'identité pour le bon de visite légal. Au plaisir de vous faire découvrir ce bien !`;
    }

    const cleanPhone = event.contactPhone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Export iCal (.ics) RFC 5545 generator
  const exportICalendar = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SASU NellImmo//Cockpit Agenda//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:NellImmo Agenda Professionnel',
      'X-WR-TIMEZONE:Europe/Paris',
    ];

    allEvents.forEach((ev) => {
      const dtStart = ev.date.replace(/-/g, '') + 'T' + ev.time.replace(':', '') + '00';
      const startObj = new Date(`${ev.date}T${ev.time}:00`);
      const endObj = new Date(startObj.getTime() + ev.durationMinutes * 60 * 1000);
      const dtEnd =
        endObj.toISOString().slice(0, 10).replace(/-/g, '') +
        'T' +
        endObj.toTimeString().slice(0, 5).replace(':', '') +
        '00';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${ev.id}@nellimmo.fr`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${ev.title.replace(/[,;]/g, ' ')}`,
        `DESCRIPTION:${(ev.notes || '').replace(/[,;]/g, ' ')} - Contact: ${ev.contactName} (${ev.contactPhone})`,
        `LOCATION:${ev.location.replace(/[,;]/g, ' ')}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `agenda_nellimmo_${new Date().toISOString().slice(0, 10)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Fichier .ics téléchargé ! Synchronisable avec Apple Calendar, Google & Outlook.', 'success');
  };

  // Add custom event
  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const newEv: AgendaEvent = {
      id: `custom-${Date.now()}`,
      title: newEventTitle,
      category: newEventCategory,
      date: newEventDate,
      time: newEventTime,
      durationMinutes: 60,
      location: newEventLocation,
      contactName: newEventContactName || 'Nelly Fernandez',
      contactPhone: newEventContactPhone || settings.phone,
      notes: newEventNotes,
    };

    setCustomEvents((prev) => [newEv, ...prev]);
    setIsNewEventModalOpen(false);
    showToast('Rendez-vous ajouté au planning avec succès !', 'success');

    // Reset
    setNewEventTitle('');
    setNewEventNotes('');
    setNewEventContactName('');
  };

  const getCategoryBadge = (cat: EventCategory) => {
    switch (cat) {
      case 'visite':
        return {
          label: 'Visite',
          bg: 'bg-rose-50 text-[#E12B7B] border-[#F3E8EE]',
          icon: <PenTool className="w-3 h-3 text-[#E12B7B]" />,
        };
      case 'notaire':
        return {
          label: 'Notaire',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Landmark className="w-3 h-3 text-purple-600" />,
        };
      case 'estimation':
        return {
          label: 'Estimation',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <TrendingUp className="w-3 h-3 text-amber-600" />,
        };
      case 'panneau_cle':
        return {
          label: 'Clés & Panneaux',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <KeyRound className="w-3 h-3 text-emerald-600" />,
        };
      default:
        return {
          label: 'Rendez-vous',
          bg: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <CalendarIcon className="w-3 h-3 text-gray-600" />,
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <CalendarIcon className="w-4 h-4" />
            <span>Pilotage Opérationnel de l&apos;Agence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Planning & Agenda Professionnel
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Centralisation temps réel des visites, signatures d&apos;actes, délais SRU/prêts et échéances de terrain
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportICalendar}
            className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
            title="Exporter vers Apple Calendar, Google Calendar, Outlook"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Exporter iCal (.ics)</span>
          </button>

          <button
            onClick={() => setIsNewEventModalOpen(true)}
            className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Rendez-Vous</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Date Navigator + View Mode Switcher + Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F3E8EE] shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Date Navigator */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={handlePrevWeek}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition cursor-pointer"
            title="Semaine précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-800 transition cursor-pointer"
          >
            Aujourd&apos;hui
          </button>

          <button
            onClick={handleNextWeek}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition cursor-pointer"
            title="Semaine suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="font-serif font-bold text-sm text-[#131B26] ml-2">
            Semaine du {currentWeekDays[0]?.dayNum} au {currentWeekDays[6]?.dayNum}{' '}
            {currentWeekDays[6]?.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-full md:w-auto justify-center">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'week' ? 'bg-white text-[#131B26] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Vue Semaine
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'day' ? 'bg-white text-[#131B26] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Vue Jour
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'list' ? 'bg-white text-[#131B26] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Chronologie ({filteredEvents.length})
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="all">Tous les flux ({allEvents.length})</option>
            <option value="visite">Visites Acquéreurs</option>
            <option value="notaire">Signatures & Notaires</option>
            <option value="estimation">Estimations Vendeurs</option>
            <option value="panneau_cle">Clés & Panneaux</option>
          </select>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* VUE 1 : VUE SEMAINE (7 COLONNES AVEC CARTOUCHES)     */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {currentWeekDays.map((col) => {
            const isColToday = col.dateStr === new Date().toISOString().slice(0, 10);
            const dayEvents = filteredEvents.filter((e) => e.date === col.dateStr);

            return (
              <div
                key={col.dateStr}
                className={`flex flex-col rounded-3xl p-3 border min-h-[480px] transition ${
                  isColToday
                    ? 'bg-gradient-to-b from-[#FDF2F8]/60 to-white border-[#E12B7B]/30 shadow-sm'
                    : 'bg-white border-[#F3E8EE]'
                }`}
              >
                {/* Column Day Header */}
                <div className="border-b border-gray-100 pb-2.5 mb-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      {col.dayName}
                    </span>
                    <span
                      className={`text-lg font-serif font-black ${
                        isColToday ? 'text-[#E12B7B]' : 'text-[#131B26]'
                      }`}
                    >
                      {col.dayNum}
                    </span>
                  </div>

                  {isColToday && (
                    <span className="px-1.5 py-0.5 rounded bg-[#E12B7B] text-white text-[9px] font-black uppercase tracking-wider">
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>

                {/* Events list for this day */}
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-4 text-center">
                      <span className="text-[11px] text-gray-300 italic">Aucun RDV</span>
                    </div>
                  ) : (
                    dayEvents.map((ev) => {
                      const badge = getCategoryBadge(ev.category);

                      return (
                        <div
                          key={ev.id}
                          className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition text-left space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1 ${badge.bg}`}
                            >
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>
                            <span className="text-[11px] font-black text-gray-900 flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {ev.time}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-[#131B26] line-clamp-2 leading-tight">
                              {ev.title}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-gray-700 truncate max-w-[90px]">
                              {ev.contactName}
                            </span>

                            <div className="flex items-center gap-1">
                              {ev.contactPhone && (
                                <button
                                  onClick={() => sendWhatsAppConfirmation(ev)}
                                  className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition cursor-pointer"
                                  title="Envoyer confirmation WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </button>
                              )}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition"
                                title="Itinéraire GPS Google Maps"
                              >
                                <Navigation className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VUE 2 : VUE JOUR DÉTAILLÉE                           */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                Planning Quotidien
              </span>
              <h2 className="text-xl font-serif font-bold text-[#131B26]">
                {selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#E12B7B]">
                {filteredEvents.filter((e) => e.date === selectedDate.toISOString().slice(0, 10)).length} engagement(s) prévu(s)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredEvents
              .filter((e) => e.date === selectedDate.toISOString().slice(0, 10))
              .map((ev) => {
                const badge = getCategoryBadge(ev.category);

                return (
                  <div
                    key={ev.id}
                    className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 text-center shrink-0">
                        <span className="text-base font-black text-[#131B26] block">{ev.time}</span>
                        <span className="text-[10px] text-gray-400 block">{ev.durationMinutes} min</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {ev.isUrgent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                              Priorité Haute
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#131B26]">{ev.title}</h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{ev.location}</span>
                        </p>
                        {ev.notes && <p className="text-xs text-gray-500 italic mt-1">{ev.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => sendWhatsAppConfirmation(ev)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Rappel WhatsApp</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition"
                        title="Itinéraire Waze / Maps"
                      >
                        <Navigation className="w-4 h-4 text-blue-600" />
                      </a>
                    </div>
                  </div>
                );
              })}

            {filteredEvents.filter((e) => e.date === selectedDate.toISOString().slice(0, 10)).length === 0 && (
              <div className="p-8 text-center text-gray-400 italic">
                Aucun événement prévu pour cette date. Vous pouvez ajouter un rendez-vous grâce au bouton ci-dessus.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VUE 3 : CHRONOLOGIE COMPLÈTE                         */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-base text-[#131B26]">
              Chronologie Intégrale des Échéances & Rendez-Vous ({filteredEvents.length})
            </h3>
            <span className="text-xs text-gray-400">Trié par date croissante</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredEvents.map((ev) => {
              const badge = getCategoryBadge(ev.category);
              const eventDate = new Date(`${ev.date}T${ev.time}:00`);
              const isPast = eventDate.getTime() < Date.now();

              return (
                <div
                  key={ev.id}
                  className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isPast ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 shrink-0 text-center bg-gray-50 p-2 rounded-xl border border-gray-200">
                      <span className="text-xs font-bold text-gray-500 block uppercase">
                        {eventDate.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </span>
                      <span className="text-base font-black text-gray-900 block">
                        {eventDate.getDate()} {eventDate.toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      <span className="text-[10px] text-[#E12B7B] font-bold block">{ev.time}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {ev.mandateNumber && (
                          <span className="text-[10px] font-mono font-bold text-gray-500">
                            {formatMandateRef(ev.mandateNumber)}
                          </span>
                        )}
                        {ev.isUrgent && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            Alerte Délais
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-sm text-[#131B26]">{ev.title}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{ev.location}</span>
                        <span>• Contact : {ev.contactName} ({ev.contactPhone})</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => sendWhatsAppConfirmation(ev)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>

                    {ev.propertyId && (
                      <Link
                        href={`/cockpit/mandats/${ev.propertyId}`}
                        className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition"
                        title="Voir le mandat"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL : AJOUT D'UN NOUVEAU RENDEZ-VOUS RAPIDE        */}
      {/* ---------------------------------------------------- */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#E12B7B]" />
                Nouveau Rendez-Vous Agence
              </h3>
              <button
                onClick={() => setIsNewEventModalOpen(false)}
                className="text-gray-400 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">
                  Intitulé du Rendez-Vous
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Visite contre-visite M. Bernard, RDV Notaire, Expertise..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                  >
                    <option value="visite">Visite Acquéreur</option>
                    <option value="notaire">Rendez-Vous Notaire</option>
                    <option value="estimation">Rendez-Vous Estimation</option>
                    <option value="panneau_cle">Pose Panneau / Clé</option>
                    <option value="autre">Autre Rendez-Vous</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Lieu / Adresse</label>
                  <input
                    type="text"
                    required
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Nom du Contact</label>
                  <input
                    type="text"
                    placeholder="Ex: Jean Dupont"
                    value={newEventContactName}
                    onChange={(e) => setNewEventContactName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={newEventContactPhone}
                    onChange={(e) => setNewEventContactPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Notes / Consignes</label>
                <textarea
                  rows={2}
                  placeholder="Points de vigilance, code portail, présence des propriétaires..."
                  value={newEventNotes}
                  onChange={(e) => setNewEventNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewEventModalOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-800 font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  Enregistrer dans l&apos;Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
