'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import {
  buildAllEvents,
  filterEventsByCategory,
  computeWeekDays,
  openWhatsAppConfirmation,
  downloadICalendar,
} from '@/components/cockpit/agenda/agenda-types';
import type { AgendaEvent } from '@/components/cockpit/agenda/agenda-types';
import { AgendaHeader } from '@/components/cockpit/agenda/AgendaHeader';
import { AgendaControlBar } from '@/components/cockpit/agenda/AgendaControlBar';
import type { AgendaViewMode } from '@/components/cockpit/agenda/AgendaControlBar';
import { WeekView } from '@/components/cockpit/agenda/WeekView';
import { DayView } from '@/components/cockpit/agenda/DayView';
import { ListView } from '@/components/cockpit/agenda/ListView';
import { NewEventModal } from '@/components/cockpit/agenda/NewEventModal';
import { useAgendaNewEvent } from '@/components/cockpit/agenda/useAgendaNewEvent';
import { useGoogleCalendar } from '@/components/cockpit/agenda/useGoogleCalendar';

function AgendaContent() {
  const searchParams = useSearchParams();
  const prefillNewVisit = searchParams.get('newVisit') === 'true';
  const prefillName = searchParams.get('contactName') || '';
  const prefillPhone = searchParams.get('contactPhone') || '06 ';
  const prefillNotes = searchParams.get('notes') || '';
  const deepLinkEventId = searchParams.get('eventId') || '';

  const {
    properties,
    buyers,
    visits,
    transactions,
    keys,
    signboards,
    estimationLeads,
  } = useNellimoStore();

  const { showToast } = useToast();
  const { createEvent, isSyncing: isSyncingGoogle } = useGoogleCalendar();

  const [viewMode, setViewMode] = useState<AgendaViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [highlightEventId, setHighlightEventId] = useState<string>('');

  const {
    customEvents,
    isNewEventModalOpen,
    setIsNewEventModalOpen,
    newEventTitle,
    setNewEventTitle,
    newEventCategory,
    setNewEventCategory,
    newEventDate,
    setNewEventDate,
    newEventTime,
    setNewEventTime,
    newEventLocation,
    setNewEventLocation,
    newEventContactName,
    setNewEventContactName,
    newEventContactPhone,
    setNewEventContactPhone,
    newEventNotes,
    setNewEventNotes,
    handleCreateCustomEvent,
  } = useAgendaNewEvent({
    prefillNewVisit,
    prefillName,
    prefillPhone,
    prefillNotes,
  });

  const currentTime = React.useSyncExternalStore(
    (onStoreChange) => {
      const timer = setInterval(onStoreChange, 60000);
      return () => clearInterval(timer);
    },
    () => Date.now(),
    () => 0
  );

  // 1. Consolidated Events from Store
  const allEvents: AgendaEvent[] = useMemo(
    () =>
      buildAllEvents(customEvents, {
        properties,
        buyers,
        visits,
        transactions,
        keys,
        signboards,
        estimationLeads,
      }),
    [customEvents, properties, buyers, visits, transactions, keys, signboards, estimationLeads]
  );

  // 2. Filtered Events
  const filteredEvents = useMemo(
    () => filterEventsByCategory(allEvents, categoryFilter),
    [allEvents, categoryFilter]
  );

  // 3. Week Days Calculation
  const currentWeekDays = useMemo(() => computeWeekDays(selectedDate), [selectedDate]);

  // Deep-link : mise en évidence de l'événement ciblé via ?eventId=
  useEffect(() => {
    if (!deepLinkEventId) return;
    const target = allEvents.find((e) => e.id === deepLinkEventId);
    if (!target) return;
    setCategoryFilter('all');
    setViewMode('list');
    setHighlightEventId(deepLinkEventId);
    const scrollTimer = setTimeout(() => {
      const el = document.getElementById(`event-${deepLinkEventId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    const clearTimer = setTimeout(() => setHighlightEventId(''), 4000);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [deepLinkEventId, allEvents]);

  // Navigation handlers
  const handlePrevWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 7);
    setSelectedDate(next);
  };

  const handleNextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleWhatsApp = (event: AgendaEvent) => {
    if (!event.contactPhone || event.contactPhone.trim() === '' || event.contactPhone === '06 ') {
      showToast('Numéro de téléphone manquant pour ce contact', 'error');
      return;
    }
    openWhatsAppConfirmation(event);
  };

  const handleDownloadICal = () => {
    downloadICalendar(allEvents);
    showToast('Fichier iCalendar exporté pour votre smartphone !', 'success');
  };

  const handleSyncGoogleCalendar = async () => {
    if (filteredEvents.length === 0) {
      showToast('Aucun événement à synchroniser sur cette période.', 'info');
      return;
    }
    let synced = 0;
    for (const event of filteredEvents) {
      const created = await createEvent(event);
      if (created) synced++;
    }
    if (synced > 0) {
      showToast(`${synced} événement(s) synchronisé(s) avec Google Agenda.`, 'success');
    }
  };

  const tourStops = useMemo(() => {
    const stops: string[] = [];
    filteredEvents.forEach((e) => {
      if (e.location && e.location.trim()) {
        const loc = e.location.trim();
        if (!stops.includes(loc)) {
          stops.push(loc);
        }
      }
    });
    return stops.slice(0, 8);
  }, [filteredEvents]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <AgendaHeader
        onNewEvent={() => setIsNewEventModalOpen(true)}
        onExportICal={handleDownloadICal}
        tourStops={tourStops}
        onSyncGoogleCalendar={handleSyncGoogleCalendar}
        isSyncingGoogle={isSyncingGoogle}
      />

      <AgendaControlBar
        viewMode={viewMode}
        categoryFilter={categoryFilter}
        onViewModeChange={setViewMode}
        onCategoryFilterChange={setCategoryFilter}
        weekDays={currentWeekDays}
        allEventsCount={allEvents.length}
        filteredEventsCount={filteredEvents.length}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />

      {viewMode === 'week' && (
        <WeekView weekDays={currentWeekDays} events={filteredEvents} onWhatsApp={handleWhatsApp} />
      )}

      {viewMode === 'day' && (
        <DayView selectedDate={selectedDate} events={filteredEvents} onWhatsApp={handleWhatsApp} />
      )}

      {viewMode === 'list' && (
        <ListView
          events={filteredEvents}
          currentTime={currentTime}
          onWhatsApp={handleWhatsApp}
          highlightEventId={highlightEventId}
        />
      )}

      <NewEventModal
        isOpen={isNewEventModalOpen}
        title={newEventTitle}
        category={newEventCategory}
        date={newEventDate}
        time={newEventTime}
        location={newEventLocation}
        contactName={newEventContactName}
        contactPhone={newEventContactPhone}
        notes={newEventNotes}
        onTitleChange={setNewEventTitle}
        onCategoryChange={setNewEventCategory}
        onDateChange={setNewEventDate}
        onTimeChange={setNewEventTime}
        onLocationChange={setNewEventLocation}
        onContactNameChange={setNewEventContactName}
        onContactPhoneChange={setNewEventContactPhone}
        onNotesChange={setNewEventNotes}
        onSubmit={handleCreateCustomEvent}
        onClose={() => setIsNewEventModalOpen(false)}
      />
    </div>
  );
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Chargement de l&apos;agenda...</div>}>
      <AgendaContent />
    </Suspense>
  );
}
