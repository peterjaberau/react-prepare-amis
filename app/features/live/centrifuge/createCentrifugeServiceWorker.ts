import { CorsWorker as Worker } from '@grafana-module/app/core/utils/CorsWorker';

export const createWorker = () => new Worker(new URL('./service.worker.ts', import.meta.url));
