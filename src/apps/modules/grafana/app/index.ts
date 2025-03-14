import app from './app';

const prepareInit = async () => {
  if (process.env.frontend_dev_mock_api) {
    return import('src/apps/modules/grafana/test/mock-api/worker').then((workerModule) => {
      workerModule.default.start({ onUnhandledRequest: 'bypass' });
    });
  }
  return Promise.resolve();
};

prepareInit().then(() => {
  app.init();
});
