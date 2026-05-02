import Conf from 'conf';
import path from 'path';

export const SUPPORTED_MODELS = [
  'qwen/qwen3.5-122b-a10b',
  'meta/llama-3.1-405b-instruct',
  'meta/llama-3.1-70b-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'mistralai/mixtral-8x22b-instruct-v0.1'
];

export const DEFAULT_MODEL = SUPPORTED_MODELS[0];

interface ConfigSchema {
  nimApiKey?: string;
  model: string;
  reportsDir: string;
}

const config = new Conf<ConfigSchema>({
  projectName: 'performance-coach-cli',
  defaults: {
    model: DEFAULT_MODEL,
    reportsDir: path.join(process.cwd(), 'task-reports'),
  },
});

export default config;
