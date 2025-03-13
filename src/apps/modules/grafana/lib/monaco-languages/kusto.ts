import { CorsWorker as Worker } from '../../../core/utils/CorsWorker';

export default function loadKusto() {
  return new Worker(new URL('@kusto/monaco-kusto/release/esm/kusto.worker', import.meta.url));
}
