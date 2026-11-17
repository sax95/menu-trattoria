# Menu digitale — Trattoria da Peppe

Menu web per ristoranti in HTML, CSS e JavaScript puri: niente librerie, niente build.

- Categorie con navigazione che segue lo scorrimento
- Filtri: vegetariano, vegano, senza glutine, piccante
- Scheda del piatto con foto, allergeni e abbinamento consigliato
- Italiano / inglese (lingua scelta in automatico, oppure `?lang=en`)
- Tema chiaro e scuro, pensato prima di tutto per il telefono

## Struttura

```
index.html      struttura della pagina
crediti.html    autori e licenze delle foto
css/style.css   tutti gli stili (colori in cima, sezione :root)
js/menu.js      ← DATI: piatti, prezzi, allergeni, traduzioni
js/app.js       funzionamento della pagina
foto/           foto grandi (960 px) per la scheda del piatto
foto/mini/      foto piccole (250 px) per l'elenco
```

## Modificare il menu

Per cambiare piatti, prezzi, allergeni o traduzioni basta modificare **`js/menu.js`**:
le istruzioni sono in cima al file. I testi dell'interfaccia (filtri, pulsanti,
piè di pagina) sono nell'oggetto `T` nello stesso file.
I colori si cambiano in cima a `css/style.css`.

## Foto

Le foto stanno in `foto/` (960 px, per la scheda del piatto) e in `foto/mini/`
(250 px, per l'elenco). Prendono il nome dal piatto, in minuscolo, senza accenti
e con i trattini al posto degli spazi (es. `tagliatelle-al-ragu.jpg`).
L'elenco completo è in [`foto/LEGGIMI.txt`](foto/LEGGIMI.txt).

> Le foto attuali sono dimostrative e vengono da Wikimedia Commons con licenze libere
> (autori e licenze in [`crediti.html`](crediti.html)). Se sostituisci una foto con una tua,
> togli la sua riga da `crediti.html`.

## Pubblicazione

Il sito è servito da GitHub Pages (branch `main`, cartella principale).
Ogni `git push` aggiorna il sito in circa un minuto.
