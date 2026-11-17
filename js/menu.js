/* ================================================================
   MENU — questo è l'unico file da modificare per cambiare il menu.

   PIATTI
     name, price, desc       nome, prezzo (numero), descrizione
     tags                    "veg" vegetariano · "vegan" · "gf" senza glutine · "hot" piccante
     allergens, pair         allergeni e abbinamento consigliato (facoltativi)
     chef: true              mostra "Consigliato dallo chef" (al massimo uno per categoria)

   INGLESE
     ogni piatto e categoria può avere  en: { name, desc, allergens, pair, note }
     un campo mancante in "en" usa il testo italiano. I nomi tipici
     (Tiramisù, Margherita, Cacio e pepe…) di solito restano in italiano.

   FOTO
     foto/<nome-del-piatto>.jpg       grande, per la scheda (circa 960 px)
     foto/mini/<nome-del-piatto>.jpg  piccola, per l'elenco (circa 250 px)
     nome in minuscolo, senza accenti, trattini al posto degli spazi:
       "Tagliatelle al ragù" → tagliatelle-al-ragu.jpg
     se la foto manca, il piatto si vede senza.
     img: "foto/altro.webp"  per usare un altro file  ·  img: false  per nessuna foto
   ================================================================ */

const MENU = [
  { id: "antipasti", name: "Antipasti", note: "Per iniziare, da condividere",
    en: { name: "Starters", note: "To begin, made for sharing" }, dishes: [
    { name: "Tagliere della casa", chef: true, price: 16, desc: "Salumi locali, pecorino stagionato, giardiniera e gnocco fritto.", allergens: "Glutine, latte", pair: "Lambrusco di Sorbara",
      en: { name: "House cured-meat board", desc: "Local cured meats, aged pecorino, pickled vegetables and fried dough.", allergens: "Gluten, milk" } },
    { name: "Burrata e pomodorini", price: 12, desc: "Burrata pugliese, pomodorini confit, basilico e olio EVO.", tags: ["veg", "gf"], allergens: "Latte", pair: "Fiano di Avellino",
      en: { name: "Burrata & cherry tomatoes", desc: "Apulian burrata, confit cherry tomatoes, basil and extra-virgin olive oil.", allergens: "Milk" } },
    { name: "Polpette al sugo", price: 10, desc: "Polpette di manzo in salsa di pomodoro, crostone di pane.", allergens: "Glutine, uova, latte",
      en: { name: "Meatballs in tomato sauce", desc: "Beef meatballs in tomato sauce, served with toasted bread.", allergens: "Gluten, eggs, milk" } },
    { name: "Peperoni gratinati", price: 8, desc: "Peperoni al forno con pangrattato, capperi e acciughe.", tags: ["hot"], allergens: "Glutine, pesce",
      en: { name: "Baked stuffed peppers", desc: "Oven-baked peppers with breadcrumbs, capers and anchovies.", allergens: "Gluten, fish" } },
  ]},
  { id: "primi", name: "Primi", note: "Pasta fresca tirata a mano ogni mattina",
    en: { name: "Pasta & Risotto", note: "Fresh pasta, rolled by hand every morning" }, dishes: [
    { name: "Tagliatelle al ragù", chef: true, price: 14, desc: "Ragù bianco e rosso cotto otto ore, Parmigiano 30 mesi.", allergens: "Glutine, uova, latte, sedano", pair: "Sangiovese di Romagna",
      en: { desc: "Egg tagliatelle with a meat ragù slow-cooked for eight hours, 30-month Parmigiano.", allergens: "Gluten, eggs, milk, celery" } },
    { name: "Cacio e pepe", price: 12, desc: "Tonnarelli, pecorino romano DOP e pepe nero tostato.", tags: ["veg"], allergens: "Glutine, latte",
      en: { desc: "Tonnarelli pasta, Pecorino Romano PDO and toasted black pepper.", allergens: "Gluten, milk" } },
    { name: "Risotto ai funghi porcini", price: 16, desc: "Carnaroli mantecato, porcini trifolati e timo.", tags: ["veg", "gf"], allergens: "Latte",
      en: { name: "Porcini mushroom risotto", desc: "Creamy Carnaroli rice, sautéed porcini and thyme.", allergens: "Milk" } },
    { name: "Penne all'arrabbiata", price: 11, desc: "Pomodoro San Marzano, aglio e peperoncino calabrese.", tags: ["vegan", "veg", "hot"], allergens: "Glutine",
      en: { desc: "San Marzano tomato, garlic and Calabrian chilli.", allergens: "Gluten" } },
  ]},
  { id: "secondi", name: "Secondi", note: "Serviti con un contorno a scelta",
    en: { name: "Mains", note: "Served with a side of your choice" }, dishes: [
    { name: "Tagliata di manzo", price: 22, desc: "Controfiletto alla brace, rucola, grana e aceto balsamico.", tags: ["gf"], allergens: "Latte", pair: "Nero d'Avola",
      en: { name: "Sliced grilled beef", desc: "Chargrilled sirloin, rocket, Grana cheese and balsamic vinegar.", allergens: "Milk" } },
    { name: "Filetto di branzino", price: 20, desc: "In crosta di patate, con salsa al limone e capperi.", tags: ["gf"], allergens: "Pesce",
      en: { name: "Sea bass fillet", desc: "Potato-crusted, with a lemon and caper sauce.", allergens: "Fish" } },
    { name: "Parmigiana di melanzane", price: 14, desc: "Melanzane fritte, sugo, mozzarella fiordilatte e basilico.", tags: ["veg"], allergens: "Latte, glutine",
      en: { name: "Aubergine parmigiana", desc: "Fried aubergine layered with tomato sauce, fior di latte mozzarella and basil.", allergens: "Milk, gluten" } },
    { name: "Pollo alla diavola", price: 17, desc: "Mezzo galletto marinato al peperoncino, cotto al forno.", tags: ["gf", "hot"], allergens: "—",
      en: { name: "Devilled chicken", desc: "Half a spring chicken marinated in chilli, roasted in the oven." } },
  ]},
  { id: "pizze", name: "Pizze", note: "Impasto a lunga lievitazione, forno a legna",
    en: { name: "Pizza", note: "Slow-rise dough, wood-fired oven" }, dishes: [
    { name: "Margherita", price: 8, desc: "Pomodoro, fiordilatte, basilico, olio EVO.", tags: ["veg"], allergens: "Glutine, latte",
      en: { desc: "Tomato, fior di latte mozzarella, basil, extra-virgin olive oil.", allergens: "Gluten, milk" } },
    { name: "Diavola", price: 10, desc: "Pomodoro, fiordilatte, salame piccante.", tags: ["hot"], allergens: "Glutine, latte",
      en: { desc: "Tomato, fior di latte mozzarella, spicy salami.", allergens: "Gluten, milk" } },
    { name: "Ortolana", price: 11, desc: "Fiordilatte, verdure grigliate di stagione, pomodorini.", tags: ["veg"], allergens: "Glutine, latte",
      en: { desc: "Fior di latte mozzarella, grilled seasonal vegetables, cherry tomatoes.", allergens: "Gluten, milk" } },
    { name: "Marinara", price: 7, desc: "Pomodoro, aglio, origano, olio EVO.", tags: ["vegan", "veg"], allergens: "Glutine",
      en: { desc: "Tomato, garlic, oregano, extra-virgin olive oil. No cheese.", allergens: "Gluten" } },
  ]},
  { id: "dolci", name: "Dolci", note: "Fatti in casa",
    en: { name: "Desserts", note: "Homemade" }, dishes: [
    { name: "Tiramisù", chef: true, price: 7, desc: "Savoiardi, mascarpone, caffè espresso e cacao amaro.", tags: ["veg"], allergens: "Glutine, uova, latte", pair: "Marsala superiore",
      en: { desc: "Ladyfingers, mascarpone, espresso and bitter cocoa.", allergens: "Gluten, eggs, milk" } },
    { name: "Panna cotta", price: 6, desc: "Alla vaniglia, con coulis di frutti di bosco.", tags: ["veg", "gf"], allergens: "Latte",
      en: { desc: "Vanilla panna cotta with a berry coulis.", allergens: "Milk" } },
    { name: "Sorbetto al limone", price: 5, desc: "Limoni di Amalfi, servito in coppa.", tags: ["vegan", "veg", "gf"], allergens: "—",
      en: { name: "Lemon sorbet", desc: "Made with Amalfi lemons, served in a glass." } },
  ]},
  { id: "bevande", name: "Bevande",
    en: { name: "Drinks" }, dishes: [
    { name: "Acqua naturale o frizzante", img: false, price: 2.5, desc: "Bottiglia da 75 cl.", tags: ["vegan", "veg", "gf"],
      en: { name: "Still or sparkling water", desc: "75 cl bottle." } },
    { name: "Vino della casa", img: false, price: 12, desc: "Rosso o bianco, caraffa da 1 litro.", tags: ["vegan", "veg", "gf"], allergens: "Solfiti",
      en: { name: "House wine", desc: "Red or white, 1-litre carafe.", allergens: "Sulphites" } },
    { name: "Birra artigianale", img: false, price: 6, desc: "Bionda non filtrata, 33 cl.", tags: ["vegan", "veg"], allergens: "Glutine",
      en: { name: "Craft beer", desc: "Unfiltered lager, 33 cl.", allergens: "Gluten" } },
    { name: "Caffè espresso", img: false, price: 1.5, desc: "Miscela 100% arabica.", tags: ["vegan", "veg", "gf"],
      en: { name: "Espresso", desc: "100% Arabica blend." } },
  ]},
];

/* ---------- Testi dell'interfaccia ---------- */
const T = {
  it: {
    title: "Menu — Trattoria da Peppe",
    eyebrow: "Cucina di stagione · dal 1987",
    meta: "Via Roma 12 · Aperto a pranzo e cena · Coperto&nbsp;€&nbsp;2,50",
    categories: "Categorie", filters: "Filtri",
    filter: { veg: "Vegetariano", vegan: "Vegano", gf: "Senza glutine", hot: "Piccante" },
    badge:  { veg: "Veg", vegan: "Vegano", gf: "No glutine", hot: "Piccante" },
    chef: "Consigliato dallo chef",
    empty: "Nessun piatto di questa sezione corrisponde ai filtri.", reset: "Rimuovi filtri",
    features: "Caratteristiche", allergens: "Allergeni", askStaff: "Chiedi al personale",
    pair: "Abbinamento consigliato", close: "Chiudi",
    footer: ["Informa il personale di eventuali allergie o intolleranze.", "* Prodotto surgelato all'origine."],
    credits: "Crediti delle foto",
  },
  en: {
    title: "Menu — Trattoria da Peppe",
    eyebrow: "Seasonal cooking · since 1987",
    meta: "Via Roma 12 · Open for lunch and dinner · Cover charge&nbsp;€2.50",
    categories: "Categories", filters: "Filters",
    filter: { veg: "Vegetarian", vegan: "Vegan", gf: "Gluten-free", hot: "Spicy" },
    badge:  { veg: "Veg", vegan: "Vegan", gf: "GF", hot: "Spicy" },
    chef: "Chef's recommendation",
    empty: "No dishes in this section match your filters.", reset: "Clear filters",
    features: "Dietary", allergens: "Allergens", askStaff: "Please ask our staff",
    pair: "Suggested pairing", close: "Close",
    footer: ["Please tell our staff about any allergies or intolerances.", "* May contain frozen ingredients."],
    credits: "Photo credits",
  },
};
