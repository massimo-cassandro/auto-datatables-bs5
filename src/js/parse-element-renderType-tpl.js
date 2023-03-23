import mustache from 'mustache/mustache.mjs';
import {mesi} from '@massimo-cassandro/js-utilities';
import { dateStringToISO, formatDate, formatTime, formatDateTime } from '@massimo-cassandro/js-utilities';


export function renderTpl(item, opts) {

  if(item.dtRender.sf_base_url != null && !/\/$/.test( item.dtRender.sf_base_url ) ) {
    item.dtRender.sf_base_url += '/';
  }

  item.data = function (row) {
    // conditional template: template differenziato in base ad un valore (`dtRender.key`)
    // il valore della chiave è confrontato con l'oggetto `dtRender.cond_tpl`
    // dtRender.tpl, se presente, è considerato come valore di default
    if(item.dtRender.key !== undefined  && item.dtRender.cond_tpl !== undefined &&
        item.dtRender.cond_tpl[row[item.dtRender.key]] !== undefined
    ) {
      item.dtRender.tpl = item.dtRender.cond_tpl[row[item.dtRender.key]];
    }

    //filter
    /*
      filter è un oggetto nella forma

      {
        nome_campo: __filter__
      }
      oppure.nel caso di filtri con parametri
      {
        nome_campo: {filter: __filter__, params...}
      }

      dove `__filter__` è uno tra striptags, nl2br ecc...

    */
    if(item.dtRender.filter !== undefined) {

      for(var i in item.dtRender.filter) {
        let filter = item.dtRender.filter[i],
          filter_params = null;

        if(typeof item.dtRender.filter[i] === 'object') {
          filter_params = item.dtRender.filter[i];
          filter = item.dtRender.filter[i].filter;
        }
        if(row[i]) {
          switch (filter) {
            case 'nl2br':
              row[i] = row[i].replace(/\r\n|\n\r|\r|\n/g, '<br>\n');
              /*
                  // autoescape
                  var regex = new RegExp('\\[\\[\\[' + i + '\\]\\]\\]|\\[\\[&' + i +'\\]\\]|\\[\\[' + i + '\\]\\]', 'g'); // eliminazione eventuali escape già presenti
                  item.dtRender.tpl = item.dtRender.tpl.replace(regex, '[[&' + i +']]');
              */
              break;

            case 'striptags':
              row[i] = row[i].replace(/(<([^>]+)>)/ig, '');
              break;

            case 'bool':
              row[i] = Boolean(+row[i]);
              break;

            case 'num_format0':
              if(!isNaN(row[i]) && row[i] !== null) {
                row[i] = row[i].toLocaleString('it-IT', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                });
              }
              break;

            case 'num_format2':
              if(!isNaN(row[i]) && row[i] !== null) {
                row[i] = row[i].toLocaleString('it-IT', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
              }
              break;

            case 'sf_date_isSameOrBeforeNow':
              if(row[i] !== null) {
                row[i] = dateStringToISO(row[i].date) <= dateStringToISO();
              } else {
                row[i] = false;
              }
              break;

            case 'sf_date_isSameOrAfterNow':
              if(row[i] !== null) {
                row[i] = dateStringToISO(row[i].date) >= dateStringToISO();
              } else {
                row[i] = false;
              }
              break;

            case 'sf_date':
              if(row[i] !== null) {
                row[i] = '<span class="text-nowrap">' + formatDate(row[i].date, opts.cdt_options.formats.date) + '</span>';
              }
              break;

            case 'sf_datetime':
              if(row[i] !== null) {
                row[i] = formatDateTime(row[i].date, opts.cdt_options.formats.datetime);

              } else {
                row[i] = '&mdash;';
              }
              break;

            case 'sf_time':
              if(row[i] !== null) {
                row[i] = formatTime(row[i].date, opts.cdt_options.formats.time);
              } else {
                row[i] = '';
              }
              break;

            case 'date':
              if(row[i] !== null) {
                row[i] = '<span class="text-nowrap">' + formatDate(row[i], opts.cdt_options.formats.date) + '</span>';
              }
              break;

            case 'strips_truncate_100':
              if(row[i]) {
                row[i] = row[i].replace(/(<([^>]+)>)/ig, '');
                row[i] = row[i].substring(0, 100) + (row[i].length > 100? '…' : '');
              }
              break;

            /*
              elabora la stringa fornita, separandola usando la stringa `separator`
              crea per ogni elemento una stringa definita dal
              template mustache `tpl`
              e restituisce una stringa concantenata secondo il parametro `glue`
              richiede la definizione dei parametri dt_render:
                - separator
                - tpl
                - glue

              Nel tpl, il singolo elemento dell'array ottenuto dalla
              separazione della stringa va indicato con `split_item`
              Su ogni elemento `split_item` viene eseguito il trim

              =======================
              esempio:
              (field1 senza elaborazione extra, field2 con filtro `split`):

              {
                title     : 'XXX',
                name      : 'XXX',
                dtRender  : {
                  type: 'tpl',
                  filter: {
                    '__field2__': {
                      filter: 'split',
                      separator: ',',
                      tpl: '<span class="badge badge-primary">[[split_item]]</span>',
                      glue: ' '
                    }
                  },
                  tpl: '[[__field1__]]<br>[[& __field2__]]'
                }
              },

            */
            case 'split':
              if(row[i]) {
                mustache.parse(filter_params.tpl);
                row[i] = row[i].split(filter_params.separator).map(item => {
                  item = item.trim();
                  return mustache.render(filter_params.tpl, {'split_item': item}, {}, ['[[', ']]']);
                })
                  .join(filter_params.glue);
              }
              break;

            /*
              replace
              elabora la stringa fornita, eseguendo un replace:
                - regexp: espressione regolare ricerca (stringa)
                - flag: regexp flag
                - replace: stringa da sostituire

              =======================
              esempio:

              {
                title     : 'XXX',
                name      : 'XXX',
                dtRender  : {
                  type: 'tpl',
                  filter: {
                    '__field2__': {
                      filter: 'replace',
                      flag: 'g',
                      regexp: '\\.|@',
                      replace: '<wbr>$&'
                    }
                  }
                }
              },

            */
            case 'replace':
              if(row[i]) {
                row[i] = row[i].replace(
                  new RegExp( filter_params.regexp, filter_params.flag? filter_params.flag : null),
                  filter_params.replace
                );
              }
              break;

            case 'mese':
              if(row[i]) {
                row[i] = +row[i];
                row[i + '_parsed'] = mesi[row[i]];
              }
              break;

            case 'annomese':
              // stringa/numero anno mese nella forma `YYYY-MM` o `YYYYMM`
              if(row[i]) {
                let anno, mese;
                if(row[i].indexOf('-') !== -1) {
                  [anno, mese] = row[i].split('-').map(i => i = +i);
                } else {
                  anno = -row[i].substr(0,4);
                  mese = +row[i].substr(4);
                }
                row[i + '_parsed'] = mesi[mese] + ' ' + anno;
              }
              break;

          } // end switch filter
        }
      }
    } // end if item.dtRender.filter

    mustache.parse(item.dtRender.tpl);
    row.sf_base_url = item.dtRender.sf_base_url || null;
    return mustache.render(item.dtRender.tpl, row, {}, ['[[', ']]']);
  }; // enf item-data func

  return item;
}
