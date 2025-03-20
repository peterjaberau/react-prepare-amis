import { CorsWorker as Worker } from '~/core/utils/CorsWorker';

export const createWorker = () => new Worker(new URL('./DetectChangesWorker.ts', import.meta.url));
