# Menu digitale — Trattoria da Peppe

Menu web per ristoranti: un solo file `index.html`, senza dipendenze né build.

- Categorie con navigazione che segue lo scorrimento
- Filtri: vegetariano, vegano, senza glutine, piccante
- Scheda del piatto con foto, allergeni e abbinamento consigliato
- Italiano / inglese (lingua scelta in automatico, oppure `?lang=en`)
- Tema chiaro e scuro, pensato prima di tutto per il telefono

## Modificare il menu

Apri `index.html` e cerca **MODIFICA QUI IL TUO MENU**: piatti, prezzi, allergeni
e traduzioni sono tutti nell'array `MENU`. I testi dell'interfaccia sono nell'oggetto `T`.

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
