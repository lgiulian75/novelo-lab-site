export const CATS = ['Eventi', 'Bambini', 'Cucina e Regali', 'Decorazioni Casa'];
export type Product = { id: string; name: string; cat: string; price: number; img: any; imgs: any[]; desc: string };
export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Decorazione Eventi e Bomboniere', cat: 'Eventi', price: 15, img: require('../../assets/images/p1.jpg'), imgs: [require('../../assets/images/p1.jpg'), require('../../assets/images/p1_2.jpg'), require('../../assets/images/p1_3.jpg')], desc: 'Segnaposto, decorazioni e bomboniere in legno tagliate al laser, perfette per matrimoni, battesimi e feste.' },
  { id: 'p2', name: 'Nome in Legno per Cameretta', cat: 'Bambini', price: 25, img: require('../../assets/images/p2.jpg'), imgs: [require('../../assets/images/p2.jpg'), require('../../assets/images/p2_2.jpg'), require('../../assets/images/p2_3.jpg')], desc: 'Il nome del tuo bambino in legno, tagliato al laser, da appendere o appoggiare nella cameretta.' },
  { id: 'p3', name: 'Tagliere Personalizzato', cat: 'Cucina e Regali', price: 35, img: require('../../assets/images/p3.jpg'), imgs: [require('../../assets/images/p3.jpg'), require('../../assets/images/p3_2.jpg'), require('../../assets/images/p3_3.jpg')], desc: 'Tagliere in legno con incisione di nome, frase o data: un regalo utile e per sempre.' },
  { id: 'p4', name: 'Targa Famiglia in Legno', cat: 'Decorazioni Casa', price: 45, img: require('../../assets/images/p4.jpg'), imgs: [require('../../assets/images/p4.jpg'), require('../../assets/images/p4_2.jpg'), require('../../assets/images/p4_3.jpg')], desc: "Targa in legno con il nome della famiglia o una dedica, ideale per l'ingresso o il soggiorno." },
];
export const HERO = require('../../assets/images/hero.jpg');
export const eur = (n: number) => n.toFixed(2) + ' €';
