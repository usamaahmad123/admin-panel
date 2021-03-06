// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import NotistackProvider from './components/NotistackProvider';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <NotistackProvider>
        <ScrollToTop />
        <Router />
      </NotistackProvider>
    </ThemeConfig>
  );
}
