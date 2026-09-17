'use client';

import { useInView } from 'framer-motion';
import type { ReactElement } from 'react';
import { useRef } from 'react';

/**
 * Isometric pixel-art scene — a person seated in an office chair, typing.
 *
 * Generated from a voxel model projected through a true 2:1 isometric
 * transform (sx = (x - y)·u, sy = (x + y)·u/2 - z·u), so every surface shares
 * one perspective. The output is baked to character grids: one char per pixel,
 * mapped through PALETTE, collapsed at render time into one <path> per colour.
 * Background is transparent by design.
 *
 * Layers, back to front: the static scene, each hand (typing on opposite
 * beats), the pupils (blink), and the hologram (flicker). The whole thing is
 * masked by a grid of blocks that materialise on scroll, so the art pixels
 * itself into place.
 *
 * CSS keyframes (globals.css): pixel-typing, pixel-blink, holo-flicker,
 * pixel-block-in
 */

const GRID_W = 93;
const GRID_H = 144;

/** Three tones per material: lit top face, and the two shaded side faces. */
const PALETTE: Record<string, string> = {
  a: '#131518',
  b: '#140e0a',
  c: '#171514',
  d: '#1a1c1f',
  e: '#1a1c21',
  f: '#1b130d',
  g: '#1f1c1b',
  h: '#1f2225',
  i: '#232529',
  j: '#2884c8',
  k: '#292d32',
  l: '#2a2624',
  m: '#2f3238',
  n: '#335e1d',
  o: '#383d44',
  p: '#3a3e44',
  q: '#447f27',
  r: '#4e535c',
  s: '#5b4329',
  t: '#5cab35',
  u: '#5d5f62',
  v: '#5f6164',
  w: '#69707c',
  x: '#77787b',
  y: '#7a5a38',
  z: '#7c6c56',
  A: '#7d8084',
  B: '#808387',
  C: '#846c55',
  D: '#87827b',
  E: '#8ebddb',
  F: '#9bcff0',
  G: '#a1a2a5',
  H: '#a5794b',
  I: '#a5dcff',
  J: '#a79174',
  K: '#a9adb3',
  L: '#adb1b6',
  M: '#b29172',
  N: '#b6afa5',
  O: '#d9dbdf',
  P: '#e2c49d',
  Q: '#f0c49a',
  R: '#f6eddf',
};

/** The scene, minus hands, pupils and hologram. '.' is transparent. */
const SCENE: readonly string[] = [
  '.......................ww....................................................................',
  '.....................wwwwww..................................................................',
  '...................wwwwwwwwww................................................................',
  '.................wwwwwwwwwwwwp...............................................................',
  '...............wwwwwwwwwwwwppp...............................................................',
  '.............wwwwwwwwwwwwppppp...............................................................',
  '...........wwwwwwwwwwwwpppppp............ll....ll............................................',
  '.........wwwwwwwwwwwwpppppp............llllllllllll..........................................',
  '.......wwwwwwwwwwwwppppppppww........llllllllllllllll........................................',
  '.....wwwwwwwwwwwwppppppppppwwp.....llllllllllllllllllc.......................................',
  '...wwwwwwwwwwwwppppppppppppppp...llllllllllllllllllccc.......................................',
  '.wwwwwwwwwwwwppppppppppppppppp...ggllllllllllllllllllc.......................................',
  'rwwwwwwwwwwpppppppppppppppppp....ggllllllllllllllllllcl......................................',
  'rrrwwwwwwpppppppppppppppppp......llllllllllllllllllccclll....................................',
  'rrrrrwwppppppppppppppppppppww..llggllllllllllllllccccclcc....................................',
  '.rrrrrpppppppppppppppppppppwwpgllggggllllcgllllccccccCccc....................................',
  '...rrrppppppppppppppppppppppppgggggggggcccgggccccccCCCccc....................................',
  '.wwwwrprrpppppppppppppppppppppgggggggggcccgggccccCCCCCcCC....................................',
  'rwwwwwwrrpppppppppppppppppppppgggggggggccllggccCCCCCCCCCC....................................',
  'rrrwwwwwwpppppppppppppppppppppgggggggggllllllCCCCCCCCCCCC....................................',
  'rrrrrwwpppppppppppppppppppppppgggggggggggllccCCCCCCCCCCCC....................................',
  '.rrrrrppppppppppppppppppppppppggggggggggggcccCCCCCCCCCCCC....................................',
  '...rrrppppppppppppppppppppppppggggggggggggcccCCCCCCCCCCCC....................................',
  '.wwwwrprrpppppppppppppppppppppgggggggggMMgcCCCCCCCCCCCCCC....................................',
  'rwwwwwwrrppppppppppppppppppppwMggggggggMMMCCCCCCCCCCCCCCC....................................',
  'rrrwwwwwwppppppppppppppppppwwwMMMggggggMMMCCCCCCCCCCCCCCC....................................',
  'rrrrrwwppppppppppppppppppwwwwwMMMMMggggMMMCCCCCCCQQQQCCCCtt..................................',
  'rrrrrrpppppppppppppppppwwwwwwpMMMMMMMggMMMCCCCCCMQQQQCCCCtttt................................',
  'rrrrrrpppppppppppppppwwwwwwpppMMMMMMMMMMMMCCCCCCMMMCCCCCCtttttt..............................',
  'rrrrrrpppppppppppppwwwwwwpppppMMMMMMMMMMMMCCCCCCMMMCCCCttttttnn..............................',
  'rrrrrrpppppppppppwwwwwwppppppttMMMMMMMMMMMCCCCCCCMMCCCtttttttnn..............................',
  'rrrrrrpppppppppwwwwwwppppppttttttMMMMMMMMMCCCCCCCCCCCCttttttttt..............................',
  'rrrrrrpppppppwwwwwwppppppttttttttMMMMMMMMMCCCCCCCCCCCCtttttttnn..............................',
  'rrrrrrpppppwwwwwwppppppttttttttttMMMMMMMMMCCCCCCCCCCCCtttttnnnn..............................',
  'rrrrrrpppwwwwwwppppppttttttttttttMMMMMMMMMCCCCCCCCCCCCtttnnnnnn..............................',
  'rrrrrrpwwwwwwppppppttttttttttttttttMMMMCCMCMMCCCCCCCCCtnnnnnnnntt............................',
  'rrrrrrrwwwwpppppppqttttttttttttttttttMMCCMMMMCCCCCCCCCnnnnnnnnnttn...........................',
  'rrrrrrrrrpppppppppqqqttttttttttttttttttMMMMMMCCCCCCCCCnnnnnnnnnnnn...........................',
  'rrrrrrrrrpppppppppqqqqqttttttttttttttttttMMMMCCCCCCCCCnnnnnnnnnnnn...........................',
  '.rrrrrrrrpppppppppqqqqqttttttttttttttttttttMMCCCCCCCCnnnnnnnnnnnnn...........................',
  '...rrrrrrpppppppppqqqttttttttttttttttttttttttCCCCCCnnnnnnnnnnnnnnn...........................',
  '...rrrrrrpppppppppqqqqqttttttttttttttttttttnnCCCCnnnnnnnnnnnnnnnnn...........................',
  '...rrrrrrpppppppppqqqqqqqttttttttttttttttnnnnCCnnnnnnnnnnnnnnnnnnC...........................',
  '...rrrrrrpppppppppqqqqqqqqqttttttttttttnnnnnnnnnnnnnnnnnnnnnnnnCCC...........................',
  '...rrrrrrpppppppppqqqqqqqqqqqttnnqqttnnnnnnnnnnnnnnnnnnnnnnnnCCCCC...........................',
  '...rrrrrrppppppppppqqqqqqqqqqqnnnqqqnnnnnnnnnnnnnnnnnnnnnnnnCCCCCQQ..........................',
  '...rrrrrrppppppppppppqqqqqqqqqnnnqqqnnnnnnnnnnnnnnnnnnnnnnnnCCCQQQQQQ........................',
  '...rrrrrrppppppppppttqqqqqqqqqnnnqqqnnnnnnnnnnnnnnnnnnnnnnnnCQQQQQQQQQQ......................',
  '...rrrrrrpppppppppqttqqqqqqqqqnnnqqqnnnnnnnnnnnnnnnnnnnnnnnnMQQQQQQQQQQQQ....................',
  '...rrrrrrpppppppppqqqqqqqqqqqqnnnqqqnnnnnnnnnnnnnnnnnnnnnnnnMMMQQQQQQQQQQQQ..................',
  '.....rrrrpppppppppqqqqqqqqqqqqnttttqnnnnnnnnnnnnnnnnnnnnnnnnMMMMMQQQQQQQQQQQQ................',
  '.....wrrrpppppppppqqqqqqqqqqqqqttttnnnnnnnnnnnnnnnnnnnnnnnnnMMMMMMMQQQQQQQQQQC...............',
  '...wwwrrrpppppppppqqqqqqqqqqqqqqqnnnnnnnnnnnnnnnnnnnnnnnnnnnMMMMMMMMMQQQQQQCCC...............',
  '...rrwrrrpppppppppqqqqqqqqqqqqqqqnnnnnnnnnnnnnnnnnnnnnnnnnnnMMMMMMMMMMMQQCCCCC...............',
  '...rrrrrrppppppppoqqqqqqqqqqqqqqqnnnnnnnnCnnnnnnnnnnnnnnnnnn.MMMMMMMMMMMCCCCC................',
  '...rrrrrrppppppoooqqqqqqqqqqqqqqqnnnnnnCCCnnnnnnnnnnnnnnnnnn...MMMMMMMMMCCC..................',
  '.....rrrrppppppkkoqqqqqqqqqqqqqqqnnnnCCCCCnnnnnnnnnnnnnnnnnn.....MMMMCCMC....................',
  '......rrrppppppkkkqqqqqqqqqqqqqqqnnnCCCCCQQnnnnnnnnnnnnnnnn........MMCCOO....................',
  '......rrrppppppkkkqqqqqqqqqqqqqqqnnnCCCQQQQQQnnnnnnnnnnnn............OOOOOO..................',
  '......rrrppppkkkkkqqqqqqqqqqqqqqqnnnCQQQQQQQQQQnnnnnnnnnn..........OOOOOOOOOO................',
  '.......rrpp.kkkkkkqqqqqqqqqqqqMqqnnMMQQQQQQQQQQQQnnnnnnnn........KKOOOOOOOOOOOO..............',
  '............kkkkkkqqqqqqqqqqqqMMMMMMMMMQQQQQQQQQQQQnnnnnn......KKKKKKOOOOOOOOOOOO............',
  '............kkkkkkqqqqqqqqqqqqMMMMMMMMMMMQQQQQQQQQQQQnnnn....KKKKKKuuOOOOOOOOOOOOOO..........',
  '............kkkkkkqqqqqqqqqqqqqMMMMMMMMMMMMQQQQQQQQQQCLnn..KKKKKKuuuuOOKKOOOOOOOOOOOO........',
  '............kkkkkkqqqqqqqqqqqqqqqMMMMMMMMMMMMQQQQQQCCCLLLKKKKKKuuuuuuKKKKKKOOOOOOOOOOOO......',
  '............kkkkkkqLLLLqqqqqqqqqqqqMMMMMMMMMMMMQQCCCCCLKKKKKKuuuuuuKKKKKKuuOOOOOOOOOOOOOO....',
  '...........wwkkkkkBLLLLLLqqqqqqqqqqqnMMMMMMMMMMMCCCCCKKKKKKuuuuuuKKKKKKuuuuOOOOOOOOOOOOOOx...',
  '.........wwwwwwkkkBBBLLLLLLqqqqqqqqqnnnMMMMMMMMMCCCKKKKKKuuuuuuKKKKKKuuuuuuOOOOOOOOOOOOxxx...',
  '.......wwwwwwwwwwkBBBBBLLLLLLqqqqqqqnnnnnMMMMCCMCOOAAKKuuuuuuKKKKKKuuuuuuOOOOOOOOOOOOxxxxx...',
  '......rwwwwwwwwwwwBBBBBBBLLLLLLqqqqqnnnnnLLMMCCOOOOAAAuuuuuKKKKKKuuuuuuOOOOOOOOOOOOxxxxxx....',
  '......rrrwwwwwwwwwBBBBBBBBBLLLLLLqqqnnnLLLLLLOOOOOOAAAuuuKKKKKKuuuuuuOOOOOOOOOOOOxxxxxx......',
  '......rwwwwwwwwwwwBBBBBBBBBBBLLLLLLqnLLLLLLOOOOOOOOOOAuOOAAKKuuuuuuOOOOOOOOOOOOxxxxxx........',
  '......rwwwwwwwwwwwBBBBBBBBBBBBBLLLLLLLLLLOOOOOOOOOOOOOOOOAAAuuuuuOOOOOOOOOOOOxxxxxx..........',
  '......rrrwwwwwwwwwBBBBBBBBBBBBBBBLLLLLLOOOOOOOOOOOOOOOOOOAAAuuuOOOOOOOOOOOOxxxxxx............',
  '......rrrrrwwwwwwwBBBBBBBBBBBBBBBBBLLLLGGOOOOOOOOOOOOOOOOOOAuOOOOOOOOOOOOxxxxxx..............',
  '......rrrrrrrwwwwwwBBBBBBBBBBBBBBBBBBLLGGGGOOOOOOOOOOOOOOOOOOOOOOOOOOOOxxxxxx................',
  '......rrrrrrrrrwwwwwwBBBBBBBBBBBBBBBBBBGGGGGGOOOOOOOOOOOOOOOOOOOOOOOOxxxxxx..................',
  '......rrrrrrrrrrrwwwwwwBBBBBBBBBBBBBBBBBBGGGGGGOOOOOOOOOOOOOOOOOOOOxxxxxx....................',
  '.......rrrrrrrrrrrrwwwwwwBBBBBBBBBBBBBBBBBBGGGGGGOOOOOOOOOOOOOOOOxxxxxx......................',
  '.........rrrrrrrrrrrrwwwwwwBBBBBBBBBBBBBBBBBBGGGGGGOOOOOOOOOOOOxxxxxx........................',
  '...........rrrrrrrrrrrrwwwwwwBBBBBBBBBBBBBBBBBBGGGGGGOOOOOOOOxxxxxxLLLL......................',
  '.............rrrrrrrrrrrrwwwwwwBBBBBBBBBBBBBBBBBvGGGGGGOOOOxxxxxxLLLLLLv.....................',
  '...............rrrrrrrrrrrrwwwwwwBBBBBBBBBBBBBBBvvvGGGGGGxxxxxxLLLLLLvvv.....................',
  '.......oooo..oooorrrrrrrrrrrrwwwwwwBBBBBBBBBBBBBvvvvvGGGGxxxxLLLLLLvvvvv.....................',
  '.....oooooooooooooorrrrrrrrrrrrwwwwprBBBBBBBBBBBvvvvvvvGGxxBBLLLLvvvvvvv.....................',
  '...oooooooooooooooooorrrrrrrrrrrrppprrrBBBBBBBBBvvvvvvvvvBBBBBBvvvvvvvvv.....................',
  '...kkoooooooooooooooooorrrrrrrrrrppprrrBBBBBBBBBvvvvvvvLLLLBBBBvvvvvvvvv.....................',
  '...kkkkoooohkoooooooooooorrrrrrrrppprrrBBBBBBBBBvvvvvLLLLLLvBBBvvvvvvvvv.....................',
  '...kkkkkkhhhkkkoooooooooooorrrrrrppprrrBBBBBBBBBvvvLLLLLLvvvBBBvvvvvvvvv.....................',
  '...eekkkkhhhkkkkkoooooooooooorrrrppprrrBBBBBBBBBvLLLLLLvvvvvBBBvvvvvvvvv.....................',
  '...eeeekkhhakkkkkkkoooohkoooooorrppkhrrBBBBBBBBBBLLLLvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaakkkkkkkkkhhhkkkooooookkkhhhBBBBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaakkkkkkkkkhhhkkkkkooooookhooBBBBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaaakkkkkkkkhhhkkkkkkkooooooooBBBBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaaaaakkkkkkhhhkkkkkkkkkooooooBBBBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaaaaa..kkkkhhhkooookkkkkkoohhhhBBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaaaaa....kkhhooooooookkkkkhhhhhoBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...eeeeeeaaaaaa......ooooooooooookkkhhhoooBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.....eeeeaaaa......oooooooooooohhkkkhoooooBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.......eeaa......oooooooooooohhhhkkkkoooooBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...............oooooooooooohhhhhhkkkkkkoooBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.............oooooooooooohhhhhhhhkkkkkkkkoBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '...........oooooooooooohhhhhhhhhhkkkkkkkkkBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.........oooooooooooohhhhhhhhhhhhkkkkkkkkkBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.........kkoooooooohhhhhhhhhhhh....kkkkkkkBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.........kkkkoooohhhhhhhhhhhh........kkkkkBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.........kkkkkkhhhhhhhhhhhh............kkkBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.........eekkkkhhhhaahhhh................kBBBBBBBBBvvvvvvvvvBBBvvvvvvvvv.....................',
  '.........eeeekkhhaaaahh...................BBBBBBBBBvvvvvvvvvBBBvvvvvvvvmm....................',
  '.........eeeeeeaaaaaa.....................BBBBBBBBBvvvvvvvvvBBBvvvvvvmmmmmm..................',
  '.........eeeeeeaaaaaa.....................BBBBBBBBBvvvvvvvvvBBBvvvvHHHHmmmmmm................',
  '.........eeeeeeaaaaaa.....................BBBBBBBBBvvvvvvvvviBBvvPPHHHHHHmmmmd...............',
  '.........eeeeeeaaaaaa.....................BBBBBBBBBvvvvvvvvviiiPPPPPPHHHHHHddd...............',
  '.........eeeeeeaaaaaa.....................BBBBBBBBBvvvvvvvvviPPPPPPPPPPHHssddd...............',
  '.........eeeeeeaaaaaa.....................iBBBBBBBBvvvvvvvvPPPPPPPPPPPPPPssddd...............',
  '.........eeeeeeaaaaaa.....................iiiBBBBBBvvvvvvPPPPPPPPPPPPPPPPPPddd...............',
  '...........eeeeaaaa.......................iiiiiBBBBvvvvHHHHPPPPPPPPPPPPPPPPPPd...............',
  '.............eeaa.........................iiiiiiiBBvvmyHHHHHHPPPPPPPPPPPPPPPPz...............',
  '..........................................iiiiiiiiimmmyyyHHHHHHPPPPPPPPPPPPzzz...............',
  '..........................................iiiiiiiiiiimyyyyyHHssJJPPPPPPPPzzzzz...............',
  '...........................................iiiiiiiiiiiyyyyyysssJJJJPPPPzzzzzzb...............',
  '.............................................iiiiiiiiiyyyyyysssJJJJJJzzzzzzbbb...............',
  '...............................................iiiiiiiyyyyyysssJJJJJJzzzzRRRRb...............',
  '.................................................iiiiPJyyyyysssJJJfJJzzbNRRRRD...............',
  '...................................................PPPJJJyyysssJJJfffbbbNNNDDD...............',
  '...................................................JJPJJJJJysJJJJJfffbbbNNNDDD...............',
  '...................................................JJJJJJJJJJJJJJJJffbbzzNNDD................',
  '...................................................JJJJJJJJJJJJJJJJJJzzzzzz..................',
  '...................................................JJJJJJJJJJJJzzJJJJzzzz....................',
  '...................................................JJPJJJJJJJJJzzzDJJzzz.....................',
  '...................................................PPPJJJJJJJJJzzzDDDzzz.....................',
  '...................................................JJPJJJJJJJJJzzzDzzzzz.....................',
  '...................................................JJJJJJJJJJJJzzzzzzzzPP....................',
  '...................................................JJJJJJJJJJJJzzzzzzPPPPPP..................',
  '...................................................JJJJJJJJJJJJzzzzzzJJPPzz..................',
  '...................................................JJJJJJJJJzJJzzPPzzJJJzzz..................',
  '...................................................JJJJJJJJJzzzPPPPPPJJJzzz..................',
  '.....................................................JJJJJJJzzzJJPPzzJJJzzz..................',
  '.......................................................JJJJJzzzJJJzzzJJJzzz..................',
  '.........................................................JJJzzzJJJzzzJJJzzz..................',
  '...........................................................Jz..JJJzzz..Jz....................',
  '...............................................................JJJzzz........................',
  '...............................................................JJJzzz........................',
  '.................................................................Jz..........................',
];

/** Far hand. */
const HAND_A: readonly string[] = [
  '...........QQ.....',
  '.........QQQQQQ...',
  '.QQQQ..QQQQQQQQQQ.',
  'MQQQQQQQQQQQQQQQQC',
  'MMMQQQQQQQQQQQQCCC',
  'MMMMMQQQQQQQQCCCCC',
  '.MMMMMMQQQQCCCCCCC',
  '...MMMMMMCCCCCCCCC',
  '...MMMMMMCCCCuuCCC',
  '...MM..MMCCuuuuCC.',
  '.........uuuuuu...',
  '.........uuuu.....',
  '.........uu.......',
];
const HAND_A_X = 66;
const HAND_A_Y = 54;

/** Near hand — same motion, offset beat, so the two alternate. */
const HAND_B: readonly string[] = [
  '...........QQ.....',
  '.........QQQQQQ...',
  '.QQQQ..QQQQQQQQQQ.',
  'MQQQQQQQQQQQQQQQQC',
  'MMMQQQQQQQQQQQQCCC',
  'MMMMMQQQQQQQQCCCCC',
  'MMMMMMMQQQQCCCCCCu',
  'MMMMMMMMMCCCCCCuuu',
  'MMMMMMMMMCCCCuuuuu',
  '.MMMMMMMMCCCuuuuu.',
  '...MMMMMMCCCuuu...',
  '.....MMMMCCCu.....',
  '.......MMCC.......',
];
const HAND_B_X = 42;
const HAND_B_Y = 66;

/** Pupils. Hiding this layer exposes the skin beneath, which reads as a blink. */
const EYES: readonly string[] = [
  '........b',
  '......bbb',
  '......bbb',
  '..b...bb.',
  'bbb......',
  'bbb......',
  'bb.......',
];
const EYES_X = 45;
const EYES_Y = 21;

/** Holographic panel, drawn last at partial opacity. */
const HOLO: readonly string[] = [
  '................................II..',
  '..............................IIIIII',
  '............................IIIIIIEE',
  '..........................IIIIIIEEEE',
  '........................IIIIIIEEEEEE',
  '......................IIIIIIEEEEEEEE',
  '....................IIIIIIEEEEEEjEEE',
  '..................IIIIIIEEEEEEjjjEEE',
  '................IIIIIIEEEEEEjjjjjEEE',
  '..............IIIIIIEEEEEEjjjjjjjEEE',
  '............IIIIIIEEEEEEjjjjjjjjjEEE',
  '..........IIIIIIEEEEEEjjjjjjEEjjjEEE',
  '........IIIIIIEEEEEEjjjjjjEEEEjjjEEE',
  '......IIIIIIEEEEEEjjjjjjEEEEEEjjjEEE',
  '....IIIIIIEEEEEEjjjjjjEEEEEEjjjjjEEE',
  '..IIIIIIEEEEEEjjjjjjEEEEEEjjjjjjjEEE',
  'IIIIIIEEEEEEjjjjjjEEEEEEjjjjjjjjjEEE',
  'FFIIEEEEEEjjjjjjEEEEEEjjjjjjEEjjjEEE',
  'FFFEEEEEjjjjjjEEEEEEjjjjjjEEEEjjjEEE',
  'FFFEEEjjjjjjEEEEEEjjjjjjEEEEEEjjjEEE',
  'FFFEEEjjjjEEEEEEjjjjjjEEEEEEjjjjjEEE',
  'FFFEEEjjjEEEEEjjjjjjEEEEEEjjjjjjjEEE',
  'FFFEEEjjjEEEjjjjjjEEEEEEjjjjjjjjjEEE',
  'FFFEEEjjjEjjjjjjjjEEEEjjjjjjEEjjjEEE',
  'FFFEEEjjjjjjjjjjjjEEjjjjjjEEEEjjjEEE',
  'FFFEEEjjjjjjjjjjjjjjjjjjEEEEEEjjjEEE',
  'FFFEEEjjjjjjjjjjjjjjjjEEEEEEjjjjjEEE',
  'FFFEEEjjjjjjjjjjjjjjEEEEEEjjjjjjjEEE',
  'FFFEEEjjjjjjjjjjjjEEEEEEjjjjjjjjjEEE',
  'FFFEEEjjjjjjjjjjEEEEEEjjjjjjEEjjjEEE',
  'FFFEEEjjjjjjjjEEEEEEjjjjjjEEEEjjjEEE',
  'FFFEEEjjjjjjEEEEEEjjjjjjEEEEEEjjjEEE',
  'FFFEEEjjjjEEEEEEjjjjjjEEEEEEjjjjjEEE',
  'FFFEEEjjEEEEEEjjjjjjEEEEEEjjjjjjEEEE',
  'FFFEEEEEEEEEjjjjjjEEEEEEjjjjjjEEEEEE',
  'FFFEEEEEEEjjjjjjEEEEEEjjjjjjEEEEEE..',
  'FFFEEEEEjjjjjjjEEEEEjjjjjjEEEEEE....',
  'FFFEEEjjjjjjjjjEEEjjjjjjEEEEEE......',
  'FFFEEEjjjjjjjjjEjjjjjjEEEEEE........',
  'FFFEEEjjjjjjjjjjjjjjEEEEEE..........',
  'FFFEEEjjjjjjjjjjjjEEEEEE............',
  'FFFEEEjjjjjjjjjjEEEEEE..............',
  'FFFEEEjjjjjjjjEEEEEE................',
  'FFFEEEjjjjjjEEEEEE..................',
  'FFFEEEjjjjEEEEEE....................',
  'FFFEEEjjEEEEEE......................',
  'FFFEEEEEEEEE........................',
  'FFFEEEEEEE..........................',
  'FFFEEEEE............................',
  'FFFEEE..............................',
  '..FE................................',
];
const HOLO_X = 57;
const HOLO_Y = 24;

/** Reveal mask: block size in grid pixels, and how long the whole sweep takes. */
const BLOCK = 8;
const REVEAL_SPREAD = 0.85;
const MASK_ID = 'pixel-scene-reveal';

/**
 * Deterministic pseudo-shuffle. A real PRNG would differ between the server and
 * client render and trip hydration, so the delay is a pure function of index.
 */
function blockDelay(i: number): number {
  return (((i * 7919) % 101) / 101) * REVEAL_SPREAD;
}

/**
 * Run-length encode each row, then merge every run of one colour into a single
 * <path>. Keeps each layer to one node per palette entry rather than one per
 * pixel.
 */
function toPaths(rows: readonly string[], ox = 0, oy = 0): ReactElement[] {
  const runsByChar = new Map<string, string>();

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      // '.' and any unmapped character are transparent
      if (!char || !PALETTE[char]) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === char) run += 1;
      const drawn = runsByChar.get(char) ?? '';
      runsByChar.set(char, `${drawn}M${ox + x} ${oy + y}h${run}v1h-${run}z`);
      x += run;
    }
  });

  return Array.from(runsByChar, ([char, d]) => <path key={char} d={d} fill={PALETTE[char]} />);
}

const BLOCKS = Array.from(
  { length: Math.ceil(GRID_W / BLOCK) * Math.ceil(GRID_H / BLOCK) },
  (_, i) => {
    const cols = Math.ceil(GRID_W / BLOCK);
    return { i, x: (i % cols) * BLOCK, y: Math.floor(i / cols) * BLOCK };
  },
);

export function PixelCodingScene({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox={`0 0 ${GRID_W} ${GRID_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className="h-auto w-full"
        aria-hidden="true"
      >
        <defs>
          <mask id={MASK_ID}>
            {BLOCKS.map(({ i, x, y }) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={BLOCK}
                height={BLOCK}
                fill="#fff"
                style={
                  inView
                    ? { animation: `pixel-block-in 0.3s ease-out ${blockDelay(i)}s both` }
                    : { opacity: 0 }
                }
              />
            ))}
          </mask>
        </defs>

        <g mask={`url(#${MASK_ID})`}>
          {toPaths(SCENE)}

          {/* Hands tap on opposite beats */}
          <g style={{ animation: 'pixel-typing 0.6s ease-in-out infinite' }}>
            {toPaths(HAND_A, HAND_A_X, HAND_A_Y)}
          </g>
          <g style={{ animation: 'pixel-typing 0.6s ease-in-out 0.3s infinite' }}>
            {toPaths(HAND_B, HAND_B_X, HAND_B_Y)}
          </g>

          {/* Blink */}
          <g style={{ animation: 'pixel-blink 5.5s steps(1, end) infinite' }}>
            {toPaths(EYES, EYES_X, EYES_Y)}
          </g>

          {/* Holographic screen — translucent, so the hand reads through it */}
          <g style={{ animation: 'holo-flicker 4s ease-in-out infinite' }}>
            {toPaths(HOLO, HOLO_X, HOLO_Y)}
          </g>
        </g>
      </svg>
    </div>
  );
}
