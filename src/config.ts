import Conf from 'conf';
import path from 'path';

interface ConfigSchema {
  nimApiKey?: string;
  model: string;
  reportsDir: string;
}

const config = new Conf<ConfigSchema>({
  projectName: 'performance-coach-cli',
  defaults: {
    model: 'qwen/qwen2.5-72b-instruct',
    reportsDir: path.join(process.cwd(), 'task-reports'),
  },
});

export default config;
