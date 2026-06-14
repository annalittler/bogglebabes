import { TrieEngine } from 'game-ready-dictionary';
import trieData from 'game-ready-dictionary/data';

let engine = null;

export function loadDictionary() {
  if (!engine) {
    engine = new TrieEngine(trieData);
  }
  return engine;
}
