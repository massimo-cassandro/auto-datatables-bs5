export const cdt_default_options = {

  dtRender: null, // utilizzato da parse_element_data

  icone: {
    ok  : '<span class="icona icona-ok">&#10003;</span>',
    off : '<span class="icona icona-off">&#10060;</span>'
  },

  id_visible_default: true,
  align_right_class: 'text-right',
  align_left_class: 'text-left',


  formats: {
    decimals_class: '',
    euro_class: '',

    // opzioni per le funzione di formattazione data di _date_utilities.js
    date: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    time: {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    },
    datetime: {
      date: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      time: {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      separator: ' ',  // date-time separator
      date_wrapper: '<span class="text-nowrap"></span>', // HTML string or null or ''
      time_wrapper: '<small></small>' // HTML string or null or ''
    }
  },

  debug: false,

  container_header: null, //'Risultato della ricerca', // se presente aggiunge un header prima della tabella
  container_class: 'dt-container', // classe che viene assegnata al div che contiene la tabella
  container_header_level: 2, // livello gerarchico dell'header (h2, h3, ecc...)
  table_id: 'table-result',
  table_class: 'table table-striped table-bordered table-hover',
  table_caption: '',
  table_footer: false, // se true aggiunge una riga tfoot alla tabella, da popolare con un callback
  extra_info:''

};
