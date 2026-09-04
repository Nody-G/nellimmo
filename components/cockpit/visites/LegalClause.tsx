'use client';

import { Buyer, Property } from '@/lib/types';

interface LegalClauseProps {
    buyer?: Buyer;
    property?: Property;
}

export function LegalClause({ buyer, property }: LegalClauseProps) {
    return (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-2">
            <span className="font-bold text-gray-900 block">
                Engagement Juridique du Visiteur (Loi Hoguet) :
            </span>
            <p className="leading-relaxed text-[11px] text-gray-600">
                « Je soussigné(e) {buyer?.first_name} {buyer?.last_name}, reconnais que l{"\u2019"}agence
                SASU Nell{"\u2019"}Immo m{"\u2019"}a fait visiter ce jour le bien désigné ci-dessus au prix de{' '}
                {property?.price_fai.toLocaleString('fr-FR')} € FAI. Je m{"\u2019"}interdis formellement de
                traiter directement ou indirectement avec le mandant sans le concours de l{"\u2019"}agence pendant toute la
                durée légale. »
            </p>
        </div>
    );
}
