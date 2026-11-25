/* BORED? – Schach (wie chess.com, im Neon-Look)
   Engine (Zuggenerator, Suche, Matt-Löser) steckt in ENGINE() – läuft im Web Worker (Blob-URL)
   oder als Fallback im Haupt-Thread. In node: require('./chess.js') liefert {E, PUZZLES}. */
(function(){
'use strict';

/* ======================================================================
   ENGINE – reine Logik, ohne DOM. Wird per toString() auch im Worker genutzt.
   ====================================================================== */
function ENGINE(){
  'use strict';
  const WHITE = 0, BLACK = 8, P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
  const NOFF = [-33, -31, -18, -14, 14, 18, 31, 33], BOFF = [-17, -15, 15, 17], ROFF = [-16, -1, 1, 16], KOFF = [-17, -16, -15, -1, 1, 15, 16, 17];
  const VAL = [0, 100, 320, 330, 500, 900, 0];
  const PH = [0, 0, 1, 1, 2, 4, 0];
  const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const MATE = 30000, MATEB = MATE - 300;
  const FILES = 'abcdefgh';
  const sqName = s => FILES[s & 7] + ((s >> 4) + 1);
  const sqParse = n => (n.charCodeAt(0) - 97) + (n.charCodeAt(1) - 49) * 16;

  // Zobrist
  let seed = 0x2F6B3C1D;
  const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed | 0; };
  const ZL = new Int32Array(16 * 128), ZH = new Int32Array(16 * 128);
  for(let i = 0; i < ZL.length; i++){ ZL[i] = rnd(); ZH[i] = rnd(); }
  const ZCL = new Int32Array(16), ZCH = new Int32Array(16);
  for(let i = 0; i < 16; i++){ ZCL[i] = rnd(); ZCH[i] = rnd(); }
  const ZEL = new Int32Array(8), ZEH = new Int32Array(8);
  for(let i = 0; i < 8; i++){ ZEL[i] = rnd(); ZEH[i] = rnd(); }
  const ZSL = rnd(), ZSH = rnd();
  const CMASK = new Uint8Array(128).fill(15);
  CMASK[0] = 13; CMASK[4] = 12; CMASK[7] = 14; CMASK[112] = 7; CMASK[116] = 3; CMASK[119] = 11;

  /* ---------- Stellung ---------- */
  function Pos(fen){ this.b = new Int8Array(128); this.kings = [4, 116]; this.load(fen || START); }
  Pos.prototype.load = function(fen){
    const b = this.b; b.fill(0);
    const parts = String(fen).trim().split(/\s+/);
    let r = 7, f = 0;
    for(const ch of parts[0]){
      if(ch === '/'){ r--; f = 0; continue; }
      if(ch >= '1' && ch <= '8'){ f += +ch; continue; }
      const lo = ch.toLowerCase(), t = ' pnbrqk'.indexOf(lo);
      if(t < 1 || r < 0 || f > 7) throw new Error('FEN');
      const sq = r * 16 + f; b[sq] = t | (ch === lo ? BLACK : WHITE);
      if(t === K) this.kings[ch === lo ? 1 : 0] = sq;
      f++;
    }
    this.side = parts[1] === 'b' ? BLACK : WHITE;
    const c = parts[2] || '-';
    this.castle = (c.includes('K') ? 1 : 0) | (c.includes('Q') ? 2 : 0) | (c.includes('k') ? 4 : 0) | (c.includes('q') ? 8 : 0);
    this.ep = parts[3] && parts[3] !== '-' ? sqParse(parts[3]) : -1;
    this.half = +parts[4] || 0; this.full = +parts[5] || 1;
    this.u = [];
    this.rehash(); this.hl = [this.lo]; this.hh = [this.hi];
  };
  Pos.prototype.rehash = function(){
    let lo = 0, hi = 0; const b = this.b;
    for(let s = 0; s < 120; s++){ if(s & 0x88){ s += 7; continue; } if(b[s]){ lo ^= ZL[b[s] * 128 + s]; hi ^= ZH[b[s] * 128 + s]; } }
    lo ^= ZCL[this.castle]; hi ^= ZCH[this.castle];
    if(this.ep >= 0){ lo ^= ZEL[this.ep & 7]; hi ^= ZEH[this.ep & 7]; }
    if(this.side === BLACK){ lo ^= ZSL; hi ^= ZSH; }
    this.lo = lo; this.hi = hi;
  };
  Pos.prototype.fen = function(){
    const b = this.b; let s = '';
    for(let r = 7; r >= 0; r--){
      let e = 0;
      for(let f = 0; f < 8; f++){
        const p = b[r * 16 + f];
        if(!p){ e++; continue; }
        if(e){ s += e; e = 0; }
        const ch = ' pnbrqk'[p & 7]; s += p & 8 ? ch : ch.toUpperCase();
      }
      if(e) s += e; if(r) s += '/';
    }
    let c = (this.castle & 1 ? 'K' : '') + (this.castle & 2 ? 'Q' : '') + (this.castle & 4 ? 'k' : '') + (this.castle & 8 ? 'q' : '');
    return s + ' ' + (this.side ? 'b' : 'w') + ' ' + (c || '-') + ' ' + (this.ep >= 0 ? sqName(this.ep) : '-') + ' ' + this.half + ' ' + this.full;
  };
  Pos.prototype.attacked = function(sq, by){
    const b = this.b; let t;
    if(by === WHITE){
      t = sq - 15; if(!(t & 0x88) && b[t] === P) return true;
      t = sq - 17; if(!(t & 0x88) && b[t] === P) return true;
    } else {
      t = sq + 15; if(!(t & 0x88) && b[t] === (P | 8)) return true;
      t = sq + 17; if(!(t & 0x88) && b[t] === (P | 8)) return true;
    }
    const kn = N | by, kg = K | by, bi = B | by, rk = R | by, qu = Q | by;
    for(let i = 0; i < 8; i++){ t = sq + NOFF[i]; if(!(t & 0x88) && b[t] === kn) return true; }
    for(let i = 0; i < 8; i++){ t = sq + KOFF[i]; if(!(t & 0x88) && b[t] === kg) return true; }
    for(let i = 0; i < 4; i++){
      const d = BOFF[i]; t = sq + d;
      while(!(t & 0x88)){ const c = b[t]; if(c){ if(c === bi || c === qu) return true; break; } t += d; }
    }
    for(let i = 0; i < 4; i++){
      const d = ROFF[i]; t = sq + d;
      while(!(t & 0x88)){ const c = b[t]; if(c){ if(c === rk || c === qu) return true; break; } t += d; }
    }
    return false;
  };
  Pos.prototype.inCheck = function(){ return this.attacked(this.kings[this.side >> 3], this.side ^ 8); };
  function addPromo(list, from, to, caps){
    list.push(from | to << 7 | Q << 14);
    if(!caps){ list.push(from | to << 7 | N << 14, from | to << 7 | R << 14, from | to << 7 | B << 14); }
  }
  // Pseudo-legale Züge. Zug = from | to<<7 | promo<<14 | flag<<17 (1 Doppelschritt, 2 en passant, 3 Rochade)
  Pos.prototype.gen = function(list, caps){
    const b = this.b, s = this.side, e = s ^ 8;
    for(let sq = 0; sq < 120; sq++){
      if(sq & 0x88){ sq += 7; continue; }
      const p = b[sq]; if(!p || (p & 8) !== s) continue;
      const t = p & 7;
      if(t === P){
        const d = s === WHITE ? 16 : -16, r = sq >> 4, promoR = s === WHITE ? 6 : 1, startR = s === WHITE ? 1 : 6;
        const to = sq + d;
        if(!b[to]){
          if(r === promoR) addPromo(list, sq, to, caps);
          else if(!caps){ list.push(sq | to << 7); if(r === startR && !b[to + d]) list.push(sq | (to + d) << 7 | 1 << 17); }
        }
        for(let k = -1; k <= 1; k += 2){
          const tc = to + k; if(tc & 0x88) continue;
          const c = b[tc];
          if(c && (c & 8) === e){ if(r === promoR) addPromo(list, sq, tc, caps); else list.push(sq | tc << 7); }
          else if(!c && tc === this.ep) list.push(sq | tc << 7 | 2 << 17);
        }
      } else if(t === N || t === K){
        const offs = t === N ? NOFF : KOFF;
        for(let i = 0; i < 8; i++){
          const to = sq + offs[i]; if(to & 0x88) continue;
          const c = b[to];
          if(!c){ if(!caps) list.push(sq | to << 7); } else if((c & 8) === e) list.push(sq | to << 7);
        }
      } else {
        const dirs = t === B ? BOFF : t === R ? ROFF : KOFF;
        for(let i = 0; i < dirs.length; i++){
          const d = dirs[i]; let to = sq + d;
          while(!(to & 0x88)){
            const c = b[to];
            if(!c){ if(!caps) list.push(sq | to << 7); }
            else { if((c & 8) === e) list.push(sq | to << 7); break; }
            to += d;
          }
        }
      }
    }
    if(!caps && this.castle){
      if(s === WHITE && b[4] === K){
        if((this.castle & 1) && !b[5] && !b[6] && b[7] === R && !this.attacked(4, BLACK) && !this.attacked(5, BLACK) && !this.attacked(6, BLACK)) list.push(4 | 6 << 7 | 3 << 17);
        if((this.castle & 2) && !b[3] && !b[2] && !b[1] && b[0] === R && !this.attacked(4, BLACK) && !this.attacked(3, BLACK) && !this.attacked(2, BLACK)) list.push(4 | 2 << 7 | 3 << 17);
      } else if(s === BLACK && b[116] === (K | 8)){
        if((this.castle & 4) && !b[117] && !b[118] && b[119] === (R | 8) && !this.attacked(116, WHITE) && !this.attacked(117, WHITE) && !this.attacked(118, WHITE)) list.push(116 | 118 << 7 | 3 << 17);
        if((this.castle & 8) && !b[115] && !b[114] && !b[113] && b[112] === (R | 8) && !this.attacked(116, WHITE) && !this.attacked(115, WHITE) && !this.attacked(114, WHITE)) list.push(116 | 114 << 7 | 3 << 17);
      }
    }
    return list;
  };
  Pos.prototype.make = function(m){
    const b = this.b, from = m & 127, to = (m >> 7) & 127, pr = (m >> 14) & 7, fl = (m >> 17) & 3;
    const p = b[from], side = this.side;
    const capSq = fl === 2 ? to + (side === WHITE ? -16 : 16) : to;
    const cap = b[capSq];
    this.u.push(m, cap, this.castle, this.ep, this.half);
    let lo = this.lo ^ ZL[p * 128 + from], hi = this.hi ^ ZH[p * 128 + from];
    if(cap){ lo ^= ZL[cap * 128 + capSq]; hi ^= ZH[cap * 128 + capSq]; b[capSq] = 0; }
    const np = pr ? (pr | side) : p;
    b[from] = 0; b[to] = np; lo ^= ZL[np * 128 + to]; hi ^= ZH[np * 128 + to];
    if(fl === 3){
      let rf, rt;
      if(to === 6){ rf = 7; rt = 5; } else if(to === 2){ rf = 0; rt = 3; } else if(to === 118){ rf = 119; rt = 117; } else { rf = 112; rt = 115; }
      const rk = b[rf]; b[rf] = 0; b[rt] = rk;
      lo ^= ZL[rk * 128 + rf] ^ ZL[rk * 128 + rt]; hi ^= ZH[rk * 128 + rf] ^ ZH[rk * 128 + rt];
    }
    if(this.ep >= 0){ lo ^= ZEL[this.ep & 7]; hi ^= ZEH[this.ep & 7]; }
    this.ep = fl === 1 ? (from + to) >> 1 : -1;
    if(this.ep >= 0){ lo ^= ZEL[this.ep & 7]; hi ^= ZEH[this.ep & 7]; }
    const nc = this.castle & CMASK[from] & CMASK[to];
    if(nc !== this.castle){ lo ^= ZCL[this.castle] ^ ZCL[nc]; hi ^= ZCH[this.castle] ^ ZCH[nc]; this.castle = nc; }
    this.half = ((p & 7) === P || cap) ? 0 : this.half + 1;
    if(side === BLACK) this.full++;
    if((p & 7) === K) this.kings[side >> 3] = to;
    this.side = side ^ 8; lo ^= ZSL; hi ^= ZSH;
    this.lo = lo; this.hi = hi; this.hl.push(lo); this.hh.push(hi);
    if(this.attacked(this.kings[side >> 3], this.side)){ this.unmake(); return false; }
    return true;
  };
  Pos.prototype.unmake = function(){
    const u = this.u, n = u.length, b = this.b;
    const half = u[n - 1], ep = u[n - 2], castle = u[n - 3], cap = u[n - 4], m = u[n - 5];
    u.length = n - 5;
    this.hl.pop(); this.hh.pop();
    this.lo = this.hl[this.hl.length - 1]; this.hi = this.hh[this.hh.length - 1];
    const side = this.side ^ 8; this.side = side;
    this.castle = castle; this.ep = ep; this.half = half;
    if(side === BLACK) this.full--;
    if(!m) return; // Nullzug
    const from = m & 127, to = (m >> 7) & 127, pr = (m >> 14) & 7, fl = (m >> 17) & 3;
    const np = b[to], p = pr ? (P | side) : np;
    b[to] = 0; b[from] = p;
    if(fl === 2) b[to + (side === WHITE ? -16 : 16)] = cap; else b[to] = cap;
    if(fl === 3){
      let rf, rt;
      if(to === 6){ rf = 7; rt = 5; } else if(to === 2){ rf = 0; rt = 3; } else if(to === 118){ rf = 119; rt = 117; } else { rf = 112; rt = 115; }
      b[rf] = b[rt]; b[rt] = 0;
    }
    if((p & 7) === K) this.kings[side >> 3] = from;
  };
  Pos.prototype.makeNull = function(){
    this.u.push(0, 0, this.castle, this.ep, this.half);
    let lo = this.lo, hi = this.hi;
    if(this.ep >= 0){ lo ^= ZEL[this.ep & 7]; hi ^= ZEH[this.ep & 7]; this.ep = -1; }
    if(this.side === BLACK) this.full++;
    this.side ^= 8; lo ^= ZSL; hi ^= ZSH; this.half = 0;
    this.lo = lo; this.hi = hi; this.hl.push(lo); this.hh.push(hi);
  };
  Pos.prototype.unmakeNull = Pos.prototype.unmake;
  Pos.prototype.legal = function(){
    const list = this.gen([], false), out = [];
    for(let i = 0; i < list.length; i++){ if(this.make(list[i])){ this.unmake(); out.push(list[i]); } }
    return out;
  };
  Pos.prototype.hasLegal = function(){
    const list = this.gen([], false);
    for(let i = 0; i < list.length; i++){ if(this.make(list[i])){ this.unmake(); return true; } }
    return false;
  };
  Pos.prototype.isRep = function(){
    const n = this.hl.length - 1, lo = this.lo, hi = this.hi, stop = Math.max(0, n - this.half);
    for(let i = n - 2; i >= stop; i -= 2) if(this.hl[i] === lo && this.hh[i] === hi) return true;
    return false;
  };
  Pos.prototype.repCount = function(){
    const n = this.hl.length - 1, stop = Math.max(0, n - this.half); let c = 0;
    for(let i = n - 2; i >= stop; i -= 2) if(this.hl[i] === this.lo && this.hh[i] === this.hi) c++;
    return c;
  };
  Pos.prototype.insufficient = function(){
    const b = this.b; let minors = 0, knights = 0, bcol = -1, mixed = false;
    for(let s = 0; s < 120; s++){
      if(s & 0x88){ s += 7; continue; }
      const t = b[s] & 7; if(!t || t === K) continue;
      if(t === P || t === R || t === Q) return false;
      minors++;
      if(t === N) knights++;
      else { const c = ((s >> 4) + (s & 7)) & 1; if(bcol < 0) bcol = c; else if(bcol !== c) mixed = true; }
    }
    if(minors <= 1) return true;
    return knights === 0 && !mixed;
  };
  Pos.prototype.hasPieces = function(){
    const b = this.b, s = this.side;
    for(let q = 0; q < 120; q++){ if(q & 0x88){ q += 7; continue; } const p = b[q]; if(p && (p & 8) === s){ const t = p & 7; if(t > P && t < K) return true; } }
    return false;
  };
  Pos.prototype.uci = function(m){ const pr = (m >> 14) & 7; return sqName(m & 127) + sqName((m >> 7) & 127) + (pr ? ' pnbrqk'[pr] : ''); };
  Pos.prototype.findUci = function(u){ const l = this.legal(); for(const m of l) if(this.uci(m) === u) return m; return 0; };
  Pos.prototype.makeUci = function(u){ const m = this.findUci(u); if(!m) return 0; this.make(m); return m; };
  Pos.prototype.san = function(m, legal){
    legal = legal || this.legal();
    const b = this.b, from = m & 127, to = (m >> 7) & 127, pr = (m >> 14) & 7, fl = (m >> 17) & 3, p = b[from], t = p & 7;
    let s;
    if(fl === 3) s = (to & 7) === 6 ? 'O-O' : 'O-O-O';
    else {
      const cap = b[to] || fl === 2, dest = sqName(to);
      if(t === P){ s = (cap ? FILES[from & 7] + 'x' : '') + dest + (pr ? '=' + ' PNBRQK'[pr] : ''); }
      else {
        s = ' PNBRQK'[t];
        const amb = legal.filter(o => (o & 127) !== from && ((o >> 7) & 127) === to && b[o & 127] === p);
        if(amb.length){
          const sf = amb.some(o => ((o & 127) & 7) === (from & 7)), sr = amb.some(o => ((o & 127) >> 4) === (from >> 4));
          s += !sf ? FILES[from & 7] : !sr ? String((from >> 4) + 1) : sqName(from);
        }
        s += (cap ? 'x' : '') + dest;
      }
    }
    this.make(m);
    if(this.inCheck()) s += this.hasLegal() ? '+' : '#';
    this.unmake();
    return s;
  };
  // Spielstatus: null oder {res:'w'|'b'|'d', reason}
  Pos.prototype.status = function(){
    if(!this.hasLegal()){
      if(this.inCheck()) return { res: this.side === WHITE ? 'b' : 'w', reason: 'Schachmatt' };
      return { res: 'd', reason: 'Patt' };
    }
    if(this.insufficient()) return { res: 'd', reason: 'Ungenügendes Material' };
    if(this.half >= 100) return { res: 'd', reason: '50-Züge-Regel' };
    if(this.repCount() >= 2) return { res: 'd', reason: 'Dreifache Wiederholung' };
    return null;
  };
  Pos.prototype.perft = function(d){
    if(d === 0) return 1;
    const list = this.gen([], false); let n = 0;
    for(let i = 0; i < list.length; i++){
      if(!this.make(list[i])) continue;
      n += d === 1 ? 1 : this.perft(d - 1);
      this.unmake();
    }
    return n;
  };

  /* ---------- Bewertung (Piece-Square-Tables) ---------- */
  const T = a => Int16Array.from(a);
  const PST = [null,
    T([0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0]),
    T([-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50]),
    T([-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20]),
    T([0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0]),
    T([-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20])
  ];
  const KMG = T([-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20]);
  const KEG = T([-50,-40,-30,-20,-20,-30,-40,-50, -30,-20,-10,0,0,-10,-20,-30, -30,-10,20,30,30,20,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,20,30,30,20,-10,-30, -30,-30,0,0,0,0,-30,-30, -50,-30,-30,-30,-30,-30,-30,-50]);
  const cdist = s => { const r = s >> 4, f = s & 7; return Math.max(3 - f, f - 4) + Math.max(3 - r, r - 4); };
  function evaluate(pos){
    const b = pos.b;
    let s = 0, phase = 0, wb = 0, bb = 0, matW = 0, matB = 0, advW = 0, advB = 0, wk = 4, bk = 116;
    for(let sq = 0; sq < 120; sq++){
      if(sq & 0x88){ sq += 7; continue; }
      const p = b[sq]; if(!p) continue;
      const t = p & 7, r = sq >> 4, f = sq & 7;
      if(p < 8){
        if(t === K){ wk = sq; continue; }
        s += VAL[t] + PST[t][(7 - r) * 8 + f]; matW += VAL[t]; phase += PH[t];
        if(t === B) wb++; else if(t === P) advW += r - 1;
      } else {
        if(t === K){ bk = sq; continue; }
        s -= VAL[t] + PST[t][r * 8 + f]; matB += VAL[t]; phase += PH[t];
        if(t === B) bb++; else if(t === P) advB += 6 - r;
      }
    }
    if(phase > 24) phase = 24;
    const wi = (7 - (wk >> 4)) * 8 + (wk & 7), bi = (bk >> 4) * 8 + (bk & 7);
    s += ((KMG[wi] - KMG[bi]) * phase + (KEG[wi] - KEG[bi]) * (24 - phase)) / 24;
    s += (advW - advB) * (24 - phase) / 4;
    if(wb >= 2) s += 30; if(bb >= 2) s -= 30;
    if(phase <= 10){
      const d = matW - matB;
      const kd = Math.abs((wk >> 4) - (bk >> 4)) + Math.abs((wk & 7) - (bk & 7));
      if(d >= 300) s += cdist(bk) * 12 + (14 - kd) * 5;
      else if(d <= -300) s -= cdist(wk) * 12 + (14 - kd) * 5;
    }
    return (pos.side === WHITE ? s : -s) + 10 | 0;
  }

  /* ---------- Suche: Negamax + Alpha-Beta, TT, MVV-LVA, Killer, Quiescence, iterative Vertiefung ---------- */
  const TTS = 1 << 18, TTM = TTS - 1;
  const ttK = new Int32Array(TTS), ttM = new Int32Array(TTS), ttS = new Int16Array(TTS), ttD = new Int8Array(TTS), ttF = new Uint8Array(TTS);
  const killers = new Int32Array(260), hist = new Int32Array(16 * 128);
  function search(pos, opt){
    opt = opt || {};
    const t0 = Date.now(), limit = opt.time || 1000, deadline = t0 + limit, maxD = opt.depth || 64;
    const noise = opt.noise | 0, nseed = (Math.random() * 1e9) | 0;
    let nodes = 0, stop = false, canStop = false;
    const b = pos.b;
    killers.fill(0); hist.fill(0);
    const ev = () => {
      let s = evaluate(pos);
      if(noise) s += ((Math.imul(pos.lo ^ nseed, 0x9E3779B1) >>> 0) % (2 * noise + 1)) - noise;
      return s;
    };
    const tick = () => { if((++nodes & 2047) === 0 && canStop && Date.now() > deadline) stop = true; };
    function scoreMoves(list, sc, ttMove, ply){
      const k1 = killers[ply * 2], k2 = killers[ply * 2 + 1];
      for(let i = 0; i < list.length; i++){
        const m = list[i], to = (m >> 7) & 127, fl = (m >> 17) & 3, pr = (m >> 14) & 7;
        let s;
        if(m === ttMove) s = 1e8;
        else {
          const v = fl === 2 ? P : b[to] & 7;
          if(v) s = 1e6 + VAL[v] * 10 - (b[m & 127] & 7) + (pr ? 9000 : 0);
          else if(pr) s = 9e5 + pr;
          else if(m === k1) s = 8e5;
          else if(m === k2) s = 7e5;
          else s = hist[b[m & 127] * 128 + to];
        }
        sc[i] = s;
      }
    }
    function pick(list, sc, i){
      let bi = i;
      for(let j = i + 1; j < list.length; j++) if(sc[j] > sc[bi]) bi = j;
      if(bi !== i){ let t = list[i]; list[i] = list[bi]; list[bi] = t; t = sc[i]; sc[i] = sc[bi]; sc[bi] = t; }
    }
    function qs(alpha, beta, ply){
      tick(); if(stop) return 0;
      const sp = ev();
      if(sp >= beta) return sp;
      if(sp > alpha) alpha = sp;
      if(ply > 60) return sp;
      const list = pos.gen([], true), sc = new Array(list.length);
      scoreMoves(list, sc, 0, Math.min(ply, 127));
      for(let i = 0; i < list.length; i++){
        pick(list, sc, i);
        const m = list[i], pr = (m >> 14) & 7, fl = (m >> 17) & 3;
        const v = fl === 2 ? P : b[(m >> 7) & 127] & 7;
        if(!pr && sp + VAL[v] + 200 < alpha) continue;
        if(!pos.make(m)) continue;
        const s = -qs(-beta, -alpha, ply + 1);
        pos.unmake();
        if(stop) return 0;
        if(s >= beta) return s;
        if(s > alpha) alpha = s;
      }
      return alpha;
    }
    function nm(depth, alpha, beta, ply, nullOk){
      if(pos.half >= 100 || pos.isRep()) return 0;
      const inC = pos.inCheck();
      if(inC) depth++;
      if(depth <= 0) return qs(alpha, beta, ply);
      tick(); if(stop) return 0;
      if(ply >= 120) return ev();
      const idx = pos.lo & TTM; let ttMove = 0;
      if(ttK[idx] === pos.hi){
        ttMove = ttM[idx];
        if(ttD[idx] >= depth){
          let s = ttS[idx]; if(s > MATEB) s -= ply; else if(s < -MATEB) s += ply;
          const f = ttF[idx];
          if(f === 0 || (f === 1 && s >= beta) || (f === 2 && s <= alpha)) return s;
        }
      }
      if(nullOk && !inC && depth >= 3 && beta < MATEB && beta > -MATEB && pos.hasPieces() && ev() >= beta){
        pos.makeNull();
        const s = -nm(depth - 1 - (depth > 6 ? 3 : 2), -beta, -beta + 1, ply + 1, false);
        pos.unmakeNull();
        if(stop) return 0;
        if(s >= beta) return beta;
      }
      const list = pos.gen([], false), sc = new Array(list.length);
      scoreMoves(list, sc, ttMove, Math.min(ply, 127));
      let best = -MATE - 1, bestM = 0, legal = 0;
      const a0 = alpha;
      for(let i = 0; i < list.length; i++){
        pick(list, sc, i);
        const m = list[i], to = (m >> 7) & 127;
        const quiet = !b[to] && !((m >> 14) & 7) && ((m >> 17) & 3) !== 2;
        const pc = b[m & 127];
        if(!pos.make(m)) continue;
        legal++;
        let s;
        if(legal === 1) s = -nm(depth - 1, -beta, -alpha, ply + 1, true);
        else {
          let r = 0;
          if(depth >= 3 && legal > 4 && !inC && quiet && sc[i] < 7e5 && !pos.inCheck()) r = legal > 12 && depth > 5 ? 2 : 1;
          s = -nm(depth - 1 - r, -alpha - 1, -alpha, ply + 1, true);
          if(!stop && s > alpha && (r || s < beta)) s = -nm(depth - 1, -beta, -alpha, ply + 1, true);
        }
        pos.unmake();
        if(stop) return 0;
        if(s > best){
          best = s; bestM = m;
          if(s > alpha){
            alpha = s;
            if(s >= beta){
              if(quiet){
                const k = Math.min(ply, 127) * 2;
                if(killers[k] !== m){ killers[k + 1] = killers[k]; killers[k] = m; }
                hist[pc * 128 + to] += depth * depth;
              }
              break;
            }
          }
        }
      }
      if(!legal) return inC ? -MATE + ply : 0;
      let ss = best; if(ss > MATEB) ss += ply; else if(ss < -MATEB) ss -= ply;
      ttK[idx] = pos.hi; ttM[idx] = bestM; ttS[idx] = ss; ttD[idx] = depth; ttF[idx] = best >= beta ? 1 : best > a0 ? 0 : 2;
      return best;
    }
    const root = pos.legal();
    if(!root.length) return { move: 0, score: pos.inCheck() ? -MATE : 0, depth: 0, nodes: 0 };
    const sc = new Array(root.length); scoreMoves(root, sc, 0, 0);
    const order = root.map((m, i) => [m, sc[i]]).sort((a, b2) => b2[1] - a[1]).map(x => x[0]);
    let bestMove = order[0], bestScore = 0, done = 0;
    for(let d = 1; d <= maxD; d++){
      canStop = d > 1;
      let alpha = -MATE - 1; const beta = MATE + 1;
      let cur = 0, curS = -MATE - 1;
      for(let i = 0; i < order.length; i++){
        const m = order[i];
        pos.make(m);
        let s;
        if(i === 0) s = -nm(d - 1, -beta, -alpha, 1, true);
        else {
          s = -nm(d - 1, -alpha - 1, -alpha, 1, true);
          if(!stop && s > alpha) s = -nm(d - 1, -beta, -alpha, 1, true);
        }
        pos.unmake();
        if(stop) break;
        if(s > curS){ curS = s; cur = m; }
        if(s > alpha) alpha = s;
      }
      if(stop) break;
      bestMove = cur; bestScore = curS; done = d;
      order.splice(order.indexOf(cur), 1); order.unshift(cur);
      if(root.length === 1 && d >= 2) break;
      if(Math.abs(bestScore) > MATEB && d >= (MATE - Math.abs(bestScore)) + 2) break;
      if(Date.now() - t0 > limit * 0.5) break;
    }
    return { move: bestMove, score: bestScore, depth: done, nodes, ms: Date.now() - t0 };
  }

  /* ---------- Matt-Löser (für Puzzles) ---------- */
  function mateIn(pos, n, lim){
    let nodes = 0; lim = lim || 4e6;
    function att(k){
      const list = pos.legal(), checks = [], rest = [];
      for(const m of list){ pos.make(m); (pos.inCheck() ? checks : rest).push(m); pos.unmake(); }
      const all = k === 1 ? checks : checks.concat(rest);
      for(const m of all){
        if(++nodes > lim) throw new Error('limit');
        pos.make(m);
        let ok;
        if(!pos.hasLegal()) ok = pos.inCheck();
        else ok = k > 1 && def(k - 1);
        pos.unmake();
        if(ok) return m;
      }
      return 0;
    }
    function def(k){
      const list = pos.legal();
      for(const m of list){ pos.make(m); const r = att(k); pos.unmake(); if(!r) return false; }
      return true;
    }
    return { att, def, nodes: () => nodes };
  }
  // Kann die Seite am Zug in <= n Zügen mattsetzen? Gibt Zug oder 0 zurück (null bei Limit)
  function findMate(pos, n, lim){ try{ for(let k = 1; k <= n; k++){ const m = mateIn(pos, k, lim).att(k); if(m) return m; } return 0; }catch(e){ return null; } }
  // Verteidiger am Zug: werden alle Antworten in <= n Zügen mattgesetzt?
  function forcedMate(pos, n, lim){ try{ return mateIn(pos, n, lim).def(n); }catch(e){ return null; } }
  // Beste (längste) Verteidigung, Verteidiger am Zug, Angreifer hat noch n Züge
  function bestDefense(pos, n, prefer){
    const list = pos.legal(); let best = 0, bestK = -1;
    for(const m of list){
      pos.make(m);
      let k = 1;
      try{ while(k <= n && !mateIn(pos, k, 1e6).att(k)) k++; }catch(e){ k = n; }
      pos.unmake();
      if(k > bestK || (k === bestK && pos.uci(m) === prefer)){ bestK = k; best = m; }
    }
    return best;
  }

  /* ---------- Einstieg für Worker / Fallback ---------- */
  function runSearch(fen, moves, opt){
    const pos = new Pos(fen);
    for(const u of moves || []) if(!pos.makeUci(u)) break;
    const legal = pos.legal();
    if(!legal.length) return { move: null, score: null };
    if(opt.rnd && Math.random() < opt.rnd){
      const m = legal[Math.floor(Math.random() * legal.length)];
      return { move: pos.uci(m), score: null, depth: 0, random: true };
    }
    const r = search(pos, opt);
    const sc = pos.side === WHITE ? r.score : -r.score;
    return { move: r.move ? pos.uci(r.move) : null, score: sc, mate: Math.abs(r.score) > MATEB ? Math.sign(sc) * Math.ceil((MATE - Math.abs(r.score)) / 2) : 0, depth: r.depth, nodes: r.nodes, ms: r.ms };
  }
  if(typeof importScripts === 'function' && typeof self !== 'undefined'){
    self.onmessage = e => {
      const d = e.data; let res;
      try{ res = runSearch(d.fen, d.moves, d.opt); }catch(err){ res = { error: String(err) }; }
      res.id = d.id; self.postMessage(res);
    };
  }
  return { Pos, search, evaluate, runSearch, findMate, forcedMate, bestDefense, START, sqName, sqParse, WHITE, BLACK, MATE };
}

/* ======================================================================
   PUZZLES – echte erzwungene Matts, mit node-Löser geprüft (n = Matt in n)
   ====================================================================== */
const PUZZLES = [
  {"name":"Schäfermatt","fen":"r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4","n":1,"line":"h5f7","r":600},
  {"name":"Narrenmatt","fen":"rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2","n":1,"line":"d8h4","r":625},
  {"name":"Grundreihe","fen":"6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1","n":1,"line":"d1d8","r":650},
  {"name":"Ersticktes Matt","fen":"6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1","n":1,"line":"g5f7","r":675},
  {"name":"Anastasias Matt","fen":"8/4N1pk/8/8/8/4R3/8/K7 w - - 0 1","n":1,"line":"e3h3","r":700},
  {"name":"Arabisches Matt","fen":"7k/1R6/5N2/8/8/8/8/6K1 w - - 0 1","n":1,"line":"b7h7","r":725},
  {"name":"Grundreihe (Schwarz)","fen":"1r4k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1","n":1,"line":"b8b1","r":750},
  {"name":"Légals Matt","fen":"rn1q1bnr/ppp1kB1p/3p2p1/4N3/4P3/2N5/PPPP1PPP/R1BbK2R w KQ - 0 7","n":1,"line":"c3d5","r":775},
  {"name":"Opernmatt (Morphy)","fen":"1n2kb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2KR4 w k - 0 17","n":1,"line":"d1d8","r":800},
  {"name":"Epaulettenmatt","fen":"3rkr2/pp4pp/8/8/2Q5/8/PP4PP/6K1 w - - 0 1","n":1,"line":"c4e6","r":825},
  {"name":"Umwandlung","fen":"k7/2P5/1K6/8/8/8/8/8 w - - 0 1","n":1,"line":"c7c8q","r":850},
  {"name":"Damenangriff h7","fen":"r4rk1/ppp2pp1/2n5/7Q/8/3B4/PPP2PPP/R5K1 w - - 0 1","n":1,"line":"h5h7","r":875},
  {"name":"f2-Angriff (Schwarz)","fen":"r1b1k1nr/pppp1ppp/2n5/2b1p3/2B1P2q/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 5","n":1,"line":"h4f2","r":900},
  {"name":"Lollis Matt","fen":"r4rk1/pp3p1p/5PpQ/8/8/8/PP3PPP/6K1 w - - 0 1","n":1,"line":"h6g7","r":925},
  {"name":"h2-Matt (Schwarz)","fen":"6k1/5ppp/8/8/6nq/8/5PPP/3Q1RK1 b - - 0 1","n":1,"line":"h4h2","r":950},
  {"name":"Opernmatt (Morphy)","fen":"4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 16","n":2,"line":"b3b8 d7b8 d1d8","r":1100},
  {"name":"Turmwalze","fen":"8/4k3/R7/8/8/8/8/1R4K1 w - - 0 1","n":2,"line":"b1b7 e7d8 a6a8","r":1150},
  {"name":"Bodens Matt","fen":"2kr1b1r/pp1n1ppp/2n5/8/5B2/2Q5/PP3PPP/5BK1 w - - 0 1","n":2,"line":"c3c6 b7c6 f1a6","r":1200},
  {"name":"Légals Matt","fen":"rn1qkbnr/ppp2p1p/3p2p1/4N3/2B1P3/2N5/PPPP1PPP/R1BbK2R w KQkq - 0 6","n":2,"line":"c4f7 e8e7 c3d5","r":1250},
  {"name":"Grundreihen-Opfer","fen":"3r2k1/2q2ppp/8/3Q4/8/8/5PPP/3R2K1 w - - 0 1","n":2,"line":"d5d8 c7d8 d1d8","r":1300},
  {"name":"Grundreihe (Schwarz)","fen":"3r2k1/5ppp/8/8/3q4/8/2Q2PPP/3R2K1 b - - 0 1","n":2,"line":"d4d1 c2d1 d8d1","r":1350},
  {"name":"Ersticktes Matt","fen":"5rk1/5Npp/8/8/2Q5/8/6PP/6K1 w - - 0 1","n":3,"line":"f7h6 g8h8 c4g8 f8g8 h6f7","r":1600},
  {"name":"Philidors Vermächtnis","fen":"1r5k/6pp/7N/3Q4/8/8/6PP/6K1 w - - 0 1","n":2,"line":"d5g8 b8g8 h6f7","r":1400},
  {"name":"Anastasias Matt","fen":"1q3r1k/4Nppp/8/4R3/7Q/8/5PPP/6K1 w - - 0 1","n":2,"line":"h4h7 h8h7 e5h5","r":1450},
  {"name":"Anastasias Matt","fen":"1q3rk1/5ppp/8/3NR3/7Q/8/5PPP/6K1 w - - 0 1","n":3,"line":"d5e7 g8h8 h4h7 h8h7 e5h5","r":1700},
  {"name":"Réti – Tartakower 1910","fen":"rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9","n":3,"line":"d3d8 e8d8 d2g5 d8c7 g5d8","r":1800}
];

if(typeof window === 'undefined'){ if(typeof module !== 'undefined') module.exports = { E: ENGINE(), PUZZLES, ENGINE }; return; }

/* ======================================================================
   UI
   ====================================================================== */
const E = ENGINE();
const LEVELS = [
  { name: 'Anfänger', elo: 400, time: 200, depth: 1, noise: 220, rnd: 0.3 },
  { name: 'Einsteiger', elo: 800, time: 300, depth: 2, noise: 110, rnd: 0.1 },
  { name: 'Hobby', elo: 1200, time: 500, depth: 3, noise: 45, rnd: 0.03 },
  { name: 'Fortgeschritten', elo: 1600, time: 800, depth: 5, noise: 15, rnd: 0 },
  { name: 'Experte', elo: 2000, time: 1100, depth: 64, noise: 0, rnd: 0 },
  { name: 'Meister', elo: 2300, time: 1500, depth: 64, noise: 0, rnd: 0 }
];
const CLOCKS = { none: null, blitz: { base: 180000, inc: 2000, label: 'Blitz 3+2' }, rapid: { base: 600000, inc: 0, label: 'Schnell 10+0' } };
const DE = { K: 'K', Q: 'D', R: 'T', B: 'L', N: 'S' };

/* ---------- Figuren (eigenes SVG-Set) ---------- */
const BASE = '<path d="M22 89 C22 81 27 78 32 78 H68 C73 78 78 81 78 89 Z"/>';
const SHAPES = {
  1: { f: '<path d="M40 47 C40 61 33 69 30 78 H70 C67 69 60 61 60 47 Z"/>' + BASE + '<path d="M34 49 C34 42 41 39 50 39 C59 39 66 42 66 49 Z"/><circle cx="50" cy="26" r="13"/>', d: '' },
  2: { f: BASE + '<path d="M30 78 C30 67 37 58 44 50 C40 53 34 56 28 58 C22 60 17 56 18 49 C19 43 26 34 33 27 L33 16 L41 23 L46 13 L51 22 C67 26 77 41 77 60 C77 68 75 74 75 78 Z"/>',
       d: '<path d="M55 27 C66 35 71 48 71 66"/><circle cx="37" cy="33" r="3" class="e"/><circle cx="23" cy="51" r="1.8" class="e"/>' },
  3: { f: '<path d="M35 78 C38 67 41 61 41 55 H59 C59 61 62 67 65 78 Z"/>' + BASE + '<path d="M35 57 C35 51 42 49 50 49 C58 49 65 51 65 57 Z"/><path d="M50 16 C40 25 33 34 35 43 C36 48 41 50 50 50 C59 50 64 48 65 43 C67 34 60 25 50 16 Z"/><circle cx="50" cy="12" r="5"/>',
       d: '<path d="M56 27 L46 38"/>' },
  4: { f: BASE + '<path d="M28 78 L31 70 H69 L72 78 Z"/><path d="M34 70 L36 39 H64 L66 70 Z"/><path d="M30 39 L27 31 V15 H37 V22 H45 V15 H55 V22 H63 V15 H73 V31 L70 39 Z"/>',
       d: '<path d="M31 31 H69 M37 39 H63"/>' },
  5: { f: BASE + '<path d="M29 78 C31 68 30 60 20 32 L35 52 L35 25 L46 50 L50 20 L54 50 L65 25 L65 52 L80 32 C70 60 69 68 71 78 Z"/><circle cx="20" cy="29" r="5"/><circle cx="35" cy="22" r="5"/><circle cx="50" cy="16" r="5"/><circle cx="65" cy="22" r="5"/><circle cx="80" cy="29" r="5"/>',
       d: '<path d="M31 69 C44 65 56 65 69 69"/>' },
  6: { f: '<path d="M47 8 H53 V14 H59 V20 H53 V31 H47 V20 H41 V14 H47 Z"/>' + BASE + '<path d="M30 78 C30 70 22 63 20 53 C18 43 26 37 34 38 C41 39 46 45 50 52 C54 45 59 39 66 38 C74 37 82 43 80 53 C78 63 70 70 70 78 Z"/><path d="M50 53 C44 45 43 37 50 30 C57 37 56 45 50 53 Z"/>',
       d: '<path d="M31 70 C44 66 56 66 69 70"/>' }
};
const svgCache = {};
function pieceSVG(p){
  if(svgCache[p]) return svgCache[p];
  const w = p < 8, t = p & 7, id = 'chg' + (w ? 'w' : 'b'), sh = SHAPES[t];
  const fill = w ? ['#ffffff', '#cfc5ef'] : ['#4b3f6c', '#100c1c'];
  const stroke = w ? '#1c1631' : '#030208', det = w ? '#1c1631' : '#d6c3ff';
  return svgCache[p] = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="' + fill[0] + '"/><stop offset="1" stop-color="' + fill[1] + '"/></linearGradient></defs>' +
    '<g fill="url(#' + id + ')" stroke="' + stroke + '" stroke-width="3.4" stroke-linejoin="round">' + sh.f + '</g>' +
    (sh.d ? '<g fill="none" stroke="' + det + '" stroke-width="2.6" stroke-linecap="round" opacity=".85">' + sh.d.replace(/class="e"/g, 'fill="' + det + '" stroke="none"') + '</g>' : '') + '</svg>';
}

const CSS = `
.ch-wrap{display:flex;flex-direction:column;gap:8px;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.ch-player{display:flex;align-items:center;gap:9px;min-height:44px;padding:4px 6px 4px 6px;border-radius:12px;background:var(--glass);border:1px solid var(--line-2);transition:border-color .2s,box-shadow .2s}
.ch-player.turn{border-color:var(--line);box-shadow:0 0 0 1px rgba(168,85,247,.35),var(--glow-v)}
.ch-ava{width:34px;height:34px;flex:0 0 34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;background:linear-gradient(135deg,rgba(168,85,247,.45),rgba(0,229,255,.25))}
.ch-ava svg{width:28px;height:28px}
.ch-pinfo{flex:1;min-width:0}
.ch-pname{font-family:var(--head);font-weight:700;font-size:15px;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.15}
.ch-pname small{color:var(--mute);font-weight:600;margin-left:4px}
.ch-caps{display:flex;align-items:center;height:17px;margin-top:1px}
.ch-caps span{display:inline-block;width:17px;height:17px;margin-right:-6px}
.ch-caps span svg{width:100%;height:100%}
.ch-caps span.gap{margin-left:8px}
.ch-adv{margin-left:11px;font-size:12px;color:var(--mute);font-family:var(--mono);font-weight:700}
.ch-clock{font-family:var(--mono);font-weight:700;font-size:19px;padding:5px 9px;border-radius:9px;background:rgba(8,8,18,.6);border:1px solid var(--line-2);min-width:82px;text-align:right;font-variant-numeric:tabular-nums;color:var(--mute)}
.ch-clock.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.ch-clock.low{color:var(--bad)}
.ch-clock.on.low{background:var(--bad);color:var(--ink);border-color:var(--bad)}
.ch-think{width:8px;height:8px;border-radius:50%;background:var(--cyan);box-shadow:var(--glow-c);animation:chPulse 1s infinite;flex:0 0 8px}
@keyframes chPulse{50%{opacity:.25}}
.ch-row{display:flex;gap:6px;align-items:stretch}
.ch-eval{width:18px;flex:0 0 18px;border-radius:8px;overflow:hidden;background:color-mix(in srgb,var(--bg) 70%,var(--violet));position:relative;border:1px solid var(--line-2)}
.ch-evalw{position:absolute;left:0;right:0;bottom:0;height:50%;background:linear-gradient(var(--ink),color-mix(in srgb,var(--ink) 80%,var(--violet)));transition:height .6s cubic-bezier(.2,.8,.2,1)}
.ch-eval.flip .ch-evalw{bottom:auto;top:0}
.ch-evalt{position:absolute;left:-2px;right:-2px;font-size:8px;font-weight:800;font-family:var(--mono);text-align:center;z-index:1;letter-spacing:-.04em}
.ch-evalt.lo{bottom:3px;color:var(--bg)}.ch-evalt.hi{top:3px;color:var(--ink)}
.ch-board{position:relative;flex:1;min-width:0;aspect-ratio:1/1;touch-action:none;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px var(--line),0 0 28px rgba(168,85,247,.35)}
.ch-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr)}
.ch-sq{position:relative}
.ch-sq.l{background:color-mix(in srgb,var(--ink) 80%,var(--violet))}
.ch-sq.d{background:color-mix(in srgb,var(--violet) 62%,var(--bg))}
.ch-sq.last::before,.ch-sq.sel::before,.ch-sq.hint::before{content:"";position:absolute;inset:0}
.ch-sq.last::before{background:rgba(0,229,255,.36)}
.ch-sq.sel::before{background:rgba(255,54,184,.5)}
.ch-sq.hint::before{background:rgba(255,201,60,.55);animation:chPulse 1s infinite}
.ch-sq.hov::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 0 4px rgba(245,245,255,.8);z-index:1}
.ch-sq.chk{background-image:radial-gradient(circle,rgba(255,40,80,1) 0%,rgba(255,40,80,.75) 30%,rgba(255,40,80,0) 72%)}
.ch-sq.chk::after{content:"";position:absolute;inset:6%;border-radius:50%;box-shadow:0 0 18px 6px rgba(255,54,90,.75);animation:chPulse 1.1s infinite}
.ch-dot{position:absolute;left:34%;top:34%;width:32%;height:32%;border-radius:50%;background:rgba(14,6,36,.32);z-index:1}
.ch-ring{position:absolute;inset:2%;border-radius:50%;border:5px solid rgba(14,6,36,.32);z-index:1}
.ch-co{position:absolute;font-size:11px;font-weight:800;font-family:var(--head);line-height:1;pointer-events:none;z-index:1}
.ch-co.f{right:3px;bottom:2px}.ch-co.r{left:3px;top:3px}
.ch-sq.l .ch-co{color:color-mix(in srgb,var(--violet) 62%,var(--bg))}.ch-sq.d .ch-co{color:color-mix(in srgb,var(--ink) 80%,var(--violet))}
.ch-pcs{position:absolute;inset:0;pointer-events:none;z-index:2}
.ch-pc{position:absolute;width:12.5%;height:12.5%;transition:transform .2s cubic-bezier(.25,.8,.3,1);will-change:transform}
.ch-pc svg{width:100%;height:100%;display:block;filter:drop-shadow(0 2px 1.5px rgba(0,0,0,.4))}
.ch-pc.drag{z-index:10;transition:none}
.ch-pc.drag svg{filter:drop-shadow(0 8px 8px rgba(0,0,0,.5)) drop-shadow(0 0 8px rgba(0,229,255,.6))}
.ch-arrow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4}
.ch-over{position:absolute;inset:0;z-index:12;display:flex;align-items:center;justify-content:center;background:rgba(8,8,18,.5);animation:fade .3s}
.ch-overbox{background:var(--glass);border:1px solid var(--line);border-radius:var(--r);padding:18px 18px 14px;text-align:center;box-shadow:var(--glow-v);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);min-width:220px;display:flex;flex-direction:column;gap:10px}
.ch-moves{display:flex;gap:2px;align-items:center;overflow-x:auto;white-space:nowrap;padding:6px 8px;border-radius:12px;background:var(--glass);border:1px solid var(--line-2);min-height:38px;font-family:var(--mono);font-size:14px;scrollbar-width:none}
.ch-moves::-webkit-scrollbar{height:0}
.ch-mn{color:var(--mute);margin-left:6px}.ch-mn:first-child{margin-left:0}
.ch-mv{padding:2px 5px;border-radius:6px}.ch-mv.cur{background:rgba(0,229,255,.18);color:var(--cyan)}
.ch-status{text-align:center;font-family:var(--head);font-weight:700;font-size:15px;letter-spacing:.04em;color:var(--mute);min-height:20px}
.ch-status.hot{color:var(--cyan)}
.ch-ctrl{display:grid;gap:6px}
.ch-cb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:54px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2);font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink);transition:transform .1s}
.ch-cb .i{font-size:19px;line-height:1}
.ch-cb:disabled{opacity:.35}
.ch-cb:active{transform:scale(.94)}
.ch-cb.on{border-color:var(--cyan);color:var(--cyan)}
.ch-promo{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.ch-promo button{aspect-ratio:1;border-radius:14px;background:color-mix(in srgb,var(--ink) 80%,var(--violet));border:2px solid var(--line);padding:6px}
.ch-promo button svg{width:100%;height:100%;display:block}
.ch-pz{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--glass);border:1px solid var(--line)}
.ch-pz .tx{flex:1;min-width:0}
.ch-pz b{font-family:var(--head);font-size:17px;letter-spacing:.03em;display:block}
.ch-pz small{color:var(--mute);font-size:13px}
.ch-pz.ok{border-color:var(--good);box-shadow:0 0 16px rgba(61,245,160,.35)}
.ch-pz.bad{border-color:var(--bad);box-shadow:0 0 16px rgba(255,84,112,.35)}
.ch-opts{display:flex;flex-direction:column;gap:12px}
`;

BORED.registerGame({
  id: 'chess', name: 'Schach', icon: '♞', cat: 'denk', kind: 'game', players: '1-2',
  desc: 'Klassisches Schach – gegen den Computer (6 Stärken), zu zweit am Handy oder mit Matt-Puzzles.',
  rules: [
    'Tippe eine Figur an und dann das Zielfeld – oder zieh sie mit dem Finger. Punkte zeigen legale Züge, Ringe Schlagzüge.',
    'Alle offiziellen Regeln: Rochade, en passant, Umwandlung (Dame, Turm, Läufer oder Springer wählbar).',
    'Gewonnen ist, wer den gegnerischen König mattsetzt. Patt, 50-Züge-Regel, dreifache Wiederholung und zu wenig Material sind Remis.',
    'Gegen den Computer kannst du Züge zurücknehmen, dir Tipps holen und den Bewertungsbalken einblenden.',
    'Puzzles: Finde das erzwungene Matt. Dein Puzzle-Rating steigt mit jedem gelösten Puzzle.',
    'Deine Partie wird automatisch gespeichert – über „Weiterspielen“ geht’s später weiter.'
  ],
  tags: ['alleine', 'freunde', 'drinnen', 'lang', 'schwierig'],
  mount(root, api){
    if(!document.getElementById('ch-style')){ const st = document.createElement('style'); st.id = 'ch-style'; st.textContent = CSS; document.head.append(st); }
    const el = api.el;
    const opts = Object.assign({ color: 'w', clock: 'none', evalOn: true, german: false, autoFlip: false }, api.store.get('opts', {}));
    const saveOpts = () => api.store.set('opts', opts);
    let G = null, alive = true, clockTimer = null, timers = [];
    const later = (fn, ms) => { const t = setTimeout(() => { timers = timers.filter(x => x !== t); if(alive) fn(); }, ms); timers.push(t); return t; };
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    /* ---------- Engine-Anbindung (Worker mit Fallback) ---------- */
    let worker = null, workerOk = null, seq = 0, workerUrl = null;
    const pending = new Map();
    function runLocal(req, cb){
      later(() => { let r; try{ r = E.runSearch(req.fen, req.moves, Object.assign({}, req.opt, { time: Math.min(req.opt.time, 700), depth: Math.min(req.opt.depth || 64, 6) })); }catch(e){ r = { error: String(e) }; } cb(r); }, 40);
    }
    function failWorker(){
      workerOk = false;
      if(worker){ try{ worker.terminate(); }catch(e){} worker = null; }
      const list = [...pending.values()]; pending.clear();
      list.forEach(x => runLocal(x.req, x.cb));
    }
    function getWorker(){
      if(workerOk === false) return null;
      if(worker) return worker;
      try{
        workerUrl = URL.createObjectURL(new Blob(['(' + ENGINE.toString() + ')();'], { type: 'text/javascript' }));
        worker = new Worker(workerUrl);
        worker.onmessage = e => { workerOk = true; const x = pending.get(e.data.id); if(x){ pending.delete(e.data.id); if(alive) x.cb(e.data); } };
        worker.onerror = ev => { try{ ev.preventDefault(); }catch(e){} failWorker(); };
      }catch(e){ worker = null; workerOk = false; }
      return worker;
    }
    function ask(fen, moves, opt, cb){
      const id = ++seq, req = { id, fen, moves: moves.slice(), opt };
      const w = getWorker();
      if(w){
        pending.set(id, { req, cb });
        try{ w.postMessage(req); }catch(e){ failWorker(); return id; }
        later(() => { if(pending.has(id) && workerOk !== true) failWorker(); }, (opt.time || 1000) + 2500);
      } else runLocal(req, cb);
      return id;
    }

    /* ---------- Hilfen ---------- */
    const colorName = c => c === 'w' ? 'Weiß' : 'Schwarz';
    const sideCh = pos => pos.side === E.WHITE ? 'w' : 'b';
    const fmtSan = s => opts.german ? s.replace(/[KQRBN]/g, c => DE[c]) : s;
    const diffOf = lvl => lvl <= 1 ? 0 : lvl <= 3 ? 1 : 2;
    const fmtClock = ms => {
      ms = Math.max(0, ms);
      if(ms < 20000) return Math.floor(ms / 60000) + ':' + String(Math.floor(ms / 1000) % 60).padStart(2, '0') + '.' + Math.floor(ms / 100) % 10;
      const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    };

    /* ---------- Startbildschirm ---------- */
    function showStart(){
      stopClock(); clearTimers(); G = null;
      api.setTitle('Schach');
      const save = api.store.get('save', null);
      const pr = api.store.get('pzRating', 1000), solved = api.store.get('pzSolved', []);
      const chipRow = (label, items, cur, onPick) => {
        const box = el('div', { class: 'b-chips' });
        const draw = v => { box.innerHTML = ''; items.forEach(([id, txt]) => box.append(el('button', { class: 'b-chip', 'aria-pressed': String(id === v), text: txt, onclick: () => { api.sound('click'); onPick(id); draw(id); } }))); };
        draw(cur);
        return el('div', {}, [el('span', { class: 'b-label', text: label }), box]);
      };
      const colorRow = chipRow('Deine Farbe', [['w', '♔ Weiß'], ['b', '♚ Schwarz'], ['r', '🎲 Zufall']], opts.color, v => { opts.color = v; saveOpts(); });
      const clockRow = chipRow('Schachuhr', [['none', 'Ohne Uhr'], ['blitz', 'Blitz 3+2'], ['rapid', 'Schnell 10+0']], opts.clock, v => { opts.clock = v; saveOpts(); });
      const evalRow = chipRow('Bewertungsbalken', [[true, 'An'], [false, 'Aus']], opts.evalOn, v => { opts.evalOn = v; saveOpts(); });
      const pzInfo = el('div', { class: 'b-card', style: { display: 'flex', gap: '12px', alignItems: 'center' } }, [
        el('div', { style: { fontSize: '30px' }, text: '🧩' }),
        el('div', {}, [el('b', { style: { fontFamily: 'var(--head)', fontSize: '17px' }, text: 'Puzzle-Rating ' + pr }), el('div', { class: 'b-hint', text: solved.length + ' von ' + PUZZLES.length + ' Matt-Puzzles gelöst' })])
      ]);
      let resume = null;
      if(save && save.moves){
        const lv = LEVELS[save.level] || LEVELS[0];
        resume = el('div', { class: 'b-card glow', style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, [
          el('div', { class: 'b-kicker', text: 'Laufende Partie' }),
          el('div', { class: 'b-hint', text: (save.mode === 'cpu' ? 'Gegen Computer (' + lv.name + ' ' + lv.elo + '), du spielst ' + colorName(save.human) : '2 Spieler am Handy') + ' · ' + Math.ceil(save.moves.length / 2) + ' Züge' }),
          el('div', { class: 'b-grid2' }, [
            el('button', { class: 'b-btn ghost sm', text: 'Verwerfen', onclick: async () => { if(await api.confirm('Gespeicherte Partie löschen?', 'Löschen', 'Behalten')){ api.store.set('save', null); showStart(); } } }),
            el('button', { class: 'b-btn cyan sm ch-resume', text: '▶ Weiterspielen', onclick: () => { api.sound('good'); resumeGame(save); } })
          ])
        ]);
      }
      const extra = el('div', { class: 'ch-opts' }, [resume, colorRow, clockRow, evalRow, pzInfo]);
      BORED.ui.start(root, api, {
        levels: LEVELS.map(l => l.name + ' ' + l.elo),
        defaultLevel: 2,
        modes: [{ id: 'cpu', label: '🤖 Gegen Computer' }, { id: '2p', label: '👥 2 Spieler' }, { id: 'puzzle', label: '🧩 Puzzles' }],
        extra,
        bestKey: (l, m) => m === 'puzzle' ? 'puzzle' : m === '2p' ? '2p' : 'cpu',
        bestLabel: 'Rekord',
        startLabel: '▶ Spielen',
        onStart(level, mode){ if(mode === 'puzzle') startPuzzle(); else newGame(mode, level); }
      });
      const lvGroup = root.querySelector('[aria-label="Schwierigkeit"]');
      if(lvGroup && lvGroup.previousSibling) lvGroup.previousSibling.textContent = 'Computer-Stärke';
      const sync = () => {
        const m = api.store.get('lastMode', 'cpu');
        if(lvGroup) lvGroup.parentNode.style.display = m === 'cpu' ? '' : 'none';
        colorRow.style.display = m === 'cpu' ? '' : 'none';
        clockRow.style.display = evalRow.style.display = m === 'puzzle' ? 'none' : '';
        pzInfo.style.display = m === 'puzzle' ? '' : 'none';
      };
      sync();
      const modeGroup = root.querySelector('[aria-label="Modus"]');
      if(modeGroup) modeGroup.addEventListener('click', () => setTimeout(sync, 0));
    }

    /* ---------- Partie anlegen ---------- */
    function baseGame(mode){
      return { mode, pos: new E.Pos(E.START), startFen: E.START, moves: [], sans: [], sel: -1, legal: [], last: null, over: null, thinking: false, req: 0,
        flipped: false, evalScore: 0, evalMate: 0, hint: null, hintArrow: null, clock: null };
    }
    function newGame(mode, level){
      G = baseGame(mode);
      G.level = level;
      G.human = mode === 'cpu' ? (opts.color === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : opts.color) : 'w';
      G.flipped = mode === 'cpu' && G.human === 'b';
      const ck = CLOCKS[opts.clock];
      if(ck) G.clock = { w: ck.base, b: ck.base, inc: ck.inc, last: Date.now(), label: ck.label };
      G.legal = G.pos.legal();
      buildScreen();
      save();
      if(mode === 'cpu' && G.human === 'b') later(think, 500);
    }
    function resumeGame(s){
      G = baseGame(s.mode);
      G.level = s.level | 0; G.human = s.human || 'w'; G.flipped = !!s.flipped; G.startFen = s.startFen || E.START;
      G.pos = new E.Pos(G.startFen);
      for(const u of s.moves){
        const m = G.pos.findUci(u); if(!m) break;
        G.sans.push(G.pos.san(m)); G.pos.make(m); G.moves.push(u);
        G.last = { from: m & 127, to: (m >> 7) & 127 };
      }
      if(s.clock) G.clock = Object.assign({}, s.clock, { last: Date.now() });
      G.legal = G.pos.legal();
      buildScreen();
      const st = G.pos.status();
      if(st){ endGame(st.res, st.reason); return; }
      if(G.mode === 'cpu' && sideCh(G.pos) !== G.human) later(think, 400);
      else if(opts.evalOn) analyze();
    }
    function save(){
      if(!G || G.mode === 'puzzle') return;
      if(G.over){ api.store.set('save', null); return; }
      api.store.set('save', { mode: G.mode, level: G.level, human: G.human, flipped: G.flipped, startFen: G.startFen, moves: G.moves,
        clock: G.clock ? { w: curTime('w'), b: curTime('b'), inc: G.clock.inc, label: G.clock.label } : null });
    }

    /* ---------- Spielbildschirm ---------- */
    let ui = {};
    function buildScreen(){
      root.innerHTML = '';
      api.setTitle(G.mode === 'puzzle' ? 'Puzzle' : 'Schach');
      ui = {};
      ui.top = el('div', { class: 'ch-player' }); ui.bottom = el('div', { class: 'ch-player' });
      ui.grid = el('div', { class: 'ch-grid' });
      ui.sqs = [];
      for(let i = 0; i < 64; i++){ const s = el('div', { class: 'ch-sq' }); ui.sqs.push(s); ui.grid.append(s); }
      ui.pcs = el('div', { class: 'ch-pcs' });
      ui.arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ui.arrow.setAttribute('class', 'ch-arrow'); ui.arrow.setAttribute('viewBox', '0 0 8 8');
      ui.board = el('div', { class: 'ch-board' }, [ui.grid, ui.pcs]);
      ui.board.append(ui.arrow);
      ui.evalW = el('div', { class: 'ch-evalw' }); ui.evalT = el('div', { class: 'ch-evalt' });
      ui.eval = el('div', { class: 'ch-eval' }, [ui.evalW, ui.evalT]);
      ui.status = el('div', { class: 'ch-status' });
      ui.moves = el('div', { class: 'ch-moves', 'aria-label': 'Zugliste' });
      ui.ctrl = el('div', { class: 'ch-ctrl' });
      ui.pz = el('div', { class: 'ch-pz' });
      const isPz = G.mode === 'puzzle';
      root.append(el('div', { class: 'ch-wrap' }, [
        isPz ? ui.pz : ui.top,
        el('div', { class: 'ch-row' }, [isPz ? null : ui.eval, ui.board]),
        isPz ? null : ui.bottom,
        ui.status, isPz ? null : ui.moves, ui.ctrl
      ]));
      buildControls();
      bindBoard();
      render(null);
      startClock();
    }
    const btn = (icon, label, fn, cls) => el('button', { class: 'ch-cb' + (cls ? ' ' + cls : ''), onclick: e => { api.sound('click'); fn(e); } }, [el('span', { class: 'i', text: icon }), el('span', { text: label })]);
    function buildControls(){
      ui.ctrl.innerHTML = '';
      if(G.mode === 'cpu'){
        ui.undo = btn('↶', 'Zurück', undo, 'ch-undo');
        ui.hintB = btn('💡', 'Tipp', hint, 'ch-hint');
        ui.ctrl.style.gridTemplateColumns = 'repeat(5,1fr)';
        ui.ctrl.append(ui.undo, ui.hintB, btn('⇅', 'Drehen', flip), btn('🏳', 'Aufgeben', resign), btn('☰', 'Menü', menu, 'ch-menu'));
      } else if(G.mode === '2p'){
        ui.hintB = btn('💡', 'Tipp', hint, 'ch-hint');
        ui.ctrl.style.gridTemplateColumns = 'repeat(5,1fr)';
        ui.ctrl.append(btn('½', 'Remis', offerDraw), ui.hintB, btn('⇅', 'Drehen', flip), btn('🏳', 'Aufgeben', resign), btn('☰', 'Menü', menu, 'ch-menu'));
      } else {
        ui.ctrl.style.gridTemplateColumns = 'repeat(4,1fr)';
        ui.hintB = btn('💡', 'Hinweis', pzHint, 'ch-hint');
        ui.solB = btn('👁', 'Lösung', pzSolution, 'ch-sol');
        ui.ctrl.append(ui.hintB, ui.solB, btn('⇅', 'Drehen', flip), btn('⏭', 'Nächstes', pzNext, 'ch-next'));
      }
    }
    function menu(){
      const closeS = api.sheet(close => {
        const tog = (label, key, after) => el('button', { class: 'b-item', onclick: () => { opts[key] = !opts[key]; saveOpts(); api.sound('click'); close(); after && after(); render(null); } }, [
          el('div', { class: 'tx' }, [el('b', { text: label })]), el('span', { class: 'b-pill ' + (opts[key] ? 'good' : ''), text: opts[key] ? 'An' : 'Aus' })]);
        return el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'Optionen' }),
          el('div', { class: 'b-list' }, [
            tog('Bewertungsbalken', 'evalOn', () => { if(opts.evalOn) analyze(); }),
            tog('Deutsche Notation (D, T, L, S)', 'german'),
            G.mode === '2p' ? tog('Brett nach jedem Zug drehen', 'autoFlip', () => { if(opts.autoFlip){ G.flipped = sideCh(G.pos) === 'b'; } }) : null
          ]),
          el('button', { class: 'b-btn block', text: 'Neue Partie', onclick: async () => { close(); if(G.moves.length && !G.over && !(await api.confirm('Laufende Partie abbrechen und neu starten?', 'Neu starten', 'Weiterspielen'))) return; restartSame(); } }),
          el('button', { class: 'b-btn ghost block', text: 'Zum Menü (Partie bleibt gespeichert)', onclick: () => { close(); save(); showStart(); } })
        ]);
      });
      return closeS;
    }
    function restartSame(){ const m = G.mode, l = G.level; api.store.set('save', null); if(m === 'puzzle') startPuzzle(); else newGame(m, l); }

    /* ---------- Darstellung ---------- */
    const dispToSq = (r, c) => G.flipped ? r * 16 + (7 - c) : (7 - r) * 16 + c;
    const sqToDisp = sq => G.flipped ? [sq >> 4, 7 - (sq & 7)] : [7 - (sq >> 4), sq & 7];
    function targetsOf(from){ return G.legal.filter(m => (m & 127) === from).map(m => (m >> 7) & 127); }
    function renderSquares(hover){
      const b = G.pos.b, tg = G.sel >= 0 ? targetsOf(G.sel) : [];
      const chk = G.pos.inCheck() ? G.pos.kings[G.pos.side >> 3] : -1;
      for(let r = 0; r < 8; r++) for(let c = 0; c < 8; c++){
        const sq = dispToSq(r, c), d = ui.sqs[r * 8 + c];
        const light = ((sq >> 4) + (sq & 7)) & 1;
        let cls = 'ch-sq ' + (light ? 'l' : 'd');
        if(G.last && (G.last.from === sq || G.last.to === sq)) cls += ' last';
        if(G.sel === sq) cls += ' sel';
        if(G.hint === sq) cls += ' hint';
        if(sq === chk) cls += ' chk';
        if(hover === sq) cls += ' hov';
        d.className = cls;
        d.dataset.sq = E.sqName(sq);
        let h = '';
        if(tg.includes(sq)) h += b[sq] || ((G.legal.find(m => (m & 127) === G.sel && ((m >> 7) & 127) === sq) >> 17) & 3) === 2 ? '<i class="ch-ring"></i>' : '<i class="ch-dot"></i>';
        if(r === 7) h += '<span class="ch-co f">' + 'abcdefgh'[sq & 7] + '</span>';
        if(c === 0) h += '<span class="ch-co r">' + ((sq >> 4) + 1) + '</span>';
        if(d._h !== h){ d.innerHTML = h; d._h = h; }
      }
    }
    function renderPieces(anim){
      const b = G.pos.b; ui.pcs.innerHTML = ''; ui.pcEls = {};
      for(let sq = 0; sq < 120; sq++){
        if(sq & 0x88){ sq += 7; continue; }
        const p = b[sq]; if(!p) continue;
        const [r, c] = sqToDisp(sq);
        const d = document.createElement('div');
        d.className = 'ch-pc'; d.style.left = c * 12.5 + '%'; d.style.top = r * 12.5 + '%';
        d.innerHTML = pieceSVG(p);
        ui.pcs.append(d); ui.pcEls[sq] = d;
      }
      if(anim && BORED.settings.anim){
        const go = [[anim.from, anim.to]];
        if(anim.rook) go.push(anim.rook);
        const els = [];
        go.forEach(([f, t]) => {
          const e = ui.pcEls[t]; if(!e) return;
          const [r1, c1] = sqToDisp(f), [r2, c2] = sqToDisp(t);
          e.style.transition = 'none';
          e.style.transform = 'translate(' + (c1 - c2) * 100 + '%,' + (r1 - r2) * 100 + '%)';
          els.push(e);
        });
        if(els.length){ void ui.pcs.offsetWidth; els.forEach(e => { e.style.transition = ''; e.style.transform = ''; }); }
      }
    }
    function renderArrow(){
      const a = G.hintArrow;
      if(!a){ ui.arrow.innerHTML = ''; return; }
      const [r1, c1] = sqToDisp(a.from), [r2, c2] = sqToDisp(a.to);
      const x1 = c1 + .5, y1 = r1 + .5, x2 = c2 + .5, y2 = r2 + .5, ang = Math.atan2(y2 - y1, x2 - x1);
      const L = Math.hypot(x2 - x1, y2 - y1), ex = x1 + Math.cos(ang) * (L - .32), ey = y1 + Math.sin(ang) * (L - .32);
      const hx = (dx, dy) => (x2 + Math.cos(ang) * dx - Math.sin(ang) * dy).toFixed(3) + ',' + (y2 + Math.sin(ang) * dx + Math.cos(ang) * dy).toFixed(3);
      ui.arrow.innerHTML = '<g opacity=".85" style="filter:drop-shadow(0 0 .12px #00E5FF)"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + ex.toFixed(3) + '" y2="' + ey.toFixed(3) + '" stroke="#FFC93C" stroke-width=".2" stroke-linecap="round"/>' +
        '<polygon points="' + hx(0, 0) + ' ' + hx(-.42, -.3) + ' ' + hx(-.42, .3) + '" fill="#FFC93C"/></g>';
    }
    function capsHTML(color){
      // Figuren, die "color" geschlagen hat (= fehlende gegnerische Figuren)
      const b = G.pos.b, cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for(let sq = 0; sq < 120; sq++){ if(sq & 0x88){ sq += 7; continue; } if(b[sq]) cnt[b[sq]]++; }
      const opp = color === 'w' ? 8 : 0, full = [0, 8, 2, 2, 2, 1];
      let h = '', last = 0;
      [1, 2, 3, 4, 5].forEach(t => { const n = Math.max(0, full[t] - cnt[t | opp]); for(let i = 0; i < n; i++){ h += '<span' + (last && last !== t && i === 0 ? ' class="gap"' : '') + '>' + pieceSVG(t | opp) + '</span>'; last = t; } });
      const vals = [0, 1, 3, 3, 5, 9];
      let mat = 0; for(let t = 1; t <= 5; t++) mat += vals[t] * (cnt[t] - cnt[t | 8]);
      const adv = color === 'w' ? mat : -mat;
      return h + (adv > 0 ? '<span class="ch-adv">+' + adv + '</span>' : '');
    }
    function renderPlayers(){
      if(G.mode === 'puzzle') return;
      const bottomC = G.flipped ? 'b' : 'w', topC = bottomC === 'w' ? 'b' : 'w', turn = sideCh(G.pos);
      [[ui.bottom, bottomC], [ui.top, topC]].forEach(([box, c]) => {
        const isCpu = G.mode === 'cpu' && c !== G.human;
        const name = G.mode === 'cpu' ? (isCpu ? 'Computer' : (api.profile && api.profile.name) || 'Du') : colorName(c);
        const sub = G.mode === 'cpu' ? (isCpu ? LEVELS[G.level].name + ' ' + LEVELS[G.level].elo : colorName(c)) : '';
        box.className = 'ch-player' + (turn === c && !G.over ? ' turn' : '');
        box.innerHTML = '';
        const ava = el('div', { class: 'ch-ava' });
        if(G.mode === 'cpu' && isCpu) ava.textContent = '🤖';
        else if(G.mode === 'cpu') ava.textContent = (api.profile && api.profile.avatar) || '😎';
        else ava.innerHTML = pieceSVG(c === 'w' ? 6 : 14);
        const nm = el('div', { class: 'ch-pname' }, [name, sub ? el('small', { text: sub }) : null]);
        const caps = el('div', { class: 'ch-caps', html: capsHTML(c) });
        box.append(ava, el('div', { class: 'ch-pinfo' }, [nm, caps]));
        if(isCpu && G.thinking) box.append(el('i', { class: 'ch-think', title: 'denkt' }));
        if(G.clock){ const ck = el('div', { class: 'ch-clock', 'data-c': c }); box.append(ck); }
      });
      updateClocks();
    }
    function renderMoves(){
      if(G.mode === 'puzzle') return;
      ui.moves.innerHTML = '';
      if(!G.sans.length){ ui.moves.append(el('span', { class: 'ch-mn', text: 'Noch keine Züge' })); return; }
      const blackFirst = G.startFen.split(' ')[1] === 'b';
      let n = +(G.startFen.split(' ')[5] || 1);
      G.sans.forEach((s, i) => {
        const white = blackFirst ? i % 2 === 1 : i % 2 === 0;
        if(white || i === 0) ui.moves.append(el('span', { class: 'ch-mn', text: n + (white ? '.' : '…') }));
        ui.moves.append(el('span', { class: 'ch-mv' + (i === G.sans.length - 1 ? ' cur' : ''), text: fmtSan(s) }));
        if(!white) n++;
      });
      ui.moves.scrollLeft = ui.moves.scrollWidth;
    }
    function renderEval(){
      if(G.mode === 'puzzle') return;
      ui.eval.style.display = opts.evalOn ? '' : 'none';
      if(!opts.evalOn) return;
      let pct, txt;
      if(G.evalMate){ pct = G.evalMate > 0 ? 100 : 0; txt = 'M' + Math.abs(G.evalMate); }
      else { const cp = G.evalScore; pct = 50 + 50 * Math.tanh(cp / 500); pct = Math.max(4, Math.min(96, pct)); txt = (Math.abs(cp) / 100).toFixed(1); }
      if(G.over){ pct = G.over.res === 'w' ? 100 : G.over.res === 'b' ? 0 : 50; txt = G.over.res === 'd' ? '½' : G.over.res === 'w' ? '1-0' : '0-1'; }
      ui.eval.classList.toggle('flip', G.flipped);
      ui.evalW.style.height = pct + '%';
      const whiteAhead = pct >= 50;
      // Text auf der Seite des Vorteils
      const atBottom = whiteAhead !== G.flipped;
      ui.evalT.className = 'ch-evalt ' + (atBottom ? 'lo' : 'hi');
      ui.evalT.style.color = whiteAhead ? 'var(--bg)' : 'var(--ink)';
      ui.evalT.textContent = txt;
    }
    function renderStatus(){
      let t = '', hot = false;
      if(G.mode === 'puzzle') t = G.pzMsg || '';
      else if(G.over) t = G.over.text;
      else if(G.mode === 'cpu'){
        if(G.thinking){ t = 'Computer denkt …'; }
        else { t = 'Du bist am Zug'; hot = true; }
        if(G.pos.inCheck() && !G.thinking) t = 'Schach! ' + t;
      } else { t = colorName(sideCh(G.pos)) + ' ist am Zug' + (G.pos.inCheck() ? ' – Schach!' : ''); hot = true; }
      ui.status.textContent = t; ui.status.classList.toggle('hot', hot);
      if(ui.undo) ui.undo.disabled = !G.moves.length || !!G.over || !G.moves.some((_, i) => plyColor(i) === G.human);
      if(ui.hintB && G.mode !== 'puzzle') ui.hintB.disabled = !!G.over || G.thinking || !!G.hintBusy;
    }
    const plyColor = i => { const bf = G.startFen.split(' ')[1] === 'b'; return (i % 2 === 0) !== bf ? 'w' : 'b'; };
    function render(anim){
      if(!G || !ui.board) return;
      renderSquares(); renderPieces(anim); renderArrow(); renderPlayers(); renderMoves(); renderEval(); renderStatus();
      if(G.mode === 'puzzle') renderPz();
    }

    /* ---------- Eingabe: Tippen + Ziehen ---------- */
    let drag = null;
    function canMove(){
      if(!G || G.over || G.thinking || G.busy) return false;
      if(G.mode === 'cpu') return sideCh(G.pos) === G.human;
      if(G.mode === 'puzzle') return !G.pzDone && sideCh(G.pos) === G.human;
      return true;
    }
    function sqAt(x, y){
      const r = ui.board.getBoundingClientRect();
      const c = Math.floor((x - r.left) / r.width * 8), rr = Math.floor((y - r.top) / r.height * 8);
      if(c < 0 || c > 7 || rr < 0 || rr > 7) return -1;
      return dispToSq(rr, c);
    }
    function bindBoard(){
      const bd = ui.board;
      bd.addEventListener('pointerdown', e => {
        if(!canMove()) return;
        const sq = sqAt(e.clientX, e.clientY); if(sq < 0) return;
        e.preventDefault();
        const p = G.pos.b[sq];
        const own = p && ((p & 8) === G.pos.side);
        if(G.sel >= 0 && G.sel !== sq && targetsOf(G.sel).includes(sq) && !own){ tryMove(G.sel, sq, true); return; }
        if(own){
          const wasSel = G.sel === sq;
          G.sel = sq; G.hint = null; renderSquares();
          const pe = ui.pcEls[sq];
          drag = { sq, x0: e.clientX, y0: e.clientY, started: false, wasSel, el: pe, id: e.pointerId };
          try{ bd.setPointerCapture(e.pointerId); }catch(err){}
          api.sound('tap');
        } else { G.sel = -1; renderSquares(); }
      });
      bd.addEventListener('pointermove', e => {
        if(!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
        if(!drag.started && Math.hypot(dx, dy) < 6) return;
        drag.started = true;
        if(drag.el){
          drag.el.classList.add('drag');
          const r = bd.getBoundingClientRect(), s = r.width / 8, [rr, cc] = sqToDisp(drag.sq);
          const ox = e.clientX - (r.left + (cc + .5) * s), oy = e.clientY - (r.top + (rr + .5) * s);
          drag.el.style.transform = 'translate(' + ox + 'px,' + (oy - s * .25) + 'px) scale(1.25)';
        }
        const h = sqAt(e.clientX, e.clientY);
        if(h !== drag.hov){ drag.hov = h; renderSquares(h); }
      });
      const end = e => {
        if(!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null;
        if(d.started){
          const to = sqAt(e.clientX, e.clientY);
          if(to >= 0 && to !== d.sq && targetsOf(d.sq).includes(to) && e.type !== 'pointercancel'){ tryMove(d.sq, to, false, d.el); return; }
          if(d.el){ d.el.classList.remove('drag'); d.el.style.transform = ''; }
          if(to === d.sq && d.wasSel) G.sel = -1;
          renderSquares();
        } else if(d.wasSel){ G.sel = -1; renderSquares(); }
      };
      bd.addEventListener('pointerup', end);
      bd.addEventListener('pointercancel', end);
      bd.addEventListener('contextmenu', e => e.preventDefault());
    }
    function tryMove(from, to, animate, dragEl){
      const cands = G.legal.filter(m => (m & 127) === from && ((m >> 7) & 127) === to);
      if(!cands.length) return;
      if(cands.length > 1){
        // Umwandlung: Auswahl
        let chosen = false;
        api.sheet(close => el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'Bauernumwandlung' }),
          el('p', { class: 'b-h', text: 'Wähle deine neue Figur' }),
          el('div', { class: 'ch-promo' }, [Q, R, B, N].map(t => {
            const m = cands.find(x => ((x >> 14) & 7) === t);
            return el('button', { class: 'ch-promo-' + t, 'aria-label': ['', '', 'Springer', 'Läufer', 'Turm', 'Dame'][t], html: pieceSVG(t | G.pos.side), onclick: () => { chosen = true; close(); humanMove(m, false); } });
          }))
        ]), { onClose: () => { if(!chosen){ G.sel = -1; render(null); } } });
        return;
      }
      humanMove(cands[0], animate);
    }
    const P = 1, N = 2, B = 3, R = 4, Q = 5;

    function humanMove(m, animate){
      if(G.mode === 'puzzle'){ pzMove(m, animate); return; }
      playMove(m, animate);
      if(G.over) return;
      if(G.mode === 'cpu') later(think, 120);
      else {
        if(opts.autoFlip) later(() => { G.flipped = sideCh(G.pos) === 'b'; render(null); }, 450);
        if(opts.evalOn) analyze();
      }
    }
    function playMove(m, animate){
      const pos = G.pos, from = m & 127, to = (m >> 7) & 127, fl = (m >> 17) & 3;
      const cap = !!pos.b[to] || fl === 2;
      const mover = sideCh(pos);
      const san = pos.san(m, G.legal);
      const uci = pos.uci(m);
      pos.make(m);
      G.moves.push(uci); G.sans.push(san);
      G.sel = -1; G.hint = null; G.hintArrow = null;
      G.last = { from, to };
      G.legal = pos.legal();
      if(G.clock && !G.over){
        const now = Date.now();
        if(G.moves.length > 1) G.clock[mover] -= now - G.clock.last;
        G.clock[mover] += G.clock.inc; G.clock.last = now;
      }
      let rook = null;
      if(fl === 3){ rook = to === 6 ? [7, 5] : to === 2 ? [0, 3] : to === 118 ? [119, 117] : [112, 115]; }
      const st = pos.status();
      api.sound(san.includes('+') || san.includes('#') ? 'check' : cap ? 'capture' : 'move');
      api.vibrate(cap ? 25 : 10);
      render(animate !== false || fl === 3 ? { from, to, rook: rook && rook } : (rook ? { from: rook[0], to: rook[1] } : null));
      if(st && G.mode !== 'puzzle') endGame(st.res, st.reason);
      else save();
      return st;
    }

    /* ---------- Computer ---------- */
    function think(){
      if(!G || G.over || G.mode !== 'cpu' || sideCh(G.pos) === G.human) return;
      G.thinking = true; renderStatus(); renderPlayers();
      const lv = LEVELS[G.level], t0 = Date.now();
      const opt = { time: lv.time, depth: lv.depth, noise: lv.noise + (G.moves.length < 10 && lv.noise < 20 ? 12 : 0), rnd: lv.rnd };
      if(G.clock){ const left = curTime(sideCh(G.pos)); opt.time = Math.max(80, Math.min(opt.time, left / 30 + G.clock.inc * 0.6)); }
      const myReq = ++G.req, g = G;
      ask(G.startFen, G.moves, opt, res => {
        if(G !== g || myReq !== G.req || G.over) return;
        const wait = Math.max(0, 380 - (Date.now() - t0));
        later(() => {
          if(G !== g || myReq !== G.req || G.over) return;
          G.thinking = false;
          const m = res && res.move ? G.pos.findUci(res.move) : 0;
          const mv = m || G.legal[Math.floor(Math.random() * G.legal.length)];
          if(res && res.score != null){ G.evalScore = res.score; G.evalMate = res.mate || 0; }
          if(mv) playMove(mv, true);
        }, wait);
      });
    }
    function analyze(){
      if(!G || G.over || !opts.evalOn || G.mode === 'puzzle') return;
      const myReq = ++G.req, g = G;
      ask(G.startFen, G.moves, { time: 350, depth: 64, noise: 0 }, res => {
        if(G !== g || myReq !== G.req || G.over || !res || res.score == null) return;
        G.evalScore = res.score; G.evalMate = res.mate || 0; renderEval();
      });
    }
    function hint(){
      if(!G || G.over || G.thinking || G.hintBusy) return;
      if(G.mode === 'cpu' && sideCh(G.pos) !== G.human) return;
      G.hintBusy = true; renderStatus(); ui.status.textContent = 'Suche besten Zug …';
      const g = G, myReq = ++G.req;
      ask(G.startFen, G.moves, { time: 900, depth: 64, noise: 0 }, res => {
        if(G !== g) return;
        G.hintBusy = false;
        if(myReq !== G.req || G.over){ renderStatus(); return; }
        const m = res && res.move ? G.pos.findUci(res.move) : 0;
        if(m){
          G.hintArrow = { from: m & 127, to: (m >> 7) & 127 };
          if(res.score != null){ G.evalScore = res.score; G.evalMate = res.mate || 0; }
          api.toast('💡 Tipp: ' + fmtSan(G.pos.san(m, G.legal)));
          api.sound('pop');
        }
        render(null);
      });
    }
    function undo(){
      if(!G || G.mode !== 'cpu' || G.over) return;
      if(!G.moves.some((_, i) => plyColor(i) === G.human)) return;
      G.req++; G.thinking = false; G.hintBusy = false;
      let poppedHuman = false;
      while(G.moves.length && (!poppedHuman || sideCh(G.pos) !== G.human)){
        const i = G.moves.length - 1;
        if(plyColor(i) === G.human) poppedHuman = true;
        G.pos.unmake(); G.moves.pop(); G.sans.pop();
        if(poppedHuman && sideCh(G.pos) === G.human) break;
      }
      G.legal = G.pos.legal(); G.sel = -1; G.hint = null; G.hintArrow = null;
      // letzten Zug rekonstruieren
      G.last = null;
      if(G.moves.length){ const u = G.moves[G.moves.length - 1]; G.last = { from: E.sqParse(u.slice(0, 2)), to: E.sqParse(u.slice(2, 4)) }; }
      if(G.clock) G.clock.last = Date.now();
      api.sound('flip');
      render(null); save();
      if(sideCh(G.pos) !== G.human) later(think, 300);
    }
    function flip(){ G.flipped = !G.flipped; render(null); save(); }
    async function resign(){
      if(!G || G.over) return;
      const who = G.mode === 'cpu' ? G.human : sideCh(G.pos);
      if(await api.confirm(G.mode === 'cpu' ? 'Wirklich aufgeben?' : colorName(who) + ': wirklich aufgeben?', 'Aufgeben', 'Weiterspielen'))
        if(G && !G.over) endGame(who === 'w' ? 'b' : 'w', 'Aufgegeben');
    }
    async function offerDraw(){
      if(!G || G.over) return;
      const other = sideCh(G.pos) === 'w' ? 'b' : 'w';
      if(await api.confirm(colorName(sideCh(G.pos)) + ' bietet Remis an. ' + colorName(other) + ', nimmst du an?', '½ Annehmen', 'Ablehnen')){
        if(G && !G.over) endGame('d', 'Remis vereinbart');
      } else api.toast('Remis abgelehnt – weiter geht’s!');
    }

    /* ---------- Uhr ---------- */
    function curTime(c){
      if(!G || !G.clock) return 0;
      let t = G.clock[c];
      if(!G.over && G.moves.length > 0 && sideCh(G.pos) === c) t -= Date.now() - G.clock.last;
      return t;
    }
    function updateClocks(){
      if(!G || !G.clock || !ui.board) return;
      const turn = sideCh(G.pos);
      root.querySelectorAll('.ch-clock').forEach(ck => {
        const c = ck.dataset.c, t = curTime(c);
        ck.textContent = fmtClock(t);
        ck.classList.toggle('on', turn === c && !G.over && G.moves.length > 0);
        ck.classList.toggle('low', t < 20000);
      });
      if(!G.over && G.moves.length > 0 && curTime(turn) <= 0){
        G.clock[turn] = 0;
        const other = turn === 'w' ? 'b' : 'w';
        // Gegner hat nur noch König → Remis
        const b = G.pos.b, oc = other === 'w' ? 0 : 8; let has = false;
        for(let sq = 0; sq < 120; sq++){ if(sq & 0x88){ sq += 7; continue; } const p = b[sq]; if(p && (p & 8) === oc && (p & 7) !== 6) has = true; }
        endGame(has ? other : 'd', has ? 'Zeit abgelaufen' : 'Zeit abgelaufen (zu wenig Material)');
      }
    }
    function startClock(){ stopClock(); if(G && G.clock) clockTimer = setInterval(() => { if(alive) updateClocks(); }, 100); }
    function stopClock(){ if(clockTimer){ clearInterval(clockTimer); clockTimer = null; } }

    /* ---------- Partieende ---------- */
    function endGame(res, reason){
      if(!G || G.over) return;
      if(G.clock){ G.clock.w = curTime('w'); G.clock.b = curTime('b'); }
      G.req++; G.thinking = false;
      const score = res === 'w' ? '1–0' : res === 'b' ? '0–1' : '½–½';
      let title, win = null, emoji;
      if(G.mode === 'cpu'){
        win = res === 'd' ? null : res === G.human;
        title = win ? 'Du hast gewonnen!' : win === false ? 'Verloren' : 'Remis';
        emoji = win ? '🏆' : win === false ? '💀' : '🤝';
      } else {
        title = res === 'd' ? 'Remis' : colorName(res) + ' gewinnt!';
        emoji = res === 'd' ? '🤝' : '🏆';
      }
      G.over = { res, reason, text: title + ' · ' + reason, score };
      stopClock(); api.store.set('save', null);
      api.sound(G.mode === 'cpu' ? (win ? 'win' : win === false ? 'lose' : 'good') : 'win');
      let rec = null;
      if(G.mode === 'cpu'){
        if(win) rec = api.reportScore(LEVELS[G.level].elo, 'cpu');
        G.xp = api.finish({ win, difficulty: diffOf(G.level), xp: win ? 20 + G.level * 7 : win === false ? 8 : 14 });
      } else {
        api.finish({ win: null, difficulty: 1, xp: 16 });
      }
      render(null);
      const g = G;
      const box = el('div', { class: 'ch-overbox b-pop' }, [
        el('div', { style: { fontSize: '40px', lineHeight: 1 }, text: emoji }),
        el('div', { class: 'b-title ' + (win !== false ? 'b-grad' : ''), text: title }),
        el('div', { class: 'b-hint', text: reason + ' · ' + score }),
        el('div', { class: 'b-grid2' }, [
          el('button', { class: 'b-btn ghost sm', text: 'Brett', onclick: () => { api.sound('click'); over.remove(); } }),
          el('button', { class: 'b-btn sm ch-cont', text: 'Weiter', onclick: () => { api.sound('click'); showResult(g, title, win, emoji, rec); } })
        ])
      ]);
      const over = el('div', { class: 'ch-over' }, [box]);
      ui.board.append(over);
      // Nach "Brett" bleibt ein Weiter-Knopf in der Steuerleiste
      ui.ctrl.innerHTML = ''; ui.ctrl.style.gridTemplateColumns = '1fr 1fr';
      ui.ctrl.append(btn('⇅', 'Drehen', flip), btn('▶', 'Weiter', () => showResult(g, title, win, emoji, rec), 'ch-cont2'));
    }
    function showResult(g, title, win, emoji, rec){
      const lines = [['Ergebnis', g.over.score], ['Grund', g.over.reason], ['Züge', String(Math.ceil(g.moves.length / 2))]];
      if(g.mode === 'cpu') lines.push(['Gegner', LEVELS[g.level].name + ' ' + LEVELS[g.level].elo]);
      if(rec && rec.isBest) lines.push(['Neuer Rekord', LEVELS[g.level].elo + ' Elo']);
      BORED.ui.result(root, api, {
        win, title, emoji,
        sub: g.mode === 'cpu' ? (win ? 'Stark gespielt gegen ' + LEVELS[g.level].name + '!' : win === false ? 'Nächstes Mal klappt’s – probier „Zurück“ oder „Tipp“.' : 'Unentschieden – solide!') : 'Gute Partie, ihr zwei!',
        lines,
        againLabel: 'Nochmal',
        onAgain: () => newGame(g.mode, g.level),
        onMenu: showStart
      });
    }

    /* ---------- Puzzles ---------- */
    function startPuzzle(){
      const rating = api.store.get('pzRating', 1000);
      let solved = api.store.get('pzSolved', []);
      let pool = PUZZLES.map((p, i) => i).filter(i => !solved.includes(i));
      if(!pool.length){ api.toast('Alle Puzzles gelöst – es geht von vorne los!'); solved = []; api.store.set('pzSolved', []); pool = PUZZLES.map((p, i) => i); }
      const lastPz = api.store.get('pzLast', -1);
      if(pool.length > 1) pool = pool.filter(i => i !== lastPz);
      pool.sort((a, b) => Math.abs(PUZZLES[a].r - rating) - Math.abs(PUZZLES[b].r - rating));
      const idx = api.pick(pool.slice(0, 3));
      loadPuzzle(idx);
    }
    function loadPuzzle(idx){
      const pz = PUZZLES[idx];
      api.store.set('pzLast', idx);
      G = baseGame('puzzle');
      G.pz = pz; G.pzIdx = idx; G.pos = new E.Pos(pz.fen); G.startFen = pz.fen;
      G.human = G.pos.side === E.WHITE ? 'w' : 'b';
      G.flipped = G.human === 'b';
      G.step = 0; G.line = pz.line.split(' '); G.failed = false; G.hintLvl = 0; G.pzDone = false; G.counted = false;
      G.legal = G.pos.legal();
      G.pzMsg = colorName(G.human) + ' zieht und setzt matt in ' + pz.n + (pz.n === 1 ? ' Zug' : ' Zügen');
      buildScreen();
    }
    function renderPz(){
      const rating = api.store.get('pzRating', 1000);
      const left = G.pz.n - Math.floor(G.step / 2);
      ui.pz.className = 'ch-pz' + (G.pzState === 'ok' ? ' ok' : G.pzState === 'bad' ? ' bad' : '');
      ui.pz.innerHTML = '';
      ui.pz.append(
        el('div', { class: 'ch-ava', html: pieceSVG(G.human === 'w' ? 6 : 14) }),
        el('div', { class: 'tx' }, [
          el('b', { text: G.pzDone ? (G.failed ? 'Gelöst (mit Hilfe)' : 'Gelöst! 🎉') : 'Matt in ' + left + ' · ' + G.pz.name }),
          el('small', { text: 'Puzzle ' + G.pz.r + ' · Dein Rating ' + rating + (G.pzDelta ? ' (' + (G.pzDelta > 0 ? '+' : '') + G.pzDelta + ')' : '') })
        ])
      );
      if(ui.hintB) ui.hintB.disabled = G.pzDone || G.busy;
      if(ui.solB) ui.solB.disabled = G.pzDone || G.busy;
    }
    function pzRate(success){
      if(G.counted) return;
      G.counted = true;
      const r = api.store.get('pzRating', 1000), exp = 1 / (1 + Math.pow(10, (G.pz.r - r) / 400));
      const s = success ? (G.hintLvl ? 0.5 : 1) : 0;
      const nr = Math.max(100, Math.round(r + 32 * (s - exp)));
      G.pzDelta = nr - r;
      api.store.set('pzRating', nr);
      api.reportScore(nr, 'puzzle');
      if(success){ const sv = api.store.get('pzSolved', []); if(!sv.includes(G.pzIdx)){ sv.push(G.pzIdx); api.store.set('pzSolved', sv); } }
      api.finish({ win: success, difficulty: Math.min(2, G.pz.n - 1), xp: success ? 10 + G.pz.n * 6 : 6 });
    }
    function pzMove(m, animate){
      const pos = G.pos, u = pos.uci(m), expected = G.line[G.step];
      const left = G.pz.n - Math.floor(G.step / 2);
      let ok = u === expected, mateNow = false;
      pos.make(m);
      mateNow = pos.inCheck() && !pos.hasLegal();
      if(!ok) ok = mateNow || (left > 1 && E.forcedMate(pos, left - 1, 3e5) === true);
      pos.unmake();
      const followsLine = u === expected;
      playMove(m, animate);
      if(!ok){
        G.pzState = 'bad'; G.pzMsg = 'Nicht ganz – das ist nicht das Matt. Versuch es nochmal!';
        api.sound('bad'); api.vibrate(60);
        if(!G.failed){ G.failed = true; pzRate(false); }
        G.busy = true; render(null);
        later(() => { G.pos.unmake(); G.moves.pop(); G.sans.pop(); G.legal = G.pos.legal(); G.last = null; G.busy = false; G.pzState = ''; render(null); }, 900);
        return;
      }
      if(mateNow){ pzSolved(); return; }
      G.step++;
      G.pzState = 'ok'; G.pzMsg = 'Stark! Weiter so …';
      G.busy = true; render(null);
      later(() => {
        let reply = followsLine && G.line[G.step] ? G.pos.findUci(G.line[G.step]) : 0;
        if(!reply) reply = E.bestDefense(G.pos, left - 1, G.line[G.step]);
        if(!followsLine){ G.line = G.line.slice(0, G.step); }
        G.busy = false;
        if(reply){
          playMove(reply, true);
          G.line[G.step] = G.moves[G.moves.length - 1];
          G.step++;
          if(!followsLine){ const mm = E.findMate(G.pos, G.pz.n - Math.floor(G.step / 2), 3e5); if(mm) G.line[G.step] = G.pos.uci(mm); }
        }
        G.pzState = ''; G.pzMsg = colorName(G.human) + ' am Zug – finde die Fortsetzung';
        render(null);
      }, 550);
    }
    function pzSolved(){
      G.pzDone = true; G.pzState = 'ok';
      G.pzMsg = G.failed ? 'Geschafft – beim nächsten klappt’s auf Anhieb!' : G.hintLvl ? 'Matt! (mit Hinweis)' : 'Schachmatt! Perfekt gelöst.';
      api.sound('win');
      pzRate(true);
      if(!G.failed && !G.hintLvl) api.confetti();
      render(null);
      ui.ctrl.innerHTML = ''; ui.ctrl.style.gridTemplateColumns = '1fr 1fr';
      ui.ctrl.append(btn('↺', 'Nochmal', () => loadPuzzle(G.pzIdx)), btn('⏭', 'Nächstes', pzNext, 'ch-next'));
    }
    function pzHint(){
      if(!G || G.pzDone || G.busy) return;
      const u = G.line[G.step]; if(!u) return;
      const m = G.pos.findUci(u); if(!m) return;
      G.hintLvl++;
      if(G.hintLvl === 1){ G.hint = m & 127; G.pzMsg = 'Hinweis: Diese Figur zieht.'; }
      else { G.hint = m & 127; G.hintArrow = { from: m & 127, to: (m >> 7) & 127 }; G.pzMsg = 'Hinweis: ' + fmtSan(G.pos.san(m, G.legal)); }
      api.sound('pop');
      render(null);
    }
    function pzSolution(){
      if(!G || G.pzDone || G.busy) return;
      if(!G.failed){ G.failed = true; pzRate(false); }
      G.busy = true;
      const playNext = () => {
        if(!G || G.mode !== 'puzzle') return;
        const u = G.line[G.step];
        const m = u ? G.pos.findUci(u) : 0;
        if(!m){ G.busy = false; if(G.pos.inCheck() && !G.pos.hasLegal()) pzSolved(); else { G.pzDone = true; render(null); } return; }
        playMove(m, true); G.step++;
        if(G.pos.inCheck() && !G.pos.hasLegal()){ G.busy = false; pzSolved(); return; }
        later(playNext, 700);
      };
      G.pzMsg = 'Lösung wird gezeigt …';
      playNext();
    }
    function pzNext(){
      if(G && G.mode === 'puzzle' && !G.pzDone && !G.counted && G.moves.length){ pzRate(false); }
      startPuzzle();
    }

    showStart();
    return () => {
      alive = false; stopClock(); clearTimers();
      if(G && !G.over && G.mode !== 'puzzle') save();
      if(worker){ try{ worker.terminate(); }catch(e){} }
      if(workerUrl) try{ URL.revokeObjectURL(workerUrl); }catch(e){}
    };
  }
});
})();
