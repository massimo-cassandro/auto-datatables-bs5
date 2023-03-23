import {creaDT} from './js/creaDT';
import { jquery_loader } from '@massimo-cassandro/js-utilities';

// FIXME migliorare sequenza caricamento jquery e dt
// TODO fare in modo che le funzione restituisca l'istanza datatable
// FIXME rivedere ed eliminare variabile globale Window.dt_loaded

Window.dt_loaded = false; // impedisce il ricaricamento defli scripty datatable in caso la funzione sia richiamata più volte

export function _autoDataTable( opts ) {

  opts = {...{
    // defaults
    container    : '.dt-container',
    cdt_options  : {},
    dt_options   : {},
    jquery_url   : 'https://code.jquery.com/jquery-3.6.3.min.js',
    dt_urls: [
      'https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js',
      'https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js'
    ]

  },...opts };

  opts.container = typeof opts.container === 'string'? document.querySelector(opts.container) : opts.container;

  // spinner
  opts.container.innerHTML =
    `<div class="d-flex justify-content-center">
      <div class="spinner-border spinner-border-sm my-1 text-muted" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;

  jquery_loader(opts.jquery_url, () => {

    if(opts.dt_urls && opts.dt_urls.length && !Window.dt_loaded ) {

      return (async () => {

        const result = await Promise.all(
          opts.dt_urls.map((u, idx) =>
            new Promise(resolve => {
              const script = document.createElement('script');
              script.onload = function() {
                resolve();
              };
              script.src = u;
              script.async = false;
              script.className = `dt${idx}`;
              document.head.appendChild(script);
            })
          )
        )
          .then(() => {
            Window.dt_loaded = true;
            return creaDT(opts.container, opts.cdt_options, opts.dt_options);
          });

        return result;

      })();

    } else {
      return creaDT(opts.container, opts.cdt_options, opts.dt_options);
    }
  });

}

