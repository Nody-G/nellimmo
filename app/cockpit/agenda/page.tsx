'use client';

import React, { useState, useMemo, Suspense } from 'react';
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

function AgendaContent() {
  const searchParams = useSearchParams();
  const prefillNewVisit = searchParams.get('newVisit') === 'true';
  const prefillName = searchParams.get('contactName') || '';
  const prefillPhone = searchParams.get('contactPhone') || '06 ';
  const prefillNotes = searchParams.get('notes') || '';

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

  const [viewMode, setViewMode] = useState<AgendaViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <AgendaHeader
        onNewEvent={() => setIsNewEventModalOpen(true)}
        onExportICal={handleDownloadICal}
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
        <ListView events={filteredEvents} currentTime={currentTime} onWhatsApp={handleWhatsApp} />
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
