'use client';

import React, { useState, useMemo } from 'react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import {
  buildAllEvents,
  filterEventsByCategory,
  computeWeekDays,
  openWhatsAppConfirmation,
  downloadICalendar,
} from '@/components/cockpit/agenda/agenda-types';
import type { AgendaEvent, EventCategory } from '@/components/cockpit/agenda/agenda-types';
import { AgendaHeader } from '@/components/cockpit/agenda/AgendaHeader';
import { AgendaControlBar } from '@/components/cockpit/agenda/AgendaControlBar';
import type { AgendaViewMode } from '@/components/cockpit/agenda/AgendaControlBar';
import { WeekView } from '@/components/cockpit/agenda/WeekView';
import { DayView } from '@/components/cockpit/agenda/DayView';
import { ListView } from '@/components/cockpit/agenda/ListView';
import { NewEventModal } from '@/components/cockpit/agenda/NewEventModal';

export default function AgendaPage() {
  const {
    properties,
    buyers,
    visits,
    transactions,
    keys,
    signboards,
    estimationLeads,
    settings,
  } = useNellimoStore();

  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<AgendaViewMode>('week');
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

  // 3. Week calculation
  const currentWeekDays = useMemo(() => computeWeekDays(selectedDate), [selectedDate]);

  // 4. Navigation helpers
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

  // 5. WhatsApp Quick Confirmation
  const handleWhatsApp = (event: AgendaEvent) => {
    openWhatsAppConfirmation(event);
  };

  // 6. Export iCal
  const handleExportICal = () => {
    downloadICalendar(allEvents);
    showToast('Fichier .ics téléchargé ! Synchronisable avec Apple Calendar, Google & Outlook.', 'success');
  };

  // 7. Add custom event
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

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <AgendaHeader onExportICal={handleExportICal} onNewEvent={() => setIsNewEventModalOpen(true)} />

      <AgendaControlBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categoryFilter={categoryFilter}
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
