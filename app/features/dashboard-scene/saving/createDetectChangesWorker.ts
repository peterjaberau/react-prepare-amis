import { CorsWorker as Worker } from '@grafana-module/app/core/utils/CorsWorker';

export const createWorker = () => new Worker(new URL('./DetectChangesWorker.ts', import.meta.url));
