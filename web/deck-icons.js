'use strict';
/* HoneyDeck – Piktogramm-Bibliothek. Flache, reduzierte Zeichen auf einem 24er-Raster.
   Jedes Zeichen besteht aus Flächen; Flächen mit acc:true werden in der Akzentfarbe gezeichnet.
   Gezeichnet wird mit Path2D (SVG-Pfade), Löcher über die Füllregel evenodd. */
(function(){
  const f = n => +n.toFixed(2);
  // Formen als SVG-Pfad
  const C = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
  const R = (x, y, w, h, r = 0) => { r = Math.min(r, w / 2, h / 2); return r ? `M${f(x + r)} ${f(y)}h${f(w - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${f(h - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(-(w - 2 * r))}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(-(h - 2 * r))}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}Z` : `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`; };
  const SECTOR = (x, y, r1, r2, a1, a2) => { const p = (r, d) => [x + r * Math.cos(d * Math.PI / 180), y + r * Math.sin(d * Math.PI / 180)].map(f).join(' ');
    return `M${p(r1, a1)}L${p(r2, a1)}A${r2} ${r2} 0 0 1 ${p(r2, a2)}L${p(r1, a2)}A${r1} ${r1} 0 0 0 ${p(r1, a1)}Z`; };
  const RING = (x, y, r, t) => C(x, y, r) + C(x, y, r - t);
  const POLY = (...p) => 'M' + p.map(n => f(n)).reduce((s, n, i) => s + (i && i % 2 === 0 ? 'L' : i ? ' ' : '') + n, '') + 'Z';
  // Linie mit Stärke t (als Fläche)
  const LINE = (x1, y1, x2, y2, t = 2) => { const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l * t / 2, ny = dx / l * t / 2;
    return POLY(x1 + nx, y1 + ny, x2 + nx, y2 + ny, x2 - nx, y2 - ny, x1 - nx, y1 - ny); };
  const PERSON = (x, y, s = 1) => C(x, y - 5.2 * s, 2.6 * s) + `M${f(x - 5 * s)} ${f(y + 6 * s)}v${f(-3 * s)}a${f(5 * s)} ${f(5 * s)} 0 0 1 ${f(10 * s)} 0v${f(3 * s)}Z`;
  const ARROW_R = (x, y, w, t = 3, hd = 4) => POLY(x, y - t / 2, x + w - hd, y - t / 2, x + w - hd, y - hd, x + w, y, x + w - hd, y + hd, x + w - hd, y + t / 2, x, y + t / 2);
  const a = d => ({d, acc: true}), n = d => ({d});

  const ICONS = [
    // ───── Protest & Bewegung ─────
    ['megafon', 'Megafon', 'Protest', [n('M3 9h4l9-5v16l-9-5H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z'), n(R(5, 15, 3, 5, 1)), a('M18 8.5a5 5 0 0 1 0 7l-1.3-1.3a3.2 3.2 0 0 0 0-4.4Z'), a('M20.4 6a8.5 8.5 0 0 1 0 12l-1.3-1.3a6.7 6.7 0 0 0 0-9.4Z')]],
    ['faust', 'Erhobene Faust', 'Protest', [n('M7 9.5V6.2a1.6 1.6 0 0 1 3.2 0V9h.4V5.2a1.6 1.6 0 0 1 3.2 0V9h.4V5.8a1.6 1.6 0 0 1 3.2 0V9.5h.2a1.6 1.6 0 0 1 1.6 1.6V14a5 5 0 0 1-2 4v4H8v-4a5.6 5.6 0 0 1-2.4-4.6V11a1.5 1.5 0 0 1 1.4-1.5Z'), a(R(8, 20, 9, 2, 0.5))]],
    ['schild', 'Demo-Schild', 'Protest', [n(R(3, 3, 18, 11, 1.5)), n(R(11, 13, 2, 9, 0.5)), a(R(6, 6.5, 12, 1.8, 0.9)), a(R(6, 9.5, 8, 1.8, 0.9))]],
    ['demo', 'Demonstration', 'Protest', [n(PERSON(6, 15, 0.8)), n(PERSON(18, 15, 0.8)), n(PERSON(12, 16, 0.95)), a(R(8, 2, 8, 5, 1)), a(R(11.4, 6.5, 1.2, 4))]],
    ['streik', 'Streik', 'Protest', [n('M2 21V11l5 3V11l5 3V11l5 3V5h3v16Z'), a(R(14, 2, 8, 6, 1)), a(R(17.4, 7.5, 1.2, 4))]],
    ['flagge', 'Fahne', 'Protest', [n(R(4, 2, 2, 20, 1)), a('M6.5 3h13l-3 4.5 3 4.5h-13Z')]],
    ['solidaritaet', 'Händedruck', 'Protest', [n('M1 9l4-2 5 1 3-1.5L18 9l5-1v6l-3 1-5 4.5a1.6 1.6 0 0 1-2.3-.2 1.6 1.6 0 0 1-2.4-.6 1.6 1.6 0 0 1-2.2-1.2 1.6 1.6 0 0 1-1.8-2L1 14Z'), a('M10 8l3-1.5 5 2.5-2.2 1.4-3.5-1.6-1.8 1.4a1.4 1.4 0 0 1-1.9-.2Z')]],
    ['kette', 'Kette', 'Protest', [n('M3.5 13.5l3-3a4 4 0 0 1 5.6 0l.7.7-1.5 1.5-.7-.7a2 2 0 0 0-2.8 0l-3 3a2 2 0 0 0 2.8 2.8l1-1 1.5 1.5-1 1a4 4 0 0 1-5.6-5.6Z'), n('M20.5 10.5l-3 3a4 4 0 0 1-5.6 0l-.7-.7 1.5-1.5.7.7a2 2 0 0 0 2.8 0l3-3a2 2 0 0 0-2.8-2.8l-1 1-1.5-1.5 1-1a4 4 0 0 1 5.6 5.6Z')]],
    ['kette-gebrochen', 'Gesprengte Kette', 'Protest', [n('M3.5 13.5l3-3a4 4 0 0 1 4.4-.8L9.4 11.2a2 2 0 0 0-1.4.6l-3 3a2 2 0 0 0 2.8 2.8l1-1 1.5 1.5-1 1a4 4 0 0 1-5.8-5.6Z'), n('M20.5 10.5l-3 3a4 4 0 0 1-4.4.8l1.5-1.5a2 2 0 0 0 1.4-.6l3-3a2 2 0 0 0-2.8-2.8l-1 1-1.5-1.5 1-1a4 4 0 0 1 5.8 5.6Z'), a(LINE(11, 2, 12, 6, 1.6)), a(LINE(16, 18, 13, 21.5, 1.6)), a(LINE(5, 6, 8, 8, 1.6))]],
    ['flamme', 'Flamme', 'Protest', [n('M12 22c-4.4 0-7-2.8-7-6.6 0-4 3-6 4-9.4 1.6 1.4 2.2 3 2.2 4.6 1.4-1 2.4-3.6 2.2-7.6 3.6 2.6 6.6 6.8 6.6 12.4 0 3.8-3.2 6.6-8 6.6Z'), a('M12 21c-2 0-3.2-1.2-3.2-3 0-1.8 1.4-2.8 2-4.4.8.8 1 1.6 1 2.4.7-.4 1.3-1.4 1.3-2.8 1.6 1.2 2.5 3 2.5 4.8 0 1.8-1.4 3-3.6 3Z')]],
    ['wahlurne', 'Wahlurne', 'Politik', [n(R(3, 10, 18, 12, 1.5)), n(R(2, 8, 20, 3, 1)), a(R(8, 2, 8, 9, 0.6)), n(R(6, 9, 12, 1.2))]],
    ['stimmzettel', 'Stimmzettel', 'Politik', [n(R(4, 2, 16, 20, 1.5)), a(LINE(7, 8, 9, 10, 1.6)), a(LINE(9, 10, 12.5, 5.5, 1.6)), n(R(14, 6.5, 4, 1.6, 0.8)), n(R(7, 13, 11, 1.6, 0.8)), n(R(7, 16.5, 8, 1.6, 0.8))]],
    ['parlament', 'Parlament', 'Politik', [n('M12 2l10 5v2H2V7Z'), n(R(3.5, 10, 2.5, 8)), n(R(8, 10, 2.5, 8)), n(R(13.5, 10, 2.5, 8)), n(R(18, 10, 2.5, 8)), n(R(2, 19, 20, 3, 0.5)), a(C(12, 6, 1.4))]],
    ['kuppel', 'Kuppel', 'Politik', [n('M4 12a8 8 0 0 1 16 0Z'), a(R(11, 2, 2, 3)), n(R(3, 13, 18, 2)), n(R(4, 16, 2, 4)), n(R(9, 16, 2, 4)), n(R(13, 16, 2, 4)), n(R(18, 16, 2, 4)), n(R(2, 20.5, 20, 1.8))]],
    ['rednerpult', 'Rednerpult', 'Politik', [n('M5 11h14l-2 11H7Z'), n(R(4, 9, 16, 2.5, 0.5)), n(PERSON(12, 8.5, 0.75)), a(R(10.5, 14, 3, 3, 1.5))]],
    ['krone', 'Krone', 'Politik', [n('M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5Z'), n(R(5, 19, 14, 3, 0.8)), a(C(12, 13.5, 1.6))]],
    ['waage', 'Waage', 'Recht', [n(R(11, 4, 2, 15)), n(R(7, 19, 10, 3, 1)), n(R(4, 5, 16, 2, 1)), a('M2 13l3-6 3 6a3 3 0 0 1-6 0Z'), a('M16 13l3-6 3 6a3 3 0 0 1-6 0Z'), n(C(12, 3.5, 1.6))]],
    ['paragraf', 'Paragraf', 'Recht', [n('M14.6 7.2C14.2 5.6 13.4 5 12 5c-1.6 0-2.4.8-2.4 1.9 0 2.8 7.4 2.3 7.4 7 0 1.4-.6 2.4-1.6 3.1.5.6.8 1.4.8 2.3 0 2.2-1.8 3.7-4.2 3.7-2.4 0-4-1.2-4.6-3.4l2.1-.6c.3 1.2 1.1 1.8 2.5 1.8 1.3 0 2-.6 2-1.5 0-2.6-7.4-2.3-7.4-6.9 0-1.4.6-2.4 1.6-3.1-.5-.6-.8-1.4-.8-2.3C7.4 4.4 9.2 3 11.8 3c2.2 0 3.8 1 4.6 3.4ZM9.8 12.2c0 1.3 2 1.8 3.8 2.6.4-.4.6-.8.6-1.2 0-1.4-2-1.9-3.8-2.6-.4.3-.6.7-.6 1.2Z')]],
    ['hammer', 'Richterhammer', 'Recht', [n('M3.5 9.3l6-6 2.8 2.8-6 6Z'), n('M9 14.8l6-6 2.8 2.8-6 6Z'), n(LINE(13.5, 10.5, 21, 18, 2.6)), a(R(3, 19.5, 10, 2.5, 1))]],
    ['polizei', 'Polizei', 'Staat', [n('M12 2l8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.6-8-5.8-8-11V5Z'), a('M12 7.5l1.4 2.9 3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.8 1.5.5-3.2-2.3-2.2 3.2-.5Z')]],
    ['helm', 'Einsatzhelm', 'Staat', [n('M3 15a9 9 0 0 1 18 0v1H3Z'), n(R(2, 16, 20, 2.5, 1)), a(R(5, 12.5, 14, 2.4, 0.4)), n(R(11, 4, 2, 4))]],
    ['schutzschild', 'Schutzschild', 'Staat', [n('M12 2l8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.6-8-5.8-8-11V5Z'), a('M12 4.3V19.7C8.8 18.2 6.2 14.8 6.2 11V6.5Z')]],
    ['gefaengnis', 'Gefängnis', 'Staat', [n(R(3, 3, 18, 18, 1.5) + R(5, 5, 14, 14)), n(R(7.5, 4, 2, 16)), n(R(11, 4, 2, 16)), n(R(14.5, 4, 2, 16)), a(R(4, 10.5, 16, 2))]],
    ['ueberwachung', 'Überwachungskamera', 'Staat', [n('M3 6.5l13 4-1.6 5-13-4Z'), n(R(15.8, 12.5, 2, 6)), n(R(15, 18, 7, 2.5, 0.8)), a(C(6.5, 9.2, 1.2))]],
    ['auge', 'Auge', 'Staat', [n('M1.5 12C4 7.5 7.8 5 12 5s8 2.5 10.5 7c-2.5 4.5-6.3 7-10.5 7S4 16.5 1.5 12Z' + C(12, 12, 4.6)), a(C(12, 12, 2.6))]],
    ['grenze', 'Grenzzaun', 'Staat', [n(R(3, 5, 2, 17)), n(R(11, 5, 2, 17)), n(R(19, 5, 2, 17)), n(R(2, 9, 20, 1.6)), n(R(2, 15, 20, 1.6)), a('M2 3l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2v1.6l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Z')]],
    ['ausweis', 'Ausweis', 'Staat', [n(R(2, 5, 20, 14, 2) + R(4, 7, 16, 10, 0.6)), a(C(8.5, 10.5, 2)), a('M5.5 16a3 3 0 0 1 6 0Z'), n(R(13, 9.5, 5, 1.5, 0.7)), n(R(13, 12.5, 4, 1.5, 0.7))]],
    // ───── Arbeit & Wirtschaft ─────
    ['fabrik', 'Fabrik', 'Arbeit', [n('M2 22V10l5 3.5V10l5 3.5V10l5 3.5V3h4v19Z'), a(R(5, 16, 3, 3)), a(R(10.5, 16, 3, 3)), a(R(16, 16, 3, 3))]],
    ['zahnrad', 'Zahnrad', 'Arbeit', [n('M10.3 2h3.4l.5 2.6a7.6 7.6 0 0 1 2 1.1l2.5-.9 1.7 3-2 1.7a7.6 7.6 0 0 1 0 2.4l2 1.7-1.7 3-2.5-.9a7.6 7.6 0 0 1-2 1.1l-.5 2.6h-3.4l-.5-2.6a7.6 7.6 0 0 1-2-1.1l-2.5.9-1.7-3 2-1.7a7.6 7.6 0 0 1 0-2.4l-2-1.7 1.7-3 2.5.9a7.6 7.6 0 0 1 2-1.1Z' + C(12, 11, 3)), a(C(12, 11, 1.6))]],
    ['werkzeug', 'Schraubenschlüssel', 'Arbeit', [n('M14.5 2.5a5.5 5.5 0 0 0-5.2 7.3L2.6 16.5a2.1 2.1 0 0 0 3 3l6.7-6.7A5.5 5.5 0 0 0 19.6 7L16.4 10l-2.6-.6-.6-2.6L16.2 3.6a5.5 5.5 0 0 0-1.7-1.1Z'), a(C(4.3, 18, 1))]],
    ['helm-bau', 'Bauhelm', 'Arbeit', [n('M4 16a8 8 0 0 1 16 0Z'), n(R(2, 16, 20, 3, 1.2)), a(R(10.5, 6, 3, 8, 1))]],
    ['koffer', 'Aktenkoffer', 'Arbeit', [n(R(2, 7, 20, 14, 2)), n('M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h-2V5h-4v2Z'), a(R(2, 12, 20, 2)), n(R(10.5, 11, 3, 4, 0.6))]],
    ['geld', 'Geldscheine', 'Wirtschaft', [n(R(2, 6, 20, 12, 1.5) + C(12, 12, 3.2)), a(C(12, 12, 1.8)), n(R(4, 8, 2, 2, 1)), n(R(18, 14, 2, 2, 1))]],
    ['euro', 'Euro', 'Wirtschaft', [n('M15.8 4.6l-.6 2.2C14.4 6.4 13.6 6.2 12.8 6.2c-2.2 0-3.9 1.3-4.6 3.3h5.6l-.5 1.8H7.9v1.4h4.9l-.5 1.8H8.2c.7 2 2.4 3.3 4.6 3.3.9 0 1.7-.2 2.4-.6l.6 2.2c-.9.5-2 .8-3.1.8-3.6 0-6.3-2.3-7-5.7H4l.5-1.8H5.5v-1.4H4l.5-1.8h1.2c.7-3.4 3.4-5.7 7.1-5.7 1.1 0 2.2.3 3 .8Z')]],
    ['muenzen', 'Münzstapel', 'Wirtschaft', [n(R(3, 17, 10, 3, 1.5)), n(R(3, 13, 10, 3, 1.5)), n(R(3, 9, 10, 3, 1.5)), a(C(17, 15, 5)), n(R(16.2, 12.5, 1.6, 5, 0.6))]],
    ['sparschwein', 'Sparschwein', 'Wirtschaft', [n('M4 12a7 6 0 0 1 7-6h3a7 6 0 0 1 5.2 2.6L21.5 8v3.5l-1.6.6a6.4 6.4 0 0 1-2 3.4V19h-3v-2.4h-4V19H8v-3.1A6 6 0 0 1 5.4 14H3v-3h1.1Z'), a(R(9, 4, 5, 2, 1)), n(C(16.5, 10.5, 0.9))]],
    ['einkauf', 'Einkaufswagen', 'Wirtschaft', [n('M1.5 3h3.4l.8 3H22l-2.4 9H8.1l.5 2H19v2H7L3.4 5H1.5Z'), a(C(9, 20.5, 1.6)), a(C(18, 20.5, 1.6))]],
    ['diagramm-hoch', 'Steigende Kurve', 'Wirtschaft', [n(R(2, 20, 20, 2)), n(R(2, 3, 2, 18)), a('M6 16.5l4-5 3.5 2.5 5-6.2-1.8-1.3L21.5 4l.4 5.3-1.8-1.3-6.2 7.6-3.5-2.5-3.2 4Z')]],
    ['diagramm-runter', 'Fallende Kurve', 'Wirtschaft', [n(R(2, 20, 20, 2)), n(R(2, 3, 2, 18)), a('M6 5.5l4 5 3.5-2.5 5 6.2-1.8 1.3 4.8 2.5.4-5.3-1.8 1.3-6.2-7.6-3.5 2.5-3.2-4Z')]],
    ['balken', 'Balkendiagramm', 'Wirtschaft', [n(R(2, 20, 20, 2)), n(R(4, 12, 4, 7)), a(R(10, 5, 4, 14)), n(R(16, 9, 4, 10))]],
    ['torte', 'Tortendiagramm', 'Wirtschaft', [n('M11 3.1V13h9.9A10 10 0 1 1 11 3.1Z'), a('M13 1.1A10 10 0 0 1 22.9 11H13Z')]],
    ['prozent', 'Prozent', 'Wirtschaft', [n(RING(6.5, 6.5, 3.6, 2) + RING(17.5, 17.5, 3.6, 2)), a(LINE(19, 4, 5, 20, 2.4))]],
    ['haus', 'Haus', 'Alltag', [n('M12 2.5l10 8.5h-3v11H5V11H2Z'), a(R(10, 15, 4, 7))]],
    ['miete', 'Miete', 'Wirtschaft', [n('M12 2.5l10 8.5h-3v11H5V11H2Z'), a('M13.6 12.4l-.4 1.2c-.4-.2-.8-.3-1.2-.3-1 0-1.8.6-2.1 1.5h2.5l-.3 1h-2.3v.4h2.1l-.3 1H10c.3.9 1.1 1.4 2.1 1.4.4 0 .8-.1 1.2-.3l.3 1.2c-.5.3-1 .4-1.6.4-1.8 0-3.2-1.1-3.6-2.7h-.8l.3-1h.4v-.4h-.6l.3-1h.4c.4-1.7 1.8-2.8 3.6-2.8.6 0 1.2.2 1.6.4Z')]],
    ['bank', 'Bank', 'Wirtschaft', [n('M12 2l10 5v2H2V7Z'), n(R(4, 10, 3, 8)), n(R(10.5, 10, 3, 8)), n(R(17, 10, 3, 8)), n(R(2, 19, 20, 3, 0.5)), a(C(12, 5.8, 1.3))]],
    ['konzern', 'Hochhaus', 'Wirtschaft', [n(R(4, 2, 10, 20, 0.6)), n(R(14, 8, 6, 14, 0.6)), a(R(6.5, 5, 2, 2)), a(R(9.5, 5, 2, 2)), a(R(6.5, 9, 2, 2)), a(R(9.5, 9, 2, 2)), a(R(6.5, 13, 2, 2)), a(R(9.5, 13, 2, 2)), n(R(8, 18, 2, 4))]],
    ['steuer', 'Steuerbescheid', 'Wirtschaft', [n('M5 2h10l5 5v15H5Z' + R(7.5, 10, 8, 1.6, 0.8) + R(7.5, 13.5, 6, 1.6, 0.8)), a(C(15, 18, 2.6)), a('M15 2v5h5Z')]],
    // ───── Medien & Kommunikation ─────
    ['zeitung', 'Zeitung', 'Medien', [n(R(2, 4, 20, 16, 1.5) + R(4, 6, 16, 12)), a(R(5, 7, 14, 3)), n(R(5, 11.5, 6.5, 5.5)), n(R(13, 11.5, 6, 1.4)), n(R(13, 14, 6, 1.4)), n(R(13, 16.5, 4, 1.4))]],
    ['kamera', 'Videokamera', 'Medien', [n(R(2, 6, 14, 12, 2)), a('M17 10.5l5-3v9l-5-3Z'), n(C(6, 4, 2) + C(11.5, 4, 2))]],
    ['foto', 'Fotokamera', 'Medien', [n('M4 7h3l1.6-2.5h6.8L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z' + C(12, 13, 4.2)), a(C(12, 13, 2.6))]],
    ['mikrofon', 'Mikrofon', 'Medien', [n(R(8.5, 2, 7, 12, 3.5)), n('M5 11h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.9V20h3v2H8v-2h3v-2.1A7 7 0 0 1 5 11Z'), a(R(8.5, 7, 7, 1.6))]],
    ['handy', 'Smartphone', 'Medien', [n(R(6, 1.5, 12, 21, 2.2) + R(7.8, 4, 8.4, 14)), a(R(9, 5.5, 6, 2, 0.5)), a(R(9, 9, 4, 2, 0.5)), n(C(12, 20.2, 0.9))]],
    ['laptop', 'Laptop', 'Medien', [n(R(4, 4, 16, 11, 1.2) + R(5.8, 5.8, 12.4, 7.4)), n('M1 17h22l-1.5 3h-19Z'), a(R(7.5, 7.5, 6, 1.4, 0.7))]],
    ['fernseher', 'Fernseher', 'Medien', [n(R(2, 5, 20, 13, 1.5) + R(4, 7, 16, 9)), n(R(9, 19, 6, 2.5, 0.8)), a('M10 9l5 2.5-5 2.5Z'), n(LINE(8, 1.5, 11, 5, 1.4)), n(LINE(16, 1.5, 13, 5, 1.4))]],
    ['play', 'Video', 'Medien', [n(R(2, 4, 20, 16, 3)), a('M10 8.5l6 3.5-6 3.5Z')]],
    ['sprechblase', 'Sprechblase', 'Medien', [n('M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9l-5 4.5V17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z'), a(C(8, 10, 1.4)), a(C(12, 10, 1.4)), a(C(16, 10, 1.4))]],
    ['dialog', 'Gespräch', 'Medien', [n('M3 2h11a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 14 12H8l-3.5 3v-3H3a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 3 2Z'), a('M10 13.5h4.5a3 3 0 0 0 3-3V7.5H21a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 21 17.5h-1.5v3l-3.5-3H11.5A1.5 1.5 0 0 1 10 16Z')]],
    ['zitat', 'Anführungszeichen', 'Medien', [n('M3 12.5C3 8 5.2 5 9 4l.8 1.8C7.6 6.8 6.6 8.4 6.5 10.5H10V20H3Z'), a('M13 12.5C13 8 15.2 5 19 4l.8 1.8c-2.2 1-3.2 2.6-3.3 4.7H20V20h-7Z')]],
    ['brief', 'Brief', 'Medien', [n(R(2, 5, 20, 14, 1.5)), a('M2.6 6l9.4 7 9.4-7v2.5L12 15.5 2.6 8.5Z')]],
    ['dokument', 'Dokument', 'Medien', [n('M5 2h10l5 5v15H5Z' + R(7.5, 10, 9, 1.6, 0.8) + R(7.5, 13.5, 9, 1.6, 0.8) + R(7.5, 17, 6, 1.6, 0.8)), a('M15 2v5h5Z')]],
    ['buch', 'Buch', 'Medien', [n('M3 4.5C5.5 3.5 8.5 3.5 11 5v16c-2.5-1.4-5.5-1.4-8-.4Z'), n('M21 4.5c-2.5-1-5.5-1-8 .5v16c2.5-1.4 5.5-1.4 8-.4Z'), a(R(14.5, 8, 4.5, 1.4, 0.7)), a(R(14.5, 11, 4.5, 1.4, 0.7))]],
    ['lupe', 'Lupe', 'Medien', [n(RING(10, 10, 7.5, 2.4)), n(LINE(15.5, 15.5, 21.5, 21.5, 3.2)), a(C(10, 10, 3.2))]],
    ['link', 'Link', 'Medien', [n('M10 7.5l2.2-2.2a4.5 4.5 0 0 1 6.4 6.4l-2.2 2.2-1.6-1.6 2.2-2.2a2.2 2.2 0 0 0-3.2-3.2L11.6 9.1Z'), n('M14 16.5l-2.2 2.2a4.5 4.5 0 0 1-6.4-6.4l2.2-2.2 1.6 1.6-2.2 2.2a2.2 2.2 0 0 0 3.2 3.2l2.2-2.2Z'), a(LINE(9, 15, 15, 9, 2.2))]],
    ['wlan', 'Internet', 'Medien', [n('M1 9a16 16 0 0 1 22 0l-2 2a13 13 0 0 0-18 0Z'), n('M5 13a10.5 10.5 0 0 1 14 0l-2 2a7.6 7.6 0 0 0-10 0Z'), a(C(12, 19, 2.2))]],
    ['algorithmus', 'Algorithmus', 'Medien', [n(R(3, 3, 6, 6, 1)), n(R(15, 3, 6, 6, 1)), n(R(9, 15, 6, 6, 1)), n(LINE(6, 9, 11, 15, 1.6)), n(LINE(18, 9, 13, 15, 1.6)), a(C(12, 12, 2))]],
    ['ki', 'KI-Chip', 'Medien', [n(R(5, 5, 14, 14, 2) + R(7.5, 7.5, 9, 9, 0.5)), n(R(8, 2, 1.6, 3)), n(R(11.2, 2, 1.6, 3)), n(R(14.4, 2, 1.6, 3)), n(R(8, 19, 1.6, 3)), n(R(11.2, 19, 1.6, 3)), n(R(14.4, 19, 1.6, 3)), n(R(2, 8, 3, 1.6)), n(R(2, 11.2, 3, 1.6)), n(R(2, 14.4, 3, 1.6)), n(R(19, 8, 3, 1.6)), n(R(19, 11.2, 3, 1.6)), n(R(19, 14.4, 3, 1.6)), a(R(9.5, 9.5, 5, 5, 0.6))]],
    ['like', 'Daumen hoch', 'Medien', [n(R(2, 10, 4, 11, 1)), n('M7.5 10.5L11.5 3a2 2 0 0 1 2.7 1.8l-.7 4.7H20a2 2 0 0 1 2 2.4l-1.6 7.8A2 2 0 0 1 18.4 21H7.5Z'), a(C(4, 18.5, 0.9))]],
    ['dislike', 'Daumen runter', 'Medien', [n(R(2, 3, 4, 11, 1)), n('M7.5 13.5L11.5 21a2 2 0 0 0 2.7-1.8l-.7-4.7H20a2 2 0 0 0 2-2.4l-1.6-7.8A2 2 0 0 0 18.4 3H7.5Z'), a(C(4, 5.5, 0.9))]],
    ['benachrichtigung', 'Glocke', 'Medien', [n('M12 2.5a1.5 1.5 0 0 1 1.5 1.5v.6A6.5 6.5 0 0 1 18.5 11v4.5L21 18v1H3v-1l2.5-2.5V11a6.5 6.5 0 0 1 5-6.4V4A1.5 1.5 0 0 1 12 2.5Z'), a('M9.5 20h5a2.5 2.5 0 0 1-5 0Z')]],
    // ───── Menschen & Gesellschaft ─────
    ['person', 'Person', 'Menschen', [n(PERSON(12, 13, 1.25))]],
    ['gruppe', 'Gruppe', 'Menschen', [n(PERSON(6, 14, 0.75)), n(PERSON(18, 14, 0.75)), a(PERSON(12, 13.5, 1))]],
    ['menge', 'Viele Menschen', 'Menschen', [n(PERSON(4.5, 10, 0.55)), n(PERSON(12, 10, 0.55)), n(PERSON(19.5, 10, 0.55)), n(PERSON(8.2, 18.5, 0.55)), a(PERSON(15.8, 18.5, 0.55))]],
    ['arbeiterin', 'Beschäftigte', 'Menschen', [n(PERSON(12, 14, 1.2)), a('M7.3 6.8a4.7 4.7 0 0 1 9.4 0v.8H7.3Z'), a(R(6, 7.2, 12, 1.4, 0.7))]],
    ['familie', 'Familie', 'Menschen', [n(PERSON(6.5, 13, 0.85)), n(PERSON(17.5, 13, 0.85)), a(PERSON(12, 17, 0.55))]],
    ['kind', 'Kind', 'Menschen', [n(C(12, 6.5, 3.5)), n('M7 22v-6a5 5 0 0 1 10 0v6Z'), a(R(9, 15, 6, 2, 1))]],
    ['kinderwagen', 'Kinderwagen', 'Menschen', [n('M3 10h16a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7Z'), a('M11 2.2V10H3.2A8 8 0 0 1 11 2.2Z'), n(C(7, 20, 2)), n(C(16, 20, 2)), n(R(19, 5, 3, 1.8, 0.9)), n(R(18.5, 5, 1.8, 6, 0.9))]],
    ['schule', 'Schule', 'Menschen', [n('M12 3l11 5-11 5L1 8Z'), n('M5 11v5c0 2 3.2 3.6 7 3.6s7-1.6 7-3.6v-5l-7 3.2Z'), a(R(20.5, 8, 1.4, 8, 0.7)), a(C(21.2, 16.5, 1.3))]],
    ['krankenhaus', 'Gesundheit', 'Menschen', [n(R(3, 3, 18, 18, 3)), a('M10 6.5h4v3.5h3.5v4H14v3.5h-4V14H6.5v-4H10Z')]],
    ['herz', 'Herz', 'Menschen', [a('M12 21l-1.4-1.3C5.4 15 2 12 2 8.2 2 5.1 4.4 2.8 7.4 2.8c1.7 0 3.4.8 4.6 2.1 1.2-1.3 2.9-2.1 4.6-2.1 3 0 5.4 2.3 5.4 5.4 0 3.8-3.4 6.8-8.6 11.5Z')]],
    ['hand', 'Offene Hand', 'Menschen', [n('M8 21l-4.6-6.6a1.7 1.7 0 0 1 2.7-2L8 14V4.8a1.5 1.5 0 0 1 3 0V11h.5V3.5a1.5 1.5 0 0 1 3 0V11h.5V4.8a1.5 1.5 0 0 1 3 0V11h.5V7.2a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6Z')]],
    ['haende', 'Hände', 'Menschen', [n('M2 13l3.5-1.5c1.5-.6 3.2-.4 4.4.6L12 14H8v1.5h5.6l5-2a1.6 1.6 0 0 1 1.2 3L13 19.5a4 4 0 0 1-2.8 0L2 17Z'), a(C(12, 6.5, 3.5))]],
    ['rollstuhl', 'Barrierefreiheit', 'Menschen', [n(C(11, 3.6, 2)), n('M9.4 7h2.4v5h5.2l2.4 6 1.6-.6.8 2-3.6 1.4-2.6-6.8H11a1.6 1.6 0 0 1-1.6-1.6Z'), a(RING(9.5, 16, 6, 1.8))]],
    ['einzeln', 'Einzelperson gegen viele', 'Menschen', [a(PERSON(4.5, 14, 0.8)), n(PERSON(13, 9.5, 0.55)), n(PERSON(19.5, 9.5, 0.55)), n(PERSON(13, 18.5, 0.55)), n(PERSON(19.5, 18.5, 0.55))]],
    ['sprechende', 'Rede', 'Menschen', [n(PERSON(8, 14, 1.1)), a('M15 3h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3l-2 2V9h-1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z')]],
    // ───── Umwelt & Energie ─────
    ['baum', 'Baum', 'Umwelt', [n('M12 2a6 6 0 0 1 5.8 7.6A4.6 4.6 0 0 1 16.4 18H7.6a4.6 4.6 0 0 1-1.4-8.4A6 6 0 0 1 12 2Z'), a(R(11, 13, 2, 9))]],
    ['blatt', 'Blatt', 'Umwelt', [n('M20 3C10 3 4 8 4 15c0 1.6.4 3 1 4.2C6.2 14 9.6 10.6 14 9c-3.6 2.4-6.2 5.6-7.6 11 1.3.6 2.8 1 4.4 1C18 21 21 13 20 3Z')]],
    ['sonne', 'Sonne', 'Umwelt', [a(C(12, 12, 4.6)), ...[0, 45, 90, 135, 180, 225, 270, 315].map(d => { const r = d * Math.PI / 180; return n(LINE(12 + Math.cos(r) * 7, 12 + Math.sin(r) * 7, 12 + Math.cos(r) * 10.4, 12 + Math.sin(r) * 10.4, 2)); })]],
    ['wolke', 'Wolke', 'Umwelt', [n('M6.5 19a4.5 4.5 0 0 1-.4-9A6.5 6.5 0 0 1 18.6 9 5 5 0 0 1 18 19Z')]],
    ['regen', 'Unwetter', 'Umwelt', [n('M6.5 14a4.5 4.5 0 0 1-.4-9A6.5 6.5 0 0 1 18.6 4 5 5 0 0 1 18 14Z'), a('M12 14.5l-3 4.5h2.5l-1.5 4 5-5.5h-2.6l1.6-3Z')]],
    ['tropfen', 'Wasser', 'Umwelt', [n('M12 2s7 7.6 7 12.5A7 7 0 0 1 5 14.5C5 9.6 12 2 12 2Z'), a('M8.5 14.5a3.5 3.5 0 0 0 3.5 3.5V20a5.5 5.5 0 0 1-5.5-5.5Z')]],
    ['thermometer', 'Klima', 'Umwelt', [n('M10 4a2 2 0 0 1 4 0v9.6a4.5 4.5 0 1 1-4 0Z'), a(C(12, 17.5, 2.4)), a(R(11.2, 8, 1.6, 9)), n(R(16, 5, 4, 1.6, 0.8)), n(R(16, 8.5, 3, 1.6, 0.8))]],
    ['erde', 'Globus', 'Umwelt', [n(C(12, 12, 10)), a('M7 5.2c1.5.5 2.2 1.8 1.6 3.2-.6 1.2-2.2 1.2-2.4 2.8-.2 1.4 1.4 2 1.2 3.6-.2 1.4-1.6 1.8-1.6 3.4A8 8 0 0 1 7 5.2Z'), a('M15 4.6c1.4.4 1.2 2 2.4 2.4 1.3.5 2.6-.2 3.2.9a8 8 0 0 1-1.8 9.9c-.8-1.2-.2-2.8-1.4-3.6-1.4-1-3.4.2-4.2-1.4-.8-1.6 1.2-2.6.6-4.4-.4-1.4-1.6-1.8-1.8-3.2A8 8 0 0 1 15 4.6Z')]],
    ['windrad', 'Windkraft', 'Umwelt', [n('M11.2 10h1.6l.8 12h-3.2Z'), a('M12 9.5L10.6 2.2a1.4 1.4 0 0 1 2.8 0Z'), a('M12.6 10.8l6.8 3a1.4 1.4 0 0 1-1.4 2.4Z'), a('M11.4 10.8l-5.6 4.8a1.4 1.4 0 0 1-1.4-2.4Z'), n(C(12, 10, 1.6))]],
    ['solar', 'Solarenergie', 'Umwelt', [n('M4 11h16l2 8H2Z'), n(R(11, 19, 2, 3)), n(R(8, 21, 8, 1.4)), a(C(12, 5, 2.6)), n(LINE(7.3, 11, 6.7, 19, 1)), n(LINE(16.7, 11, 17.3, 19, 1)), n(LINE(12, 11, 12, 19, 1)), n(R(3, 14.6, 18, 1))]],
    ['atom', 'Atomkraft', 'Umwelt', [a(C(12, 12, 2)), n('M12 7.5c5.5 0 10 2 10 4.5s-4.5 4.5-10 4.5S2 14.5 2 12s4.5-4.5 10-4.5Zm0 1.8c-4.6 0-8.2 1.4-8.2 2.7s3.6 2.7 8.2 2.7 8.2-1.4 8.2-2.7-3.6-2.7-8.2-2.7Z'), n('M7.4 4.3c2.7-4.8 6.9-2.6 9.6 2.1s2.9 9.5-.4 11.2c-3.4 1.7-7.6-1.1-9.9-5.6-1.3-2.6-1.9-5.5.7-7.7Zm.9 1.6c-1.6 1.4-.6 4.3.5 6.3 1.9 3.6 5 5.7 6.7 4.9 1.6-.9 1.3-4.6-.9-8.4s-5-4.9-6.3-2.8Z')]],
    ['strahlung', 'Strahlung', 'Umwelt', [n(RING(12, 12, 10.5, 1.8)), a(C(12, 12, 1.8)), ...[-90, 30, 150].map(d => a(SECTOR(12, 12, 2.9, 7.6, d - 30, d + 30)))]],
    ['fabrik-rauch', 'Emissionen', 'Umwelt', [n('M2 22V13l5 3v-3l5 3v-3l5 3V8h4v14Z'), a('M17 6.5c0-1.6 1.2-2 2.2-2 .2-1.4 1.4-2.5 3-2.5v2c-.6 0-1 .4-1 1v1h-1.2c-.6 0-1 .3-1 .6Z'), a(C(8, 7, 2.2)), a(C(11.5, 5, 1.6))]],
    ['auto', 'Auto', 'Alltag', [n('M5.5 6h13l2.5 6h1v6h-2.2a2.3 2.3 0 0 1-4.6 0H8.8a2.3 2.3 0 0 1-4.6 0H2v-6h1Zm1.4 2L5.3 12h13.4l-1.6-4Z'), a(R(3.6, 13.5, 3, 1.8, 0.9)), a(R(17.4, 13.5, 3, 1.8, 0.9))]],
    ['bus', 'Bus', 'Alltag', [n(R(4, 2, 16, 17, 2.5) + R(6, 5, 12, 6, 0.6)), n(R(5, 18, 3, 3.5, 1)), n(R(16, 18, 3, 3.5, 1)), a(C(8, 15, 1.3)), a(C(16, 15, 1.3))]],
    ['zug', 'Bahn', 'Alltag', [n(R(5, 2, 14, 16, 3.5) + R(7, 5, 10, 5, 0.6)), a(C(9, 14, 1.3)), a(C(15, 14, 1.3)), n(LINE(8, 18, 5, 22, 1.6)), n(LINE(16, 18, 19, 22, 1.6))]],
    ['fahrrad', 'Fahrrad', 'Alltag', [n(RING(5.5, 16, 4, 1.6) + RING(18.5, 16, 4, 1.6)), n(LINE(5.5, 16, 9.5, 8.5, 1.8)), n(LINE(9.5, 8.5, 16.5, 8.5, 1.8)), n(LINE(16.5, 8.5, 12, 16, 1.8)), n(LINE(5.5, 16, 12, 16, 1.8)), n(LINE(16.5, 8.5, 18.5, 16, 1.8)), n(LINE(15.2, 5.5, 16.5, 8.5, 1.8)), n(R(13.5, 4.6, 4, 1.8, 0.9)), n(R(7.5, 6.4, 4.5, 1.8, 0.9)), a(C(12, 16, 1.6))]],
    ['flugzeug', 'Flugzeug', 'Alltag', [n('M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z')]],
    ['essen', 'Teller', 'Alltag', [n(RING(13, 12, 8.6, 1.8)), a(C(13, 12, 4.4)), n(R(1.5, 3, 1.4, 6)), n(R(3.4, 3, 1.4, 6)), n('M1.5 8.5h3.3v2.2l-.8.6V21H2.3v-9.7l-.8-.6Z')]],
    ['brot', 'Lebensmittel', 'Alltag', [n('M4 10.5C2.6 10.5 2 9.6 2 8.5 2 5.5 6.4 3 12 3s10 2.5 10 5.5c0 1.1-.6 2-2 2V21H4Z'), a(R(7, 13, 10, 1.6, 0.8)), a(R(7, 16.5, 7, 1.6, 0.8))]],
    ['einkaufstasche', 'Einkauf', 'Alltag', [n('M4 8h16l-1.2 14H5.2Z'), n('M8 8V6.5a4 4 0 0 1 8 0V8h-1.8V6.5a2.2 2.2 0 0 0-4.4 0V8Z'), a(C(12, 14.5, 2.4))]],
    ['uhr', 'Uhr', 'Alltag', [n(C(12, 12, 10) + C(12, 12, 8.2)), a(R(11.1, 5.5, 1.8, 7.5, 0.9)), a(LINE(12, 12, 16, 15, 1.8))]],
    ['kalender', 'Kalender', 'Alltag', [n(R(2, 4, 20, 18, 2) + R(4, 10, 16, 10)), n(R(6.5, 2, 2, 4, 1)), n(R(15.5, 2, 2, 4, 1)), a(R(13.5, 14, 4, 4, 0.6))]],
    ['ort', 'Ortsmarke', 'Alltag', [n('M12 2a7.5 7.5 0 0 1 7.5 7.5c0 5.6-7.5 12.5-7.5 12.5S4.5 15.1 4.5 9.5A7.5 7.5 0 0 1 12 2Z' + C(12, 9.5, 3)), a(C(12, 9.5, 1.5))]],
    ['karte', 'Karte', 'Alltag', [n('M2 5l6-2.5 8 3 6-2.5v16l-6 2.5-8-3-6 2.5Z'), a('M8 2.5l8 3v16l-8-3Z')]],
    ['schluessel', 'Schlüssel', 'Alltag', [n(RING(7.5, 12, 5, 2.2)), n(R(12, 11, 10, 2.2, 1)), n(R(17, 13, 2, 3.5, 0.5)), a(R(20, 13, 2, 2.5, 0.5))]],
    ['schloss', 'Schloss', 'Alltag', [n('M7 10V7a5 5 0 0 1 10 0v3h-2.2V7a2.8 2.8 0 0 0-5.6 0v3Z'), n(R(4, 10, 16, 12, 2)), a(C(12, 15, 1.8)), a(R(11.2, 15, 1.6, 3.6, 0.6))]],
    ['gluehbirne', 'Idee', 'Alltag', [a('M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2Z'), n(R(8, 18, 8, 1.8, 0.9)), n(R(9, 20.4, 6, 1.8, 0.9))]],
    ['tuer', 'Tür', 'Alltag', [n(R(5, 2, 14, 20, 1) + R(7, 4, 10, 18)), a('M7 4l7 2v16l-7-2Z'), n(C(12.5, 13, 0.9))]],
    ['mauer', 'Mauer', 'Alltag', [n(R(2, 4, 9, 4)), n(R(13, 4, 9, 4)), n(R(2, 10, 4, 4)), n(R(8, 10, 8, 4)), n(R(18, 10, 4, 4)), n(R(2, 16, 9, 4)), a(R(13, 16, 9, 4))]],
    ['bruecke', 'Brücke', 'Alltag', [n('M1 12h22v2.5h-2v6h-3v-3a6 6 0 0 0-12 0v3H3v-6H1Z'), a(R(1, 8, 22, 2))]],
    ['baustelle', 'Baustelle', 'Alltag', [n('M9.6 3h4.8l5 16h-14.8Z'), a('M8.6 8h6.8l1.1 3.6h-9Z'), a('M6.8 14h10.4l1.1 3.6H5.7Z'), n(R(2, 19, 20, 3, 1))]],
    // ───── Krieg & Frieden ─────
    ['taube', 'Friedenstaube', 'Frieden', [n('M2 11c3.6-1.4 6.6-1 9 1 .6-3 2.4-5.6 5-6.8.6-1.4 1.8-2.2 3.2-2.2L22 4.4l-2.2.9c.4 4.4-1.6 9.4-6.6 11.7l2 4h-2.2l-1.7-3.4c-.6.1-1.3.2-2 .2l-1 3.2H6.2l1.2-3.6C4.8 16.4 3 14.2 2 11Z'), a('M16.6 2.8l3.2 1.2-.8.7Z')]],
    ['frieden', 'Friedenszeichen', 'Frieden', [n(RING(12, 12, 10, 2.2)), n(R(10.9, 2.5, 2.2, 19)), n(LINE(12, 12.4, 5.2, 18.8, 2.2)), n(LINE(12, 12.4, 18.8, 18.8, 2.2))]],
    ['panzer', 'Panzer', 'Krieg', [n(R(2, 14, 20, 6, 3)), n('M5 9h10l2 5H4Z'), n(R(14, 9.6, 8, 1.8, 0.4)), a(C(6, 17, 1.4)), a(C(10, 17, 1.4)), a(C(14, 17, 1.4)), a(C(18, 17, 1.4))]],
    ['soldat', 'Soldat', 'Krieg', [n(C(12, 8, 3.2)), n('M6.6 7.4a5.4 5.4 0 0 1 10.8 0v1.3H6.6Z'), n('M5 22v-4.4a5.6 5.6 0 0 1 5.6-5.6h2.8a5.6 5.6 0 0 1 5.6 5.6V22Z'), a(R(5, 15.5, 14, 2))]],
    ['rakete', 'Rakete', 'Krieg', [n('M12 1.5c2.6 2 4 5 4 8.5v7H8v-7c0-3.5 1.4-6.5 4-8.5Z'), n('M8 12l-3 4v3h3Z'), n('M16 12l3 4v3h-3Z'), a('M9.5 18h5l-1 4h-3Z'), a(C(12, 8, 1.6))]],
    ['bombe', 'Explosion', 'Krieg', [a('M12 1l2.2 5.4L19.8 3.6 17.8 9l5.2 1.8-5.2 2.4 3 5-5.6-1.4L14.2 22 12 17l-2.2 5-1-5.6-5.6 1.4 3-5L1 10.8 6.2 9 4.2 3.6l5.6 2.8Z'), n('M12 6.5l1.3 3.2 3.4-1.1-1.6 3.2 3.2 1.4-3.4.8.9 3.4-3-2-1.6 3-.6-3.4-3.4.5L9.2 13l-3-1.6 3.4-.9-.8-3.4 2.9 1.9Z')]],
    ['schwert', 'Schwert', 'Krieg', [n('M19.5 2.5L21.5 4.5 10 16l-2-2Z'), a(LINE(5.5, 13, 11, 18.5, 2.4)), n(LINE(8, 16, 3, 21, 2.2)), n(C(3, 21, 1.5))]],
    ['abruestung', 'Abrüstung', 'Frieden', [n('M19.5 2.5L21.5 4.5 10 16l-2-2Z'), n(LINE(8, 16, 3, 21, 2.2)), a(RING(12, 12, 10, 2)), a(LINE(5, 19, 19, 5, 2))]],
    // ───── Zeichen & Pfeile ─────
    ['haken', 'Haken', 'Zeichen', [a('M3 12.5l2.4-2.4 4.1 4.1L18.6 5l2.4 2.4L9.5 19Z')]],
    ['kreuz', 'Kreuz', 'Zeichen', [a('M5 3l7 7 7-7 2 2-7 7 7 7-2 2-7-7-7 7-2-2 7-7-7-7Z')]],
    ['haken-kreis', 'Richtig', 'Zeichen', [n(C(12, 12, 10)), a('M6.5 12.5l1.8-1.8 2.7 2.7 5-5 1.8 1.8L11 17Z')]],
    ['kreuz-kreis', 'Falsch', 'Zeichen', [n(C(12, 12, 10)), a('M8 9.6L9.6 8l2.4 2.4L14.4 8 16 9.6 13.6 12l2.4 2.4-1.6 1.6-2.4-2.4-2.4 2.4L8 14.4l2.4-2.4Z')]],
    ['ausrufe', 'Achtung', 'Zeichen', [n('M12 2l10.5 19h-21Z'), a(R(11, 8, 2, 7, 1)), a(C(12, 17.6, 1.2))]],
    ['frage', 'Frage', 'Zeichen', [n(C(12, 12, 10)), a('M9 9.3a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1-1.5 2.1v.5h-2v-.6c0-1.9 1-2.7 2-3.3a1 1 0 1 0-1.5-.9V10H9Z'), a(C(11, 17, 1.2))]],
    ['info', 'Info', 'Zeichen', [n(C(12, 12, 10)), a(R(11, 10, 2, 7.5, 1)), a(C(12, 7.2, 1.3))]],
    ['stopp', 'Stopp', 'Zeichen', [a('M8 2h8l6 6v8l-6 6H8l-6-6V8Z'), n(R(6, 10.8, 12, 2.4, 1))]],
    ['verbot', 'Verbot', 'Zeichen', [a(RING(12, 12, 10, 2.4)), a(LINE(5, 19, 19, 5, 2.4))]],
    ['pfeil-rechts', 'Pfeil rechts', 'Pfeile', [a(ARROW_R(2, 12, 20, 4, 7))]],
    ['pfeil-links', 'Pfeil links', 'Pfeile', [a('M22 10v4H9v5l-7-7 7-7v5Z')]],
    ['pfeil-hoch', 'Pfeil hoch', 'Pfeile', [a('M10 22h4V9h5l-7-7-7 7h5Z')]],
    ['pfeil-runter', 'Pfeil runter', 'Pfeile', [a('M10 2h4v13h5l-7 7-7-7h5Z')]],
    ['pfeil-kreis', 'Kreislauf', 'Pfeile', [n('M12 4a8 8 0 0 1 7.7 5.9l-2 .5A6 6 0 0 0 6.3 10l2.2 1.2L3 13.5l.2-6 1.5 2A8 8 0 0 1 12 4Z'), a('M12 20a8 8 0 0 1-7.7-5.9l2-.5a6 6 0 0 0 11.4.4l-2.2-1.2 5.5-2.3-.2 6-1.5-2A8 8 0 0 1 12 20Z')]],
    ['pfeile-gegen', 'Gegenüber', 'Pfeile', [n('M2 8l5-5v3h8v4H7v3Z'), a('M22 16l-5 5v-3H9v-4h8v-3Z')]],
    ['tauschen', 'Wechsel', 'Pfeile', [n('M7 3l5 5H9v8H5V8H2Z'), a('M17 21l-5-5h3V8h4v8h3Z')]],
    ['ziel', 'Ziel', 'Zeichen', [n(RING(12, 12, 10, 2.2) + RING(12, 12, 6, 2.2)), a(C(12, 12, 2.2))]],
    ['stern', 'Stern', 'Zeichen', [a('M12 2l2.9 6.4 7 .7-5.2 4.7 1.5 6.9L12 17.2l-6.2 3.5 1.5-6.9L2.1 9.1l7-.7Z')]],
    ['blitz', 'Blitz', 'Zeichen', [a('M14 1L4 14h7l-2 9 11-13h-7Z')]],
    ['plus', 'Plus', 'Zeichen', [a('M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7Z')]],
    ['minus', 'Minus', 'Zeichen', [a(R(3, 10, 18, 4, 1))]],
    ['gleich', 'Gleich', 'Zeichen', [n(R(3, 6.5, 18, 4, 1)), a(R(3, 13.5, 18, 4, 1))]],
    ['ungleich', 'Ungleich', 'Zeichen', [n(R(3, 6.5, 18, 4, 1)), n(R(3, 13.5, 18, 4, 1)), a(LINE(17, 2, 7, 22, 2.6))]],
    ['rang', 'Rangliste', 'Zeichen', [n(R(2, 13, 6, 9, 0.6)), a(R(9, 7, 6, 15, 0.6)), n(R(16, 16, 6, 6, 0.6))]],
    ['waage-ungleich', 'Ungleichheit', 'Recht', [n(R(11, 4, 2, 15)), n(R(7, 19, 10, 3, 1)), n(LINE(3.5, 8.5, 20.5, 3.5, 2)), a('M1 14.5l2.5-5.5 2.5 5.5a2.5 2.5 0 0 1-5 0Z'), n('M18 10l2.5-5.5L23 10a2.5 2.5 0 0 1-5 0Z')]],
    ['spaltung', 'Spaltung', 'Gesellschaft', [n('M2 4h8.5l-2 4 2.5 3-2 4 2 5H2Z'), a('M22 4h-9.5l-2 4 2.5 3-2 4 2 5H22Z')]],
    ['oben-unten', 'Oben und unten', 'Gesellschaft', [a(PERSON(12, 8.5, 0.7)), n(R(3, 13, 18, 1.6, 0.8)), n(PERSON(5.5, 21, 0.45)), n(PERSON(12, 21, 0.45)), n(PERSON(18.5, 21, 0.45))]],
  ];
  // ───── Weitere Formen ─────
  const ELL = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`;
  const TRI = (...p) => POLY(...p);
  const pt = (x, y, r, d) => [x + r * Math.cos(d * Math.PI / 180), y + r * Math.sin(d * Math.PI / 180)];
  // Ringstück von a1 bis a2 (Grad, im Uhrzeigersinn ab rechts), Radien r1 innen, r2 außen
  const SEC = (x, y, r1, r2, a1, a2) => { const lg = (a2 - a1) % 360 > 180 ? 1 : 0, P = (r, d) => pt(x, y, r, d).map(f).join(' ');
    if (a2 - a1 >= 359.9) return C(x, y, r2) + (r1 > 0 ? C(x, y, r1) : '');
    return r1 > 0 ? `M${P(r2, a1)}A${r2} ${r2} 0 ${lg} 1 ${P(r2, a2)}L${P(r1, a2)}A${r1} ${r1} 0 ${lg} 0 ${P(r1, a1)}Z` : `M${f(x)} ${f(y)}L${P(r2, a1)}A${r2} ${r2} 0 ${lg} 1 ${P(r2, a2)}Z`; };
  const ARC = (x, y, r, t, a1, a2) => SEC(x, y, r - t, r, a1, a2);
  const STAR = (x, y, r1, r2, k, rot = -90) => POLY(...[...Array(k * 2)].flatMap((_, i) => pt(x, y, i % 2 ? r2 : r1, rot + i * 180 / k)));
  const LEAF = (x1, y1, x2, y2, w) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, l = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / l * w, ny = (x2 - x1) / l * w;
    return `M${f(x1)} ${f(y1)}Q${f(mx + nx)} ${f(my + ny)} ${f(x2)} ${f(y2)}Q${f(mx - nx)} ${f(my - ny)} ${f(x1)} ${f(y1)}Z`; };
  const WAVE = (y, amp, t, x1 = 1, x2 = 23) => { const N = 24, top = [], bot = [];
    for (let i = 0; i <= N; i++){ const x = x1 + (x2 - x1) * i / N, yy = y + amp * Math.sin(i / N * Math.PI * 4); top.push(x, yy); bot.unshift(x, yy + t); }
    return POLY(...top, ...bot); };
  const DOTS = (ps, r) => ps.map(([x, y]) => C(x, y, r)).join('');
  // Pfeilspitze am Ende eines Bogens (Richtung im Uhrzeigersinn, dir = -1 dagegen)
  const HEAD = (x, y, r, d, s, dir = 1) => { const [px, py] = pt(x, y, r, d), tx = -Math.sin(d * Math.PI / 180) * dir, ty = Math.cos(d * Math.PI / 180) * dir, nx = Math.cos(d * Math.PI / 180), ny = Math.sin(d * Math.PI / 180);
    return POLY(px + tx * s * 1.1, py + ty * s * 1.1, px + nx * s * 0.9, py + ny * s * 0.9, px - nx * s * 0.9, py - ny * s * 0.9); };
  const CAR = (x, y, s) => { const q = v => f(v * s); return `M${f(x + 3 * s)} ${f(y)}h${q(12)}l${q(2.2)} ${q(4)}h${q(.8)}v${q(4.5)}h${q(-1.8)}a${q(2)} ${q(2)} 0 0 1 ${q(-4)} 0h${q(-6.4)}a${q(2)} ${q(2)} 0 0 1 ${q(-4)} 0H${f(x)}v${q(-4.5)}h${q(.8)}Z`; };
  const PIN = (x, y, s) => C(x, y - s * 0.3, s) ;
  const PIN2 = (x, y, s) => TRI(x - s * 0.86, y + s * 0.2, x + s * 0.86, y + s * 0.2, x, y + s * 1.9);
  const HEART = (x, y, s) => { const q = v => f(v * s); return `M${f(x)} ${f(y + 8.5 * s)}l${q(-1)} ${q(-.9)}C${f(x - 7 * s)} ${f(y + 2.6 * s)} ${f(x - 9 * s)} ${f(y + .8 * s)} ${f(x - 9 * s)} ${f(y - 1.7 * s)}a${q(4.6)} ${q(4.6)} 0 0 1 ${q(9)} ${q(-1.5)}a${q(4.6)} ${q(4.6)} 0 0 1 ${q(9)} ${q(1.5)}c0 ${q(2.5)} ${q(-2)} ${q(4.3)} ${q(-8)} ${q(9.3)}Z`; };
  const DOC = (extra = '') => 'M5 2h14v20H5Z' + extra;
  const BILL = (extra = '') => 'M5 2h14v20l-2.3-1.5-2.4 1.5-2.3-1.5-2.4 1.5-2.3-1.5L5 22Z' + extra;
  const lines3 = R(7.5, 5.5, 9, 1.4, .7) + R(7.5, 8.5, 9, 1.4, .7) + R(7.5, 11.5, 6, 1.4, .7);
  const CARP = 'M5 9h14l2.5 5H22v5h-2a2.3 2.3 0 0 1-4.6 0H8.6A2.3 2.3 0 0 1 4 19H2v-5h.5Z';
  const HAND = 'M8 21l-4.6-6.6a1.7 1.7 0 0 1 2.7-2L8 14V4.8a1.5 1.5 0 0 1 3 0V11h.5V3.5a1.5 1.5 0 0 1 3 0V11h.5V4.8a1.5 1.5 0 0 1 3 0V11h.5V7.2a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6Z';
  const hemi = (acc) => { const dots = []; [[5, 5], [7.5, 8], [10, 11]].forEach(([r, k]) => { for (let i = 0; i < k; i++){ const d = 180 + 180 * i / (k - 1); dots.push([...pt(12, 19, r, d), d]); } });
    return [DOTS(dots.filter(p => p[2] < 180 + acc * 180).map(p => [p[0], p[1]]), 1), DOTS(dots.filter(p => p[2] >= 180 + acc * 180).map(p => [p[0], p[1]]), 1)]; };
  const HM = hemi(0.42);

  const ICONS2 = [
    // ── Protest & Bewegung
    ['transparent', 'Transparent', 'Protest & Bewegung', [n(R(3, 4, 1.6, 17, .8)), n(R(19.4, 4, 1.6, 17, .8)), a(R(4.6, 6, 14.8, 8, 1) + R(7, 9.2, 10, 1.6, .8))]],
    ['spraydose', 'Spraydose', 'Protest & Bewegung', [n(R(6, 8, 8, 14, 2)), n(R(8, 5, 4, 3, .6)), n(R(9, 3, 2, 2, .4)), a(R(6, 13, 8, 3)), a(DOTS([[15.5, 3.5], [18, 2.2], [18, 5.4], [20.6, 3.8], [20.6, 7]], .9))]],
    ['trillerpfeife', 'Trillerpfeife', 'Protest & Bewegung', [n('M2 9h12.5a5.8 5.8 0 1 1-5.5 7.6L2 14.5Z'), a(C(14.5, 15, 2.2)), n(R(10, 6, 5, 3, .8))]],
    ['kerze', 'Kerze', 'Protest & Bewegung', [n(R(9, 10, 6, 12, 1)), a('M12 2c2 2.6 3 4 3 5.4A3 3 0 0 1 9 7.4C9 6 10 4.6 12 2Z')]],
    ['menschenkette', 'Menschenkette', 'Protest & Bewegung', [n(PERSON(4, 13, .6)), n(PERSON(9.3, 13, .6)), n(PERSON(14.6, 13, .6)), n(PERSON(20, 13, .6)), a(R(3, 12.6, 18, 1.6, .8))]],
    ['flugblaetter', 'Flugblätter', 'Protest & Bewegung', [a(R(7, 2, 13, 16, 1)), n(R(4, 5, 13, 17, 1) + R(6.5, 9, 8, 1.4, .7) + R(6.5, 12, 8, 1.4, .7) + R(6.5, 15, 5, 1.4, .7))]],
    ['plakat', 'Plakat', 'Protest & Bewegung', [n(R(4, 4, 16, 17, 1) + R(6.5, 13, 11, 1.5, .75) + R(6.5, 16, 7, 1.5, .75)), a(R(6.5, 7, 11, 4, .6)), a(R(10, 2, 4, 3, .5))]],
    ['fackel', 'Fackel', 'Protest & Bewegung', [n('M9.5 11h5l-1.5 11h-2Z'), n(R(8.5, 9.5, 7, 2, .6)), a('M12 1.5c2.4 2.4 3.6 4.4 3.6 6A3.6 3.6 0 0 1 8.4 7.5c0-1.6 1.2-3.6 3.6-6Z')]],
    ['stopp-hand', 'Stopp-Hand', 'Protest & Bewegung', [a(HAND)]],
    ['kundgebung', 'Kundgebung', 'Protest & Bewegung', [n(R(2, 15, 20, 3)), n(R(3, 18, 2, 4)), n(R(19, 18, 2, 4)), n(PERSON(12, 10, .7)), a(R(10.8, 9.5, 2.4, 5.5, .6))]],
    ['regenbogen', 'Regenbogen', 'Protest & Bewegung', [a(ARC(12, 19, 10.5, 2.4, 180, 360)), n(ARC(12, 19, 7.6, 2.4, 180, 360)), a(ARC(12, 19, 4.7, 2.4, 180, 360))]],
    ['petition', 'Petition', 'Protest & Bewegung', [n(DOC(lines3)), a(LINE(7.5, 18.5, 9.5, 16.5, 1.3)), a(LINE(9.5, 16.5, 11.5, 18.5, 1.3)), a(LINE(11.5, 18.5, 13.5, 16.5, 1.3)), a(LINE(13.5, 16.5, 15.5, 18.5, 1.3))]],
    ['besetzung', 'Besetzung', 'Protest & Bewegung', [n('M3 22V11l9-7 9 7v11Z' + R(10, 15, 4, 7)), a(R(11.3, 1, 1.4, 7)), a('M12.7 1.3h5l-1.4 1.6 1.4 1.6h-5Z')]],
    // ── Politik & Wahlen
    ['wahlkreuz', 'Wahlkreuz', 'Politik & Wahlen', [n(R(3, 3, 18, 18, 2) + R(5.2, 5.2, 13.6, 13.6, .8)), a(LINE(7.8, 7.8, 16.2, 16.2, 2.6)), a(LINE(16.2, 7.8, 7.8, 16.2, 2.6))]],
    ['sitzverteilung', 'Sitzverteilung', 'Politik & Wahlen', [a(HM[0]), n(HM[1]), n(R(2, 20.5, 20, 1.5, .7))]],
    ['koalition', 'Koalition', 'Politik & Wahlen', [n(RING(8.5, 12, 6.5, 2)), a(RING(15.5, 12, 6.5, 2))]],
    ['rathaus', 'Rathaus', 'Politik & Wahlen', [n(R(3, 10, 18, 12, .5) + R(5.5, 13, 3, 4) + R(15.5, 13, 3, 4) + R(10.5, 16, 3, 6)), n('M3 10l9-5 9 5Z'), a(R(10.5, 1, 3, 5.5, .4)), a(C(12, 8.6, 1.4))]],
    ['pressekonferenz', 'Pressekonferenz', 'Politik & Wahlen', [n('M4 14h16l-1.5 8h-13Z'), n(PERSON(12, 10, .7)), a(R(6.6, 9.5, 1.6, 5, .6)), a(C(7.4, 9, 1.5)), a(R(15.8, 9.5, 1.6, 5, .6)), a(C(16.6, 9, 1.5))]],
    ['handzeichen', 'Abstimmung per Hand', 'Politik & Wahlen', [n(R(4, 10, 2.4, 12, 1.2)), n(ELL(5.2, 7.5, 2.4, 3)), a(R(10.8, 6, 2.4, 16, 1.2)), a(ELL(12, 4, 2.4, 3)), n(R(17.6, 10, 2.4, 12, 1.2)), n(ELL(18.8, 7.5, 2.4, 3))]],
    ['gesetzbuch', 'Gesetzbuch', 'Politik & Wahlen', [n(R(5, 2, 15, 20, 1.5) + R(10, 7, 7, 1.6, .8) + R(10, 10.5, 7, 1.6, .8) + R(10, 14, 4, 1.6, .8)), a(R(5, 2, 3.2, 20, 1))]],
    ['stempel', 'Stempel', 'Politik & Wahlen', [n(R(9.5, 2, 5, 7, 2.5)), n('M8 9h8l1 4H7Z'), n(R(4, 13, 16, 4, 1)), a(R(5, 19.5, 14, 2, 1))]],
    ['antrag', 'Antrag', 'Politik & Wahlen', [n(DOC(lines3)), a(RING(15.5, 17, 3, 1.4))]],
    ['regierung', 'Regierung', 'Politik & Wahlen', [n(R(3, 9, 18, 13) + R(6, 12, 2.4, 6) + R(10.8, 12, 2.4, 6) + R(15.6, 12, 2.4, 6)), n('M2 9l10-6 10 6Z'), a(R(11.3, .5, 1.4, 4)), a('M12.7 .8h4.5l-1 1.3 1 1.3h-4.5Z')]],
    ['europa', 'Europa', 'Politik & Wahlen', [a([...Array(12)].map((_, i) => STAR(...pt(12, 12, 8.5, i * 30), 1.7, .7, 5)).join(''))]],
    ['wahlplakat', 'Wahlplakat', 'Politik & Wahlen', [n(R(5, 2, 14, 13, 1) + R(7.5, 10, 9, 1.5, .75)), a(R(7.5, 4.5, 9, 3.5, .5)), n(LINE(7, 15, 4, 22, 1.8)), n(LINE(17, 15, 20, 22, 1.8))]],
    ['lobbyismus', 'Lobbyismus', 'Politik & Wahlen', [n(R(2, 8, 13, 10, 1.5)), n('M6 8V6.5A1.5 1.5 0 0 1 7.5 5h2A1.5 1.5 0 0 1 11 6.5V8H9.5V6.6h-1.9V8Z'), a(C(17.5, 15, 4.5) + R(16.8, 12.5, 1.4, 5, .6))]],
    ['bestechung', 'Bestechung', 'Politik & Wahlen', [n(R(2, 5, 15, 11, 1.2) + POLY(3.5, 6.5, 9.5, 11, 15.5, 6.5, 15.5, 8.3, 9.5, 12.8, 3.5, 8.3)), a(C(17.5, 16.5, 4.5) + R(16.8, 14, 1.4, 5, .6))]],
    ['debatte', 'Debatte', 'Politik & Wahlen', [n(PERSON(5.5, 15, .8)), n(PERSON(18.5, 15, .8)), a('M8 2h8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3l-2 2V8H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z')]],
    ['podium', 'Podium', 'Politik & Wahlen', [n(R(2, 15, 20, 7, 1)), n(PERSON(6, 11, .55)), n(PERSON(12, 11, .55)), n(PERSON(18, 11, .55)), a(R(2, 15, 20, 2.2, .6))]],
    // ── Recht & Justiz
    ['gericht', 'Gericht', 'Recht & Justiz', [n(R(3, 10, 18, 10) + R(5.5, 12, 2, 6) + R(9, 12, 2, 6) + R(13, 12, 2, 6) + R(16.5, 12, 2, 6)), n('M2 10l10-7 10 7Z'), n(R(2, 20.5, 20, 2)), a(C(12, 7.3, 1.5))]],
    ['handschellen', 'Handschellen', 'Recht & Justiz', [n(RING(7, 15, 4.5, 2)), n(RING(17, 15, 4.5, 2)), a(R(8, 7.5, 8, 2, 1)), n(R(5.8, 8.6, 2.4, 2.4, .4)), n(R(15.8, 8.6, 2.4, 2.4, .4))]],
    ['akte', 'Akte', 'Recht & Justiz', [n('M2 6a1 1 0 0 1 1-1h6l2 2h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z'), a(R(2, 10, 20, 1.8))]],
    ['vertrag', 'Vertrag', 'Recht & Justiz', [n(DOC(lines3)), a(LINE(7.5, 18, 9.5, 15.8, 1.2)), a(LINE(9.5, 15.8, 11, 18, 1.2)), a(LINE(11, 18, 13, 15.8, 1.2)), a(C(16.2, 17.5, 1.8))]],
    ['grundgesetz', 'Grundgesetz', 'Recht & Justiz', [n(R(4, 2, 16, 20, 1.5) + R(7, 10, 10, 1.5, .75) + R(7, 13.5, 10, 1.5, .75) + R(7, 17, 6, 1.5, .75)), a(R(4, 2, 16, 5, 1.5))]],
    ['urkunde', 'Urkunde', 'Recht & Justiz', [n(R(3, 3, 18, 14, 1) + R(6, 6.5, 12, 1.4, .7) + R(6, 9.5, 8, 1.4, .7)), a(C(16.5, 16, 3)), a(POLY(14.6, 18, 13.8, 22.5, 16.5, 21, 19.2, 22.5, 18.4, 18))]],
    ['datenschutz', 'Datenschutz', 'Recht & Justiz', [n('M12 2l8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.6-8-5.8-8-11V5Z'), a('M9.6 11V9.4a2.4 2.4 0 0 1 4.8 0V11h-1.4V9.4a1 1 0 0 0-2 0V11Z'), a(R(8.5, 11, 7, 5.5, 1))]],
    ['fingerabdruck', 'Fingerabdruck', 'Recht & Justiz', [n(ARC(12, 13, 9.5, 1.5, 200, 340)), a(ARC(12, 13, 6.8, 1.5, 190, 350)), n(ARC(12, 13, 4.1, 1.5, 180, 360)), n(R(11.25, 12.5, 1.5, 9.5, .75)), n(ARC(12, 13, 6.8, 1.5, 15, 75)), a(ARC(12, 13, 9.5, 1.5, 10, 60)), n(ARC(12, 13, 4.1, 1.5, 100, 160))]],
    ['zeugin', 'Aussage', 'Recht & Justiz', [n(PERSON(8, 14, 1)), a('M14 3h7a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-3l-2.5 2.5V10H14a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z')]],
    ['knast', 'Haft', 'Recht & Justiz', [n(PERSON(12, 14, 1.1)), a(R(3, 2, 2, 20)), a(R(8, 2, 2, 20)), a(R(14, 2, 2, 20)), a(R(19, 2, 2, 20))]],
    // ── Staat & Sicherheit
    ['blaulicht', 'Blaulicht', 'Staat & Sicherheit', [n(R(5, 17, 14, 4, 1)), n('M7 17v-6a5 5 0 0 1 10 0v6Z'), a(LINE(3, 6, 5.5, 8.5, 1.6)), a(LINE(21, 6, 18.5, 8.5, 1.6)), a(R(11.2, 1.5, 1.6, 3.5, .8))]],
    ['wasserwerfer', 'Wasserwerfer', 'Staat & Sicherheit', [n('M2 12h12l2-3h4l2 4v5H2Z'), n(C(6, 19, 2)), n(C(17, 19, 2)), n(R(6, 8, 3, 4)), a('M7 8.6L3 2.6 4.8 1.6l4 6Z'), a(DOTS([[1.8, 4.6], [3.2, 6.6]], .8))]],
    ['polizeiauto', 'Polizeiauto', 'Staat & Sicherheit', [n(CARP + 'M6.6 11l-1.2 3h13.2l-1.2-3Z'), a(R(10, 5.8, 4, 3, .8))]],
    ['traenengas', 'Tränengas', 'Staat & Sicherheit', [n(R(3, 10, 6, 12, 1.5)), n(R(4.5, 8, 3, 2.5, .5)), a(C(12, 7, 3)), a(C(17, 4.6, 3.4)), a(C(17, 11, 2.6)), a(C(21, 7.8, 2))]],
    ['drohne', 'Drohne', 'Staat & Sicherheit', [n(LINE(8, 10, 4, 6, 1.6)), n(LINE(16, 10, 20, 6, 1.6)), n(LINE(8, 14, 4, 18, 1.6)), n(LINE(16, 14, 20, 18, 1.6)), n(R(8, 9.5, 8, 5, 1.5)), a(ELL(4, 5.6, 3.2, 1.1)), a(ELL(20, 5.6, 3.2, 1.1)), a(ELL(4, 18.4, 3.2, 1.1)), a(ELL(20, 18.4, 3.2, 1.1))]],
    ['satellit', 'Satellit', 'Staat & Sicherheit', [n(R(9.5, 9.5, 5, 5, 1)), n(R(8, 11.3, 8, 1.4)), a(R(1.5, 10, 6.5, 4, .5)), a(R(16, 10, 6.5, 4, .5)), n(R(11.3, 5, 1.4, 4.5)), n(C(12, 4.5, 1.5))]],
    ['abhoeren', 'Abhören', 'Staat & Sicherheit', [n('M3 15v-3a9 9 0 0 1 18 0v3h-2.2v-3a6.8 6.8 0 0 0-13.6 0v3Z'), a(R(2, 13.5, 5, 8, 2)), n(R(17, 13.5, 5, 8, 2))]],
    ['radar', 'Radar', 'Staat & Sicherheit', [n(RING(12, 12, 10, 1.6)), n(RING(12, 12, 5.8, 1.4)), a(SEC(12, 12, 0, 10, -90, -35)), a(C(16.4, 7, 1.3))]],
    ['verschlusssache', 'Verschlusssache', 'Staat & Sicherheit', [n(DOC(R(7.5, 5.5, 9, 1.4, .7) + R(7.5, 8.5, 9, 1.4, .7) + R(7.5, 18.5, 7, 1.4, .7))), a(R(3, 11.5, 18, 5, .6))]],
    ['feuerwehr', 'Feuerwehr', 'Staat & Sicherheit', [n('M2 11h11V8h5l3 4h1v6H2Z'), n(C(6, 19, 2)), n(C(17, 19, 2)), a(LINE(3, 8.4, 12, 3, 1.6)), a(R(4, 13, 7, 2))]],
    ['schild-recht', 'Grundrechte', 'Staat & Sicherheit', [n('M12 2l8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.6-8-5.8-8-11V5Z'), a(HEART(12, 9.6, .45))]],
    ['zaun', 'Zaun', 'Staat & Sicherheit', [n(POLY(3, 22, 3, 6, 4.5, 4, 6, 6, 6, 22)), n(POLY(10.5, 22, 10.5, 6, 12, 4, 13.5, 6, 13.5, 22)), n(POLY(18, 22, 18, 6, 19.5, 4, 21, 6, 21, 22)), a(R(1.5, 9, 21, 2)), a(R(1.5, 16, 21, 2))]],
    // ── Krieg & Frieden
    ['kampfjet', 'Kampfjet', 'Krieg & Frieden', [n('M12 1.5c1 1 1.4 2.5 1.4 4.5v4l8 5v2l-8-2v4l2.5 2v1.5L12 21l-3.9 1.5V21l2.5-2v-4l-8 2v-2l8-5V6c0-2 .4-3.5 1.4-4.5Z'), a(ELL(12, 6.5, .8, 2))]],
    ['kriegsschiff', 'Kriegsschiff', 'Krieg & Frieden', [n('M1 15h22l-3 5H4Z'), n(R(6, 11, 10, 4)), n(R(9, 7.5, 4, 3.5)), n(LINE(13, 9, 20, 7.2, 1.4)), a(R(10.4, 3.5, 1.2, 4))]],
    ['munition', 'Munition', 'Krieg & Frieden', [n('M4 10a1.7 3.2 0 0 1 3.4 0v11H4Z'), a('M10.3 10a1.7 3.2 0 0 1 3.4 0v11h-3.4Z'), n('M16.6 10a1.7 3.2 0 0 1 3.4 0v11h-3.4Z')]],
    ['stacheldraht', 'Stacheldraht', 'Krieg & Frieden', [n(R(1, 11.2, 22, 1.6)), ...[5, 12, 19].flatMap(x => [a(LINE(x - 2, 9, x + 2, 15, 1.4)), a(LINE(x + 2, 9, x - 2, 15, 1.4))])]],
    ['olivenzweig', 'Olivenzweig', 'Krieg & Frieden', [n(LINE(4, 21, 19, 3, 1.4)), ...[[7.4, 17], [10, 13.8], [12.6, 10.6], [15.2, 7.4]].flatMap(([x, y]) => [a(LEAF(x, y, x - 4.6, y - 2.4, 1.5)), a(LEAF(x, y, x + 2.2, y + 4.4, 1.5))]), a(LEAF(19, 3, 21.8, 1.5, 1.3))]],
    ['weisse-fahne', 'Weiße Fahne', 'Krieg & Frieden', [n(R(4, 2, 1.8, 20, .9)), n(R(5.8, 3, 14, 10) + R(7.4, 4.6, 10.8, 6.8)), a(C(4.9, 2, 1.4))]],
    ['zerstoerung', 'Zerstörung', 'Krieg & Frieden', [n('M3 22V9l4-2v4l3-3 2 3V6l4 3v3l3-1 2 2v10Z' + R(6, 14, 2.4, 3) + R(13, 14, 2.4, 3)), a(R(1.5, 20, 7, 2.2, .6)), a(POLY(15, 22, 18.5, 17.5, 22.5, 22))]],
    ['gedenken', 'Gedenken', 'Krieg & Frieden', [n('M7 22V9a5 5 0 0 1 10 0v13Z'), a(RING(12, 13.5, 2.8, 1.1)), n(R(3, 20.5, 18, 1.6))]],
    ['orden', 'Orden', 'Krieg & Frieden', [n(POLY(8, 2, 11, 2, 12, 7.5, 13, 2, 16, 2, 14, 10, 10, 10)), a(STAR(12, 15.5, 6.5, 3.4, 8))]],
    ['militaerhelm', 'Militärhelm', 'Krieg & Frieden', [n('M3 16a9 8 0 0 1 18 0Z'), n(R(1.5, 15.5, 21, 2.4, 1.2)), a(R(6, 10, 12, 1.8, .9))]],
    ['ruestung', 'Aufrüstung', 'Krieg & Frieden', [n(R(2, 17, 5, 5)), n(R(9.5, 12, 5, 10)), a(R(17, 7, 5, 15)), a('M15 6l4.5-4.5L24 6h-2.6v.1H17.6V6Z')]],
    // ── Migration & Grenzen
    ['seenotrettung', 'Seenotrettung', 'Migration & Grenzen', [n('M2 14h20l-3 5H5Z'), n(PERSON(8, 11.4, .45)), n(PERSON(12, 11.4, .45)), n(PERSON(16, 11.4, .45)), a(WAVE(20.6, .7, 1.8))]],
    ['rettungsring', 'Rettungsring', 'Migration & Grenzen', [n(RING(12, 12, 10, 4)), a(SEC(12, 12, 6, 10, -65, -25)), a(SEC(12, 12, 6, 10, 25, 65)), a(SEC(12, 12, 6, 10, 115, 155)), a(SEC(12, 12, 6, 10, 205, 245))]],
    ['reisekoffer', 'Koffer', 'Migration & Grenzen', [n(R(5, 6, 14, 15, 2)), n('M9 6V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V6h-1.6V3.6h-2.8V6Z'), a(R(8.5, 6, 1.6, 15)), a(R(13.9, 6, 1.6, 15)), n(C(8, 22, 1)), n(C(16, 22, 1))]],
    ['reisepass', 'Reisepass', 'Migration & Grenzen', [n(R(5, 2, 14, 20, 1.6)), a(RING(12, 10, 3.6, 1.2)), a(R(8, 16, 8, 1.6, .8))]],
    ['zelt', 'Zelt', 'Migration & Grenzen', [n('M12 3l10 18H2Z'), a('M12 9l5 12H7Z')]],
    ['schlagbaum', 'Schlagbaum', 'Migration & Grenzen', [n(R(3, 8, 3, 14, .6)), a(R(6, 9, 16, 3, 1)), n(R(10, 9, 3, 3)), n(R(16, 9, 3, 3)), n(R(1.5, 20.5, 6, 1.6))]],
    ['meer', 'Meer', 'Migration & Grenzen', [n(WAVE(6, 1.4, 2.4)), a(WAVE(11.5, 1.4, 2.4)), n(WAVE(17, 1.4, 2.4))]],
    ['flucht', 'Flucht', 'Migration & Grenzen', [n(PERSON(6, 14, .9)), n(PERSON(12.5, 15.5, .65)), a(ARROW_R(13, 6, 10, 2.4, 4))]],
    ['schutz', 'Schutz und Asyl', 'Migration & Grenzen', [n('M12 2.5l10 8.5h-3v11H5V11H2Z'), a(HEART(12, 12.6, .42))]],
    ['migration', 'Migration', 'Migration & Grenzen', [n(PIN(5, 16, 3)), n(PIN2(5, 16, 3)), a(PIN(19, 6, 3)), a(PIN2(19, 6, 3)), n(DOTS([[8.5, 20], [11.5, 19.5], [14, 17.5], [16, 14.5], [17.5, 11.5]], .9))]],
    ['abschiebung', 'Abschiebung', 'Migration & Grenzen', [n('M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z'), a(ARROW_R(14, 4, 9, 2, 3.4))]],
    // ── Arbeit & Gewerkschaft
    ['baukran', 'Baukran', 'Arbeit & Gewerkschaft', [n(R(6, 4, 2, 18)), n(R(2, 4, 20, 2)), n(R(3, 20.5, 8, 1.6)), n(R(17.2, 6, 1, 5)), a(R(15.5, 11, 4.4, 3, .4)), n(R(3, 6, 3, 3))]],
    ['schaufel', 'Schaufel', 'Arbeit & Gewerkschaft', [n(LINE(4, 3, 13, 12, 2)), n(R(2, 1.5, 5, 2.4, 1.2)), a('M12.5 13.5l3-3 6 6-1 5-5 1-6-6Z')]],
    ['buero', 'Büro', 'Arbeit & Gewerkschaft', [n(R(3, 4, 18, 11, 1.2) + R(5, 6, 14, 7)), n(R(10.5, 15, 3, 3)), n(R(7, 18, 10, 2, 1)), a(R(6.5, 7.5, 6, 1.6, .8)), a(R(6.5, 10.2, 4, 1.6, .8))]],
    ['lieferdienst', 'Lieferdienst', 'Arbeit & Gewerkschaft', [n(RING(5.5, 18, 3.2, 1.4)), n(RING(18.5, 18, 3.2, 1.4)), n(LINE(5.5, 18, 10, 12, 1.6)), n(LINE(10, 12, 16, 12, 1.6)), n(LINE(16, 12, 18.5, 18, 1.6)), n(LINE(10, 12, 12, 18, 1.6)), n(LINE(15, 12, 14, 8, 1.6)), a(R(1.5, 6, 8, 6, .8))]],
    ['paket', 'Paket', 'Arbeit & Gewerkschaft', [n('M12 2l9 4.5v11L12 22l-9-4.5v-11Z'), a('M3 6.5l9 4.5 9-4.5-1.7-.9L12 9.2 4.7 5.6Z'), a(R(11.2, 11, 1.6, 11))]],
    ['kaffeepause', 'Pause', 'Arbeit & Gewerkschaft', [n('M3 9h14v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6Z'), n('M17 10.5h1.5a3 3 0 0 1 0 6H16.8v-1.8h1.7a1.2 1.2 0 0 0 0-2.4H17Z'), a('M7.4 2.5c1 1 1 2 0 3s-1 2 0 3H5.8c-1-1-1-2 0-3s1-2 0-3Z'), a('M12 2.5c1 1 1 2 0 3s-1 2 0 3h-1.6c-1-1-1-2 0-3s1-2 0-3Z')]],
    ['lohnabrechnung', 'Lohnabrechnung', 'Arbeit & Gewerkschaft', [n(BILL(R(7.5, 5.5, 9, 1.4, .7) + R(7.5, 8.5, 6, 1.4, .7))), a(C(14, 14.6, 3.2) + R(13.3, 12.4, 1.4, 4.4, .6))]],
    ['leiter', 'Leiter', 'Arbeit & Gewerkschaft', [n(R(5, 2, 2, 20, 1)), n(R(17, 2, 2, 20, 1)), n(R(7, 5, 10, 1.6)), n(R(7, 10, 10, 1.6)), n(R(7, 15, 10, 1.6)), a(R(7, 19.4, 10, 1.6))]],
    ['karriere', 'Aufstieg', 'Arbeit & Gewerkschaft', [n('M2 21h5v-4h5v-4h5V9h5v12Z'), a(PERSON(19.5, 5.4, .5))]],
    ['warteschlange', 'Warteschlange', 'Arbeit & Gewerkschaft', [n(PERSON(4, 14, .6)), n(PERSON(9.3, 14, .6)), n(PERSON(14.6, 14, .6)), a(PERSON(20, 14, .6))]],
    ['kuendigung', 'Kündigung', 'Arbeit & Gewerkschaft', [n(R(3, 3, 10, 18, 1) + R(5, 5, 6, 14)), a(ARROW_R(8.5, 12, 14, 2.4, 4.2))]],
    ['homeoffice', 'Homeoffice', 'Arbeit & Gewerkschaft', [n('M12 2.5l10 8.5h-3v11H5V11H2Z' + R(8, 12, 8, 5, .6) + R(7, 17.6, 10, 1.4, .7)), a(R(9.4, 13.4, 5.2, 2.2, .3))]],
    ['schichtarbeit', 'Schichtarbeit', 'Arbeit & Gewerkschaft', [n(RING(10, 13, 8, 1.8)), n(R(9.1, 8, 1.8, 5.6, .9)), n(LINE(10, 13, 13, 15, 1.8)), a('M19.5 1.5a4.5 4.5 0 1 0 3 7.6 3.6 3.6 0 0 1-3-7.6Z')]],
    ['gewerkschaft', 'Gewerkschaft', 'Arbeit & Gewerkschaft', [n(PERSON(5, 15, .8)), n(PERSON(11.5, 15, .8)), n(R(16, 2, 1.4, 20, .7)), a('M17.4 3h5.6l-1.6 2.5 1.6 2.5h-5.6Z')]],
    ['werkzeugkasten', 'Werkzeugkasten', 'Arbeit & Gewerkschaft', [n(R(2, 9, 20, 12, 1.5)), n('M8 9V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V9h-1.8V6.8H9.8V9Z'), a(R(2, 13, 20, 2)), n(R(10.5, 12, 3, 4, .6))]],
    ['hammer-werkzeug', 'Hammer', 'Arbeit & Gewerkschaft', [n(LINE(5, 21, 14, 8, 2.4)), a('M11 3.5l5-1.5 6 6-2 2-2.5-1.5-2 2-4-4 1.5-1.5Z')]],
    ['pflegekraft', 'Pflegekraft', 'Arbeit & Gewerkschaft', [n(PERSON(12, 14, 1.2)), a('M10.8 15h2.4v1.6h1.6V19h-1.6v1.6h-2.4V19H9.2v-2.4h1.6Z')]],
    ['erntehelfer', 'Saisonarbeit', 'Arbeit & Gewerkschaft', [n(PERSON(8, 14, 1)), a(R(14, 13, 8, 8, 1)), n(R(15, 11, 6, 2, .8))]],
    // ── Wirtschaft & Geld
    ['geldsack', 'Geldsack', 'Wirtschaft & Geld', [n('M9 6h6l-1.5 2.5C18 10 20 13.5 20 16.5 20 20 17 22 12 22s-8-2-8-5.5C4 13.5 6 10 10.5 8.5Z'), n('M9 2.5h6L13.5 5h-3Z'), a(C(12, 15.5, 3.2) + R(11.3, 13.4, 1.4, 4.2, .6))]],
    ['bankkarte', 'Bankkarte', 'Wirtschaft & Geld', [n(R(2, 5, 20, 14, 2) + R(5, 14.5, 6, 1.6, .8)), a(R(2, 8.5, 20, 3))]],
    ['geldboerse', 'Geldbörse', 'Wirtschaft & Geld', [n('M5 6l11-3.5 1.2 3.5Z'), n(R(2, 6, 20, 15, 2)), a('M15 10.5h7v7h-7a3.5 3.5 0 0 1 0-7Z'), n(C(15.5, 14, 1.2))]],
    ['rechnung', 'Rechnung', 'Wirtschaft & Geld', [n(BILL(lines3)), a(R(11.5, 15, 5, 2.4, .6))]],
    ['boersenkurs', 'Börsenkurs', 'Wirtschaft & Geld', [n(R(2, 20.5, 20, 1.5)), n(R(4, 9, 3, 8)), n(R(5.1, 7, .8, 12)), a(R(10.5, 5, 3, 7)), a(R(11.6, 3, .8, 11)), n(R(17, 11, 3, 6)), n(R(18.1, 9, .8, 10))]],
    ['preis', 'Preis', 'Wirtschaft & Geld', [n('M2 12V4a2 2 0 0 1 2-2h8l10 10-10 10Z' + C(7, 7, 1.6))]],
    ['preissteigerung', 'Preissteigerung', 'Wirtschaft & Geld', [n('M2 13V5a2 2 0 0 1 2-2h7l9 9-9 9Z' + C(6.5, 7.5, 1.5)), a('M19 1l4 4.5h-2.6V11h-2.8V5.5H15Z')]],
    ['tresor', 'Tresor', 'Wirtschaft & Geld', [n(R(2, 3, 20, 17, 2) + C(11, 11.5, 4) + R(18, 9, 1.8, 5, .9)), a(C(11, 11.5, 2)), n(R(4, 20, 3, 2)), n(R(17, 20, 3, 2))]],
    ['goldbarren', 'Goldbarren', 'Wirtschaft & Geld', [n('M2 20l2.5-6h7L14 20Z'), a('M10 20l2.5-6h7L22 20Z'), n('M6 13l2.5-6h7L18 13Z')]],
    ['schulden', 'Schulden', 'Wirtschaft & Geld', [n(R(2, 17, 10, 3, 1.5)), n(R(2, 13, 10, 3, 1.5)), n(R(2, 9, 10, 3, 1.5)), a('M16.5 2h3v12h3l-4.5 7-4.5-7h3Z')]],
    ['container', 'Container', 'Wirtschaft & Geld', [n(R(2, 8, 20, 11, 1) + R(4.5, 10.5, 1.6, 6) + R(8, 10.5, 1.6, 6) + R(11.5, 10.5, 1.6, 6) + R(15, 10.5, 1.6, 6) + R(18.5, 10.5, 1.6, 6)), a(R(2, 5, 20, 2))]],
    ['kasse', 'Kasse', 'Wirtschaft & Geld', [n(R(2, 12, 20, 10, 1.5) + R(5, 15, 3, 2) + R(10.5, 15, 3, 2) + R(16, 15, 3, 2)), n(R(5, 7, 14, 5) + R(7, 8.5, 10, 2)), a(R(7, 2, 10, 4, .8))]],
    ['wachstum', 'Wachstum', 'Wirtschaft & Geld', [n(R(3, 18, 18, 4, 1)), n(R(11.2, 8, 1.6, 10)), a(LEAF(12, 12, 5.5, 7.5, 2.2)), a(LEAF(12, 9, 18.5, 3.5, 2.2))]],
    ['reichtum', 'Reichtum', 'Wirtschaft & Geld', [a('M6 3h12l4 6-10 13L2 9Z'), n('M2 9h20l-1 1.4H3Z'), n(POLY(9.5, 10.4, 11, 10.4, 12, 18.6, 11.2, 19.5))]],
    ['hunger', 'Hunger', 'Wirtschaft & Geld', [n(RING(13, 13, 8.5, 1.6)), n(RING(13, 13, 4.8, 1.2)), a(R(1.3, 4, 1.4, 6)), a(R(3.3, 4, 1.4, 6)), a('M1.3 9.4h3.4v1.4l-.9.8V22H2.2V11.6l-.9-.8Z')]],
    ['rente', 'Rente', 'Wirtschaft & Geld', [n(PERSON(8.5, 13.5, 1.05)), n(R(15.5, 11, 1.4, 11, .7)), n('M15.5 11.8a2.4 2.4 0 0 1 4.8 0h-1.4a1 1 0 0 0-2 0Z'), a(C(19, 5, 3.4) + R(18.3, 3, 1.4, 4, .6))]],
    ['handel', 'Welthandel', 'Wirtschaft & Geld', [n(C(12, 12, 9.5) + ELL(12, 12, 4, 9.5) + R(2.5, 11.2, 19, 1.6)), a(ARC(12, 12, 11.4, 1.6, 200, 300)), a(HEAD(12, 12, 10.6, 300, 2.2))]],
    ['sozialstaat', 'Sozialstaat', 'Wirtschaft & Geld', [n('M2 13l3.5-1.5c1.5-.6 3.2-.4 4.4.6L12 14H8v1.5h5.6l5-2a1.6 1.6 0 0 1 1.2 3L13 19.5a4 4 0 0 1-2.8 0L2 17Z'), a(C(12, 6.5, 3.6) + R(11.3, 4.4, 1.4, 4.2, .6))]],
    // ── Wohnen & Stadt
    ['wohnblock', 'Wohnblock', 'Wohnen & Stadt', [n(R(4, 2, 16, 20, .6) + [4.5, 8.5, 12.5].flatMap(y => [6.5, 10.75, 15].map(x => R(x, y, 2.5, 2.5))).join('')), a(R(10, 17, 4, 5))]],
    ['stadt', 'Stadt', 'Wohnen & Stadt', [n('M1 22V12h4V8h4v14Z'), n('M9 22V4h6v18Z' + R(10.5, 6, 1.2, 1.6) + R(12.5, 6, 1.2, 1.6) + R(10.5, 9, 1.2, 1.6) + R(12.5, 9, 1.2, 1.6) + R(10.5, 12, 1.2, 1.6) + R(12.5, 12, 1.2, 1.6)), a('M15 22V10h4V7h2v3h2v12Z')]],
    ['umzug', 'Umzug', 'Wohnen & Stadt', [n(R(3, 8, 18, 13, 1) + R(10.5, 8, 3, 5)), a('M3 8l3-4h12l3 4Z')]],
    ['mietvertrag', 'Mietvertrag', 'Wohnen & Stadt', [n(DOC(R(7.5, 14, 9, 1.4, .7) + R(7.5, 17, 6, 1.4, .7))), a('M12 4.3l4.5 3.8h-1.3V12H8.8V8.1H7.5Z')]],
    ['parkbank', 'Parkbank', 'Wohnen & Stadt', [a(R(2, 4, 20, 2.4, .6)), n(R(2, 8, 20, 3, .6)), n(R(2, 12.5, 20, 2.6, .6)), n(R(4, 15, 2, 6)), n(R(18, 15, 2, 6))]],
    ['ampel', 'Ampel', 'Wohnen & Stadt', [n(R(8, 1.5, 8, 17, 2) + C(12, 5, 2) + C(12, 10, 2)), a(C(12, 15, 2)), n(R(11, 18.5, 2, 4))]],
    ['strasse', 'Straße', 'Wohnen & Stadt', [n('M8 2h2.5l-1 20H2Z'), n('M13.5 2H16l6 20h-7.5Z'), a(R(11.3, 3, 1.4, 3)), a(R(11.3, 9, 1.4, 3.5)), a(R(11.2, 15.5, 1.6, 4.5))]],
    ['heizung', 'Heizung', 'Wohnen & Stadt', [n(R(3, 7, 3, 13, 1.5)), n(R(7.5, 7, 3, 13, 1.5)), n(R(12, 7, 3, 13, 1.5)), n(R(16.5, 7, 3, 13, 1.5)), n(R(2, 16, 19, 2)), a('M6 2c1 1 1 2 0 3h-1.4c1-1 1-2 0-3Z'), a('M11 2c1 1 1 2 0 3H9.6c1-1 1-2 0-3Z'), a('M16 2c1 1 1 2 0 3h-1.4c1-1 1-2 0-3Z')]],
    ['wasserhahn', 'Wasser', 'Wohnen & Stadt', [n('M4 6h9a4 4 0 0 1 4 4v2h-3v-2a1 1 0 0 0-1-1H4Z'), n(R(7, 3, 3, 3, .5)), a('M15.5 15s2 2.4 2 3.8a2 2 0 0 1-4 0c0-1.4 2-3.8 2-3.8Z')]],
    ['lampe', 'Licht', 'Wohnen & Stadt', [n('M8 2h8l3 8H5Z'), n(R(11, 10, 2, 9)), n(R(7, 19, 10, 3, 1)), a(R(9, 10, 6, 1.6))]],
    ['bett', 'Wohnraum', 'Wohnen & Stadt', [n(R(2, 13, 20, 4, .8)), n(R(2, 8, 2, 14, .5)), n(R(20, 13, 2, 9, .5)), a(R(5, 10, 5, 3, 1.5)), n(R(10.5, 10.5, 9.5, 2.5, 1))]],
    ['fenster', 'Fenster', 'Wohnen & Stadt', [n(R(4, 3, 16, 17, 1) + R(6, 5, 5, 6) + R(13, 5, 5, 6) + R(6, 13, 5, 5) + R(13, 13, 5, 5)), a(R(2, 20, 20, 2, 1))]],
    ['dorf', 'Dorf', 'Wohnen & Stadt', [n('M1 22v-9l5-4 5 4v9Z'), a('M11 22V10l5.5-5 5.5 5v12Z' + R(14.5, 15, 3, 7))]],
    ['zu-vermieten', 'Zu vermieten', 'Wohnen & Stadt', [n(R(11.2, 10, 1.6, 12)), n(R(3, 2, 18, 9, 1) + R(5.5, 5, 7, 1.6, .8)), a(R(14, 4, 4.5, 4, .6))]],
    ['obdachlosigkeit', 'Obdachlosigkeit', 'Wohnen & Stadt', [n(PERSON(7, 11, .8)), n(R(2, 15, 20, 2.4, .6)), n(R(3.5, 17, 2, 5)), n(R(18.5, 17, 2, 5)), a('M15 3.5l4.5 3.8H18.2V11h-6.4V7.3h-1.3Z')]],
    ['spielplatz', 'Spielplatz', 'Wohnen & Stadt', [n(LINE(3, 22, 8, 3, 1.6)), n(LINE(13, 22, 8, 3, 1.6)), n(R(5, 3, 15, 1.6)), n(R(17.6, 3, 1.4, 11)), a(R(15.5, 14, 5.5, 2, .8))]],
    ['baum-stadt', 'Stadtgrün', 'Wohnen & Stadt', [a(C(12, 8, 6)), n(R(11, 12, 2, 8)), n(R(4, 20, 16, 2, 1))]],
    // ── Medien & Kommunikation
    ['radio', 'Radio', 'Medien & Kommunikation', [n(R(2, 7, 20, 14, 2) + C(15.5, 14, 3.6)), a(C(15.5, 14, 1.8)), n(LINE(5, 7, 17, 2, 1.4)), a(R(5, 10, 6, 2, .5))]],
    ['podcast', 'Podcast', 'Medien & Kommunikation', [n(R(9.5, 2, 5, 10, 2.5)), n(ARC(12, 9, 6.5, 1.6, 0, 180)), n(R(11.2, 15, 1.6, 4.5)), n(R(8.5, 19.5, 7, 1.6, .8)), a(ARC(12, 7, 10, 1.4, 200, 250)), a(ARC(12, 7, 10, 1.4, 290, 340))]],
    ['kopfhoerer', 'Kopfhörer', 'Medien & Kommunikation', [n('M3 15v-3a9 9 0 0 1 18 0v3h-2.2v-3a6.8 6.8 0 0 0-13.6 0v3Z'), a(R(2, 14, 5, 8, 2)), a(R(17, 14, 5, 8, 2))]],
    ['livestream', 'Livestream', 'Medien & Kommunikation', [n(R(2, 4, 20, 14, 2) + R(4, 6, 16, 10)), n(R(8, 19.5, 8, 2, 1)), a(C(8, 11, 2.2)), a(ARC(8, 11, 5, 1.4, -45, 45))]],
    ['hashtag', 'Hashtag', 'Medien & Kommunikation', [n(LINE(9.5, 3, 7.5, 21, 2.2)), n(LINE(16.5, 3, 14.5, 21, 2.2)), a(R(3.5, 7.5, 17, 2.2, 1.1)), a(R(3, 14.5, 17, 2.2, 1.1))]],
    ['at', 'Erwähnung', 'Medien & Kommunikation', [n(ARC(12, 12, 9.5, 2, 30, 360)), a(RING(12, 12, 3.8, 2)), a('M14.8 8h2v6.5a1.5 1.5 0 0 0 3 0V12h2v2.5a3.5 3.5 0 0 1-7 0Z')]],
    ['teilen', 'Teilen', 'Medien & Kommunikation', [n(LINE(6, 12, 18, 5, 1.6)), n(LINE(6, 12, 18, 19, 1.6)), a(C(18, 5, 3)), n(C(6, 12, 3)), a(C(18, 19, 3))]],
    ['eilmeldung', 'Eilmeldung', 'Medien & Kommunikation', [n(R(2, 4, 20, 16, 1.5) + R(4, 10, 16, 1.5) + R(4, 13.5, 16, 1.5) + R(4, 17, 10, 1.5)), a(R(2, 4, 20, 4, 1.5))]],
    ['film', 'Film', 'Medien & Kommunikation', [n(R(2, 10, 20, 11, 1)), a('M2 6.5l18.5-4 .8 3.5L2.8 10Z'), n(R(2, 8.2, 20, 1.8))]],
    ['falschmeldung', 'Falschmeldung', 'Medien & Kommunikation', [n(R(2, 3, 18, 15, 1.5) + R(4.5, 6, 13, 2.5) + R(4.5, 10.5, 6, 5) + R(12.5, 10.5, 5, 1.5) + R(12.5, 13.5, 5, 1.5)), a(C(18, 18, 5)), n(LINE(16, 16, 20, 20, 1.5)), n(LINE(20, 16, 16, 20, 1.5))]],
    ['faktencheck', 'Faktencheck', 'Medien & Kommunikation', [n(RING(10, 10, 7.5, 2.2)), n(LINE(15.5, 15.5, 21.5, 21.5, 3)), a('M6.8 10l1.3-1.3 1.5 1.5 3.4-3.4 1.3 1.3-4.7 4.7Z')]],
    ['zensur', 'Zensur', 'Medien & Kommunikation', [n(R(2, 3, 20, 18, 1.5) + R(4.5, 6, 15, 1.6, .8) + R(4.5, 16.5, 15, 1.6, .8)), a(R(3, 9.5, 18, 5, .5))]],
    ['telefon', 'Telefon', 'Medien & Kommunikation', [n('M6.6 2.5l2.9 3.2-1.8 2.8a12 12 0 0 0 7.8 7.8l2.8-1.8 3.2 2.9-1.6 3.6C12 21.4 2.6 12 3 4.1Z'), a(ARC(14, 10, 5, 1.4, -90, 0)), a(ARC(14, 10, 8.5, 1.4, -90, 0))]],
    ['sendemast', 'Sendemast', 'Medien & Kommunikation', [n('M12 7l5 15h-2.2L12 13l-2.8 9H7Z'), a(C(12, 6, 1.6)), a(ARC(12, 6, 4.5, 1.4, 200, 250)), a(ARC(12, 6, 4.5, 1.4, 290, 340)), a(ARC(12, 6, 8, 1.4, 200, 250)), a(ARC(12, 6, 8, 1.4, 290, 340))]],
    ['email', 'E-Mail', 'Medien & Kommunikation', [n(R(2, 5, 20, 14, 1.5) + POLY(3.5, 6.5, 12, 12.5, 20.5, 6.5, 20.5, 8.4, 12, 14.4, 3.5, 8.4)), a(C(19.5, 5, 2.6))]],
    ['kommentare', 'Kommentare', 'Medien & Kommunikation', [n('M3 3h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-9l-5 4.5V16H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z' + R(5, 6.5, 14, 1.5, .75) + R(5, 10, 9, 1.5, .75)), a(C(20, 4, 2.6))]],
    ['bildschirm', 'Bildschirm', 'Medien & Kommunikation', [n(R(2, 3, 20, 14, 1.5) + R(4, 5, 16, 10)), n(R(10.5, 17, 3, 3)), n(R(7, 20, 10, 1.8, .9)), a(R(6, 7, 8, 6, .6))]],
    ['satellitenschuessel', 'Satellitenschüssel', 'Medien & Kommunikation', [n('M4 4a15 15 0 0 0 16 16Z'), n(LINE(16, 8, 11, 13, 1.4)), a(C(16.5, 7.5, 1.8)), n(R(4, 20, 9, 2, 1))]],
    ['presseausweis', 'Presseausweis', 'Medien & Kommunikation', [n(R(4, 3, 16, 19, 2) + R(9.5, 4.5, 5, 1.4, .7)), a(C(12, 11, 2.8)), a('M7.5 18a4.5 4.5 0 0 1 9 0Z')]],
    ['lautsprecher', 'Lautsprecher', 'Medien & Kommunikation', [n('M3 9h4l6-5v16l-6-5H3Z'), a(ARC(12, 12, 5, 1.6, -45, 45)), a(ARC(12, 12, 8.5, 1.6, -45, 45))]],
    ['stumm', 'Stumm', 'Medien & Kommunikation', [n('M3 9h4l6-5v16l-6-5H3Z'), a(LINE(16, 9, 22, 15, 1.8)), a(LINE(22, 9, 16, 15, 1.8))]],
    ['interview', 'Interview', 'Medien & Kommunikation', [n(PERSON(7, 14, .95)), n(R(15, 9, 2, 13, 1)), a(R(13.5, 3, 5, 7.5, 2.5))]],
    ['reichweite', 'Reichweite', 'Medien & Kommunikation', [a(C(12, 12, 2.4)), n(RING(12, 12, 6.5, 1.6)), n(RING(12, 12, 10.5, 1.6))]],
    // ── Digital & Technik
    ['cloud', 'Cloud', 'Digital & Technik', [n('M6.5 19a4.5 4.5 0 0 1-.4-9A6.5 6.5 0 0 1 18.6 9 5 5 0 0 1 18 19Z'), a('M12 9l3.5 4h-2.3v4h-2.4v-4H8.5Z')]],
    ['datenbank', 'Daten', 'Digital & Technik', [n(ELL(12, 5, 8, 2.8)), n('M4 8.4c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v3.4c0 1.5-3.6 2.8-8 2.8s-8-1.3-8-2.8Z'), a('M4 15c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v3.4c0 1.5-3.6 2.8-8 2.8S4 19.9 4 18.4Z')]],
    ['code', 'Code', 'Digital & Technik', [n(POLY(8, 6, 2, 12, 8, 18, 9.6, 16.4, 5.2, 12, 9.6, 7.6)), n(POLY(16, 6, 22, 12, 16, 18, 14.4, 16.4, 18.8, 12, 14.4, 7.6)), a(LINE(13.5, 4, 10.5, 20, 2))]],
    ['server', 'Server', 'Digital & Technik', [n(R(3, 3, 18, 5, 1) + C(6.5, 5.5, 1)), n(R(3, 9.5, 18, 5, 1) + C(6.5, 12, 1)), a(R(3, 16, 18, 5, 1) + C(6.5, 18.5, 1))]],
    ['roboter', 'Roboter', 'Digital & Technik', [n(R(5, 7, 14, 11, 3) + C(9.5, 12, 1.8) + C(14.5, 12, 1.8)), n(R(11.2, 3, 1.6, 4)), a(C(12, 3, 1.6)), n(R(2, 10, 2, 5, 1)), n(R(20, 10, 2, 5, 1)), a(R(9, 15, 6, 1.4, .7))]],
    ['passwort', 'Passwort', 'Digital & Technik', [n(R(2, 7, 20, 10, 2)), a(STAR(7, 12, 2.3, .9, 6)), a(STAR(12, 12, 2.3, .9, 6)), a(STAR(17, 12, 2.3, .9, 6))]],
    ['virus', 'Virus', 'Digital & Technik', [n(C(12, 12, 5.8)), ...[0, 45, 90, 135, 180, 225, 270, 315].map(d => n(LINE(...pt(12, 12, 5, d), ...pt(12, 12, 8.6, d), 1.4))), a([0, 45, 90, 135, 180, 225, 270, 315].map(d => C(...pt(12, 12, 9.3, d), 1.5)).join(''))]],
    ['netzwerk', 'Netzwerk', 'Digital & Technik', [n(LINE(5, 6, 12, 12, 1.4)), n(LINE(19, 6, 12, 12, 1.4)), n(LINE(5, 18, 12, 12, 1.4)), n(LINE(19, 18, 12, 12, 1.4)), n(DOTS([[5, 6], [19, 6], [5, 18], [19, 18]], 2.4)), a(C(12, 12, 3))]],
    ['qr-code', 'QR-Code', 'Digital & Technik', [n(R(3, 3, 7, 7) + R(5, 5, 3, 3)), n(R(14, 3, 7, 7) + R(16, 5, 3, 3)), n(R(3, 14, 7, 7) + R(5, 16, 3, 3)), a(R(14, 14, 3, 3) + R(18, 18, 3, 3)), n(R(18, 14, 3, 3) + R(14, 18, 3, 3))]],
    ['akku', 'Akku', 'Digital & Technik', [n(R(2, 7, 18, 10, 2) + R(4, 9, 14, 6)), n(R(20, 10, 2, 4, .6)), a(R(5, 10, 6, 4))]],
    ['stecker', 'Stecker', 'Digital & Technik', [n(R(6, 8, 12, 7, 1.5)), n(R(8.5, 2, 2, 6)), n(R(13.5, 2, 2, 6)), n('M9 15h6v2a3 3 0 0 1-6 0Z'), a(R(11, 19, 2, 4))]],
    ['herunterladen', 'Herunterladen', 'Digital & Technik', [a('M10 2h4v9h4l-6 7-6-7h4Z'), n(R(3, 19, 18, 3, 1))]],
    ['hochladen', 'Hochladen', 'Digital & Technik', [a('M10 18h4V9h4l-6-7-6 7h4Z'), n(R(3, 19, 18, 3, 1))]],
    ['smartwatch', 'Smartwatch', 'Digital & Technik', [n(R(8, 1, 8, 4, .8)), n(R(8, 19, 8, 4, .8)), n(R(5, 5, 14, 14, 3) + R(7, 7, 10, 10, 1.5)), a(R(9.5, 9.5, 5, 5, 1))]],
    ['tablet', 'Tablet', 'Digital & Technik', [n(R(3, 2, 18, 20, 2) + R(5, 4, 14, 14)), n(C(12, 20, 1)), a(R(7, 6, 10, 4, .5))]],
    ['maus', 'Klick', 'Digital & Technik', [n(R(6, 3, 12, 18, 6)), a(R(11.2, 6, 1.6, 4, .8)), a(LINE(1, 5, 4, 7, 1.4)), a(LINE(1, 11, 4, 10, 1.4))]],
    ['ueberwachung-digital', 'Datensammlung', 'Digital & Technik', [n(R(2, 4, 20, 14, 1.5) + R(4, 6, 16, 10)), n(R(8, 19.5, 8, 2, 1)), a('M5 11c2-2.6 4.4-3.8 7-3.8s5 1.2 7 3.8c-2 2.6-4.4 3.8-7 3.8s-5-1.2-7-3.8Z' + C(12, 11, 1.8))]],
    // ── Menschen & Gesellschaft
    ['aeltere', 'Ältere Menschen', 'Menschen & Gesellschaft', [n(PERSON(9, 13.5, 1.05)), a(R(16, 10, 1.6, 12, .8)), a('M16 10.8a2.6 2.6 0 0 1 5.2 0h-1.6a1 1 0 0 0-2 0Z')]],
    ['baby', 'Baby', 'Menschen & Gesellschaft', [n(C(12, 7.5, 5)), n(ELL(12, 18.5, 6.5, 4)), a(C(12, 13.5, 1.6))]],
    ['paar', 'Paar', 'Menschen & Gesellschaft', [n(PERSON(8, 13, 1)), a(PERSON(16, 13, 1))]],
    ['schulkind', 'Schulkind', 'Menschen & Gesellschaft', [n(PERSON(10, 13.5, 1.05)), a(R(15.5, 9, 6, 9, 1.5)), n(R(17, 7.5, 3, 2, .8))]],
    ['gemeinschaft', 'Gemeinschaft', 'Menschen & Gesellschaft', [n([0, 60, 120, 180, 240, 300].map(d => C(...pt(12, 12, 8.4, d - 90), 2.4)).join('')), a(C(12, 12, 3.4))]],
    ['ausgrenzung', 'Ausgrenzung', 'Menschen & Gesellschaft', [n(RING(9, 12, 7.5, 1.6)), n(DOTS([[6.5, 10], [11, 9], [9, 14.5]], 1.6)), a(C(20, 12, 2.4))]],
    ['ehrenamt', 'Ehrenamt', 'Menschen & Gesellschaft', [n('M2 13l3.5-1.5c1.5-.6 3.2-.4 4.4.6L12 14H8v1.5h5.6l5-2a1.6 1.6 0 0 1 1.2 3L13 19.5a4 4 0 0 1-2.8 0L2 17Z'), a(HEART(13, 4.2, .5))]],
    ['spenden', 'Spenden', 'Menschen & Gesellschaft', [n(R(4, 11, 16, 11, 1.5) + R(8.5, 13, 7, 1.6, .8)), a(HEART(12, 4.5, .55))]],
    ['gleichberechtigung', 'Gleichberechtigung', 'Menschen & Gesellschaft', [n(PERSON(5, 13, .8)), n(PERSON(19, 13, .8)), a(R(9.5, 9.5, 5, 1.8, .9)), a(R(9.5, 13, 5, 1.8, .9))]],
    ['generationen', 'Generationen', 'Menschen & Gesellschaft', [n(PERSON(5, 13, .95)), n(PERSON(12, 15, .7)), a(PERSON(18.5, 16.8, .5))]],
    ['vielfalt', 'Vielfalt', 'Menschen & Gesellschaft', [n(PERSON(4.2, 15, .65)), a(PERSON(9.8, 13, .9)), n(PERSON(15.4, 16, .55)), n(PERSON(20, 14, .75))]],
    ['nachbarschaft', 'Nachbarschaft', 'Menschen & Gesellschaft', [n('M1 13l5-4.5 5 4.5v9H1Z'), n('M13 13l5-4.5 5 4.5v9H13Z'), a(HEART(12, 2.5, .38))]],
    ['zuhoeren', 'Zuhören', 'Menschen & Gesellschaft', [n('M15 9a6 6 0 0 0-12 0c0 3 2 4 2 6.5S6.5 22 10 22a3 3 0 0 0 3-3h-2a1 1 0 0 1-1 1c-1.5 0-2.5-1.7-2.5-4.5S5 12 5 9a4 4 0 0 1 8 0Z'), a(ARC(15, 9, 5, 1.4, -50, 50)), a(ARC(15, 9, 8.2, 1.4, -45, 45))]],
    ['einzelne', 'Einzelne Person', 'Menschen & Gesellschaft', [a(PERSON(12, 13, 1.25))]],
    // ── Bildung & Wissen
    ['tafel', 'Tafel', 'Bildung & Wissen', [n(R(2, 3, 20, 14, 1) + R(4, 5, 16, 10)), n(R(11, 17, 2, 4)), a(LINE(6, 12.5, 10, 8, 1.4)), a(LINE(10, 8, 13, 11, 1.4)), a(LINE(13, 11, 18, 7, 1.4))]],
    ['stift', 'Stift', 'Bildung & Wissen', [n('M15.5 4.5l4 4L8.5 19.5 3 21l1.5-5.5Z'), a('M15.5 4.5l1.8-1.8a1.5 1.5 0 0 1 2.1 0l1.9 1.9a1.5 1.5 0 0 1 0 2.1l-1.8 1.8Z')]],
    ['mikroskop', 'Forschung', 'Bildung & Wissen', [n(R(9, 2, 4, 9, 1)), n(LINE(11, 10, 12.5, 14, 2)), n('M16.5 12a6 6 0 0 1-7.5 8.5h11Z'), n(R(4, 20, 16, 2, 1)), a(R(6.5, 13, 6.5, 2, .6))]],
    ['reagenzglas', 'Wissenschaft', 'Bildung & Wissen', [n('M8 2h8v1.6h-1.2v14.4a2.8 2.8 0 0 1-5.6 0V3.6H8Z'), a('M9.2 12h5.6v6a2.8 2.8 0 0 1-5.6 0Z')]],
    ['gehirn', 'Denken', 'Bildung & Wissen', [n('M11.6 4a3.4 3.4 0 0 0-6 1.5 3.6 3.6 0 0 0-2.4 5.6A3.6 3.6 0 0 0 4.6 17.2a3.6 3.6 0 0 0 7 2.3Z'), a('M12.4 4a3.4 3.4 0 0 1 6 1.5 3.6 3.6 0 0 1 2.4 5.6 3.6 3.6 0 0 1-1.4 6.1 3.6 3.6 0 0 1-7 2.3Z')]],
    ['bibliothek', 'Bibliothek', 'Bildung & Wissen', [n(R(3, 4, 3, 15)), a(R(7, 6, 3, 13)), n(R(11, 3, 3, 16)), n('M15 6.5l2.8-.8 3.6 12.8-2.8.8Z'), n(R(2, 19.5, 20, 2))]],
    ['abschluss', 'Abschluss', 'Bildung & Wissen', [n(R(2, 3, 20, 14, 1) + R(5, 6, 14, 1.6, .8) + R(5, 9.5, 9, 1.6, .8)), a(C(17, 15, 3.2)), a(POLY(15, 17, 14, 22.5, 17, 20.8, 20, 22.5, 19, 17))]],
    ['brille', 'Brille', 'Bildung & Wissen', [n(RING(6.5, 13, 4, 1.6)), n(RING(17.5, 13, 4, 1.6)), n(R(10, 12, 4, 1.6)), n(LINE(2.6, 12, 1.2, 8, 1.4)), n(LINE(21.4, 12, 22.8, 8, 1.4)), a(C(6.5, 13, 1.5)), a(C(17.5, 13, 1.5))]],
    ['lineal', 'Messen', 'Bildung & Wissen', [n(R(2, 8, 20, 8, 1) + R(4.5, 9.5, 1.2, 3.5) + R(7.5, 9.5, 1.2, 2.2) + R(10.5, 9.5, 1.2, 3.5) + R(13.5, 9.5, 1.2, 2.2) + R(16.5, 9.5, 1.2, 3.5) + R(19.5, 9.5, 1.2, 2.2))]],
    ['bausteine', 'Frühe Bildung', 'Bildung & Wissen', [n(R(2, 12, 9, 9, 1.2)), a(R(13, 12, 9, 9, 1.2)), n(R(7.5, 2.5, 9, 9, 1.2))]],
    ['globus', 'Globus', 'Bildung & Wissen', [n(RING(12, 10, 7, 1.8)), a(C(12, 10, 4.6)), n(ARC(12, 10, 9.4, 1.4, 20, 160)), n(R(11.2, 19, 1.6, 2)), n(R(8, 21, 8, 1.6, .8))]],
    ['notizbuch', 'Notizen', 'Bildung & Wissen', [n(R(5, 2, 15, 20, 1.5) + R(9, 7, 8, 1.4, .7) + R(9, 10.5, 8, 1.4, .7) + R(9, 14, 5, 1.4, .7)), a(DOTS([[5, 5.5], [5, 10], [5, 14.5], [5, 19]], 1.4))]],
    ['vortrag', 'Vortrag', 'Bildung & Wissen', [n(R(8, 2, 14, 10, 1) + R(10, 4, 10, 6)), a(R(11.5, 5.5, 5, 1.4, .7)), n(PERSON(5, 15, .85)), n(LINE(7.5, 11, 10, 8, 1.2))]],
    // ── Gesundheit & Pflege
    ['impfung', 'Impfung', 'Gesundheit & Pflege', [n('M14.5 3.5l6 6-1.4 1.4-1-1-7.6 7.6-3.6-.6-.6-3.6 7.6-7.6-1-1Z'), n(LINE(6.5, 17.5, 3, 21, 1.6)), a(LINE(10, 11, 12.5, 13.5, 1.4))]],
    ['tablette', 'Medikamente', 'Gesundheit & Pflege', [n('M4.2 13.2l9-9a4.4 4.4 0 0 1 6.6 6.6l-9 9a4.4 4.4 0 0 1-6.6-6.6Z'), a('M8.7 8.7l6.6 6.6-4.5 4.5a4.4 4.4 0 0 1-6.6-6.6Z')]],
    ['stethoskop', 'Arztbesuch', 'Gesundheit & Pflege', [n(ARC(9, 8, 5, 1.6, 0, 180)), n(R(3.2, 2.5, 1.6, 5.5, .8)), n(R(13.2, 2.5, 1.6, 5.5, .8)), n(R(8.2, 12.5, 1.6, 4, .8)), n(ARC(13.6, 16, 4.6, 1.6, 0, 180)), n(R(17.4, 12, 1.6, 4, .8)), a(RING(18.2, 10.5, 2.6, 1.4))]],
    ['rettungswagen', 'Rettungswagen', 'Gesundheit & Pflege', [n('M2 7h12v4h4l4 4v4H2Z'), n(C(6, 19, 2)), n(C(17, 19, 2)), a('M7 8.5h2v2h2v2H9v2H7v-2H5v-2h2Z')]],
    ['herzschlag', 'Herzschlag', 'Gesundheit & Pflege', [n(LINE(1, 13, 6, 13, 1.8)), a(LINE(6, 13, 8.5, 6, 1.8)), a(LINE(8.5, 6, 11.5, 19, 1.8)), a(LINE(11.5, 19, 14, 10, 1.8)), a(LINE(14, 10, 15.5, 13, 1.8)), n(LINE(15.5, 13, 23, 13, 1.8))]],
    ['pflege', 'Pflege', 'Gesundheit & Pflege', [n(PERSON(7, 14, 1)), n('M12 22v-3a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v3Z'), n(C(17, 10.5, 2.6)), a(HEART(12, 1.6, .4))]],
    ['mundschutz', 'Mundschutz', 'Gesundheit & Pflege', [n('M5 8c3-1.5 11-1.5 14 0v6a7 4 0 0 1-14 0Z' + R(8, 10, 8, 1.2, .6) + R(8, 12.6, 8, 1.2, .6)), a(LINE(5, 9, 1.5, 7, 1.2)), a(LINE(19, 9, 22.5, 7, 1.2)), a(LINE(6, 15, 1.5, 16.5, 1.2)), a(LINE(18, 15, 22.5, 16.5, 1.2))]],
    ['pflaster', 'Pflaster', 'Gesundheit & Pflege', [n('M4.2 13.2l9-9a4.4 4.4 0 0 1 6.6 6.6l-9 9a4.4 4.4 0 0 1-6.6-6.6Z'), a(R(9, 9, 6, 6, 1))]],
    ['apotheke', 'Apotheke', 'Gesundheit & Pflege', [n(R(6, 7, 12, 15, 2)), n(R(5, 2.5, 14, 4, 1)), a(R(6, 11, 12, 7)), n('M11 12.5h2v2h2v2h-2v2h-2v-2H9v-2h2Z')]],
    ['krankenbett', 'Krankenhausbett', 'Gesundheit & Pflege', [n(R(2, 13, 20, 3)), n(R(2, 7, 2, 15, .5)), n(R(20, 10, 2, 12, .5)), a(R(5, 10, 5, 3, 1.5)), n(R(10.5, 10.5, 9.5, 2.5, 1))]],
    ['zahn', 'Zahngesundheit', 'Gesundheit & Pflege', [n('M7 3c2 0 3 1 5 1s3-1 5-1c3 0 4.5 2.5 4 6-.5 3-1.5 4-2 7-.4 3-1 5-2.5 5S14 17 12 17s-1.5 4-3.5 4S6.4 19 6 16c-.5-3-1.5-4-2-7-.5-3.5 1-6 3-6Z'), a(ELL(8.5, 7.5, 1.5, 1))]],
    ['psyche', 'Psychische Gesundheit', 'Gesundheit & Pflege', [n('M10 2a8 8 0 0 0-5 14.2V22h8v-3h2a3 3 0 0 0 3-3v-2l2-1-2-3.5A8 8 0 0 0 10 2Z'), a(HEART(10, 7.4, .36))]],
    ['blutspende', 'Blutspende', 'Gesundheit & Pflege', [a('M12 2s7 7.6 7 12.5A7 7 0 0 1 5 14.5C5 9.6 12 2 12 2Z'), n('M11 11h2v2.5h2.5v2H13V18h-2v-2.5H8.5v-2H11Z')]],
    ['rollator', 'Mobilität im Alter', 'Gesundheit & Pflege', [n(LINE(7, 4, 4, 21, 1.6)), n(LINE(17, 4, 20, 21, 1.6)), n(R(7, 3, 10, 2, 1)), n(R(5.5, 11, 13, 1.6)), a(C(4, 20.5, 1.8)), a(C(20, 20.5, 1.8))]],
    // ── Umwelt & Klima
    ['gletscher', 'Gletscherschmelze', 'Umwelt & Klima', [n('M6 12l3-7 3 2 2-3 4 8Z'), a('M2 13h20l-3 9H5Z'), n(DOTS([[8, 16], [12, 17.5], [16, 16]], .9))]],
    ['waldbrand', 'Waldbrand', 'Umwelt & Klima', [n('M7 22v-4H3l4-6H5l4-6 4 6h-2l4 6h-4v4Z'), a('M17.5 22c-2.6 0-4-1.6-4-3.8 0-2.3 1.6-3.4 2.2-5.4.9.8 1.2 1.7 1.2 2.6.8-.6 1.3-2 1.2-4.3 2 1.5 3.4 3.9 3.4 7 0 2.2-1.6 3.9-4 3.9Z')]],
    ['duerre', 'Dürre', 'Umwelt & Klima', [n(R(2, 13, 20, 9, 1) + POLY(5, 13, 7, 17, 6, 22, 7.5, 22, 8.6, 17, 7, 13) + POLY(14, 13, 15.2, 16, 13, 19, 14, 19.6, 16.6, 16, 15.8, 13)), a(C(17, 6, 3.5))]],
    ['hochwasser', 'Hochwasser', 'Umwelt & Klima', [n('M12 2.5l9 7.5h-2.5v5h-13v-5H3Z'), a(WAVE(15.5, 1, 2.6)), a(WAVE(20, 1, 2.4))]],
    ['muell', 'Müll', 'Umwelt & Klima', [n(R(5, 7, 14, 15, 1.5) + R(8, 10, 1.6, 9, .8) + R(11.2, 10, 1.6, 9, .8) + R(14.4, 10, 1.6, 9, .8)), a(R(3, 4, 18, 2.6, 1)), n(R(9, 2, 6, 2.4, .8))]],
    ['recycling', 'Recycling', 'Umwelt & Klima', [a(ARC(12, 12, 9.5, 2.4, -75, 10)), a(HEAD(12, 12, 8.3, 10, 2.6)), n(ARC(12, 12, 9.5, 2.4, 45, 130)), n(HEAD(12, 12, 8.3, 130, 2.6)), a(ARC(12, 12, 9.5, 2.4, 165, 250)), a(HEAD(12, 12, 8.3, 250, 2.6))]],
    ['plastik', 'Plastik', 'Umwelt & Klima', [n('M10 2h4v3l2 3v14H8V8l2-3Z'), a(R(8, 12, 8, 5)), a(LINE(3, 21, 21, 3, 1.6))]],
    ['biene', 'Insekten', 'Umwelt & Klima', [n(ELL(12, 14, 5, 6.5) + R(7, 12, 10, 1.6) + R(7, 15.5, 10, 1.6)), a(ELL(7.5, 7, 3.5, 2.3)), a(ELL(16.5, 7, 3.5, 2.3)), n(C(12, 6.5, 2))]],
    ['berge', 'Berge', 'Umwelt & Klima', [n('M1 21l8-14 5 8 3-4 6 10Z'), a('M9 7l2.4 4.2-1.4-.8-1 1.2-1-1.2-1.4.8Z')]],
    ['abgase', 'Abgase', 'Umwelt & Klima', [n(CAR(5, 11, .9)), a(C(3.5, 9, 2.2)), a(C(2.5, 4.5, 1.6)), a(C(6.5, 5.5, 1.8))]],
    ['blume', 'Blume', 'Umwelt & Klima', [n(R(11.2, 11, 1.6, 11)), n(LEAF(12, 18, 6.5, 14, 2)), n(DOTS([[12, 3.4], [15.6, 7], [12, 10.6], [8.4, 7]], 2.5)), a(C(12, 7, 2.2))]],
    ['wald', 'Wald', 'Umwelt & Klima', [n('M6 22v-3H2l4-6H4l4-6 4 6h-2l4 6H8v3Z'), a('M16.5 22v-3h-4l4-6h-2l4-7 4 7h-2l4 6h-4v3Z')]],
    ['klimastreik', 'Klimastreik', 'Umwelt & Klima', [n(R(3, 3, 18, 11, 1.5)), n(R(11.2, 13, 1.6, 9)), a(C(12, 8.5, 3.6)), a(R(11.3, 9, 1.4, 4.6))]],
    ['co2', 'CO₂-Ausstoß', 'Umwelt & Klima', [n('M6.5 19a4.5 4.5 0 0 1-.4-9A6.5 6.5 0 0 1 18.6 9 5 5 0 0 1 18 19Z' + RING(9, 14, 2.2, 1) + RING(14, 14, 2.2, 1)), a(R(17.8, 15, 2, 1.2, .3))]],
    ['erde-warm', 'Erderwärmung', 'Umwelt & Klima', [n(C(10, 12, 8.5)), a('M5.6 6c1.4.4 2 1.6 1.4 2.8-.6 1.1-2 1.1-2.2 2.5-.2 1.3 1.2 1.8 1 3.2a7 7 0 0 1-.2-8.5Z'), a(R(19, 2, 2.4, 13, 1.2) + C(20.2, 17, 2.8))]],
    // ── Energie
    ['strommast', 'Stromnetz', 'Energie', [n(POLY(10.5, 2, 13.5, 2, 17, 22, 15, 22, 12, 8, 9, 22, 7, 22)), n(R(5, 6, 14, 1.6)), n(R(7, 11, 10, 1.6)), a(C(5, 8.6, 1.1)), a(C(19, 8.6, 1.1))]],
    ['kraftwerk', 'Kraftwerk', 'Energie', [n('M4 22c1.5-5 1.5-10 0-14h8c-1.5 4-1.5 9 0 14Z'), n(R(14, 12, 7, 10)), n(R(16, 6, 2, 6)), a(C(8, 5, 2.4)), a(C(11.5, 3, 1.8))]],
    ['oel', 'Öl', 'Energie', [n(R(5, 3, 14, 19, 2) + R(5, 8, 14, 1.4) + R(5, 16, 14, 1.4)), a('M12 10s2 2.4 2 3.6a2 2 0 0 1-4 0c0-1.2 2-3.6 2-3.6Z')]],
    ['gas', 'Gas', 'Energie', [n(R(4, 18, 16, 4, 1)), a('M12 3c3 3 5 5.5 5 8.5a5 5 0 0 1-10 0c0-3 2-5.5 5-8.5Z' + 'M12 9.5c1.2 1.2 2 2.2 2 3.2a2 2 0 0 1-4 0c0-1 .8-2 2-3.2Z')]],
    ['tankstelle', 'Tankstelle', 'Energie', [n(R(3, 3, 11, 19, 1.5) + R(5, 5, 7, 5, .5)), n('M14 8h2a3 3 0 0 1 3 3v6a1 1 0 0 0 2 0V9l-2.5-2.5 1.2-1.2 3 3V17a3 3 0 0 1-6 0v-6a1 1 0 0 0-1-1H14Z'), a(R(2, 20, 13, 2, .6))]],
    ['steckdose', 'Steckdose', 'Energie', [n(C(12, 12, 10) + C(12, 12, 6.6)), a(C(9.5, 12, 1.3)), a(C(14.5, 12, 1.3))]],
    ['speicher', 'Speicher', 'Energie', [n(R(6, 4, 12, 18, 2) + R(8, 6, 8, 14)), n(R(9.5, 2, 5, 2.4, .6)), a(R(9, 13, 6, 6)), a(R(9, 9.5, 6, 2.5))]],
    ['kohle', 'Kohle', 'Energie', [n('M3 21l3-7 4 2 3-5 4 3 4-2 1 9Z'), a(R(2, 20, 20, 2, .6))]],
    ['e-auto', 'E-Auto', 'Energie', [n(CARP), a('M13 1.5l-4 5h3l-1 4 4-5h-3Z')]],
    ['waermepumpe', 'Wärmepumpe', 'Energie', [n(R(2, 5, 20, 15, 1.5) + C(9, 12.5, 5)), a(SEC(9, 12.5, 0, 3.6, -90, 0) + SEC(9, 12.5, 0, 3.6, 90, 180)), n(R(16, 8, 4, 1.4, .7) + R(16, 11, 4, 1.4, .7)), a(R(16, 14, 4, 1.4, .7))]],
    ['energiesparen', 'Energie sparen', 'Energie', [a('M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2Z'), n(R(8, 18, 8, 1.8, .9)), n(R(9, 20.4, 6, 1.8, .9)), n(LEAF(12, 13, 12, 5, 2))]],
    // ── Verkehr
    ['strassenbahn', 'Straßenbahn', 'Verkehr', [n(R(5, 5, 14, 15, 3) + R(7, 8, 10, 5, .6)), n(R(11.2, 1.5, 1.6, 3.5)), n(R(8, 1.5, 8, 1.4)), a(C(9, 16.5, 1.2)), a(C(15, 16.5, 1.2)), n(LINE(8, 20, 6, 23, 1.4)), n(LINE(16, 20, 18, 23, 1.4))]],
    ['schiff', 'Schiff', 'Verkehr', [n('M1 15h22l-3 5H4Z'), n(R(6, 9, 10, 6) + R(8, 11, 2, 2) + R(12, 11, 2, 2)), a(R(13, 5, 3, 4))]],
    ['lkw', 'Lkw', 'Verkehr', [n(R(1, 6, 13, 11, 1)), n('M14 9h4l4 4v4h-8Z'), n(C(5, 19, 2)), n(C(17, 19, 2)), a(R(3, 8.5, 9, 3))]],
    ['zu-fuss', 'Zu Fuß', 'Verkehr', [n(C(13, 3.5, 2.2)), n('M11 7.5h3l2.2 4.6 3 1.2-.7 1.8-3.8-1.6-.6-1.3-1 3.6 2.6 2.8V22h-2v-3l-2.5-2.5L9.8 22H7.6l2.6-8.4-1 .5-.8 2.8H6.4l1.3-4.3Z')]],
    ['fahrkarte', 'Fahrkarte', 'Verkehr', [n('M2 7h20v3.5a1.5 1.5 0 0 0 0 3V17H2v-3.5a1.5 1.5 0 0 0 0-3Z' + R(15, 8.5, 1, 1.6) + R(15, 11.2, 1, 1.6) + R(15, 13.9, 1, 1.6)), a(R(5, 10, 7, 1.6, .8)), a(R(5, 13, 5, 1.6, .8))]],
    ['stau', 'Stau', 'Verkehr', [n(CAR(.5, 13, .55)), n(CAR(8.3, 13, .55)), a(CAR(16, 13, .55)), a(R(10, 4, 4, 5, .5)), n(R(11.2, 9, 1.6, 2.5))]],
    ['autobahn', 'Autobahn', 'Verkehr', [n('M9 2h2l-2 20H2Z'), n('M13 2h2l7 20h-7Z'), a(R(11.4, 4, 1.2, 3)), a(R(11.3, 10, 1.4, 3.6)), a(R(11.2, 17, 1.6, 5))]],
    ['e-roller', 'E-Roller', 'Verkehr', [n(RING(5, 19, 2.6, 1.2)), n(RING(19, 19, 2.6, 1.2)), n(R(5, 18.2, 12, 1.6)), n(LINE(17, 19, 15, 4, 1.6)), a(R(12, 3, 6, 1.8, .9))]],
    ['haltestelle', 'Haltestelle', 'Verkehr', [n(R(11.2, 12, 1.6, 10)), n(C(12, 7.5, 5.5) + R(9.5, 4.5, 1.4, 6) + R(13.1, 4.5, 1.4, 6) + R(10.9, 6.8, 2.2, 1.4)), a(R(8, 20.5, 8, 1.6, .8))]],
    ['bahnhof', 'Bahnhof', 'Verkehr', [n('M2 10l10-6 10 6v12H2Z' + R(5, 13, 4, 9) + R(15, 13, 4, 9)), a(RING(12, 11, 2.4, 1)), a(R(10, 16, 4, 6))]],
    ['flughafen', 'Flughafen', 'Verkehr', [n(R(2, 18, 20, 4, 1)), n(R(4, 12, 6, 6)), n(R(6, 6, 2, 6)), n(R(4, 4, 6, 2.4, .6)), a('M22 9v-1.2l-4.5-2.8V2.2a.9.9 0 0 0-1.8 0V5l-4.5 2.8V9l4.5-1.4v2.6l-1.2 1v.9l2.1-.6 2.1.6v-.9l-1.2-1V7.6Z')]],
    ['radweg', 'Radweg', 'Verkehr', [n(RING(6, 15, 4, 1.5)), n(RING(18, 15, 4, 1.5)), n(LINE(6, 15, 10.5, 8, 1.5)), n(LINE(10.5, 8, 16, 8, 1.5)), n(LINE(16, 8, 18, 15, 1.5)), n(LINE(10.5, 8, 12, 15, 1.5)), a(R(1, 21, 22, 1.6, .8))]],
    // ── Essen & Landwirtschaft
    ['traktor', 'Landwirtschaft', 'Essen & Landwirtschaft', [n(R(3, 8, 9, 6, .6)), n('M11 10h6l2.5 4v2H11Z'), a(RING(7, 17, 4, 1.8)), n(C(18.5, 18.5, 2.5)), n(R(14, 5, 1.6, 5))]],
    ['getreide', 'Getreide', 'Essen & Landwirtschaft', [n(R(11.2, 8, 1.6, 14)), a(LEAF(12, 9, 12, 2, 1.6)), a(LEAF(11.6, 12.5, 7, 8.5, 1.6)), a(LEAF(12.4, 12.5, 17, 8.5, 1.6)), a(LEAF(11.6, 16.5, 7, 12.5, 1.6)), a(LEAF(12.4, 16.5, 17, 12.5, 1.6))]],
    ['apfel', 'Obst', 'Essen & Landwirtschaft', [n('M12 7c2-1.5 6-1.6 7.5 1.5 1.5 3.3.3 8.3-2 11-1.4 1.6-2.6 2-3.5 1.6-.9-.4-1.1-.4-2 0-.9.4-2.1 0-3.5-1.6-2.3-2.7-3.5-7.7-2-11C6 5.4 10 5.5 12 7Z'), n(R(11.3, 2, 1.4, 5, .7)), a(LEAF(12.6, 5, 17.5, 2, 1.4))]],
    ['fisch', 'Fisch', 'Essen & Landwirtschaft', [n('M2 12c3-5 10-6 14-2l4-3v10l-4-3c-4 4-11 3-14-2Z'), a(C(6.5, 11, 1.1))]],
    ['kochtopf', 'Kochen', 'Essen & Landwirtschaft', [n(R(4, 10, 16, 10, 2)), n(R(2, 10, 20, 2, 1)), n(R(10, 7.5, 4, 2, .6)), a('M8 2.5c1 1 1 2 0 3H6.6c1-1 1-2 0-3Z'), a('M13 2.5c1 1 1 2 0 3h-1.4c1-1 1-2 0-3Z'), a('M18 2.5c1 1 1 2 0 3h-1.4c1-1 1-2 0-3Z')]],
    ['besteck', 'Mahlzeit', 'Essen & Landwirtschaft', [n(R(5.2, 10, 1.6, 12, .8)), n('M3 2h1.4v5h1.2V2h1.4v5h1.2V2H9.6v6a2.6 2.6 0 0 1-2.6 2.6H5.6A2.6 2.6 0 0 1 3 8Z'), a('M17 2c2.5 0 3.5 3 3.5 6.5S19 12 18 12v10h-2V2.2Z')]],
    ['giesskanne', 'Gießkanne', 'Essen & Landwirtschaft', [n('M5 9h10v11H5Z'), n(LINE(15, 12, 21, 7, 1.6)), n('M5 11a3 3 0 0 0 0 6v-1.6a1.4 1.4 0 0 1 0-2.8Z'), a(DOTS([[21.5, 5.5], [22.5, 9], [19.6, 9.6]], .9))]],
    ['acker', 'Acker', 'Essen & Landwirtschaft', [n(POLY(1, 22, 8, 11, 10, 11, 5, 22)), n(POLY(8, 22, 11, 11, 13, 11, 12, 22)), n(POLY(15, 22, 14.5, 11, 16.5, 11, 21.5, 22)), a(C(17.5, 5, 3))]],
    ['lebensmittelspende', 'Lebensmittelspende', 'Essen & Landwirtschaft', [a(C(8, 8, 3)), a(C(15, 7, 3.5)), n(R(3, 11, 18, 11, 1.5) + R(8.5, 14, 7, 1.6, .8))]],
    ['brot-laib', 'Brot', 'Essen & Landwirtschaft', [n('M3 14c0-5 4-8 9-8s9 3 9 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), a(LINE(7, 12, 9, 9, 1.4)), a(LINE(11, 12, 13, 9, 1.4)), a(LINE(15, 12, 17, 9, 1.4))]],
    ['kuh', 'Tierhaltung', 'Essen & Landwirtschaft', [n('M4 8h14a3 3 0 0 1 3 3v2h1v3h-3v5h-2v-4H8v4H6v-5.2A3 3 0 0 1 4 13Z'), n(POLY(18, 8, 19, 5, 20.4, 8)), a(R(8, 10, 4, 3, 1))]],
    // ── Natur & Tiere
    ['tanne', 'Tanne', 'Natur & Tiere', [n('M12 2l6 8h-3l5 7h-6v5h-4v-5H4l5-7H6Z'), a(R(10.6, 17, 2.8, 5))]],
    ['mond', 'Nacht', 'Natur & Tiere', [n('M15 2a10 10 0 1 0 7 17 8.5 8.5 0 0 1-7-17Z'), a(STAR(18, 7, 2.4, .9, 4))]],
    ['vogel', 'Vogel', 'Natur & Tiere', [n('M3 10c3 0 5 1 6.5 3C11 9 14 6.5 18 6l1.5-2 1 3 3 1-3 1.5c0 5-3.5 9-9 9.5L8 22l-1-3c-2.5-1.5-3.5-5-4-9Z'), a(C(18.6, 8, .9))]],
    ['hund', 'Hund', 'Natur & Tiere', [n('M4 9l2-5 3 3h6l3-3 2 5v5a8 8 0 0 1-16 0Z' + C(9, 12, 1.2) + C(15, 12, 1.2)), a(ELL(12, 16, 2, 1.4))]],
    ['katze', 'Katze', 'Natur & Tiere', [n('M4 3l4 4h8l4-4v9a8 8 0 0 1-16 0Z' + C(9, 12, 1.2) + C(15, 12, 1.2)), a(TRI(10.8, 15, 13.2, 15, 12, 16.6))]],
    ['pfote', 'Tierschutz', 'Natur & Tiere', [n(ELL(12, 16, 5, 4.2)), a(ELL(5, 10, 2, 2.6)), a(ELL(9.5, 5.6, 2, 2.6)), a(ELL(14.5, 5.6, 2, 2.6)), a(ELL(19, 10, 2, 2.6))]],
    ['schmetterling', 'Schmetterling', 'Natur & Tiere', [a('M11 11C9 5 4 2 2.5 4S3 11 11 12Z'), a('M13 11c2-6 7-9 8.5-7S21 11 13 12Z'), n('M11 13c-6 0-8 3-6.5 5.5S10 18 11 14Z'), n('M13 13c6 0 8 3 6.5 5.5S14 18 13 14Z'), n(ELL(12, 12, 1.2, 7))]],
    ['blatt-herbst', 'Laub', 'Natur & Tiere', [a(LEAF(4, 20, 20, 4, 6)), n(LINE(4, 20, 17, 7, 1.2))]],
    ['welle', 'Welle', 'Natur & Tiere', [n('M2 18c4 0 5-12 12-12 4 0 6 3 6 6-2-2-5-1.5-5 1.5 0 2 2 4.5 7 4.5v4H2Z'), a(R(2, 20, 20, 2, .6))]],
    ['pilz', 'Pilz', 'Natur & Tiere', [a('M2 12a10 9 0 0 1 20 0Z'), n('M9 12h6v8a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z'), n(DOTS([[7, 8.5], [12, 6], [17, 8.5]], 1.2))]],
    ['regentropfen', 'Regen', 'Natur & Tiere', [n('M6.5 13a4.5 4.5 0 0 1-.4-9A6.5 6.5 0 0 1 18.6 3 5 5 0 0 1 18 13Z'), a(DOTS([[8, 17], [12, 19.5], [16, 17], [10, 22], [14, 22]], 1))]],
    // ── Alltag & Dinge
    ['regenschirm', 'Regenschirm', 'Alltag & Dinge', [a('M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2Z'), n('M11.2 12h1.6v7a3 3 0 0 1-6 0h1.6a1.4 1.4 0 0 0 2.8 0Z')]],
    ['schere', 'Schere', 'Alltag & Dinge', [n(RING(6, 18, 3, 1.6)), n(RING(18, 18, 3, 1.6)), n(LINE(7.5, 15.5, 17, 3, 1.8)), a(LINE(16.5, 15.5, 7, 3, 1.8))]],
    ['pinnadel', 'Pinnnadel', 'Alltag & Dinge', [a(C(12, 7, 4.5)), n(R(11.2, 10, 1.6, 12, .8)), n(R(8, 10, 8, 2, 1))]],
    ['geschenk', 'Geschenk', 'Alltag & Dinge', [n(R(3, 9, 18, 4)), n(R(4, 13, 16, 9)), a(R(10.8, 9, 2.4, 13)), a('M12 9C10 5 6 4 6 6.5S10 9 12 9Zm0 0c2-4 6-5 6-2.5S14 9 12 9Z')]],
    ['kleidung', 'Kleidung', 'Alltag & Dinge', [n('M8 3l4 2 4-2 6 4-2.5 4L17 9.5V21H7V9.5L4.5 11 2 7Z'), a(R(7, 13, 10, 2))]],
    ['pokal', 'Pokal', 'Alltag & Dinge', [n('M6 3h12v5a6 6 0 0 1-12 0Z'), n(ARC(6, 7.5, 3.5, 1.4, 90, 270)), n(ARC(18, 7.5, 3.5, 1.4, -90, 90)), n(R(11, 13, 2, 5)), a(R(7, 18.5, 10, 3, 1))]],
    ['bild', 'Bild', 'Alltag & Dinge', [n(R(2, 4, 20, 16, 1) + R(4, 6, 16, 12)), a('M5 17l4.5-5 3 3 2-2 4.5 4Z'), a(C(16, 9.5, 1.6))]],
    ['musik', 'Musik', 'Alltag & Dinge', [n(R(8, 4, 1.8, 13)), n(R(18, 2, 1.8, 13)), a('M9.8 4L19.8 2v3.4L9.8 7.4Z'), n(ELL(6.6, 17.5, 3, 2.4)), n(ELL(16.6, 15.5, 3, 2.4))]],
    ['wuerfel', 'Zufall', 'Alltag & Dinge', [n(R(3, 3, 18, 18, 3.5) + C(8, 8, 1.6) + C(16, 16, 1.6) + C(16, 8, 1.6) + C(8, 16, 1.6)), a(C(12, 12, 1.8))]],
    ['waschmaschine', 'Haushalt', 'Alltag & Dinge', [n(R(4, 2, 16, 20, 2) + C(12, 13, 5) + R(6, 4.5, 3, 1.6, .8) + C(16, 5.3, 1)), a(C(12, 13, 3))]],
    ['sanduhr', 'Sanduhr', 'Alltag & Dinge', [n(R(5, 2, 14, 2, .8)), n(R(5, 20, 14, 2, .8)), n('M7 4h10c0 4-3 6-4 8 1 2 4 4 4 8H7c0-4 3-6 4-8-1-2-4-4-4-8Z'), a(TRI(9, 19, 15, 19, 12, 15.5)), a(TRI(9.6, 6, 14.4, 6, 12, 9))]],
    ['wecker', 'Wecker', 'Alltag & Dinge', [n(RING(12, 13, 8, 1.8)), n(R(11.1, 8.5, 1.8, 5, .9)), n(LINE(12, 13, 15, 15, 1.8)), a(C(4.5, 4.5, 2.6)), a(C(19.5, 4.5, 2.6))]],
    ['einkaufszettel', 'Einkaufszettel', 'Alltag & Dinge', [n(DOC(R(10, 6, 7, 1.4, .7) + R(10, 10.5, 7, 1.4, .7) + R(10, 15, 7, 1.4, .7))), a(R(7, 5.6, 2, 2, .4)), a(R(7, 10.1, 2, 2, .4)), a(R(7, 14.6, 2, 2, .4))]],
    // ── Zeit & Orte
    ['stoppuhr', 'Stoppuhr', 'Zeit & Orte', [n(RING(12, 14, 8, 1.8)), n(R(10, 2, 4, 2, .6)), n(R(11.2, 3.5, 1.6, 3)), a(SEC(12, 14, 0, 5.6, -90, 30))]],
    ['kompass', 'Kompass', 'Zeit & Orte', [n(RING(12, 12, 10, 1.8)), a(POLY(12, 4.5, 14.2, 12, 9.8, 12)), n(POLY(9.8, 12, 14.2, 12, 12, 19.5))]],
    ['zielflagge', 'Ziel', 'Zeit & Orte', [n(R(4, 2, 1.8, 20, .9)), n('M5.8 3h15v10h-15Z' + R(5.8, 3, 3.75, 2.5) + R(13.3, 3, 3.75, 2.5) + R(9.55, 5.5, 3.75, 2.5) + R(17.05, 5.5, 3.75, 2.5) + R(5.8, 8, 3.75, 2.5) + R(13.3, 8, 3.75, 2.5) + R(9.55, 10.5, 3.75, 2.5) + R(17.05, 10.5, 3.75, 2.5))]],
    ['wegweiser', 'Wegweiser', 'Zeit & Orte', [n(R(11, 2, 2, 20)), a('M4 4h12l3 2.5-3 2.5H4Z'), n('M20 11H8l-3 2.5 3 2.5h12Z'), n(R(8, 20.5, 8, 1.6, .8))]],
    ['route', 'Route', 'Zeit & Orte', [n(C(5, 18, 2.6)), a(PIN(19, 6, 3)), a(PIN2(19, 6, 3)), n(DOTS([[8.5, 17], [11.5, 15.5], [13, 12.5], [15, 10.5]], .9))]],
    ['weltkarte', 'Weltweit', 'Zeit & Orte', [n(C(12, 12, 10) + ELL(12, 12, 4.4, 10) + R(2, 11.2, 20, 1.6) + R(3.5, 6.4, 17, 1.4) + R(3.5, 16.2, 17, 1.4)), a(C(17, 6, 2.6))]],
    ['zeitstrahl-sym', 'Zeitleiste', 'Zeit & Orte', [n(R(1, 11.2, 22, 1.6)), n(C(5, 12, 2.2)), a(C(12, 12, 2.8)), n(C(19, 12, 2.2)), n(R(4.3, 4, 1.4, 4, .7)), n(R(18.3, 16, 1.4, 4, .7))]],
    ['frist', 'Frist', 'Zeit & Orte', [n(R(2, 4, 20, 18, 2) + R(4, 10, 16, 10)), n(R(6.5, 2, 2, 4, 1)), n(R(15.5, 2, 2, 4, 1)), a(LINE(8, 12, 16, 18, 1.8)), a(LINE(16, 12, 8, 18, 1.8))]],
    ['jahrestag', 'Jahrestag', 'Zeit & Orte', [n(R(2, 4, 20, 18, 2) + R(4, 10, 16, 10)), n(R(6.5, 2, 2, 4, 1)), n(R(15.5, 2, 2, 4, 1)), a(STAR(12, 15, 3.8, 1.6, 5))]],
    ['haus-ort', 'Wohnort', 'Zeit & Orte', [n('M12 2a7.5 7.5 0 0 1 7.5 7.5c0 5.6-7.5 12.5-7.5 12.5S4.5 15.1 4.5 9.5A7.5 7.5 0 0 1 12 2Z'), a('M12 5.5l4 3.4h-1.2v3.6H9.2V8.9H8Z')]],
    // ── Diagramme & Zahlen
    ['liniendiagramm', 'Liniendiagramm', 'Diagramme & Zahlen', [n(R(2, 20, 20, 1.6)), n(R(2, 3, 1.6, 18)), a(LINE(5, 16, 9, 11, 1.8)), a(LINE(9, 11, 13, 13, 1.8)), a(LINE(13, 13, 19, 5, 1.8)), a(DOTS([[9, 11], [13, 13], [19, 5]], 1.6))]],
    ['flaechendiagramm', 'Flächendiagramm', 'Diagramme & Zahlen', [n(R(2, 20, 20, 1.6)), n(R(2, 3, 1.6, 18)), a('M4 19l5-7 4 3 7-9v13Z')]],
    ['ringdiagramm', 'Ringdiagramm', 'Diagramme & Zahlen', [n(SEC(12, 12, 5.5, 10, -90, 150)), a(SEC(12, 12, 5.5, 10, 152, 268))]],
    ['saeulen-gruppiert', 'Säulen gruppiert', 'Diagramme & Zahlen', [n(R(2, 20, 20, 1.6)), n(R(3, 10, 2.6, 9)), a(R(5.8, 6, 2.6, 13)), n(R(10, 12, 2.6, 7)), a(R(12.8, 8, 2.6, 11)), n(R(17, 14, 2.6, 5)), a(R(19.8, 11, 2.6, 8))]],
    ['balken-quer', 'Balken quer', 'Diagramme & Zahlen', [n(R(2, 2, 1.6, 20)), n(R(4, 4, 10, 3.5)), a(R(4, 10, 16, 3.5)), n(R(4, 16, 7, 3.5))]],
    ['streudiagramm', 'Streudiagramm', 'Diagramme & Zahlen', [n(R(2, 20, 20, 1.6)), n(R(2, 3, 1.6, 18)), n(DOTS([[6, 15], [9, 16.5], [8, 12], [12, 11], [14, 13.5], [11, 8]], 1.2)), a(DOTS([[17, 7], [19.5, 4.5], [16.5, 10]], 1.3))]],
    ['skala', 'Skala', 'Diagramme & Zahlen', [n(ARC(12, 16, 9.5, 2.4, 180, 360)), a(ARC(12, 16, 9.5, 2.4, 180, 265)), n(LINE(12, 16, 17, 9.5, 2)), n(C(12, 16, 2))]],
    ['trichter', 'Trichter', 'Diagramme & Zahlen', [a(POLY(2, 3, 22, 3, 19.5, 8, 4.5, 8)), n(POLY(5.5, 10, 18.5, 10, 16, 15, 8, 15)), n(POLY(9, 17, 15, 17, 13.5, 21, 10.5, 21))]],
    ['pyramide', 'Pyramide', 'Diagramme & Zahlen', [a(POLY(12, 2, 15.4, 8, 8.6, 8)), n(POLY(7.5, 10, 16.5, 10, 19.4, 15, 4.6, 15)), n(POLY(3.5, 17, 20.5, 17, 22.6, 21, 1.4, 21))]],
    ['schnittmenge', 'Schnittmenge', 'Diagramme & Zahlen', [n(C(9, 12, 7) + C(15, 12, 7)), a('M12 5.7a7 7 0 0 1 0 12.6 7 7 0 0 1 0-12.6Z')]],
    ['tabelle', 'Tabelle', 'Diagramme & Zahlen', [n(R(2, 3, 20, 18, 1.5) + R(4, 9, 7, 4) + R(13, 9, 7, 4) + R(4, 15, 7, 4) + R(13, 15, 7, 4)), a(R(2, 3, 20, 4.5, 1.5))]],
    ['raster', 'Rasterdiagramm', 'Diagramme & Zahlen', [a([...Array(7)].map((_, i) => R(3 + (i % 5) * 3.8, 3 + Math.floor(i / 5) * 3.8, 3, 3, .5)).join('')), n([...Array(18)].map((_, j) => { const i = j + 7; return R(3 + (i % 5) * 3.8, 3 + Math.floor(i / 5) * 3.8, 3, 3, .5); }).join(''))]],
    ['stagnation', 'Stagnation', 'Diagramme & Zahlen', [n(R(2, 20, 20, 1.6)), n(R(2, 3, 1.6, 18)), a(LINE(5, 12, 10, 10.5, 1.8)), a(LINE(10, 10.5, 14.5, 12.5, 1.8)), a(POLY(14.5, 11.6, 18.5, 11.6, 18.5, 9, 22.5, 12.4, 18.5, 15.8, 18.5, 13.2, 14.5, 13.2))]],
    ['zielwert', 'Zielwert', 'Diagramme & Zahlen', [n(R(2, 20, 20, 1.6)), n(R(4, 10, 4, 9)), n(R(10, 7, 4, 12)), n(R(16, 12, 4, 7)), a(R(2, 4.5, 3, 1.4) + R(6.5, 4.5, 3, 1.4) + R(11, 4.5, 3, 1.4) + R(15.5, 4.5, 3, 1.4) + R(20, 4.5, 2, 1.4))]],
    ['zahl-eins', 'Platz 1', 'Diagramme & Zahlen', [a(R(9, 6, 6, 16)), n(R(2, 11, 6, 11)), n(R(16, 14, 6, 8)), n(STAR(12, 2.6, 2.4, 1, 5))]],
    // ── Zeichen
    ['pause', 'Pause', 'Zeichen', [n(R(6, 4, 4, 16, 1)), a(R(14, 4, 4, 16, 1))]],
    ['quadrat-stopp', 'Stopp', 'Zeichen', [a(R(5, 5, 14, 14, 2))]],
    ['aufnahme', 'Aufnahme', 'Zeichen', [n(RING(12, 12, 10, 1.8)), a(C(12, 12, 5.5))]],
    ['merken', 'Merken', 'Zeichen', [n('M6 2h12v20l-6-5-6 5Z'), a(STAR(12, 9, 3.2, 1.4, 5))]],
    ['sternchen', 'Sternchen', 'Zeichen', [a(STAR(12, 12, 10, 3.4, 6))]],
    ['unendlich', 'Dauerhaft', 'Zeichen', [n(RING(7.5, 12, 5, 1.8)), a(RING(16.5, 12, 5, 1.8))]],
    ['laden', 'Wird geladen', 'Zeichen', [n(ARC(12, 12, 9.5, 2.4, -90, 180)), a(ARC(12, 12, 9.5, 2.4, 180, 270))]],
    ['anker', 'Halt', 'Zeichen', [n(RING(12, 4.5, 2.6, 1.4)), n(R(11, 7, 2, 14)), n(R(7, 9, 10, 1.8, .9)), a(ARC(12, 12, 9, 2, 25, 155)), a(TRI(1.5, 13, 5.6, 11.4, 4.2, 16)), a(TRI(22.5, 13, 18.4, 11.4, 19.8, 16))]],
    ['strategie', 'Strategie', 'Zeichen', [n('M6 3h2.5v2h2V3h3v2h2V3H18v5l-2 2v8H8v-8L6 8Z'), a(R(5, 19, 14, 3, 1))]],
    ['wichtig', 'Wichtig', 'Zeichen', [n(C(12, 12, 10)), a(R(10.9, 6, 2.2, 8, 1.1) + C(12, 17.2, 1.3))]],
    ['weniger', 'Weniger', 'Zeichen', [n(C(12, 12, 10)), a(R(6.5, 10.9, 11, 2.2, 1.1))]],
    ['mehr', 'Mehr', 'Zeichen', [n(C(12, 12, 10)), a('M10.9 6.5h2.2v4.4h4.4v2.2h-4.4v4.4h-2.2v-4.4H6.5v-2.2h4.4Z')]],
    ['unsichtbar', 'Unsichtbar', 'Zeichen', [n('M1.5 12C4 7.5 7.8 5 12 5s8 2.5 10.5 7c-2.5 4.5-6.3 7-10.5 7S4 16.5 1.5 12Z' + C(12, 12, 4.6)), a(LINE(3, 21, 21, 3, 2.2))]],
    ['lupe-plus', 'Vergrößern', 'Zeichen', [n(RING(10, 10, 7.5, 2.2)), n(LINE(15.5, 15.5, 21.5, 21.5, 3)), a('M9.1 6.5h1.8v2.6h2.6v1.8h-2.6v2.6H9.1v-2.6H6.5V9.1h2.6Z')]],
    ['glocke-aus', 'Stumm geschaltet', 'Zeichen', [n('M12 2.5a1.5 1.5 0 0 1 1.5 1.5v.6A6.5 6.5 0 0 1 18.5 11v4.5L21 18v1H3v-1l2.5-2.5V11a6.5 6.5 0 0 1 5-6.4V4A1.5 1.5 0 0 1 12 2.5Z'), a(LINE(3, 21, 21, 3, 2.2))]],
    // ── Pfeile
    ['pfeil-schraeg-hoch', 'Pfeil schräg hoch', 'Pfeile', [a(POLY(6, 20, 4, 18, 14.5, 7.5, 10, 7.5, 10, 4, 20, 4, 20, 14, 16.5, 14, 16.5, 9.5))]],
    ['pfeil-schraeg-runter', 'Pfeil schräg runter', 'Pfeile', [a(POLY(6, 4, 4, 6, 14.5, 16.5, 10, 16.5, 10, 20, 20, 20, 20, 10, 16.5, 10, 16.5, 14.5))]],
    ['pfeil-zurueck', 'Zurück', 'Pfeile', [a('M9 4L3 9.5 9 15v-3.6h6a3.6 3.6 0 0 1 0 7.2h-3V22h3a7 7 0 0 0 0-14H9Z')]],
    ['auseinander', 'Auseinander', 'Pfeile', [n(POLY(1, 12, 6, 7, 6, 10.5, 10.5, 10.5, 10.5, 13.5, 6, 13.5, 6, 17)), a(POLY(23, 12, 18, 7, 18, 10.5, 13.5, 10.5, 13.5, 13.5, 18, 13.5, 18, 17))]],
    ['zusammen', 'Zusammen', 'Pfeile', [n(POLY(11, 12, 6, 7, 6, 10.5, 1, 10.5, 1, 13.5, 6, 13.5, 6, 17)), a(POLY(13, 12, 18, 7, 18, 10.5, 23, 10.5, 23, 13.5, 18, 13.5, 18, 17))]],
    ['hin-und-her', 'Hin und her', 'Pfeile', [a(POLY(1, 12, 6, 6.5, 6, 10.5, 18, 10.5, 18, 6.5, 23, 12, 18, 17.5, 18, 13.5, 6, 13.5, 6, 17.5))]],
    ['hinein', 'Hinein', 'Pfeile', [n(R(13, 3, 9, 18, 1.5) + R(15, 5, 5, 14)), a(POLY(2, 10.5, 9, 10.5, 9, 7, 14.5, 12, 9, 17, 9, 13.5, 2, 13.5))]],
    ['verzweigung', 'Verzweigung', 'Pfeile', [n(R(1, 10.7, 8, 2.6)), a(LINE(8, 12, 17, 5.6, 2.6)), a(TRI(21.5, 3, 14.6, 4.2, 18.6, 9.6)), n(LINE(8, 12, 17, 18.4, 2.6)), n(TRI(21.5, 21, 14.6, 19.8, 18.6, 14.4))]],
    ['wendung', 'Wendung', 'Pfeile', [a(ARC(12, 14, 8.5, 2.6, 180, 335)), a(HEAD(12, 14, 7.2, 335, 3.2))]],
    ['auf-und-ab', 'Auf und Ab', 'Pfeile', [a(LINE(2, 17, 8, 9, 2.2)), a(LINE(8, 9, 13, 14, 2.2)), a(LINE(13, 14, 18.5, 6.5, 2.2)), a(TRI(22, 3, 15.5, 5, 20.6, 9.4))]],
    ['kreislauf-zwei', 'Austausch', 'Pfeile', [a(ARC(12, 12, 9, 2.4, 200, 340)), a(HEAD(12, 12, 7.8, 340, 2.8)), n(ARC(12, 12, 9, 2.4, 20, 160)), n(HEAD(12, 12, 7.8, 160, 2.8))]],
    // ── Formen
    ['kreis', 'Kreis', 'Formen', [a(C(12, 12, 9))]],
    ['quadrat', 'Quadrat', 'Formen', [a(R(3.5, 3.5, 17, 17, 1.5))]],
    ['dreieck', 'Dreieck', 'Formen', [a(POLY(12, 3, 21.5, 20, 2.5, 20))]],
    ['raute', 'Raute', 'Formen', [a(POLY(12, 2, 21, 12, 12, 22, 3, 12))]],
    ['sechseck', 'Sechseck', 'Formen', [a(POLY(12, 2, 20.7, 7, 20.7, 17, 12, 22, 3.3, 17, 3.3, 7))]],
    ['ring', 'Ring', 'Formen', [a(RING(12, 12, 9, 3))]],
    ['halbkreis', 'Halbkreis', 'Formen', [a('M3 16a9 9 0 0 1 18 0Z')]],
    ['punkte', 'Drei Punkte', 'Formen', [n(C(5, 12, 2.4)), a(C(12, 12, 2.4)), n(C(19, 12, 2.4))]],
    ['strich', 'Strich', 'Formen', [a(R(2, 10.8, 20, 2.4, 1.2))]],
    ['klammern', 'Klammern', 'Formen', [n('M9 3H6.5A2.5 2.5 0 0 0 4 5.5V10l-2 2 2 2v4.5A2.5 2.5 0 0 0 6.5 21H9v-2H6.8a.8.8 0 0 1-.8-.8v-4.9L4.7 12 6 10.7V5.8a.8.8 0 0 1 .8-.8H9Z'), a('M15 3h2.5A2.5 2.5 0 0 1 20 5.5V10l2 2-2 2v4.5a2.5 2.5 0 0 1-2.5 2.5H15v-2h2.2a.8.8 0 0 0 .8-.8v-4.9l1.3-1.3-1.3-1.3V5.8a.8.8 0 0 0-.8-.8H15Z')]],
    ['gedanke', 'Gedanke', 'Formen', [n('M12 3c5.5 0 9.5 3.4 9.5 7.5S17.5 18 12 18c-1 0-2-.1-2.9-.4L5 20l1.2-3.6C4 15 2.5 12.9 2.5 10.5 2.5 6.4 6.5 3 12 3Z'), a(DOTS([[8, 10.5], [12, 10.5], [16, 10.5]], 1.3))]],
    ['herz-form', 'Herz', 'Formen', [a(HEART(12, 9.6, 1.05))]],
    ['pfeilform', 'Richtung', 'Formen', [a(POLY(3, 4, 15, 4, 21, 12, 15, 20, 3, 20, 9, 12))]],
  ];
  ICONS.push(...ICONS2);
  // Kategorien neu ordnen (bisherige Zeichen in die neuen Gruppen)
  const OLD = {Protest: 'Protest & Bewegung', Politik: 'Politik & Wahlen', Recht: 'Recht & Justiz', Staat: 'Staat & Sicherheit', Arbeit: 'Arbeit & Gewerkschaft', Wirtschaft: 'Wirtschaft & Geld',
    Medien: 'Medien & Kommunikation', Menschen: 'Menschen & Gesellschaft', Gesellschaft: 'Menschen & Gesellschaft', Umwelt: 'Umwelt & Klima', Alltag: 'Alltag & Dinge', Frieden: 'Krieg & Frieden', Krieg: 'Krieg & Frieden', Zeichen: 'Zeichen', Pfeile: 'Pfeile'};
  const MOVE = {haus: 'Wohnen & Stadt', miete: 'Wohnen & Stadt', mauer: 'Wohnen & Stadt', tuer: 'Wohnen & Stadt', bruecke: 'Wohnen & Stadt', baustelle: 'Wohnen & Stadt',
    'diagramm-hoch': 'Diagramme & Zahlen', 'diagramm-runter': 'Diagramme & Zahlen', balken: 'Diagramme & Zahlen', torte: 'Diagramme & Zahlen', prozent: 'Diagramme & Zahlen', rang: 'Diagramme & Zahlen',
    grenze: 'Migration & Grenzen', ausweis: 'Migration & Grenzen', laptop: 'Digital & Technik', handy: 'Digital & Technik', wlan: 'Digital & Technik', algorithmus: 'Digital & Technik', ki: 'Digital & Technik',
    schule: 'Bildung & Wissen', buch: 'Bildung & Wissen', gluehbirne: 'Bildung & Wissen', krankenhaus: 'Gesundheit & Pflege', rollstuhl: 'Gesundheit & Pflege', herz: 'Gesundheit & Pflege',
    windrad: 'Energie', solar: 'Energie', atom: 'Energie', strahlung: 'Energie', auto: 'Verkehr', bus: 'Verkehr', zug: 'Verkehr', fahrrad: 'Verkehr', flugzeug: 'Verkehr',
    essen: 'Essen & Landwirtschaft', brot: 'Essen & Landwirtschaft', einkauf: 'Wirtschaft & Geld', einkaufstasche: 'Alltag & Dinge', uhr: 'Zeit & Orte', kalender: 'Zeit & Orte', ort: 'Zeit & Orte', karte: 'Zeit & Orte',
    baum: 'Natur & Tiere', blatt: 'Natur & Tiere', sonne: 'Natur & Tiere', wolke: 'Natur & Tiere', taube: 'Krieg & Frieden', stern: 'Formen', kinderwagen: 'Menschen & Gesellschaft'};
  const ORDER = ['Protest & Bewegung', 'Politik & Wahlen', 'Recht & Justiz', 'Staat & Sicherheit', 'Krieg & Frieden', 'Migration & Grenzen', 'Arbeit & Gewerkschaft', 'Wirtschaft & Geld',
    'Wohnen & Stadt', 'Medien & Kommunikation', 'Digital & Technik', 'Menschen & Gesellschaft', 'Bildung & Wissen', 'Gesundheit & Pflege', 'Umwelt & Klima', 'Energie', 'Verkehr',
    'Essen & Landwirtschaft', 'Natur & Tiere', 'Alltag & Dinge', 'Zeit & Orte', 'Diagramme & Zahlen', 'Zeichen', 'Pfeile', 'Formen'];
  for (const i of ICONS){ i[2] = MOVE[i[0]] || OLD[i[2]] || i[2]; }
  ICONS.sort((p, q) => ORDER.indexOf(p[2]) - ORDER.indexOf(q[2]));
  const LIB = new Map();
  for (const [k, label, cat, parts] of ICONS) LIB.set(k, {k, label, cat, parts: parts.map(p => ({acc: !!p.acc, p: null, d: p.d}))});
  const path = part => part.p || (part.p = new Path2D(part.d));
  // Zeichen in eine Fläche (x, y, s = Kantenlänge) zeichnen. col = Grundfarbe, acc = Akzentfarbe (null = alles in col)
  function draw(ctx, k, x, y, s, col, acc){
    const ic = LIB.get(k); if (!ic) return false;
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 24, s / 24);
    for (const part of ic.parts){ ctx.fillStyle = part.acc && acc ? acc : col; ctx.fill(path(part), 'evenodd'); }
    ctx.restore(); return true;
  }
  // Als SVG (für Vorschaubilder in der Bibliothek)
  function svg(k, col = 'currentColor', acc = 'var(--acc, #E5402A)'){
    const ic = LIB.get(k); if (!ic) return '';
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${ic.parts.map(p => `<path fill-rule="evenodd" d="${p.d}" fill="${p.acc ? acc : col}"/>`).join('')}</svg>`;
  }
  const CATS = ORDER.filter(c => ICONS.some(i => i[2] === c));
  // Suche nach Bezeichnung, Schlüssel und Kategorie
  const EXTRA = {wahlkreuz: 'wahl stimme', sitzverteilung: 'bundestag mandate sitze', handschellen: 'festnahme verhaftung', wasserwerfer: 'polizei demo', traenengas: 'polizei pfefferspray', seenotrettung: 'flucht mittelmeer boot', abschiebung: 'migration flug', gewerkschaft: 'verdi igmetall organizing', rente: 'alter altersarmut senioren', aeltere: 'senioren alt rente', hunger: 'armut', obdachlosigkeit: 'wohnungslos armut', mietvertrag: 'miete wohnen', falschmeldung: 'fake desinformation', zensur: 'meinungsfreiheit', datenschutz: 'privatsphäre', virus: 'pandemie corona', kampfjet: 'bundeswehr luftwaffe militär', ruestung: 'aufrüstung rüstung militär', klimastreik: 'fridays for future', co2: 'emissionen klima', 'erde-warm': 'klimakrise erwärmung', kraftwerk: 'kohlekraft atomkraft', waermepumpe: 'heizungsgesetz energiewende', fahrkarte: 'deutschlandticket öpnv', strassenbahn: 'öpnv nahverkehr', stau: 'verkehr autos', pflege: 'pflegenotstand care', psyche: 'mental health', zielwert: 'ziel plan', lobbyismus: 'lobby konzerne', bestechung: 'korruption', reichtum: 'vermögen milliardäre', 'zu-vermieten': 'wohnungssuche', megafon: 'lautsprecher aufruf', faust: 'widerstand kampf', streik: 'arbeitskampf gewerkschaft', wahlurne: 'wahl abstimmung', parlament: 'bundestag regierung',
    polizei: 'staat ordnung', ueberwachung: 'geheimdienst kontrolle', geld: 'lohn einkommen kapital', euro: 'preis kosten', handy: 'social media tiktok instagram',
    play: 'youtube', kind: 'kinderrechte jugend', familie: 'alleinerziehend eltern', atom: 'kernkraft akw nuklear', thermometer: 'klimakrise erwärmung', taube: 'pazifismus',
    panzer: 'bundeswehr militär aufrüstung', soldat: 'wehrpflicht bundeswehr armee', rakete: 'aufrüstung waffe', haus: 'wohnen wohnung', miete: 'wohnen mietendeckel',
    krone: 'herrschaft macht monarchie', kette: 'unterdrückung', 'kette-gebrochen': 'befreiung revolution', waage: 'gerechtigkeit justiz gericht', paragraf: 'gesetz recht',
    zeitung: 'presse journalismus', kamera: 'film video', algorithmus: 'plattform netzwerk', ki: 'künstliche intelligenz computer', 'oben-unten': 'klasse hierarchie',
    einzeln: 'talkshow einer gegen alle', spaltung: 'polarisierung', solidaritaet: 'bündnis zusammenhalt', grenze: 'migration abschiebung flucht', ausweis: 'staatsbürgerschaft migration'};
  function search(q){
    q = String(q || '').trim().toLowerCase(); const all = [...LIB.values()];
    if (!q) return all;
    return all.filter(i => (i.k + ' ' + i.label + ' ' + i.cat + ' ' + (EXTRA[i.k] || '')).toLowerCase().includes(q));
  }
  // Passendes Zeichen zu einem Text vorschlagen: Stichwort muss am Wortanfang stehen (Streik → Streikkasse, nicht bestellte → Teller)
  const STOP = new Set(['gegen', 'einer', 'alle', 'oben', 'unten', 'viele', 'offene', 'hoch', 'runter', 'links', 'rechts', 'mitte', 'zeichen', 'symbol', 'personen', 'person']);
  const kw = new Map();
  for (const i of LIB.values()) kw.set(i.k, [...new Set((i.label + ' ' + (EXTRA[i.k] || '') + ' ' + i.k.replace(/-/g, ' ')).toLowerCase().split(/[\s/]+/).filter(w => w.length >= 4 && !STOP.has(w)))]);
  function suggest(text, min = 4){
    const ws = String(text || '').toLowerCase().split(/[^a-zäöüß0-9]+/).filter(w => w.length >= 4), hits = [];
    if (!ws.length) return [];
    for (const [k, keys] of kw){
      let sc = 0;
      for (const key of keys){ const stem = key.slice(0, Math.max(4, key.length - 2)); if (ws.some(w => w.startsWith(stem) && w.length <= key.length + 9)) sc += key.length; }
      if (sc >= min) hits.push([sc, k]);
    }
    return hits.sort((p, q) => q[0] - p[0]).map(h => h[1]);
  }
  (typeof window !== 'undefined' ? window : globalThis).HoneyDeckIcons = {LIB, CATS, draw, svg, search, suggest, list: () => [...LIB.values()]};
})();
