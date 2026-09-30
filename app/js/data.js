/** Dados da viagem — Roma + Paris, 10 a 17 de outubro de 2026 */
const APP_VERSION = "4.2.0";

const TRIP = {
  title: "Roma + Paris",
  subtitle: "10 a 17 de outubro de 2026",
  version: APP_VERSION,
  cambio: 5.9,
  travelers: 5,
  transportEstimate: { min: 60, max: 100 },
  appUrl: "https://henriquealinfo.github.io/viagem_paris/",
  weather: {
    cities: [
      { id: "roma", name: "Roma", lat: 41.9028, lon: 12.4964 },
      { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522 },
    ],
  },
  timezone: "Europe/Rome",
  defaultDates: {
    0: "2026-10-10",
    1: "2026-10-11",
    2: "2026-10-12",
    3: "2026-10-13",
    4: "2026-10-14",
    5: "2026-10-15",
    6: "2026-10-16",
    7: "2026-10-17",
  },
  emergency: {
    hotelRoma: "Residenze Serventi Longhi",
    hotelRomaAddress: "2 Largo Brindisi, San Giovanni, Roma, 00182, Itália",
    hotelRomaPhone: "+39 329 540 3799",
    hotelRomaEmail: "domvs.avrea.roma@gmail.com",
    hotelRomaBooking: "https://www.booking.com/Share-bvGJbc6",
    hotelRomaStay: "11 a 13 de outubro de 2026",
    hotelParis: "Terracotta — Le Kremlin-Bicêtre",
    hotelParisAddress: "2 Rue Marcel Sembat, 2º andar, apto. 68, 94270 Le Kremlin-Bicêtre, França",
    hotelParisPhone: "+33 6 51 45 48 36",
    hotelParisEmail: "contact@naps-immo.com",
    hotelParisBooking: "https://www.airbnb.com/l/KQEkCa8j",
    hotelParisCheckin: "https://form.jotform.com/232836045643053?bookId=93778904&guestFirstName=Vinicius&guestName=Marcondes%20Ferraz%20de%20Carmo",
    hotelParisExtras: "https://app.sunver.app/guest/terracotta-1",
    hotelParisStay: "13 a 17 de outubro de 2026 · check-in 17h · check-out 11h",
    hotelParisGuest: "Vinicius Marcondes Ferraz de Carmo",
    contactName: "Contato de emergência",
    contactPhone: "+55 11 96914-1969",
    embassyRoma: "Embaixada do Brasil — Roma",
    embassyRomaPhone: "+39 06 68391",
    embassyParis: "Embaixada do Brasil — Paris",
    embassyParisPhone: "+33 1 45 61 63 00",
    emergencyEU: "112",
    medicalIT: "118",
    policeIT: "113",
    medicalFR: "15 (SAMU)",
    policeFR: "17 (Polícia)",
    insurance: "Seguro viagem — nº apólice",
    passportNote: "Tenha foto do passaporte no celular",
  },
  dicasGerais: [
    "Não tentem “zerar” Roma no primeiro dia — o pouso é às 10h10 e o check-in do hotel é a partir das 13h30.",
    "Os ingressos com horário do Coliseu são a peça-chave da tarde de 12/10. Reservem cedo no site oficial.",
    "Para 5 pessoas, compare o custo de 5 bilhetes com um táxi/transfer: às vezes o carro sai semelhante e poupa trocas.",
    "No voo Roma → Paris, priorizem FCO → Orly se horário e preço (com bagagem) forem bons.",
    "Low-cost: compare o preço final com mala. Na Transavia Basic só o item pessoal pequeno vem incluído.",
    "Outubro esfria à noite — levem uma camada extra para Roma, Paris, Disney e Versalhes.",
    "Água da torneira é potável nas duas cidades. Peçam uma jarra no restaurante.",
    "ETIAS: confiram o status oficial antes de embarcar.",
    "No Terracotta, o código de check-in só chega por e-mail. Preencham o formulário no dia 13/10 e atualizem o e-mail.",
    "Apto em Le Kremlin-Bicêtre: não fumantes, sem festa, silêncio das 22h às 8h. Instruções de acesso vêm no e-mail do dia da chegada.",
  ],
};

const FLIGHTS = [
  { id: "gru-fco", date: "2026-10-10", time: "17h55", arriveDate: "2026-10-11", arriveTime: "10h10", from: "GRU", to: "FCO", note: "LATAM noturno · pouso em Roma no dia seguinte", mapsPlace: "Aeroporto Internacional de São Paulo GRU", city: "gru" },
  { id: "fco-paris", date: "2026-10-13", time: "~18h00", arriveTime: "~20h10", from: "FCO", to: "ORY / CDG", note: "Preferir Orly se horário e bagagem fecharem bem", mapsPlace: "Aeroporto di Fiumicino FCO", city: "roma" },
  { id: "cdg-gru", date: "2026-10-17", time: "a confirmar", from: "CDG", to: "GRU", note: "Chegar cedo — voo de longo curso", mapsPlace: "Aéroport Charles de Gaulle CDG", city: "paris" },
];

const BUDGET = {
  note: "Estimativa por pessoa, sem passagens aéreas (GRU–FCO, FCO–Paris e CDG–GRU). Hospedagem já reservada também fica de fora.",
  categories: [
    {
      id: "roma-tickets",
      name: "Ingressos em Roma",
      icon: "🇮🇹",
      items: [
        { name: "Panteão", min: 7, max: 7 },
        { name: "Vaticano + Capela Sistina", min: 25, max: 25 },
        { name: "Coliseu + Fórum + Palatino", min: 18, max: 25 },
      ],
    },
    {
      id: "paris-tickets",
      name: "Ingressos em Paris",
      icon: "🇫🇷",
      items: [
        { name: "Arco do Triunfo", min: 16, max: 16 },
        { name: "Torre Eiffel", min: 23, max: 36 },
        { name: "Cruzeiro no Sena", min: 18, max: 25 },
        { name: "Disneyland Park (1 dia / 1 parque)", min: 80, max: 95 },
        { name: "Versalhes Passport", min: 35, max: 35 },
        { name: "Opéra Garnier (se entrar)", min: 0, max: 25 },
      ],
    },
    {
      id: "transport",
      name: "Transporte no destino",
      icon: "🚇",
      items: [
        { name: "Metrô, RER e táxi no dia a dia", min: 60, max: 100, note: "Faixa do guia, vários dias" },
        { name: "FCO ↔ hotel em Roma", min: 25, max: 45, note: "Chegada + saída; transfer sai melhor para 5" },
        { name: "Aeroporto ↔ Terracotta", min: 22, max: 45, note: "Orly/CDG na chegada e CDG no retorno" },
      ],
    },
    {
      id: "food",
      name: "Alimentação",
      icon: "🍽️",
      items: [
        { name: "Cafés da manhã", min: 48, max: 48, note: "6 manhãs no roteiro" },
        { name: "Almoços", min: 90, max: 155, note: "Roma + Paris, inclusive Disney" },
        { name: "Jantares", min: 145, max: 245, note: "Inclui o jantar especial de despedida" },
      ],
    },
  ],
};

function budgetCategoryRange(cat) {
  return cat.items.reduce((acc, item) => ({
    min: acc.min + Number(item.min || 0),
    max: acc.max + Number(item.max ?? item.min ?? 0),
  }), { min: 0, max: 0 });
}

function budgetTotalRange() {
  return BUDGET.categories.reduce((acc, cat) => {
    const r = budgetCategoryRange(cat);
    return { min: acc.min + r.min, max: acc.max + r.max };
  }, { min: 0, max: 0 });
}

const CHECKLIST = [
  { id: "passport", label: "Passaportes conferidos (+ foto digital)", icon: "🛂" },
  { id: "insurance", label: "Seguro viagem emitido", icon: "🏥" },
  { id: "etias", label: "ETIAS verificado no site oficial", icon: "🇪🇺" },
  { id: "esim", label: "Chip / eSIM para internet", icon: "📱" },
  { id: "vatican", label: "Vaticano + Capela Sistina reservados", icon: "🇻🇦" },
  { id: "colosseum", label: "Coliseu + Fórum + Palatino reservados", icon: "🏟️" },
  { id: "pantheon", label: "Panteão reservado (€7)", icon: "🏛️" },
  { id: "eiffel", label: "Torre Eiffel reservada", icon: "🗼" },
  { id: "disney", label: "Disneyland Park (1 dia / 1 parque) confirmado", icon: "🏰" },
  { id: "versailles", label: "Versalhes Passport reservado", icon: "👑" },
  { id: "flight-fco", label: "Voo FCO → Paris comprado com bagagem", icon: "✈️" },
  { id: "hotel-roma", label: "Hotel de Roma confirmado (11–13/out)", icon: "🏨" },
  { id: "hotel-paris", label: "Terracotta confirmado (13–17/out)", icon: "🏨" },
  { id: "hotel-paris-code", label: "Código de check-in do Terracotta no e-mail", icon: "🔑" },
  { id: "offline", label: "Passaportes, reservas e seguro salvos offline", icon: "📂" },
  { id: "adapter", label: "Adaptador de tomada europeu", icon: "🔌" },
  { id: "charger", label: "Carregador portátil (power bank)", icon: "🔋" },
  { id: "comfort", label: "Sapatos confortáveis para caminhar", icon: "👟" },
  { id: "cards", label: "Cartões habilitados para o exterior / euros", icon: "💳" },
];

const ITALIAN_PHRASES = [
  { pt: "Por favor", lang: "Per favore", note: "Educado em qualquer pedido" },
  { pt: "Obrigado(a)", lang: "Grazie mille", note: "" },
  { pt: "Não falo italiano", lang: "Non parlo italiano", note: "Muito útil!" },
  { pt: "Fala inglês?", lang: "Parla inglese?", note: "" },
  { pt: "Onde fica o banheiro?", lang: "Dov'è il bagno?", note: "" },
  { pt: "A conta, por favor", lang: "Il conto, per favore", note: "No restaurante" },
  { pt: "Água da torneira", lang: "Una caraffa d'acqua, per favore", note: "Grátis" },
  { pt: "Quanto custa?", lang: "Quanto costa?", note: "" },
  { pt: "Preciso de ajuda", lang: "Ho bisogno di aiuto", note: "Emergência" },
  { pt: "Estou perdido(a)", lang: "Mi sono perso/a", note: "" },
  { pt: "Um café, por favor", lang: "Un caffè, per favore", note: "" },
  { pt: "Um táxi, por favor", lang: "Un taxi, per favore", note: "Grupo de 5" },
];

const FRENCH_PHRASES = [
  { pt: "Por favor", lang: "S'il vous plaît", note: "Educado em qualquer pedido" },
  { pt: "Obrigado(a)", lang: "Merci beaucoup", note: "" },
  { pt: "Não falo francês", lang: "Je ne parle pas français", note: "Muito útil!" },
  { pt: "Fala inglês?", lang: "Parlez-vous anglais?", note: "" },
  { pt: "Onde fica o banheiro?", lang: "Où sont les toilettes?", note: "" },
  { pt: "A conta, por favor", lang: "L'addition, s'il vous plaît", note: "No restaurante" },
  { pt: "Água da torneira", lang: "Une carafe d'eau, s'il vous plaît", note: "Grátis" },
  { pt: "Quanto custa?", lang: "C'est combien?", note: "" },
  { pt: "Preciso de ajuda", lang: "J'ai besoin d'aide", note: "Emergência" },
  { pt: "Estou perdido(a)", lang: "Je suis perdu(e)", note: "" },
  { pt: "Um café, por favor", lang: "Un café, s'il vous plaît", note: "" },
  { pt: "O metrô, por favor", lang: "Le métro, s'il vous plaît", note: "Pedir direções" },
];

const PHRASE_PACKS = [
  { id: "it", label: "Italiano", flag: "🇮🇹", voice: "it-IT", items: ITALIAN_PHRASES },
  { id: "fr", label: "Francês", flag: "🇫🇷", voice: "fr-FR", items: FRENCH_PHRASES },
];

const IMG_FALLBACK = "images/placeholder.svg?v=404";

const IMAGES_REMOTE = {
  aeroporto: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Paris_-_Aerial_View%2C_La_Defense%2C_Eiffel_Tower%2C_Trocad%C3%A9ro%2C_Tour_Montparnasse%2C_Notre-Dame%2C_Les_Invalides%2C_Arc_de_Triomphe%2C_Louvre%2C_Sacr%C3%A9-C%C5%93ur%2C_Montmartre%2C_2015.jpg/800px-thumbnail.jpg",
  hotel: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/H%C3%B4tel_des_Invalides%2C_Paris%2C_France.jpg/800px-H%C3%B4tel_des_Invalides%2C_Paris%2C_France.jpg",
  cafe: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Croissant-Petit-Dejeuner.jpg/800px-Croissant-Petit-Dejeuner.jpg",
  jantar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Paris_cafe_terrace.jpg/800px-Paris_cafe_terrace.jpg",
  panteao: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Pantheon_Rome_04_2016_6402.jpg/800px-Pantheon_Rome_04_2016_6402.jpg",
  navona: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Piazza_Navona_Pano.jpg/800px-Piazza_Navona_Pano.jpg",
  campo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Campo_de%27_Fiori.jpg/800px-Campo_de%27_Fiori.jpg",
  trevi: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Fontana_di_Trevi_sotto_il_sole.jpg/800px-Fontana_di_Trevi_sotto_il_sole.jpg",
  spagna: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Piazza_di_Spagna_and_the_Spanish_Steps%2C_Rome.jpg/800px-Piazza_di_Spagna_and_the_Spanish_Steps%2C_Rome.jpg",
  trastevere: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Trastevere_-_Santa_Maria.jpg/800px-Trastevere_-_Santa_Maria.jpg",
  vaticano: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Vatican_Museums_Spiral_Staircase_2012.jpg/800px-Vatican_Museums_Spiral_Staircase_2012.jpg",
  saopedro: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg/800px-St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg",
  coliseu: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg",
  forum: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Forum_Romanum_Rom.jpg/800px-Forum_Romanum_Rom.jpg",
  palatino: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Palatine_Hill_Rome.jpg/800px-Palatine_Hill_Rome.jpg",
  campidoglio: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Piazza_del_Campidoglio.jpg/800px-Piazza_del_Campidoglio.jpg",
  vittoriano: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Vittoriano_Roma.jpg/800px-Vittoriano_Roma.jpg",
  gueto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Portico_d%27Ottavia.jpg/800px-Portico_d%27Ottavia.jpg",
  notredame: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Notre-Dame_de_Paris%2C_4_October_2017.jpg/800px-Notre-Dame_de_Paris%2C_4_October_2017.jpg",
  louvre: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/800px-Louvre_Museum_Wikimedia_Commons.jpg",
  tuileries: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Tuileries_Garden%2C_Paris%2C_France_-_panoramio.jpg/800px-Tuileries_Garden%2C_Paris%2C_France_-_panoramio.jpg",
  arco: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Arc_de_Triomphe%2C_Paris_7_June_2014%2C_perspective-2.jpg/800px-Arc_de_Triomphe%2C_Paris_7_June_2014%2C_perspective-2.jpg",
  champs: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Champs-Elysees_Daytime_%28cropped%29.jpg/800px-Champs-Elysees_Daytime_%28cropped%29.jpg",
  trocadero: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tour_Eiffel%2C_Paris%2C_from_Trocadero%2C_June_2010.jpg/800px-Tour_Eiffel%2C_Paris%2C_from_Trocadero%2C_June_2010.jpg",
  torre: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
  seine: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Panorama_Pont_Neuf_%28Paris%29.jpg/800px-Panorama_Pont_Neuf_%28Paris%29.jpg",
  disney: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sleeping_Beauty_Castle_%28cropped%29.jpg/800px-Sleeping_Beauty_Castle_%28cropped%29.jpg",
  versailles: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Chateau_de_Versailles_Galerie_des_Glaces.jpg/800px-Chateau_de_Versailles_Galerie_des_Glaces.jpg",
  montmartre: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sacre_Coeur_paris.jpg/800px-Sacre_Coeur_paris.jpg",
  opera: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Paris_Opera_full_frontal_architecture%2C_May_2009.jpg/800px-Paris_Opera_full_frontal_architecture%2C_May_2009.jpg",
  compras: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Galeries_Lafayette_dome%2C_Paris%2C_France.jpg/800px-Galeries_Lafayette_dome%2C_Paris%2C_France.jpg",
};

const IMG_VER = "404";
const IMAGES = {};
Object.keys(IMAGES_REMOTE).forEach((k) => {
  IMAGES[k] = `images/${k}.svg?v=${IMG_VER}`;
});

function mapsUrl(place, city) {
  if (!place) return null;
  const suffix = { roma: "Rome, Italy", paris: "Paris, France", kremlin: "Le Kremlin-Bicêtre, France", gru: "São Paulo, Brazil" }[city] || "";
  const q = suffix ? `${place}, ${suffix}` : place;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function dayLabel(day) {
  if (!day) return "";
  return day.kind === "embarque" ? "Embarque" : `Dia ${day.id}`;
}

function cityLabel(city) {
  if (city === "roma") return "Roma";
  if (city === "paris") return "Paris";
  if (city === "kremlin") return "Le Kremlin-Bicêtre";
  if (city === "gru") return "São Paulo";
  return "";
}

const ITINERARY_KEY = "roma-paris-trip-itinerary";

function activeItineraryId() {
  try {
    const id = JSON.parse(localStorage.getItem(ITINERARY_KEY) || "null");
    return id === "opcional" ? "opcional" : "original";
  } catch {
    return "original";
  }
}

function dayChangesInOptional(dayId) {
  return Object.prototype.hasOwnProperty.call(OPTIONAL_PLAN, Number(dayId));
}

function routeReservationTime(id) {
  if (activeItineraryId() !== "opcional") return "";
  return { arco: "14:15", versailles: "09:00" }[id] || "";
}

const RESERVATIONS = [
  { id: "hotel-roma", name: "Hotel Roma — 11 a 13/out", icon: "🏨", url: "https://www.booking.com/Share-bvGJbc6", dayId: 1, defaultTime: "13:30" },
  { id: "pantheon", name: "Panteão", icon: "🏛️", url: "https://portale.museiitaliani.it/b2c/n/info/pantheon", dayId: 1, defaultTime: "15:15" },
  { id: "vatican", name: "Museus Vaticanos + Sistina", icon: "🇻🇦", url: "https://tickets.museivaticani.va/home", dayId: 2, defaultTime: "08:00" },
  { id: "colosseum", name: "Coliseu + Fórum + Palatino", icon: "🏟️", url: "https://colosseo.it/en/orario-e-tariffe/", dayId: 2, defaultTime: "14:15" },
  { id: "flight-fco", name: "Voo FCO → Paris", icon: "✈️", url: "https://www.transavia.com/", dayId: 3, defaultTime: "18:00" },
  { id: "hotel-paris", name: "Terracotta Paris — 13 a 17/out", icon: "🏨", url: "https://www.airbnb.com/l/KQEkCa8j", dayId: 3, defaultTime: "17:00" },
  { id: "hotel-paris-code", name: "Código check-in Terracotta", icon: "🔑", url: "https://form.jotform.com/232836045643053?bookId=93778904&guestFirstName=Vinicius&guestName=Marcondes%20Ferraz%20de%20Carmo", dayId: 3, defaultTime: "17:00" },
  { id: "notredame", name: "Notre-Dame (reserva grátis)", icon: "⛪", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets", dayId: 4, defaultTime: "08:30" },
  { id: "arco", name: "Arco do Triunfo", icon: "🏛️", url: "https://www.paris-arc-de-triomphe.fr/en/booking/book-a-ticket", dayId: 4, defaultTime: "14:00" },
  { id: "eiffel", name: "Torre Eiffel", icon: "🗼", url: "https://ticket.toureiffel.paris/en", dayId: 4, defaultTime: "18:00" },
  { id: "seine", name: "Cruzeiro pelo Sena", icon: "🚢", url: "https://ticket.parisjetaime.com/en/paris-seine-cruises-s113", dayId: 4, defaultTime: "20:30" },
  { id: "disney", name: "Disneyland Park", icon: "🏰", url: "https://www.disneylandparis.com/en-usd/tickets/", dayId: 5, defaultTime: "09:30" },
  { id: "versailles", name: "Palácio de Versailles", icon: "👑", url: "https://en.chateauversailles.fr/plan-your-visit/tickets-and-rates", dayId: 6, defaultTime: "08:45" },
  { id: "opera", name: "Opéra Garnier", icon: "🎭", url: "https://www.operadeparis.fr/en/visits/palais-garnier", dayId: 6, defaultTime: "18:00" },
];

const DAYS = [
  {
    id: 0, kind: "embarque", emoji: "🛫", weekday: "Sábado", title: "Embarque GRU → Roma",
    city: "gru", color: "#0D47A1", accent: "#E3F2FD", pace: "Leve",
    summary: "Voo noturno LATAM. Saída 17h55 em Guarulhos; pouso em Fiumicino às 10h10 de domingo.",
    activities: [
      { time: "14h00", title: "Sair de casa / hotel", place: "São Paulo", desc: "Chegar com folga — voo internacional e grupo de 5.", transport: "Transfer / táxi", priceEur: "0", image: IMAGES.aeroporto, city: "gru" },
      { time: "17h55", title: "Voo LATAM GRU → FCO", place: "Aeroporto Internacional de Guarulhos", desc: "Voo noturno. Pouso em Roma no dia seguinte, 11/10 às 10h10.", transport: "Avião", priceEur: "incl.", image: IMAGES.aeroporto, highlight: true, city: "gru" },
      { time: "Noite", title: "Voo noturno", place: "A bordo", desc: "Tentem dormir. O primeiro dia em Roma começa cedo e a pé.", transport: "—", priceEur: "0", image: IMAGES.hotel, city: "gru" },
    ],
  },
  {
    id: 1, emoji: "🇮🇹", weekday: "Domingo", title: "Chegada e primeira noite",
    city: "roma", color: "#B71C1C", accent: "#FFEBEE", pace: "Médio",
    summary: "Pouso às 10h10 em FCO. Patrimônio fácil, caminhada pelo centro e jantar em Trastevere — sem ingresso apertado.",
    activities: [
      { time: "10h10", title: "Pouso em FCO", place: "Aeroporto di Fiumicino", desc: "Imigração + bagagem. Planejem cerca de 2h para sair com calma.", transport: "A pé no aeroporto", priceEur: "0", image: IMAGES.aeroporto },
      { time: "12h30 – 13h30", title: "FCO → hotel", place: "2 Largo Brindisi, San Giovanni, Roma", desc: "Residenze Serventi Longhi. Para 5 + malas, transfer privado é mais cômodo. Alternativa: Leonardo Express + táxi.", transport: "Transfer / Leonardo Express", priceEur: "15 – 25", priceNote: "Por pessoa no expresso; transfer sai melhor no grupo", image: IMAGES.hotel, link: { label: "Reserva Booking", url: "https://www.booking.com/Share-bvGJbc6" } },
      { time: "13h30", title: "Check-in / deixar malas", place: "2 Largo Brindisi, San Giovanni, Roma, 00182", desc: "Estadia 11 a 13/out. Check-in a partir das 13h30. Metrô San Giovanni fica ao lado.", transport: "—", priceEur: "0", image: IMAGES.hotel, link: { label: "Abrir reserva", url: "https://www.booking.com/Share-bvGJbc6" } },
      { time: "14h00 – 15h00", title: "Almoço", place: "San Giovanni / centro", desc: "Restaurante próximo ao hotel ou já no centro histórico.", transport: "Metrô / a pé", priceEur: "15 – 25", image: IMAGES.jantar },
      { time: "15h15 – 16h00", title: "Panteão", place: "Pantheon, Roma", desc: "Primeira atração curta e fácil de entrar. Ingresso oficial €7.", transport: "A pé", priceEur: "7", highlight: true, needsReservation: true, image: IMAGES.panteao, link: { label: "Reservar Panteão", url: "https://portale.museiitaliani.it/b2c/n/info/pantheon" } },
      { time: "16h05 – 16h40", title: "Piazza Navona", place: "Piazza Navona", desc: "Caminhada curta a partir do Panteão.", transport: "A pé", priceEur: "0", image: IMAGES.navona },
      { time: "16h40 – 17h10", title: "Campo de' Fiori", place: "Campo de' Fiori", desc: "Passeio pelo entorno e mercado, se estiver ativo no domingo.", transport: "A pé", priceEur: "0", image: IMAGES.campo },
      { time: "17h20 – 18h00", title: "Fontana di Trevi", place: "Fontana di Trevi", desc: "Caminhada pelo centro histórico.", transport: "A pé", priceEur: "0", image: IMAGES.trevi, highlight: true },
      { time: "18h10 – 18h45", title: "Piazza di Spagna", place: "Piazza di Spagna", desc: "Escadaria Espanhola e fotos.", transport: "A pé", priceEur: "0", image: IMAGES.spagna },
      { time: "19h00 – 20h00", title: "Hotel / descanso", place: "2 Largo Brindisi, San Giovanni, Roma", desc: "Pausa antes do jantar — vocês chegaram de voo intercontinental.", transport: "Metrô / táxi", priceEur: "0", image: IMAGES.hotel },
      { time: "20h30 – 22h30", title: "Trastevere", place: "Trastevere, Roma", desc: "Aperitivo + jantar romano. Táxi ou ônibus no retorno.", transport: "Táxi / ônibus", priceEur: "25 – 40", image: IMAGES.trastevere, highlight: true },
    ],
  },
  {
    id: 2, emoji: "🇻🇦", weekday: "Segunda-feira", title: "Vaticano + Coliseu",
    city: "roma", color: "#4A148C", accent: "#F3E5F5", pace: "Intenso",
    summary: "O dia mais intenso de Roma: Vaticano cedo, Coliseu + Fórum + Palatino à tarde e jantar em Monti.",
    activities: [
      { time: "06h45", title: "Acordar", place: "Hotel", desc: "Café rápido no hotel. O grupo precisa sair cedo.", transport: "—", priceEur: "8", image: IMAGES.cafe },
      { time: "07h30", title: "Hotel → Vaticano", place: "Città del Vaticano", desc: "Táxi ou metrô. Sair cedo evita fila na entrada.", transport: "Táxi / metrô", priceEur: "2 – 15", image: IMAGES.vaticano },
      { time: "08h00 – 11h00", title: "Museus Vaticanos + Capela Sistina", place: "Musei Vaticani", desc: "Priorizem Galeria dos Mapas, Salas de Rafael e Capela Sistina. €20 + €5 reserva online.", transport: "A pé", priceEur: "25", priceNote: "€25 online oficial", image: IMAGES.vaticano, highlight: true, needsReservation: true, link: { label: "Reservar Vaticano", url: "https://tickets.museivaticani.va/home" } },
      { time: "11h00 – 12h15", title: "Praça + Basílica de São Pedro", place: "Piazza San Pietro", desc: "Entrada da Basílica é gratuita; reserva/audioguia é opcional.", transport: "A pé", priceEur: "0", image: IMAGES.saopedro, link: { label: "Basílica oficial", url: "https://www.basilicasanpietro.va/en.html" } },
      { time: "12h30 – 13h30", title: "Almoço", place: "Próximo ao Vaticano", desc: "Almoço rápido antes de cruzar a cidade.", transport: "A pé", priceEur: "15 – 25", image: IMAGES.jantar },
      { time: "13h30 – 14h15", title: "Vaticano → Coliseu", place: "Colosseo", desc: "Táxi recomendado para o grupo de 5.", transport: "Táxi", priceEur: "3 – 8", image: IMAGES.coliseu },
      { time: "14h15 – 15h30", title: "Coliseu", place: "Colosseo", desc: "Ingresso com horário marcado — peça-chave da tarde.", transport: "A pé", priceEur: "18 – 25", priceNote: "Bilhete combinado Coliseu + Fórum + Palatino", image: IMAGES.coliseu, highlight: true, needsReservation: true, link: { label: "Reservar Coliseu", url: "https://colosseo.it/en/orario-e-tariffe/" } },
      { time: "15h30 – 17h00", title: "Fórum Romano", place: "Foro Romano", desc: "Visita a pé pelo complexo. Incluído no bilhete combinado.", transport: "A pé", priceEur: "incl.", image: IMAGES.forum },
      { time: "17h00 – 18h00", title: "Palatino", place: "Palatino", desc: "Fazer se o grupo ainda estiver bem disposto. Incluído no mesmo bilhete.", transport: "A pé", priceEur: "incl.", image: IMAGES.palatino },
      { time: "18h10 – 19h00", title: "Campidoglio", place: "Piazza del Campidoglio", desc: "Mirante sobre o Fórum — ótimo fim de tarde.", transport: "A pé", priceEur: "0", image: IMAGES.campidoglio },
      { time: "20h30", title: "Jantar em Monti", place: "Monti, Roma", desc: "Bairro próximo ao Coliseu, bom para encerrar o dia intenso.", transport: "A pé / táxi", priceEur: "25 – 40", image: IMAGES.jantar },
    ],
  },
  {
    id: 3, emoji: "✈️", weekday: "Terça-feira", title: "Roma de manhã → Paris",
    city: "roma", color: "#00695C", accent: "#E0F2F1", pace: "Médio",
    summary: "Último circuito curto em Roma, voo por volta das 18h e chegada a Paris no começo da noite. Quatro noites na mesma hospedagem parisiense.",
    activities: [
      { time: "07h30", title: "Café e check-out", place: "2 Largo Brindisi, San Giovanni, Roma", desc: "Última manhã no hotel — estadia até 13/10. Malas prontas. Check-out no horário informado.", transport: "—", priceEur: "8", image: IMAGES.cafe, city: "roma" },
      { time: "08h30 – 09h15", title: "Piazza Venezia + Vittoriano", place: "Altare della Patria", desc: "Passeio e, se possível, terraço panorâmico.", transport: "Metrô / a pé", priceEur: "0 – 18", priceNote: "Terraço pago / variável", image: IMAGES.vittoriano, city: "roma" },
      { time: "09h20 – 10h00", title: "Campidoglio", place: "Piazza del Campidoglio", desc: "Vista para o Fórum; caminhada curta.", transport: "A pé", priceEur: "0", image: IMAGES.campidoglio, city: "roma" },
      { time: "10h05 – 10h35", title: "Teatro di Marcello", place: "Teatro di Marcello", desc: "Ver por fora — não entrar.", transport: "A pé", priceEur: "0", image: IMAGES.gueto, city: "roma" },
      { time: "10h40 – 11h30", title: "Gueto Judaico", place: "Portico d'Ottavia", desc: "Pórtico + ruas históricas do antigo gueto.", transport: "A pé", priceEur: "0", image: IMAGES.gueto, city: "roma" },
      { time: "11h30 – 12h30", title: "Último almoço romano", place: "Gueto / centro", desc: "Bagagem já pronta no hotel.", transport: "A pé", priceEur: "15 – 25", image: IMAGES.jantar, city: "roma" },
      { time: "12h30 – 13h30", title: "Voltar ao hotel / malas", place: "2 Largo Brindisi, San Giovanni, Roma", desc: "Check-out da estadia 11–13/out. Reserva no Booking.", transport: "Metrô / táxi", priceEur: "0", image: IMAGES.hotel, city: "roma", link: { label: "Abrir reserva", url: "https://www.booking.com/Share-bvGJbc6" } },
      { time: "14h00", title: "Hotel → FCO", place: "Aeroporto di Fiumicino", desc: "Transfer ou táxi. Deixem folga para o trânsito.", transport: "Transfer / táxi", priceEur: "10 – 20", image: IMAGES.aeroporto, city: "roma" },
      { time: "18h00", title: "Voo FCO → Paris", place: "Fiumicino → Orly ou CDG", desc: "Preferir voo direto. Comparar Orly e CDG com bagagem inclusa.", transport: "Avião", priceEur: "incl.", image: IMAGES.aeroporto, highlight: true, needsReservation: true, city: "roma", link: { label: "Transavia", url: "https://www.transavia.com/" } },
      { time: "20h10", title: "Chegada + Terracotta", place: "2 Rue Marcel Sembat, apto. 68", desc: "Check-in a partir das 17h. 2º andar, apto. 68. De Orly a linha 14 chega perto (Kremlin-Bicêtre–Hôpital). Código de acesso: formulário + e-mail do dia.", transport: "Linha 14 / táxi", priceEur: "10 – 20", image: IMAGES.hotel, city: "kremlin", highlight: true, link: { label: "Airbnb da reserva", url: "https://www.airbnb.com/l/KQEkCa8j" } },
      { time: "21h00", title: "Jantar perto do apto", place: "Le Kremlin-Bicêtre", desc: "Sem atração marcada. Sem festa; silêncio das 22h às 8h.", transport: "A pé", priceEur: "20 – 35", image: IMAGES.jantar, city: "kremlin" },
    ],
  },
  {
    id: 4, emoji: "🗼", weekday: "Quarta-feira", title: "Paris clássica",
    city: "paris", color: "#1F4E79", accent: "#D6E4F0", pace: "Intenso",
    summary: "Sem entrar no Louvre. Eixo visual: Notre-Dame, pirâmide por fora, Tuileries, Arco, Trocadéro, Torre Eiffel e cruzeiro no Sena.",
    activities: [
      { time: "08h00", title: "Café", place: "Terracotta / padaria", desc: "Sair cedo. Metrô 14 ou 7 até o centro / Île de la Cité.", transport: "Metrô 14 / 7", priceEur: "8", image: IMAGES.cafe, city: "kremlin" },
      { time: "08h30 – 10h00", title: "Notre-Dame + Île de la Cité", place: "Notre-Dame de Paris", desc: "Caminhada pela ilha. Reserva gratuita opcional para entrar na catedral.", transport: "Metrô / a pé", priceEur: "0", image: IMAGES.notredame, highlight: true, needsReservation: true, link: { label: "Reserva Notre-Dame", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets" } },
      { time: "10h10 – 10h45", title: "Louvre — só o exterior", place: "Pyramide du Louvre", desc: "Pirâmide + Cour Napoléon + fotos. Sem entrar no museu.", transport: "A pé", priceEur: "0", image: IMAGES.louvre },
      { time: "10h45 – 11h30", title: "Jardin des Tuileries", place: "Jardin des Tuileries", desc: "Caminhada tranquila até a Concorde.", transport: "A pé", priceEur: "0", image: IMAGES.tuileries },
      { time: "11h30 – 12h00", title: "Place de la Concorde", place: "Place de la Concorde", desc: "Fotos + eixo dos Champs-Élysées.", transport: "A pé", priceEur: "0", image: IMAGES.champs },
      { time: "12h00 – 13h30", title: "Almoço", place: "Concorde / Champs", desc: "Tempo de sentar e descansar — o dia ainda é longo.", transport: "A pé", priceEur: "15 – 25", image: IMAGES.jantar },
      { time: "14h00 – 15h15", title: "Arco do Triunfo", place: "Arc de Triomphe", desc: "Subida à cobertura. Metrô ou táxi para poupar pernas.", transport: "Metrô 1 / táxi", priceEur: "16", image: IMAGES.arco, highlight: true, needsReservation: true, link: { label: "Reservar Arco", url: "https://www.paris-arc-de-triomphe.fr/en/booking/book-a-ticket" } },
      { time: "15h30 – 16h30", title: "Champs-Élysées", place: "Champs-Élysées", desc: "Caminhar só o trecho mais interessante — não precisa fazer a avenida inteira.", transport: "A pé", priceEur: "0", image: IMAGES.champs },
      { time: "16h45 – 17h45", title: "Trocadéro", place: "Trocadéro", desc: "Melhor enquadramento da Torre Eiffel.", transport: "Metrô 6 / 9", priceEur: "0", image: IMAGES.trocadero, highlight: true },
      { time: "18h00 – 19h30", title: "Torre Eiffel", place: "Tour Eiffel", desc: "Subida de elevador no fim da tarde. Preço varia por nível.", transport: "A pé", priceEur: "23 – 36", priceNote: "Preço dinâmico por nível/modo", image: IMAGES.torre, highlight: true, needsReservation: true, link: { label: "Reservar Torre", url: "https://ticket.toureiffel.paris/en" } },
      { time: "20h30 – 21h30", title: "Cruzeiro pelo Sena", place: "Port de la Bourdonnais", desc: "Produto simples, sem jantar a bordo — ideal para sentar depois do dia a pé.", transport: "A pé", priceEur: "18 – 25", image: IMAGES.seine, highlight: true, needsReservation: true, link: { label: "Cruzeiro Sena", url: "https://ticket.parisjetaime.com/en/paris-seine-cruises-s113" } },
      { time: "21h45", title: "Jantar", place: "Centro ou Le Kremlin-Bicêtre", desc: "Volta ao Terracotta de metrô 14/7 ou táxi.", transport: "Metrô / táxi", priceEur: "20 – 35", image: IMAGES.jantar },
    ],
  },
  {
    id: 5, emoji: "🏰", weekday: "Quinta-feira", title: "Disneyland Park",
    city: "paris", color: "#6A1B9A", accent: "#E4DFEC", pace: "Intenso",
    summary: "Um parque, o dia inteiro. Disneyland Park — o castelo clássico, Big Thunder, Pirates, Phantom Manor e Hyperspace Mountain.",
    activities: [
      { time: "06h30", title: "Café", place: "Terracotta", desc: "Levar água e camadas de roupa. Outubro esfria à noite no parque.", transport: "—", priceEur: "8", image: IMAGES.cafe, city: "kremlin" },
      { time: "07h30", title: "Apto → Disney", place: "Marne-la-Vallée–Chessy", desc: "Do Terracotta: metrô 14 até Châtelet–Les Halles e RER A até a Disney. Cerca de €5–7 no RER.", transport: "Metrô 14 + RER A", priceEur: "5 – 7", image: IMAGES.disney, link: { label: "Mapa RER A", url: "https://www.ratp.fr/en/getting-around/maps/rer-a" } },
      { time: "08h30 – 09h00", title: "Chegada ao complexo", place: "Disneyland Paris", desc: "Entrar antes do pico.", transport: "A pé", priceEur: "0", image: IMAGES.disney },
      { time: "09h30 – 12h30", title: "Atrações principais", place: "Disneyland Park", desc: "Big Thunder Mountain, Pirates of the Caribbean, Phantom Manor e Star Wars: Hyperspace Mountain.", transport: "A pé", priceEur: "80 – 95", priceNote: "1 dia / 1 parque · preço dinâmico", image: IMAGES.disney, highlight: true, needsReservation: true, link: { label: "Comprar ingresso", url: "https://www.disneylandparis.com/en-usd/tickets/" } },
      { time: "12h30 – 13h30", title: "Almoço", place: "Disneyland Park", desc: "Reservar restaurante se quiserem mesa certa.", transport: "A pé", priceEur: "15 – 30", image: IMAGES.disney },
      { time: "13h30 – 17h30", title: "Castelo + Main Street", place: "Disneyland Park", desc: "Sleeping Beauty Castle e o restante das atrações clássicas.", transport: "A pé", priceEur: "incl.", image: IMAGES.disney },
      { time: "17h30 – 19h30", title: "Shows, paradas e fotos", place: "Disneyland Park", desc: "Conferir o app oficial do dia.", transport: "A pé", priceEur: "incl.", image: IMAGES.disney, link: { label: "Calendário Disney", url: "https://www.disneylandparis.com/en-usd/calendar/" } },
      { time: "19h30 – 21h30", title: "Jantar + noite no parque", place: "Disneyland Park", desc: "Ficar até o encerramento se todos estiverem bem.", transport: "A pé", priceEur: "20 – 35", image: IMAGES.jantar },
      { time: "22h00", title: "RER A → Terracotta", place: "2 Rue Marcel Sembat", desc: "RER A até Châtelet e metrô 14 de volta a Le Kremlin-Bicêtre.", transport: "RER A + metrô 14", priceEur: "5 – 7", image: IMAGES.aeroporto, city: "kremlin" },
    ],
  },
  {
    id: 6, emoji: "👑", weekday: "Sexta-feira", title: "Versalhes + Montmartre",
    city: "paris", color: "#5D4037", accent: "#EFEBE9", pace: "Médio/alto",
    summary: "Três Parises no mesmo dia: o palácio, o bairro boêmio e o eixo elegante da Opéra / Galeries Lafayette. Último jantar da viagem.",
    activities: [
      { time: "07h00", title: "Café", place: "Terracotta", desc: "Sair cedo. Do apto: metrô até uma estação do RER C (ex. Saint-Michel ou Austerlitz).", transport: "—", priceEur: "8", image: IMAGES.cafe, city: "kremlin" },
      { time: "07h30", title: "Paris → Versailles", place: "Versailles Château Rive Gauche", desc: "RER C até a estação do palácio. Cerca de €5–10.", transport: "RER C", priceEur: "5 – 10", image: IMAGES.versailles, link: { label: "Bilhetes SNCF", url: "https://www.sncf-connect.com/" } },
      { time: "08h45 – 11h00", title: "Palácio de Versailles", place: "Château de Versailles", desc: "Salão dos Espelhos + apartamentos. Horário marcado. Passport de alta temporada ~€35.", transport: "A pé", priceEur: "35", priceNote: "Passport alta temporada", image: IMAGES.versailles, highlight: true, needsReservation: true, link: { label: "Reservar Versailles", url: "https://en.chateauversailles.fr/plan-your-visit/tickets-and-rates" } },
      { time: "11h00 – 12h30", title: "Jardins", place: "Jardins de Versailles", desc: "Priorizar os eixos principais. Trenzinho se alguém estiver cansado. Incluído no Passport.", transport: "A pé / trenzinho", priceEur: "incl.", image: IMAGES.versailles },
      { time: "12h30 – 13h30", title: "Almoço", place: "Versailles", desc: "Dentro ou fora do domínio.", transport: "A pé", priceEur: "15 – 25", image: IMAGES.jantar },
      { time: "13h30 – 14h30", title: "Versailles → Paris", place: "Paris", desc: "Mesmo RER C de volta.", transport: "RER C", priceEur: "5 – 10", image: IMAGES.aeroporto },
      { time: "15h30 – 17h30", title: "Montmartre + Sacré-Cœur", place: "Sacré-Cœur, Montmartre", desc: "Place du Tertre, ruelas e a vista da basílica.", transport: "Metrô 2 / 12", priceEur: "0", image: IMAGES.montmartre, highlight: true },
      { time: "18h00 – 18h45", title: "Opéra Garnier", place: "Palais Garnier", desc: "Entrar se houver horário; senão, ficar na fachada.", transport: "Metrô 7 / 8 / RER A", priceEur: "0 – 25", priceNote: "Visita ~€25 variável", image: IMAGES.opera, needsReservation: true, link: { label: "Visitas Opéra", url: "https://www.operadeparis.fr/en/visits/palais-garnier" } },
      { time: "18h45 – 20h00", title: "Galeries Lafayette", place: "Galeries Lafayette Haussmann", desc: "Cúpula + terraço panorâmico. Compras opcionais. Terraço grátis.", transport: "A pé", priceEur: "0", image: IMAGES.compras, link: { label: "Terraço Galeries", url: "https://haussmann.galerieslafayette.com/en/rooftop/" } },
      { time: "20h15 – 21h00", title: "Apto / descanso", place: "2 Rue Marcel Sembat, apto. 68", desc: "Pausa curta no Terracotta antes do jantar especial. Silêncio a partir das 22h.", transport: "Metrô 14 / 7", priceEur: "0", image: IMAGES.hotel, city: "kremlin" },
      { time: "21h00 – 23h00", title: "Jantar especial", place: "Paris", desc: "Último jantar da viagem — vale pagar um pouco mais.", transport: "Metrô / táxi", priceEur: "35 – 60", image: IMAGES.jantar, highlight: true },
    ],
  },
  {
    id: 7, emoji: "🇧🇷", weekday: "Sábado", title: "Check-out e retorno",
    city: "paris", color: "#F9A825", accent: "#FFF2CC", pace: "Leve",
    summary: "Dia leve: café, malas e CDG. Confirmem o horário real do voo na véspera e saiam com antecedência de longo curso.",
    activities: [
      { time: "Até 11h", title: "Café e check-out", place: "2 Rue Marcel Sembat, apto. 68", desc: "Check-out até 11h. Não há recepção — deixem o apto como receberam. Código e Airbnb na aba Reservas.", transport: "—", priceEur: "8", image: IMAGES.cafe, city: "kremlin", link: { label: "Airbnb da reserva", url: "https://www.airbnb.com/l/KQEkCa8j" } },
      { time: "A confirmar", title: "Terracotta → CDG", place: "Aéroport Charles de Gaulle", desc: "Metrô 14 até Châtelet + RER B, ou táxi/transfer para 5 + malas.", transport: "Metrô 14 + RER B / transfer", priceEur: "12 – 25", image: IMAGES.aeroporto, link: { label: "Acesso CDG", url: "https://www.parisaeroport.fr/en/passengers/access/paris-charles-de-gaulle" } },
      { time: "Voo", title: "CDG → GRU", place: "Aéroport Charles de Gaulle", desc: "Longo curso. Confirmem o horário 72h antes e cheguem cedo.", transport: "Avião", priceEur: "incl.", image: IMAGES.aeroporto, highlight: true },
    ],
  },
];

function prepareActivity(day, activity, idx) {
  activity.key = `${day.id}-${idx}`;
  activity.imageFallback = IMG_FALLBACK;
  activity.city = activity.city || day.city;
  if (!activity.maps && activity.place) activity.maps = mapsUrl(activity.place, activity.city);
  if (activity.link && activity.needsReservation === undefined) activity.needsReservation = !!activity.highlight;
  return activity;
}

DAYS.forEach((day) => {
  day.activities.forEach((a, idx) => prepareActivity(day, a, idx));
});

function cloneActivity(activity) {
  return { ...activity, link: activity.link ? { ...activity.link } : activity.link };
}

function activitiesOf(dayId) {
  return DAYS.find((d) => d.id === dayId).activities.map(cloneActivity);
}

function presentActivities(day, activities) {
  return activities.map((src, idx) => prepareActivity(day, cloneActivity(src), idx));
}

const OPTIONAL_PLAN = {};

(function buildOptionalPlan() {
  const sunday = activitiesOf(1);
  const trevi = sunday[7];
  const spagna = sunday[8];
  const navona = sunday[5];
  const campo = sunday[6];
  const trastevere = sunday[10];
  trevi.time = "16h05 – 16h35";
  trevi.desc = "Logo depois do Panteão, sem voltar mais tarde.";
  spagna.time = "16h40 – 17h15";
  spagna.desc = "Escadaria Espanhola e fotos. Se o voo pesou, metrô A (Spagna → San Giovanni) e encerrem o dia por aqui.";
  navona.time = "17h25 – 17h55";
  navona.desc = "Na descida da Escadaria, em direção ao rio.";
  campo.time = "18h00 – 18h30";
  campo.desc = "Última parada antes da ponte. No domingo o mercado pode não estar montado.";
  trastevere.time = "18h35 – 22h00";
  trastevere.transport = "A pé / táxi na volta";
  trastevere.desc = "A pé pela Ponte Sisto. Aperitivo e jantar. Volta de táxi.";
  OPTIONAL_PLAN[1] = {
    summary: "Pouso às 10h10. Depois do Panteão: Trevi, Escadaria, Navona, Campo de' Fiori e jantar em Trastevere, sem voltar para o outro lado do centro.",
    activities: [sunday[0], sunday[1], sunday[2], sunday[3], sunday[4], trevi, spagna, navona, campo, trastevere],
  };

  const paris = activitiesOf(4);
  const champs = paris[7];
  const arco = paris[6];
  const trocadero = paris[8];
  champs.time = "13h30 – 14h15";
  champs.transport = "A pé";
  champs.desc = "Saindo da Concorde, só o trecho mais interessante, em direção ao Arco.";
  arco.time = "14h15 – 15h15";
  arco.transport = "A pé";
  arco.desc = "Subida à cobertura depois de atravessar a avenida. Entrem por volta das 14h15.";
  trocadero.time = "15h30 – 17h15";
  trocadero.transport = "Metrô 6";
  trocadero.desc = "Duas paradas: Charles de Gaulle–Étoile → Trocadéro. A foto daqui é de tarde; o pôr do sol fica para dentro da Torre.";
  OPTIONAL_PLAN[4] = {
    summary: "Notre-Dame, Louvre por fora e Tuileries de manhã. À tarde, Champs em direção ao Arco, metrô até o Trocadéro e Torre às 18h.",
    activities: [paris[0], paris[1], paris[2], paris[3], paris[4], paris[5], champs, arco, trocadero, paris[9], paris[10], paris[11]],
  };

  const friday = activitiesOf(6);
  const palace = friday[2];
  const gardens = friday[3];
  const lunch = friday[4];
  const back = friday[5];
  const montmartre = friday[6];
  const opera = friday[7];
  const galeries = friday[8];
  const dinner = friday[10];
  palace.time = "09h00 – 11h00";
  palace.desc = "Salão dos Espelhos e apartamentos. Ingresso das 9h, na abertura. Estejam na segurança às 8h45. O Trianon está fechado nesta sexta. Passport ~€35.";
  gardens.time = "11h00 – 12h30";
  gardens.desc = "Jardins Musicais neste dia. Eixos principais e saída por volta das 12h30. Incluído no Passport. Sem Trianon.";
  lunch.time = "12h30 – 13h15";
  lunch.desc = "Almoço rápido, dentro ou fora do domínio.";
  back.time = "13h15 – 14h45";
  back.desc = "RER C de volta, com tempo de chegar a Montmartre antes do fim da tarde.";
  montmartre.time = "15h15 – 19h00";
  montmartre.desc = "Place du Tertre, ruelas e a vista do Sacré-Cœur. Fiquem até perto do pôr do sol, por volta das 19h.";
  opera.time = "19h10 – 19h30";
  opera.desc = "Só a fachada, sem entrar. A visita interna fica de fora neste roteiro.";
  opera.priceEur = "0";
  opera.priceNote = "";
  opera.needsReservation = false;
  opera.link = { label: "Site da Opéra", url: "https://www.operadeparis.fr/en/visits/palais-garnier" };
  galeries.time = "19h30 – 20h15";
  galeries.desc = "Cúpula e terraço, se a fila estiver curta. Compras opcionais.";
  dinner.desc = "Último jantar da viagem, direto do centro.";
  OPTIONAL_PLAN[6] = {
    summary: "Versalhes na abertura das 9h, jardins até 12h30. Montmartre até o pôr do sol e Opéra só por fora. O Trianon está fechado.",
    activities: [friday[0], friday[1], palace, gardens, lunch, back, montmartre, opera, galeries, dinner],
  };
})();

function getAllDays() {
  if (activeItineraryId() !== "opcional") return DAYS;
  return DAYS.map((day) => {
    const plan = OPTIONAL_PLAN[day.id];
    if (!plan) return day;
    return { ...day, summary: plan.summary, activities: presentActivities(day, plan.activities) };
  });
}

function findDay(id) {
  return getAllDays().find((d) => d.id === Number(id));
}

FLIGHTS.forEach((f) => {
  f.maps = mapsUrl(f.mapsPlace, f.city);
});

const BOOKING_LINKS = [
  { cat: "Hotel Roma", name: "Reserva 11 a 13/out", url: "https://www.booking.com/Share-bvGJbc6", icon: "🏨" },
  { cat: "Terracotta Paris", name: "Airbnb 13 a 17/out", url: "https://www.airbnb.com/l/KQEkCa8j", icon: "🏨" },
  { cat: "Terracotta", name: "Formulário do código de check-in", url: "https://form.jotform.com/232836045643053?bookId=93778904&guestFirstName=Vinicius&guestName=Marcondes%20Ferraz%20de%20Carmo", icon: "🔑" },
  { cat: "Terracotta", name: "Extras (Sunver)", url: "https://app.sunver.app/guest/terracotta-1", icon: "➕" },
  { cat: "Panteão", name: "Ingresso oficial €7", url: "https://portale.museiitaliani.it/b2c/n/info/pantheon", icon: "🏛️" },
  { cat: "Vaticano", name: "Museus + Capela Sistina", url: "https://tickets.museivaticani.va/home", icon: "🇻🇦" },
  { cat: "Basílica", name: "São Pedro (entrada livre)", url: "https://www.basilicasanpietro.va/en.html", icon: "⛪" },
  { cat: "Coliseu", name: "Coliseu + Fórum + Palatino", url: "https://colosseo.it/en/orario-e-tariffe/", icon: "🏟️" },
  { cat: "Notre-Dame", name: "Reserva gratuita", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets", icon: "⛪" },
  { cat: "Arco do Triunfo", name: "Subida à cobertura", url: "https://www.paris-arc-de-triomphe.fr/en/booking/book-a-ticket", icon: "🏛️" },
  { cat: "Torre Eiffel", name: "Bilhete oficial", url: "https://ticket.toureiffel.paris/en", icon: "🗼" },
  { cat: "Sena", name: "Cruzeiro simples", url: "https://ticket.parisjetaime.com/en/paris-seine-cruises-s113", icon: "🚢" },
  { cat: "Disneyland", name: "1 dia / 1 parque", url: "https://www.disneylandparis.com/en-usd/tickets/", icon: "🏰" },
  { cat: "Versalhes", name: "Passport oficial", url: "https://en.chateauversailles.fr/plan-your-visit/tickets-and-rates", icon: "👑" },
  { cat: "Opéra Garnier", name: "Visita ao palácio", url: "https://www.operadeparis.fr/en/visits/palais-garnier", icon: "🎭" },
  { cat: "Voo Roma–Paris", name: "Transavia / comparar", url: "https://www.transavia.com/", icon: "✈️" },
  { cat: "ETIAS", name: "Verificar status oficial", url: "https://travel-europe.europa.eu/etias_en", icon: "🇪🇺" },
];

const WEATHER_CODES = {
  0: "☀️ Céu limpo", 1: "🌤️ Quase limpo", 2: "⛅ Parcialmente nublado", 3: "☁️ Nublado",
  45: "🌫️ Neblina", 48: "🌫️ Neblina", 51: "🌦️ Garoa", 61: "🌧️ Chuva",
  63: "🌧️ Chuva", 65: "🌧️ Chuva forte", 71: "🌨️ Neve", 80: "🌦️ Pancadas",
  95: "⛈️ Tempestade",
};
