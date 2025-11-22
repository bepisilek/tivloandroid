// Hungarian price references for Statistics tab
// Based on realistic 2024 Hungarian prices

export interface PriceReference {
  maxPrice: number;
  hu: string;
  en: string;
  de: string;
}

// About 100 price levels from small items to apartment (40M HUF)
export const priceReferences: PriceReference[] = [
  // 0-500 Ft
  { maxPrice: 100, hu: 'egy rágógumi', en: 'a piece of gum', de: 'ein Kaugummi' },
  { maxPrice: 150, hu: 'egy zsemlye', en: 'a bread roll', de: 'ein Brötchen' },
  { maxPrice: 200, hu: 'egy kifli', en: 'a croissant', de: 'ein Croissant' },
  { maxPrice: 250, hu: 'egy banán', en: 'a banana', de: 'eine Banane' },
  { maxPrice: 300, hu: 'egy liter tej', en: 'a liter of milk', de: 'ein Liter Milch' },
  { maxPrice: 350, hu: 'egy doboz gyufa', en: 'a box of matches', de: 'eine Streichholzschachtel' },
  { maxPrice: 400, hu: 'egy kenyér', en: 'a loaf of bread', de: 'ein Brot' },
  { maxPrice: 450, hu: 'egy csomag zsebkendő', en: 'a pack of tissues', de: 'ein Päckchen Taschentücher' },
  { maxPrice: 500, hu: 'egy liter benzin', en: 'a liter of gasoline', de: 'ein Liter Benzin' },

  // 500-1000 Ft
  { maxPrice: 550, hu: 'egy doboz tojás (6 db)', en: '6 eggs', de: '6 Eier' },
  { maxPrice: 600, hu: 'egy zacskó chips', en: 'a bag of chips', de: 'eine Tüte Chips' },
  { maxPrice: 650, hu: 'egy pohár fagylalt', en: 'a scoop of ice cream', de: 'eine Kugel Eis' },
  { maxPrice: 700, hu: 'egy üveg ásványvíz (1.5L)', en: 'a bottle of water', de: 'eine Flasche Wasser' },
  { maxPrice: 750, hu: 'egy csomag vaj', en: 'a pack of butter', de: 'ein Päckchen Butter' },
  { maxPrice: 800, hu: 'egy korsó sör a kocsmában', en: 'a pint of beer', de: 'ein Glas Bier' },
  { maxPrice: 850, hu: 'egy fánk', en: 'a donut', de: 'ein Donut' },
  { maxPrice: 900, hu: 'egy hot-dog', en: 'a hot dog', de: 'ein Hot Dog' },
  { maxPrice: 950, hu: 'egy kürtőskalács', en: 'a chimney cake', de: 'ein Baumstriezel' },
  { maxPrice: 1000, hu: 'egy lángos', en: 'a Hungarian fried bread', de: 'ein Langos' },

  // 1000-2000 Ft
  { maxPrice: 1100, hu: 'egy kávé a kávézóban', en: 'a coffee at a café', de: 'ein Kaffee im Café' },
  { maxPrice: 1200, hu: 'egy doboz cigaretta', en: 'a pack of cigarettes', de: 'eine Schachtel Zigaretten' },
  { maxPrice: 1300, hu: 'egy hamburger', en: 'a hamburger', de: 'ein Hamburger' },
  { maxPrice: 1400, hu: 'egy üveg bor (olcsóbb)', en: 'a bottle of wine (budget)', de: 'eine Flasche Wein (günstig)' },
  { maxPrice: 1500, hu: 'egy mozijegy (normál)', en: 'a movie ticket', de: 'eine Kinokarte' },
  { maxPrice: 1600, hu: 'egy pizza szelet', en: 'a slice of pizza', de: 'ein Stück Pizza' },
  { maxPrice: 1700, hu: 'egy gyros', en: 'a gyros', de: 'ein Gyros' },
  { maxPrice: 1800, hu: 'egy könyv (zsebkönyv)', en: 'a paperback book', de: 'ein Taschenbuch' },
  { maxPrice: 1900, hu: 'egy BKK napijegy', en: 'a daily transit pass', de: 'eine Tageskarte' },
  { maxPrice: 2000, hu: 'egy kilogramm csirkemell', en: 'a kg of chicken breast', de: 'ein kg Hähnchenbrust' },

  // 2000-5000 Ft
  { maxPrice: 2200, hu: 'egy egész pizza', en: 'a whole pizza', de: 'eine ganze Pizza' },
  { maxPrice: 2500, hu: 'egy ebéd menü', en: 'a lunch menu', de: 'ein Mittagsmenü' },
  { maxPrice: 2800, hu: 'egy BKK heti bérlet', en: 'a weekly transit pass', de: 'eine Wochenkarte' },
  { maxPrice: 3000, hu: 'egy üveg whisky (alap)', en: 'a bottle of whisky (basic)', de: 'eine Flasche Whisky (einfach)' },
  { maxPrice: 3500, hu: 'egy vacsora étteremben', en: 'a dinner at a restaurant', de: 'ein Abendessen im Restaurant' },
  { maxPrice: 4000, hu: 'egy havi Netflix előfizetés', en: 'a monthly Netflix subscription', de: 'ein Netflix-Monatsabo' },
  { maxPrice: 4500, hu: 'egy pár zokni (márkás)', en: 'a pair of branded socks', de: 'ein Paar Markensocken' },
  { maxPrice: 5000, hu: 'egy belépő a strandra (egész napos)', en: 'a day pass to a beach', de: 'ein Tageskarte für Strand' },

  // 5000-10000 Ft
  { maxPrice: 5500, hu: 'egy havi Spotify előfizetés', en: 'a monthly Spotify subscription', de: 'ein Spotify-Monatsabo' },
  { maxPrice: 6000, hu: 'egy hajvágás (férfi)', en: 'a haircut (men)', de: 'ein Haarschnitt (Herren)' },
  { maxPrice: 7000, hu: 'egy koncertjegy (kisebb)', en: 'a concert ticket (small venue)', de: 'ein Konzertticket (klein)' },
  { maxPrice: 8000, hu: 'egy tank benzin (kb 15L)', en: 'about 15L of gasoline', de: 'ca. 15L Benzin' },
  { maxPrice: 9000, hu: 'egy BKK havi bérlet', en: 'a monthly transit pass', de: 'eine Monatskarte' },
  { maxPrice: 10000, hu: 'egy pár cipő (budget)', en: 'a pair of budget shoes', de: 'ein Paar günstige Schuhe' },

  // 10000-20000 Ft
  { maxPrice: 11000, hu: 'egy hajvágás (női)', en: 'a haircut (women)', de: 'ein Haarschnitt (Damen)' },
  { maxPrice: 12000, hu: 'egy fitness havi bérlet', en: 'a monthly gym membership', de: 'eine Fitnessstudio-Monatskarte' },
  { maxPrice: 13000, hu: 'egy páros vacsora étteremben', en: 'dinner for two at a restaurant', de: 'ein Abendessen für zwei' },
  { maxPrice: 14000, hu: 'egy tank benzin (tele)', en: 'a full tank of gas', de: 'eine volle Tankfüllung' },
  { maxPrice: 15000, hu: 'egy könyv (keménytáblás)', en: 'a hardcover book', de: 'ein Hardcover-Buch' },
  { maxPrice: 16000, hu: 'egy belépő a fürdőbe (wellness)', en: 'a spa day pass', de: 'ein Spa-Tagesticket' },
  { maxPrice: 17000, hu: 'egy póló (márkás)', en: 'a branded t-shirt', de: 'ein Marken-T-Shirt' },
  { maxPrice: 18000, hu: 'egy új videójáték', en: 'a new video game', de: 'ein neues Videospiel' },
  { maxPrice: 19000, hu: 'egy hét élelmiszer (1 fő)', en: 'a week of groceries (1 person)', de: 'Lebensmittel für eine Woche' },
  { maxPrice: 20000, hu: 'egy pár futócipő (alap)', en: 'basic running shoes', de: 'einfache Laufschuhe' },

  // 20000-50000 Ft
  { maxPrice: 22000, hu: 'egy farmer nadrág', en: 'a pair of jeans', de: 'eine Jeans' },
  { maxPrice: 25000, hu: 'egy koncertjegy (nagyobb)', en: 'a concert ticket (larger venue)', de: 'ein Konzertticket (groß)' },
  { maxPrice: 28000, hu: 'egy éves domain+hosting', en: 'yearly domain+hosting', de: 'jährlich Domain+Hosting' },
  { maxPrice: 30000, hu: 'egy pár Nike cipő', en: 'a pair of Nike shoes', de: 'ein Paar Nike-Schuhe' },
  { maxPrice: 35000, hu: 'egy hónap rezsi (átlag)', en: 'monthly utilities (average)', de: 'monatliche Nebenkosten' },
  { maxPrice: 40000, hu: 'egy bőrönd', en: 'a suitcase', de: 'ein Koffer' },
  { maxPrice: 45000, hu: 'egy téli kabát (alap)', en: 'a basic winter coat', de: 'eine einfache Winterjacke' },
  { maxPrice: 50000, hu: 'egy autógumi', en: 'a car tire', de: 'ein Autoreifen' },

  // 50000-100000 Ft
  { maxPrice: 55000, hu: 'egy Apple Watch szíj', en: 'an Apple Watch band', de: 'ein Apple Watch Armband' },
  { maxPrice: 60000, hu: 'egy hónap albérlet (vidék)', en: 'monthly rent (countryside)', de: 'Monatsmiete (Land)' },
  { maxPrice: 70000, hu: 'egy okosóra (alap)', en: 'a basic smartwatch', de: 'eine einfache Smartwatch' },
  { maxPrice: 80000, hu: 'egy éves Netflix előfizetés', en: 'yearly Netflix subscription', de: 'Netflix-Jahresabo' },
  { maxPrice: 90000, hu: 'egy fülhallgató (jobb minőség)', en: 'quality headphones', de: 'hochwertige Kopfhörer' },
  { maxPrice: 100000, hu: 'egy éves edzőtermi bérlet', en: 'yearly gym membership', de: 'Fitnessstudio-Jahresabo' },

  // 100000-200000 Ft
  { maxPrice: 110000, hu: 'egy szék (designer)', en: 'a designer chair', de: 'ein Designer-Stuhl' },
  { maxPrice: 120000, hu: 'egy tablet (alap)', en: 'a basic tablet', de: 'ein einfaches Tablet' },
  { maxPrice: 130000, hu: 'egy hónap albérlet (Budapest, garzon)', en: 'monthly rent (Budapest studio)', de: 'Monatsmiete (Budapest Studio)' },
  { maxPrice: 150000, hu: 'egy hétvége wellness szállodában', en: 'a wellness weekend getaway', de: 'ein Wellness-Wochenende' },
  { maxPrice: 180000, hu: 'egy iPhone tok + töltő + kiegészítők', en: 'iPhone accessories bundle', de: 'iPhone-Zubehör-Set' },
  { maxPrice: 200000, hu: 'egy hónap albérlet (Budapest)', en: 'monthly rent (Budapest)', de: 'Monatsmiete (Budapest)' },

  // 200000-500000 Ft
  { maxPrice: 220000, hu: 'egy repülőjegy Európán belül', en: 'a flight within Europe', de: 'ein Flug innerhalb Europas' },
  { maxPrice: 250000, hu: 'egy fél év albérlet vidéken', en: '6 months rent (countryside)', de: '6 Monate Miete (Land)' },
  { maxPrice: 300000, hu: 'egy AirPods Pro', en: 'AirPods Pro', de: 'AirPods Pro' },
  { maxPrice: 350000, hu: 'egy iPhone (régebbi modell)', en: 'an older iPhone model', de: 'ein älteres iPhone' },
  { maxPrice: 400000, hu: 'egy átlagos magyar havi fizetés', en: 'average Hungarian monthly salary', de: 'durchschnittliches ungarisches Monatsgehalt' },
  { maxPrice: 450000, hu: 'egy laptop (közép kategória)', en: 'a mid-range laptop', de: 'ein Mittelklasse-Laptop' },
  { maxPrice: 500000, hu: 'egy nyaralás Horvátországban (1 hét)', en: 'a week vacation in Croatia', de: 'eine Woche Urlaub in Kroatien' },

  // 500000-1000000 Ft
  { maxPrice: 550000, hu: 'egy iPhone (újabb modell)', en: 'a newer iPhone model', de: 'ein neueres iPhone' },
  { maxPrice: 600000, hu: 'egy MacBook Air', en: 'a MacBook Air', de: 'ein MacBook Air' },
  { maxPrice: 700000, hu: 'egy használt robogó', en: 'a used scooter', de: 'ein gebrauchter Roller' },
  { maxPrice: 800000, hu: 'egy high-end gaming PC', en: 'a high-end gaming PC', de: 'ein High-End Gaming-PC' },
  { maxPrice: 900000, hu: 'egy éves albérlet (vidék)', en: 'yearly rent (countryside)', de: 'Jahresmiete (Land)' },
  { maxPrice: 1000000, hu: 'egy designer táska', en: 'a designer bag', de: 'eine Designer-Tasche' },

  // 1-5 millió Ft
  { maxPrice: 1200000, hu: 'egy MacBook Pro', en: 'a MacBook Pro', de: 'ein MacBook Pro' },
  { maxPrice: 1500000, hu: 'egy esküvői ruha', en: 'a wedding dress', de: 'ein Brautkleid' },
  { maxPrice: 2000000, hu: 'egy használt autó (olcsóbb)', en: 'a budget used car', de: 'ein günstiges Gebrauchtwagen' },
  { maxPrice: 2500000, hu: 'egy éves albérlet (Budapest)', en: 'yearly rent (Budapest)', de: 'Jahresmiete (Budapest)' },
  { maxPrice: 3000000, hu: 'egy motorkerékpár (közép)', en: 'a mid-range motorcycle', de: 'ein Mittelklasse-Motorrad' },
  { maxPrice: 4000000, hu: 'egy kisebb esküvő', en: 'a small wedding', de: 'eine kleine Hochzeit' },
  { maxPrice: 5000000, hu: 'egy használt autó (jobb)', en: 'a decent used car', de: 'ein gutes Gebrauchtwagen' },

  // 5-10 millió Ft
  { maxPrice: 6000000, hu: 'egy Rolex óra (belépő)', en: 'an entry-level Rolex', de: 'eine Rolex (Einstiegsmodell)' },
  { maxPrice: 7000000, hu: 'egy közepes esküvő', en: 'a medium-sized wedding', de: 'eine mittelgroße Hochzeit' },
  { maxPrice: 8000000, hu: 'egy új autó (kisautó)', en: 'a new compact car', de: 'ein neuer Kleinwagen' },
  { maxPrice: 10000000, hu: 'egy vidéki telek', en: 'a countryside plot of land', de: 'ein Grundstück auf dem Land' },

  // 10-20 millió Ft
  { maxPrice: 12000000, hu: 'egy új autó (közép kategória)', en: 'a new mid-range car', de: 'ein neuer Mittelklassewagen' },
  { maxPrice: 15000000, hu: 'egy nagy esküvő', en: 'a large wedding', de: 'eine große Hochzeit' },
  { maxPrice: 18000000, hu: 'egy felújított lakás (vidék)', en: 'a renovated flat (countryside)', de: 'eine renovierte Wohnung (Land)' },
  { maxPrice: 20000000, hu: 'egy vidéki családi ház (felújítandó)', en: 'a countryside house (needs work)', de: 'ein Landhaus (renovierungsbedürftig)' },

  // 20-40 millió Ft
  { maxPrice: 25000000, hu: 'egy új SUV', en: 'a new SUV', de: 'ein neuer SUV' },
  { maxPrice: 30000000, hu: 'egy budapesti garzonlakás', en: 'a studio apartment in Budapest', de: 'eine Einzimmerwohnung in Budapest' },
  { maxPrice: 35000000, hu: 'egy új prémium autó', en: 'a new premium car', de: 'ein neuer Premiumwagen' },
  { maxPrice: 40000000, hu: 'egy budapesti lakás', en: 'an apartment in Budapest', de: 'eine Wohnung in Budapest' },
];

export type Language = 'hu' | 'en' | 'de';

export const getPriceReference = (amount: number, language: Language = 'hu'): string | null => {
  if (amount <= 0) return null;

  const reference = priceReferences.find(ref => amount <= ref.maxPrice);

  if (reference) {
    return reference[language];
  }

  // For amounts larger than 40M, return the apartment reference
  const lastRef = priceReferences[priceReferences.length - 1];
  if (amount > lastRef.maxPrice) {
    const multiplier = Math.floor(amount / lastRef.maxPrice);
    if (multiplier > 1) {
      switch (language) {
        case 'hu':
          return `${multiplier} budapesti lakás`;
        case 'en':
          return `${multiplier} apartments in Budapest`;
        case 'de':
          return `${multiplier} Wohnungen in Budapest`;
      }
    }
    return lastRef[language];
  }

  return null;
};
