import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { loadCatalog } from './data/loadCatalog';
import { useStore } from './store/useStore';

// ────────────────────────────────────────────────────────────────────────────
// Async boot: fetch the catalog from Supabase, THEN hydrate the store, THEN
// render. Doing the fetch + rehydrate before the first render keeps every
// synchronous catalog consumer (engine, store merge, picker) working unchanged
// — and, being outside React, StrictMode can't double-fire it.
//
// HashRouter (not BrowserRouter) so deep links like /#/results never 404 on
// GitHub Pages, which has no SPA server-side rewrites.
// ────────────────────────────────────────────────────────────────────────────

const container = document.getElementById('root')!;

// Plain-DOM splash — must NOT subscribe to the store (it would read pre-hydration
// defaults). Geist is already loaded via index.html.
function splash(message: string): string {
  return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#edeef1;color:#1c1c24;font-family:Geist,system-ui,sans-serif">
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px">
        <div style="width:34px;height:34px;border-radius:9px;background:#3b6ef6"></div>
        <div style="font-size:14px;color:#6b6d72">${message}</div>
      </div>
    </div>`;
}

function errorScreen(): string {
  return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#edeef1;color:#1c1c24;font-family:Geist,system-ui,sans-serif;padding:24px;text-align:center">
      <div style="max-width:340px">
        <div style="font-size:16px;font-weight:600;margin-bottom:8px">Something went wrong starting BikeBreaker</div>
        <div style="font-size:14px;color:#6b6d72;margin-bottom:16px">Please reload the page to try again.</div>
        <button onclick="location.reload()" style="background:#1b1b1d;color:#fff;border:0;border-radius:8px;padding:10px 16px;font-size:14px;font-family:inherit;cursor:pointer">Reload</button>
      </div>
    </div>`;
}

async function boot(): Promise<void> {
  container.innerHTML = splash('Loading parts catalog…');
  try {
    await loadCatalog(); // populates CATALOG from Supabase (or keeps fallback)
    await useStore.persist.rehydrate(); // runs merge/isKnown against the catalog
    createRoot(container).render(
      <StrictMode>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </HashRouter>
      </StrictMode>,
    );
  } catch (err) {
    console.error('[BikeBreaker] Fatal boot error', err);
    container.innerHTML = errorScreen();
  }
}

void boot();
