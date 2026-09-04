'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewMandateSubmitBarProps {
    nextMandateNumber: number;
    isSubmitting: boolean;
}

export function NewMandateSubmitBar({ nextMandateNumber, isSubmitting }: NewMandateSubmitBarProps) {
    return (
        <div className="pt-4 flex items-center justify-between border-t border-gray-200">
            <Link
                href="/cockpit/mandats"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
            >
                Abandonner
            </Link>
            <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                leftIcon={<Plus className="w-5 h-5" />}
            >
                Créer et Sceller le Mandat #{nextMandateNumber}
            </Button>
        </div>
    );
}
