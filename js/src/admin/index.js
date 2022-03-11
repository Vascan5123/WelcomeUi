import DefaultSettingsPage from './components/DefaultSettingsPage';

app.initializers.add('vascan/welcome-ui', () => {
  app.extensionData.for('vascan-welcome-ui')
    .registerPage(DefaultSettingsPage);
});
