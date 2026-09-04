'use client';

import { useState } from 'react';
import type { AgendaEvent, EventCategory } from './agenda-types';
import { useToast } from '@/components/ui/Toast';

interface UseAgendaNewEventProps {
  prefillNewVisit: boolean;
  prefillName: string;
  prefillPhone: string;
  prefillNotes: string;
}

export function useAgendaNewEvent({
  prefillNewVisit,
  prefillName,
  prefillPhone,
  prefillNotes,
}: UseAgendaNewEventProps) {
  const { showToast } = useToast();

  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(prefillNewVisit);
  const [newEventTitle, setNewEventTitle] = useState(() => prefillName ? `Visite avec ${prefillName}` : '');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('visite');
  const [newEventDate, setNewEventDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [newEventTime, setNewEventTime] = useState<string>('14:30');
  const [newEventLocation, setNewEventLocation] = useState('Pélissanne');
  const [newEventContactName, setNewEventContactName] = useState(prefillName);
  const [newEventContactPhone, setNewEventContactPhone] = useState(prefillPhone);
  const [newEventNotes, setNewEventNotes] = useState(prefillNotes);
  const [customEvents, setCustomEvents] = useState<AgendaEvent[]>([]);

  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const newEv: AgendaEvent = {
      id: `custom-${Date.now()}`,
      title: newEventTitle,
      category: newEventCategory,
      date: newEventDate,
      time: newEventTime,
      durationMinutes: 45,
      location: newEventLocation,
      contactName: newEventContactName,
      contactPhone: newEventContactPhone,
      notes: newEventNotes,
    };

    setCustomEvents((prev) => [...prev, newEv]);
    setIsNewEventModalOpen(false);
    showToast('Événement ajouté avec succès à votre planning.', 'success');

    // Reset fields
    setNewEventTitle('');
    setNewEventContactName('');
    setNewEventContactPhone('06 ');
    setNewEventNotes('');
  };

  return {
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
  };
}
