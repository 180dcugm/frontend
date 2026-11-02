import * as migration_20261029_104633_baseline from './20261029_104633_baseline';
import * as migration_20261029_104643_partners from './20261029_104643_partners';

export const migrations = [
  {
    up: migration_20261029_104633_baseline.up,
    down: migration_20261029_104633_baseline.down,
    name: '20261029_104633_baseline',
  },
  {
    up: migration_20261029_104643_partners.up,
    down: migration_20261029_104643_partners.down,
    name: '20261029_104643_partners'
  },
];
