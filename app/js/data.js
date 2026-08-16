/** Dados da viagem — Paris 5 dias */
const APP_VERSION = "3.1.0";

const TRIP = {
  title: "Viagem à Paris",
  subtitle: "5 dias inesquecíveis",
  version: APP_VERSION,
  cambio: 6.2,
  navigoSemanal: 32.4,
  appUrl: "https://henriquealinfo.github.io/viagem_paris/",
  weather: { lat: 48.8566, lon: 2.3522, city: "Paris" },
  /** Preencha as datas reais da viagem (seg–sex) */
  defaultDates: {
    1: "2026-10-11",
    2: "2026-10-12",
    3: "2026-10-13",
    4: "2026-10-14",
    5: "2026-10-15",
  },
  emergency: {
    hotel: "Hotel (preencher nome)",
    hotelAddress: "Endereço do hotel — Paris",
    hotelPhone: "+33 ...",
    contactName: "Contato de emergência",
    contactPhone: "+55 11 96914-1969",
    embassy: "Embaixada do Brasil — Paris",
    embassyPhone: "+33 1 45 61 63 00",
    emergencyEU: "112",
    medicalFR: "15 (SAMU)",
    policeFR: "17 (Polícia)",
    insurance: "Seguro viagem — nº apólice",
    passportNote: "Tenha foto do passaporte no celular",
  },
  dicasGerais: [
    "Passe Navigo semanal (€32,40) cobre metrô, Disney e aeroporto se for seg–dom.",
    "Reserve Louvre, Torre Eiffel e Disney com antecedência pelo celular.",
    "Leve casaco leve — Paris pode esfriar à noite, mesmo no verão.",
    "Água da torneira é potável. Peça 'une carafe d'eau' no restaurante.",
  ],
};

const CHECKLIST = [
  { id: "passport", label: "Passaporte válido (+ foto digital)", icon: "🛂" },
  { id: "insurance", label: "Seguro viagem contratado", icon: "🏥" },
  { id: "esim", label: "Chip / eSIM para internet", icon: "📱" },
  { id: "navigo", label: "Foto 3×4 para cartão Navigo", icon: "🚇" },
  { id: "louvre", label: "Reserva Louvre confirmada", icon: "🎨" },
  { id: "eiffel", label: "Reserva Torre Eiffel confirmada", icon: "🗼" },
  { id: "disney", label: "Ingresso Disney confirmado", icon: "🏰" },
  { id: "arco", label: "Reserva Arco do Triunfo (se for subir)", icon: "🏛️" },
  { id: "adapter", label: "Adaptador de tomada europeu", icon: "🔌" },
  { id: "charger", label: "Carregador portátil (power bank)", icon: "🔋" },
  { id: "comfort", label: "Sapatos confortáveis para caminhar", icon: "👟" },
  { id: "cards", label: "Cartão sem taxa internacional / euros", icon: "💳" },
];

const FRENCH_PHRASES = [
  { pt: "Por favor", fr: "S'il vous plaît", note: "Educado em qualquer pedido" },
  { pt: "Obrigado(a)", fr: "Merci beaucoup", note: "" },
  { pt: "Não falo francês", fr: "Je ne parle pas français", note: "Muito útil!" },
  { pt: "Fala inglês?", fr: "Parlez-vous anglais?", note: "" },
  { pt: "Onde fica o banheiro?", fr: "Où sont les toilettes?", note: "" },
  { pt: "A conta, por favor", fr: "L'addition, s'il vous plaît", note: "No restaurante" },
  { pt: "Água da torneira", fr: "Une carafe d'eau, s'il vous plaît", note: "Grátis" },
  { pt: "Quanto custa?", fr: "C'est combien?", note: "" },
  { pt: "Preciso de ajuda", fr: "J'ai besoin d'aide", note: "Emergência" },
  { pt: "Estou perdido(a)", fr: "Je suis perdu(e)", note: "" },
  { pt: "Um café, por favor", fr: "Un café, s'il vous plaît", note: "" },
  { pt: "O metrô, por favor", fr: "Le métro, s'il vous plaît", note: "Pedir direções" },
];

const IMG_FALLBACK = "images/placeholder.svg";

const IMAGES_REMOTE = {
  aeroporto: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Paris_-_Aerial_View%2C_La_Defense%2C_Eiffel_Tower%2C_Trocad%C3%A9ro%2C_Tour_Montparnasse%2C_Notre-Dame%2C_Les_Invalides%2C_Arc_de_Triomphe%2C_Louvre%2C_Sacr%C3%A9-C%C5%93ur%2C_Montmartre%2C_2015.jpg/800px-thumbnail.jpg",
  bairro: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Street_in_Le_Marais%2C_Paris%2C_France.jpg/800px-Street_in_Le_Marais%2C_Paris%2C_France.jpg",
  notredame: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Notre-Dame_de_Paris%2C_4_October_2017.jpg/800px-Notre-Dame_de_Paris%2C_4_October_2017.jpg",
  seine: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Panorama_Pont_Neuf_%28Paris%29.jpg/800px-Panorama_Pont_Neuf_%28Paris%29.jpg",
  jantar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Paris_cafe_terrace.jpg/800px-Paris_cafe_terrace.jpg",
  cafe: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Croissant-Petit-Dejeuner.jpg/800px-Croissant-Petit-Dejeuner.jpg",
  louvre: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/800px-Louvre_Museum_Wikimedia_Commons.jpg",
  tuileries: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Tuileries_Garden%2C_Paris%2C_France_-_panoramio.jpg/800px-Tuileries_Garden%2C_Paris%2C_France_-_panoramio.jpg",
  torre: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
  trocadero: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tour_Eiffel%2C_Paris%2C_from_Trocadero%2C_June_2010.jpg/800px-Tour_Eiffel%2C_Paris%2C_from_Trocadero%2C_June_2010.jpg",
  arco: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Arc_de_Triomphe%2C_Paris_7_June_2014%2C_perspective-2.jpg/800px-Arc_de_Triomphe%2C_Paris_7_June_2014%2C_perspective-2.jpg",
  champs: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Champs-Elysees_Daytime_%28cropped%29.jpg/800px-Champs-Elysees_Daytime_%28cropped%29.jpg",
  montmartre: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sacre_Coeur_paris.jpg/800px-Sacre_Coeur_paris.jpg",
  disney: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sleeping_Beauty_Castle_%28cropped%29.jpg/800px-Sleeping_Beauty_Castle_%28cropped%29.jpg",
  orsay: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Le_Mus%C3%A9e_d%27Orsay%2C_Paris_May_2010.jpg/800px-Le_Mus%C3%A9e_d%27Orsay%2C_Paris_May_2010.jpg",
  compras: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Galeries_Lafayette_dome%2C_Paris%2C_France.jpg/800px-Galeries_Lafayette_dome%2C_Paris%2C_France.jpg",
  hotel: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/H%C3%B4tel_des_Invalides%2C_Paris%2C_France.jpg/800px-H%C3%B4tel_des_Invalides%2C_Paris%2C_France.jpg",
};

const IMAGES = {};
Object.keys(IMAGES_REMOTE).forEach((k) => {
  IMAGES[k] = `images/${k}.svg`;
});
IMAGES.versailles = "images/versailles.svg";

function getAllDays(includeOptional) {
  return includeOptional ? [...DAYS, OPTIONAL_DAY] : [...DAYS];
}

function findDay(id, includeOptional) {
  return getAllDays(includeOptional).find((d) => d.id === Number(id));
}

const OPTIONAL_DAY = {
  id: 6, emoji: "👑", optional: true, weekday: "Sábado (opcional)", title: "Versailles",
  color: "#5D4037", accent: "#EFEBE9",
  summary: "Dia opcional — Palácio de Versailles (~1h de trem de Paris).",
  activities: [
    { time: "08h00", title: "Saída de Paris", place: "Gare Saint-Lazare", desc: "Trem RER C ou SNCF até Versailles.", transport: "RER C", priceEur: "0 – 8", image: IMAGES.versailles, link: { label: "Bilhetes trem", url: "https://www.sncf-connect.com/" } },
    { time: "09h30 – 13h", title: "Palácio de Versailles", place: "Château de Versailles", desc: "Salão dos Espelhos, apartamentos reais e jardins.", transport: "A pé", priceEur: "21 – 32", priceNote: "Palácio + jardins ~€32", image: IMAGES.versailles, highlight: true, needsReservation: true, link: { label: "Reservar Versailles", url: "https://www.chateauversailles.fr/visit/tickets" } },
    { time: "13h – 14h", title: "Almoço", place: "Versailles", priceEur: "15 – 25", image: IMAGES.jantar },
    { time: "14h – 17h", title: "Jardins e Grand Trianon", place: "Versailles", desc: "Passeio pelos jardins (grátis nov–mar, exc. Musical Fountains).", transport: "A pé", priceEur: "0 – 12", image: IMAGES.versailles },
    { time: "18h", title: "Retorno a Paris", place: "Paris", transport: "RER C", priceEur: "0 – 8", image: IMAGES.aeroporto },
  ],
};

OPTIONAL_DAY.activities.forEach((a, idx) => {
  a.key = `6-${idx}`;
  a.imageFallback = IMG_FALLBACK;
  if (!a.maps && a.place) a.maps = mapsUrl(a.place);
});

const RESERVATIONS = [
  { id: "louvre", name: "Museu do Louvre", icon: "🎨", url: "https://ticket.louvre.fr/en", dayId: 2, defaultTime: "09:30" },
  { id: "eiffel", name: "Torre Eiffel", icon: "🗼", url: "https://ticket.toureiffel.paris/en", dayId: 2, defaultTime: "16:30" },
  { id: "arco", name: "Arco do Triunfo", icon: "🏛️", url: "https://www.paris-arc-de-triomphe.fr/en/booking/book-a-ticket", dayId: 3, defaultTime: "09:30" },
  { id: "disney", name: "Disneyland Paris", icon: "🏰", url: "https://www.disneylandparis.com/en-usd/tickets/", dayId: 4, defaultTime: "09:30" },
  { id: "orsay", name: "Musée d'Orsay", icon: "🖼️", url: "https://billetterie.musee-orsay.fr/en-GB", dayId: 5, defaultTime: "10:30" },
  { id: "notredame", name: "Notre-Dame", icon: "⛪", url: "https://www.notredamedeparis.fr/en/visit/opening-times-and-access", dayId: 1, defaultTime: "14:00" },
  { id: "navigo", name: "Navigo semanal", icon: "🚇", url: "https://www.iledefrance-mobilites.fr/en/tickets-fares/detail/navigo-weekly-ticket", dayId: 1, defaultTime: "" },
  { id: "versailles", name: "Palácio de Versailles", icon: "👑", url: "https://www.chateauversailles.fr/visit/tickets", dayId: 6, defaultTime: "09:30" },
];

function mapsUrl(place) {
  if (!place) return null;
  const q = encodeURIComponent(`${place}, Paris, France`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

const DAYS = [
  {
    id: 1, emoji: "✈️", weekday: "Segunda-feira", title: "Chegada e Paris Clássico",
    color: "#1F4E79", accent: "#D6E4F0",
    summary: "Dia leve para descansar do voo e conhecer o centro histórico.",
    activities: [
      { time: "Manhã", title: "Chegada e hotel", place: "Aeroporto Charles de Gaulle", desc: "Chegada em CDG ou Orly. Check-in ou deixe as malas no hotel.", transport: "RER B ou Navigo", priceEur: "0 – 14", priceNote: "Navigo semanal inclui se já estiver ativo", image: IMAGES.aeroporto, link: { label: "Navigo semanal", url: "https://www.iledefrance-mobilites.fr/en/tickets-fares/detail/navigo-weekly-ticket" } },
      { time: "11h – 13h", title: "Passeio pelo bairro", place: "Le Marais, Paris", desc: "Caminhada tranquila pelo bairro do hotel e almoço leve.", transport: "A pé / metrô", priceEur: "15", image: IMAGES.bairro },
      { time: "14h – 16h", title: "Notre-Dame e Île de la Cité", place: "Notre-Dame de Paris", desc: "Catedral Notre-Dame (exterior) e Sainte-Chapelle opcional.", transport: "Metrô linha 4", priceEur: "0 – 16", priceNote: "Sainte-Chapelle ~€16", image: IMAGES.notredame, needsReservation: true, link: { label: "Reservar Notre-Dame", url: "https://www.notredamedeparis.fr/en/visit/opening-times-and-access" } },
      { time: "16h30 – 18h", title: "Passeio pelo Sena", place: "Musée du Louvre, Paris", desc: "Caminhada à beira do rio Sena até a praça do Louvre.", transport: "A pé", priceEur: "0", image: IMAGES.seine, link: { label: "Info Louvre", url: "https://www.louvre.fr/en/visit/hours-admission" } },
      { time: "19h – 21h", title: "Jantar e descanso", place: "Bistro Paris", desc: "Primeira noite — jantar tranquilo e descanso para o jet lag.", transport: "Metrô", priceEur: "20 – 35", image: IMAGES.jantar },
    ],
  },
  {
    id: 2, emoji: "🎨", weekday: "Terça-feira", title: "Louvre e Torre Eiffel",
    color: "#2E7D32", accent: "#E2EFDA",
    summary: "O dia mais icônico — museu de manhã, Torre ao entardecer.",
    activities: [
      { time: "08h30", title: "Café da manhã", place: "Boulangerie Paris", desc: "Croissant e café numa padaria parisiense.", transport: "A pé", priceEur: "8", image: IMAGES.cafe },
      { time: "09h30 – 13h", title: "Museu do Louvre", place: "Musée du Louvre", desc: "Mona Lisa, Vênus de Milo e ala Denon. Reserva obrigatória!", transport: "Metrô 1 / 7", priceEur: "22", priceNote: "Grátis 1ª sexta 18h–21h45 (exc. jul/ago)", image: IMAGES.louvre, highlight: true, needsReservation: true, link: { label: "Reservar Louvre", url: "https://ticket.louvre.fr/en" } },
      { time: "13h – 14h", title: "Almoço", place: "Carrousel du Louvre", desc: "Almoço no shopping subterrâneo ou nos jardins.", transport: "A pé", priceEur: "15", image: IMAGES.tuileries },
      { time: "14h30 – 16h", title: "Jardim das Tuileries", place: "Jardin des Tuileries", desc: "Passeio pelos jardins até Place de la Concorde.", transport: "A pé", priceEur: "0", image: IMAGES.tuileries },
      { time: "16h30 – 18h30", title: "Torre Eiffel", place: "Tour Eiffel", desc: "Subir ao topo da Torre Eiffel — reserva online essencial.", transport: "Metrô 6 / RER C", priceEur: "28 – 37", priceNote: "Topo ~€37 | Escadas+elevador ~€28", image: IMAGES.torre, highlight: true, needsReservation: true, link: { label: "Reservar Torre", url: "https://ticket.toureiffel.paris/en" } },
      { time: "19h – 21h", title: "Pôr do sol no Trocadéro", place: "Trocadéro, Paris", desc: "Vista clássica da Torre iluminada + jantar.", transport: "Metrô 6", priceEur: "25", image: IMAGES.trocadero },
    ],
  },
  {
    id: 3, emoji: "🏛️", weekday: "Quarta-feira", title: "Arco e Montmartre",
    color: "#E65100", accent: "#FCE4D6",
    summary: "Arco do Triunfo de manhã, Montmartre à tarde.",
    activities: [
      { time: "09h", title: "Café da manhã", place: "Hotel", transport: "—", priceEur: "8", image: IMAGES.cafe },
      { time: "09h30 – 11h", title: "Arco do Triunfo", place: "Arc de Triomphe", desc: "Subir ao terraço — vista das 12 avenidas de Paris.", transport: "Metrô 1 / 2 / 6", priceEur: "16 – 22", priceNote: "Quarta abr–set: €16", image: IMAGES.arco, highlight: true, needsReservation: true, link: { label: "Reservar Arco", url: "https://www.paris-arc-de-triomphe.fr/en/booking/book-a-ticket" } },
      { time: "11h – 13h", title: "Champs-Élysées", place: "Champs-Élysées, Paris", desc: "Caminhada pela avenida mais famosa.", transport: "A pé", priceEur: "0", image: IMAGES.champs },
      { time: "13h – 14h", title: "Almoço — menu do dia", place: "Bistro Paris", desc: "Formule: prato + sobremesa, geralmente €14–18.", transport: "Metrô", priceEur: "15", image: IMAGES.jantar },
      { time: "14h30 – 16h", title: "Galerias Lafayette", place: "Galeries Lafayette Haussmann", desc: "Opcional — terraço com vista grátis da cúpula.", transport: "Metrô 7 / 9", priceEur: "0", image: IMAGES.compras, link: { label: "Galerias Lafayette", url: "https://www.galerieslafayette.com/en/" } },
      { time: "16h30 – 19h", title: "Montmartre", place: "Sacré-Cœur, Montmartre", desc: "Basílica, Place du Tertre e Moulin Rouge (por fora).", transport: "Metrô 2 / 12", priceEur: "0", image: IMAGES.montmartre, highlight: true },
      { time: "19h30", title: "Jantar em Montmartre", place: "Montmartre, Paris", transport: "Metrô", priceEur: "25", image: IMAGES.jantar },
    ],
  },
  {
    id: 4, emoji: "🏰", weekday: "Quinta-feira", title: "Disneyland Paris",
    color: "#6A1B9A", accent: "#E4DFEC",
    summary: "Dia inteiro na Disney — saia cedo!",
    activities: [
      { time: "07h30", title: "Café rápido", place: "Hotel", desc: "Pequeno-almoço + lanche para levar ao parque.", priceEur: "8", image: IMAGES.cafe },
      { time: "08h00", title: "Trem para Disney", place: "Marne-la-Vallée Chessy", desc: "Viagem de ~45 min até a estação Disney.", transport: "RER A (Navigo)", priceEur: "0", priceNote: "Incluso no Navigo semanal", image: IMAGES.disney, link: { label: "Mapa RER A", url: "https://www.ratp.fr/en/getting-around/maps/rer-a" } },
      { time: "09h30 – 13h", title: "Disneyland Park", place: "Disneyland Paris", desc: "Manhã: Big Thunder, Phantom Manor, Pirates do Caribe.", transport: "A pé", priceEur: "75 – 110", priceNote: "Ingresso 1 dia, 1 parque", image: IMAGES.disney, highlight: true, needsReservation: true, link: { label: "Comprar ingresso", url: "https://www.disneylandparis.com/en-usd/tickets/" } },
      { time: "13h – 14h", title: "Almoço no parque", place: "Disneyland Paris", priceEur: "15 – 25", image: IMAGES.disney, link: { label: "Horários parque", url: "https://www.disneylandparis.com/en-usd/calendar/" } },
      { time: "14h – 17h", title: "Walt Disney Studios", place: "Walt Disney Studios Park", desc: "Se tiver Park Hopper, ou continuar no Parque 1.", priceEur: "incl.", image: IMAGES.disney },
      { time: "17h – 20h", title: "Desfile e jantar", place: "Disneyland Paris", desc: "Show da tarde/noite + jantar no parque.", priceEur: "20 – 30", image: IMAGES.disney },
      { time: "21h", title: "Retorno a Paris", place: "Paris", transport: "RER A", priceEur: "0", image: IMAGES.aeroporto },
    ],
  },
  {
    id: 5, emoji: "🛍️", weekday: "Sexta-feira", title: "Despedida de Paris",
    color: "#F9A825", accent: "#FFF2CC",
    summary: "Últimas compras de manhã e voo à tarde/noite.",
    activities: [
      { time: "08h", title: "Check-out", place: "Hotel", desc: "Saída do hotel. Guardar bagagem se permitido.", priceEur: "0", image: IMAGES.hotel },
      { time: "08h30 – 10h30", title: "Últimas compras", place: "Le Marais, Paris", desc: "Mercado, padaria e souvenirs de despedida.", transport: "Metrô", priceEur: "10 – 30", image: IMAGES.bairro },
      { time: "10h30 – 12h", title: "Musée d'Orsay", place: "Musée d'Orsay", desc: "Opcional — museu numa antiga estação de trem.", transport: "RER C / metrô", priceEur: "0 – 16", priceNote: "Grátis 1º domingo out–mar", image: IMAGES.orsay, needsReservation: true, link: { label: "Reservar d'Orsay", url: "https://billetterie.musee-orsay.fr/en-GB" } },
      { time: "12h – 13h30", title: "Almoço de despedida", place: "Paris", priceEur: "15 – 25", image: IMAGES.jantar },
      { time: "14h – 16h", title: "Aeroporto", place: "Aéroport Charles de Gaulle", desc: "Retorno ao hotel, bagagem e transfer (~1h CDG).", transport: "RER B / Navigo", priceEur: "0 – 14", image: IMAGES.aeroporto, link: { label: "Bilhete aeroporto", url: "https://www.iledefrance-mobilites.fr/en/tickets-fares/detail/paris-region-airport-ticket" } },
    ],
  },
];

DAYS.forEach((day) => {
  day.activities.forEach((a, idx) => {
    a.key = `${day.id}-${idx}`;
    a.imageFallback = IMG_FALLBACK;
    if (!a.maps && a.place) a.maps = mapsUrl(a.place);
    if (a.link && a.needsReservation === undefined) a.needsReservation = !!a.highlight;
  });
});

const BOOKING_LINKS = [
  { cat: "Louvre", name: "Reservar ingresso", url: "https://ticket.louvre.fr/en", icon: "🎨" },
  { cat: "Torre Eiffel", name: "Comprar bilhete", url: "https://ticket.toureiffel.paris/en", icon: "🗼" },
  { cat: "Disneyland", name: "Ingressos Disney", url: "https://www.disneylandparis.com/en-usd/tickets/", icon: "🏰" },
  { cat: "Arco do Triunfo", name: "Reservar visita", url: "https://www.paris-arc-de-triomphe.fr/en/booking/book-a-ticket", icon: "🏛️" },
  { cat: "Navigo", name: "Passe semanal", url: "https://www.iledefrance-mobilites.fr/en/tickets-fares/detail/navigo-weekly-ticket", icon: "🚇" },
  { cat: "d'Orsay", name: "Reservar museu", url: "https://billetterie.musee-orsay.fr/en-GB", icon: "🖼️" },
  { cat: "Notre-Dame", name: "Visita catedral", url: "https://www.notredamedeparis.fr/en/visit/opening-times-and-access", icon: "⛪" },
  { cat: "Versailles", name: "Palácio", url: "https://www.chateauversailles.fr/visit/tickets", icon: "👑" },
];

const LOUVRE_FREE = [
  { date: "02/01/2026", iso: "2026-01-02", day: "Sexta", time: "18h – 21h45" },
  { date: "06/02/2026", iso: "2026-02-06", day: "Sexta", time: "18h – 21h45" },
  { date: "06/03/2026", iso: "2026-03-06", day: "Sexta", time: "18h – 21h45" },
  { date: "03/04/2026", iso: "2026-04-03", day: "Sexta", time: "18h – 21h45" },
  { date: "05/06/2026", iso: "2026-06-05", day: "Sexta", time: "18h – 21h45" },
  { date: "04/09/2026", iso: "2026-09-04", day: "Sexta", time: "18h – 21h45" },
  { date: "02/10/2026", iso: "2026-10-02", day: "Sexta", time: "18h – 21h45" },
  { date: "06/11/2026", iso: "2026-11-06", day: "Sexta", time: "18h – 21h45" },
  { date: "04/12/2026", iso: "2026-12-04", day: "Sexta", time: "18h – 21h45" },
];

const WEATHER_CODES = {
  0: "☀️ Céu limpo", 1: "🌤️ Quase limpo", 2: "⛅ Parcialmente nublado", 3: "☁️ Nublado",
  45: "🌫️ Neblina", 48: "🌫️ Neblina", 51: "🌦️ Garoa", 61: "🌧️ Chuva",
  63: "🌧️ Chuva", 65: "🌧️ Chuva forte", 71: "🌨️ Neve", 80: "🌦️ Pancadas",
  95: "⛈️ Tempestade",
};
