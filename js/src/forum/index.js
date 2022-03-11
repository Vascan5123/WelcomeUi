import changeWelcomeHero from './settings/changeWelcomeHero';

app.initializers.add('vascan/welcome-ui', () => {
  changeWelcomeHero();
});
