import { dateStringToISO, formatDate, formatDateTime } from '@massimo-cassandro/js-utilities';
import {renderTpl} from './parse-element-renderType-tpl';


/*
  Legge gli attributi data di `container` e restituisce un oggetto con
  gli elementi `cdt_options` e `dt_options` da utilizzare in `_autoDataTable`

  `container` è un elemento jQuery
*/

export  function parseElementData( container, cdt_options = {} ) {

  const opts = {};

  if(container.length) {

    const data = container.data();

    // =>> lettura attributi (anche legacy, se presenti)
    //     * `data-dt_columns`  : corrisponde a `data-dt-columns`
    //     * `data-cdt_options` : corrisponde a `data-cdt-options`
    //     * l'elemento `datatable_options` all'interno di `data-cdt_options` : corrisponde a `data-dt-options`

    opts.dt_options = $.extend(true, {}, (data.cdt_options?.datatable_options?? {}), (data.dtOptions?? {}) );

    // colonne: possono essere indicare anche all'interno di `opts.dt_options`
    // ma l'elemento `data.dtColumns` ha la priorità
    const dt_columns = [...(opts.dt_options.columns?? []), ...(data.dt_columns?? []), ...(data.dtColumns?? [])]


    // rimozione data.cdt_options.datatable_options se presente
    delete data.cdt_options?.datatable_options;

    opts.cdt_options = $.extend(true, {}, cdt_options, (data.cdt_options?? {}), (data.cdtOptions?? {}) );


    // =>> IMPOSTAZIONE COLONNE
    /*
      Ogni elemento di `dt_columns` è un oggetto con questa struttura:

      {
        title      : 'xxxxx',     -> titolo colonna
        data       : 'xxxxx',     -> chiave campo json (*)
        name       : 'xxxxx',     -> chiave campo json (*)
        className  : '__class__', -> fac.
        type       : '__type__',  -> fac., default string
        visible    : false,       -> fac.
        orderable  : false,       -> fac.
        searchable : false        -> fac.

        dtRender  : {             -> (**)
          field       : 'string', -> (***)
          type        : 'tpl',
          sf_base_url : path('__scheda__', { id: null }),
          tpl         : '<a href="[[sf_base_url]][[id]]">[[XXX]]</a>'
        }
      }

      (*) se ne può indicare uno solo e l'altro viene generato automaticamente

      (**) Le colonne con il campo `dtRender` vengono impostate in modo che utilizzino
          una delle funzioni base preimpostate (vedi di seguito).
          L'elaborazione è guidata dal valore di `dtRender.type`

      (***) fac., campo su cui operare il parsing, se non è indicato un campo
            specifico, viene utilizzato quello indicato in `name` o `data`


      L'elaborazione delle varie colonne avviene sulla base dell'elemento `item.dtRender.type`
      Se non impostato, si tratta di una colonna standard datatable
    */
    opts.dt_options.columns = dt_columns.map( item => {

      // defaults
      if(item.data && !item.name) {
        item.name = item.data;
      }
      if(item.name && !item.data) {
        item.data = item.name;
      }

      if( item.type === undefined) {
        item.type = 'string';
      }


      if(item.dtRender !== undefined ) {

        item.dtRender.field = item.dtRender.field || item.name || item.data;

        switch (item.dtRender.type) {

          // campo id
          case 'id':
            item = {...{
              title       : '#',
              data        : 'id',
              name        : 'id',
              className   : `${opts.cdt_options.align_right_class} text-muted`,
              type        : 'num',
              visible     : opts.cdt_options.id_visible_default
            }, ...item};
            break;


          // tpl: template mustache
          case 'tpl':
            item = renderTpl(item, opts);
            break;
            // END case 'tpl'


          case 'sf_date':  // symfony date
            item.data = function (row) {
              return row[item.dtRender.field] !== null ?
                '<span class="text-nowrap">' + formatDate(row[item.dtRender.field].date, opts.cdt_options.formats.date) + '</span>'
                : '&mdash;';
            };
            item.type = 'date';
            item.render = function ( data, type, row ) {
              if(type === 'sort') {
                return row[item.dtRender.field] !== null ? dateStringToISO(row[item.dtRender.field].date): '';
              } else {
                return data;
              }
            };
            item.className = item.className || opts.cdt_options.align_right_class;
            break;


          case 'sf_datetime':  // symfony datetime
            item.data = function (row) {
              return row[item.dtRender.field] !== null ?
                formatDateTime(row[item.dtRender.field].date, opts.cdt_options.formats.datetime)
                : '&mdash;';
            };
            item.type = 'date';
            item.render = function ( data, type, row ) {
              if(type === 'sort') {
                return row[item.dtRender.field] !== null ? dateStringToISO(row[item.dtRender.field].date, true) : '';
              } else {
                return data;
              }
            };
            item.className = item.className || opts.cdt_options.align_right_class;
            break;


          case 'date':  // stringa data
            item.data = function (row) {
              return row[item.dtRender.field] !== null ?
                '<span class="text-nowrap">' + formatDate(row[item.dtRender.field], opts.cdt_options.formats.date) + '</span>'
                : '&mdash;';
            };
            item.render = function ( data, type, row ) {
              if(type === 'sort') {
                return row[item.dtRender.field] !== null ? dateStringToISO(row[item.dtRender.field]) : '';
              } else {
                return data;
              }
            };
            item.type = 'date';
            item.className = item.className || opts.cdt_options.align_right_class;
            break;

          case 'datetime':  // stringa datetime
            item.data = function (row) {
              return row[item.dtRender.field] !== null ?
                formatDateTime(row[item.dtRender.field], opts.cdt_options.formats.datetime)
                : '&mdash;';
            };
            item.type = 'date';
            item.render = function ( data, type, row ) {
              if(type === 'sort') {
                return row[item.dtRender.field] !== null ? dateStringToISO(row[item.dtRender.field], true) : '';
              } else {
                return data;
              }
            };
            item.className = item.className || opts.cdt_options.align_right_class;
            break;

          case 'num':
            item.dtRender.decimali = item.dtRender.decimali || 0;
            item.data = function (row) {
              return row[item.dtRender.field]?
                row[item.dtRender.field].toLocaleString('it-IT', {
                  minimumFractionDigits: +item.dtRender.decimali,
                  maximumFractionDigits: +item.dtRender.decimali
                })
                  .replace(/,(\d+)/, ',<span class="' + opts.cdt_options.formats.decimals_class + '">$1</span>') : '';
            };
            item.type = 'num'; // 'num-fmt'
            item.render = function ( data, type, row ) {
              if(type === 'sort' || type === 'filter') {
                return row[item.dtRender.field];
              } else {
                return data;
              }
            };
            item.className = item.className || opts.cdt_options.align_right_class;

            break;

          case 'euro':
            item.dtRender.decimali = item.dtRender.decimali !== undefined? item.dtRender.decimali : 2;
            item.raw = function (row) {
              return row[item.dtRender.field] ? row[item.dtRender.field] : '';
            };

            item.data = function (row) {
              return row[item.dtRender.field] ? '<span class="' + opts.cdt_options.formats.euro_class + '">' +
                row[item.dtRender.field].toLocaleString('it-IT', {
                  minimumFractionDigits: +item.dtRender.decimali,
                  maximumFractionDigits: +item.dtRender.decimali
                })
                  .replace(/,(\d+)/, '.<span class="' + opts.cdt_options.formats.decimals_class + '">$1</span>') +
                  '</span>' : '&mdash;';
            };
            item.render = function ( data, type, row ) {
              if(type === 'sort' || type === 'filter') {
                return row[item.dtRender.field];
              } else {
                return data;
              }
            };
            item.className = item.className || opts.cdt_options.align_right_class;
            item.type = 'num'; // 'num-fmt'
            break;

          case 'bool_icons':
            item.data = function (row) {
              var true_icon   = item.dtRender.true_icon ? item.dtRender.true_icon : opts.cdt_options.icone.ok,
                false_icon  = item.dtRender.false_icon !== undefined ? item.dtRender.false_icon : opts.cdt_options.icone.off,
                null_icon   = item.dtRender.null_icon !== undefined ? item.dtRender.null_icon : opts.cdt_options.icone.off
                ;

              if(row[item.dtRender.field] === null) {
                return null_icon;
              } else {
                return (+row[item.dtRender.field] || Number.isNaN(Number(row[item.dtRender.field])) ) ?
                  true_icon : false_icon;
              }
            };

            item.render = function ( data, type, row ) {
              if(type === 'sort' || type === 'filter') {
                return +row[item.dtRender.field];
              } else {
                return data;
              }
            };
            item.type = 'num';
            break;

        } // end switch (item.dtRender.type)

        //delete item.dtRender;


      } // end if(item.dtRender !== undefined )

      // console.log(item);
      return item;

    }); // end dt_columns.map

  } // end if container.length

  return opts;

}
