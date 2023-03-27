import {dt_default_options, dt_classes} from './datatable-defaults';
import {cdt_default_options} from './creaDataTable-defaults';
import {parseElementData} from './parse-element-data';

/*
  creaDataTable
  Genera un datatable da un flusso JSON

  * `container` è il div entro cui generare il datatable
    può essere un selettore o un elemento DOM
  * `cdt_options` è un oggetto che contiene i parametri necessari per la configurazione
  * `dt_options` è un oggetto con le impostazioni richieste da DataTable.
  * `dt_columns` è un oggetto con la definizione delle colonne. Normalmente è incluso
    all'interno di `dt_options`, ma può essere gestito separatamente per comodità

  Restituisce l'istanza del datatable generato
*/

export function creaDT( container, cdt_options = {}, dt_options = {}, dt_columns = []) {

  if(!(container instanceof $)) {
    container = $(container);
  }


  // *******************************************
  // =>> OPZIONI CREADATATABLE
  // *******************************************
  cdt_options = $.extend(true, {}, cdt_default_options, cdt_options);

  // =>> parseElementData
  // lettura valori da attributi da data
  // va fatto dopo il primo parsing di `cdt_options`, perché ne utilizza delle parti
  // la versione definitiva di `cdt_options` è quindi quella restituita da `parseElementData`
  const optsFromDataAttr = parseElementData(container, cdt_options);
  cdt_options = $.extend({}, optsFromDataAttr.cdt_options);


  cdt_options.table_id = 'cdt-' + ( container.attr('id') ? container.attr('id') : 'dom-' + container.index());
  container.html('');

  // form di ricerca
  let form_ricerca = null, form_submit_button = null;

  // collegamento a form con parametri di ricerca
  // cdt_options.dtRender.bindToForm corrisponde all'id del form
  if( cdt_options.dtRender && cdt_options.dtRender.bindToForm ) {

    form_ricerca = $('#' + cdt_options.dtRender.bindToForm );
    dt_options.ajax = {
      url: form_ricerca.attr('action') + '?' + form_ricerca.serialize(),
      // dataSrc: ''
    };

    if(cdt_options.dtRender.formSubmitButtonId) {
      form_submit_button = $('#' + cdt_options.dtRender.formSubmitButtonId );
    } else {
      form_submit_button = $( ':submit', form_ricerca );
    }
  }

  // eliminazione parametri di ricerca salvati se la pagina di provenienza non
  // inclusa nel parametro cdt_options.dtRender.storageAllowedReferrers
  // NB: controllo eseguito solo se storageAllowedReferrers !== null e undefined (= tutte le pagine ammesse)
  // per disabilitare il salvataggio usare l'opzione `stateSave = false`,
  if(cdt_options.dtRender && cdt_options.dtRender.storageAllowedReferrers !== null &&
      cdt_options.dtRender.storageAllowedReferrers !== undefined && document.referrer) {
    let allowed_referrer = false;
    cdt_options.dtRender.storageAllowedReferrers.forEach(item => {
      if(new RegExp(item).test(document.referrer)) {
        allowed_referrer = true;
      }
    });

    if(!allowed_referrer) {

      if(dt_options.stateDuration === -1) {
        sessionStorage.removeItem( 'DataTables_' + cdt_options.table_id);

      } else {
        localStorage.removeItem( 'DataTables_' + cdt_options.table_id );

      }
    }
  }

  // salvataggio parametri form ricerca
  if(dt_options.stateSave && cdt_options.dtRender && cdt_options.dtRender.bindToForm) {

    dt_options.stateSaveCallback = function(settings, data) {

      let search_form_data = Object.fromEntries(
        new FormData(document.getElementById(cdt_options.dtRender.bindToForm))
      );

      data.search_form_data = JSON.parse(JSON.stringify(search_form_data));

      if(dt_options.stateDuration === -1) {
        sessionStorage.setItem( 'DataTables_' + settings.sInstance, JSON.stringify(data) );

      } else {
        localStorage.setItem( 'DataTables_' + settings.sInstance, JSON.stringify(data) );
      }

    };

    dt_options.stateLoadCallback = function(settings) {
      let _storage;



      if(dt_options.stateDuration === -1) {
        _storage = JSON.parse( sessionStorage.getItem( 'DataTables_' + settings.sInstance ) );

      } else {
        _storage = JSON.parse( localStorage.getItem( 'DataTables_' + settings.sInstance ) );
      }

      if(_storage && _storage.search_form_data) {
        let form = $('#' + cdt_options.dtRender.bindToForm);
        for( let i in _storage.search_form_data ) {
          $(`[name="${i}"]`, form).val(_storage.search_form_data[i]);
        }

        // form.submit();
        settings.ajax = form.attr('action') + '?' + form.serialize();

      }

      return _storage;
    };

  } // end salvataggio parametri form ricerca


  // *******************************************
  // =>> IMPOSTAZIONE OPZIONI DATATABLE
  // *******************************************
  dt_options = $.extend(true, {}, dt_default_options, optsFromDataAttr.dt_options, dt_options);
  // l'array `columns` di `dt_options` può essere gestito anche separatamente nel js
  // (quello eventualmente inserito tramite attributi data è già incluso in `optsFromDataAttr.dt_options`)
  dt_options.columns = [...(dt_options.columns?? []), ...dt_columns];

  // corregge un potenziale errore nelle impostazioni, tollerato nelle versioni precedenti di dt
  // (per compatibilità con le implementazioni precedenti)
  dt_options.order = dt_options.order == null? [] : dt_options.order;


  // configurazione datatable
  $.extend( true, $.fn.DataTable.defaults, dt_options);
  $.extend( $.fn.dataTable.ext.classes, dt_classes );


  // reset container
  container.html('');

  if(cdt_options.container_header) {
    container.html('<h' + cdt_options.container_header_level + '>' + cdt_options.container_header + '</h' + cdt_options.container_header_level + '>');
  }

  let table_cells_length =
    (!dt_options.columns && dt_options.aoColumns) ?
      dt_options.aoColumns.length : dt_options.columns.length;


  container.addClass((cdt_options.container_class + ' m-datatable').trim())
    .append(
      '<table id="' + cdt_options.table_id + '" class="' + cdt_options.table_class + '">' +
      (cdt_options.table_caption? '<caption>'+cdt_options.table_caption+'</caption>' : '') +
      '<thead><tr>' + new Array(table_cells_length + 1).join('<th scope="col"></th>') + '</tr></thead>'+
      (cdt_options.table_footer? '<tfoot><tr>' + new Array(table_cells_length + 1).join('<td></td>') + '</tr></tfoot>' : '') +
      '</table>' +
      (cdt_options.extra_info? '<p class="text-muted small">' + cdt_options.extra_info + '</p>': '')
    );

  if( cdt_options.legacy ) { $.fn.dataTable.ext.legacy.ajax = true; }

  container.data('table_id', cdt_options.table_id);

  const this_datatable = $('#' + cdt_options.table_id ).dataTable(dt_options);  // datatable istance

  if(form_ricerca !== null ) {

    form_ricerca.on('submit', function (event) {
      event.preventDefault();
      form_submit_button.prop('disabled', false);

      this_datatable.ajax.url( form_ricerca.attr('action')+ '?' + form_ricerca.serialize() ).load();

      //console.log(formSubmitButton);

    }); // end submit
  }

  return this_datatable;

}
