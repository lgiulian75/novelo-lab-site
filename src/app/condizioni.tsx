import React from 'react';
import { Wrap, Label, H, P, Page } from '../components/ui';
export default function Condizioni() {
  return <Page><Wrap style={{ paddingTop: 80, maxWidth: 800 }}><Label>Informazioni</Label><H size={48} style={{ marginVertical: 16 }}>Condizioni</H>
    <P>Ogni creazione NoveloLab è realizzata su misura nel nostro laboratorio. I prezzi indicati si riferiscono alla creazione base e possono variare in base a personalizzazione, dimensioni e finiture.</P>
    <P style={{ marginTop: 16 }}>I tempi di lavorazione dipendono dal tipo di creazione e vengono confermati al checkout insieme alle spese di spedizione. Modifica questo testo con le tue condizioni di vendita.</P></Wrap></Page>;
}
