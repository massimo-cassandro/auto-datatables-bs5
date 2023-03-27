export const dt_default_options = {
  dom:
    // controlli
    '<\'row justify-content-between d-print-none\'<\'col-sm-auto\'l><\'col-sm-auto\'f>>' +
    // table + processing
    //"<'position-relative'tr>" +
    // table + processing
    '<\'table-responsive-md\'t>r' +
    // info + paginazione
    '<\'row mt-2 d-print-none\'<\'col-sm-5 col-md-6 small\'i><\'col-sm-7 col-md-6\'p>>',

  renderer                                : 'bootstrap',
  stripeClasses                           : [], // disabilita stripe classes
  // responsive       : true,
  // responsive       : {
  //   breakpoints: [
  //     { name: 'desktop', width: Infinity },
  //     { name: 'tablet',  width: 1024 },
  //     { name: 'phone',   width: 480 }
  //   ]
  // },

  paging                                  : true,
  pageLength                              : 25,
  //pagingType           : "bootstrap",
  processing                              : true,
  serverSide                              : true,
  autoWidth                               : false,

  // fixedHeader      : true,
  stateSave                               : true,
  stateDuration                           : -1, // = sessionStorage, // 3600 -> se val. in secondi, localstorage

  //caseInsensitive     : true, // default true

  columnDefs       : [{
    orderable      : true,
    targets        : ['_all']
  }],
  ajax             : null,
  order            : [],
  columns          : [],

  language              : {
    emptyTable                            : 'Nessun record trovato',
    processing:
      '<div class="text-center">'+
        '<div class="spinner-border text-primary" role="status">' +
          '<span class="visually-hidden">Caricamento in corso...</span>' +
          '</div>' +
      '</div>',
    info                                  : 'Stai visualizzando le righe da _START_ a _END_ su un totale di <strong>_TOTAL_</strong> record trovati',
    infoEmpty                             : '<strong>Nessun record trovato</strong>',
    infoFiltered                          : '(filtrati da <strong>_MAX_</strong> record)',
    infoPostFix                           : '',
    lengthMenu:
      '<div class="d-sm-flex">' +
        '<div>Mostra</div>' +
        '<div class="dt-control mx-sm-2">_MENU_</div>' +
        '<div>record per pagina</div>' +
      '</div>',
    loadingRecords                        : '<em class="small">Attendi&hellip;</em>',
    search :
      '<div class="d-sm-flex">' +
        '<div class="mr-sm-2">Filtra risultati:</div>' +
        '<div class="dt-control">_INPUT_</div>' +
      '</div>',
    zeroRecords                           : '<strong>Nessun record trovato</strong>',
    url                                   : '',

    paginate            : {
      first                               : '',
      previous                            : '',
      next                                : '',
      last                                : ''
    },

    decimal                               : ',',
    thousands                             : '.',
    aria                : {
      sortAscending                       : ' - Click o invio per ordinare in senso ascendente',
      sortDescending                      : ' - Click o invio per ordinare in senso discendente'
    }
  }
};


// Default class modification
export const dt_classes = {
  sWrapper          : 'datatable-wrapper',

  //CONTROLS
  sLength           : 'datatable-length',
  sLengthSelect     : 'form-control form-control-sm',
  sFilter           : 'datatable-filter',
  sFilterInput      : 'form-control form-control-sm',

  //PROCESSING
  sProcessing       : 'dataTables_processing'

  // INFO
  //sInfo           : "dataTables_info",

  // PAGINAZIONE
  //sPageButton     : "paginate_button page-item",
  //sPaging         : "dataTables_paginate paging_" // Note that the type is postfixed

  // SORTING
  //sSortAsc        : "sorting_asc",
  //sSortDesc       : "sorting_desc",
  //sSortable       : "sorting", // Sortable in both directions
  //sSortableAsc    : "sorting_asc_disabled",
  //sSortableDesc   : "sorting_desc_disabled",
  //sSortableNone   : "sorting_disabled",
  //sSortColumn     : "sorting_", // Note that an int is postfixed for the sorting order
};

/*
classi default (1.10)

$.extend( DataTable.ext.classes, {
	"sTable": "dataTable",
	"sNoFooter": "no-footer",

	// Paging buttons
	"sPageButton": "paginate_button",
	"sPageButtonActive": "current",
	"sPageButtonDisabled": "disabled",

	// Striping classes
	"sStripeOdd": "odd",
	"sStripeEven": "even",

	// Empty row
	"sRowEmpty": "dataTables_empty",

	// Features
	"sWrapper": "dataTables_wrapper",
	"sFilter": "dataTables_filter",
	"sInfo": "dataTables_info",
	"sPaging": "dataTables_paginate paging_", // Note that the type is postfixed
	"sLength": "dataTables_length",
	"sProcessing": "dataTables_processing",

	// Sorting
	"sSortAsc": "sorting_asc",
	"sSortDesc": "sorting_desc",
	"sSortable": "sorting", // Sortable in both directions
	"sSortableAsc": "sorting_asc_disabled",
	"sSortableDesc": "sorting_desc_disabled",
	"sSortableNone": "sorting_disabled",
	"sSortColumn": "sorting_", // Note that an int is postfixed for the sorting order

	// Filtering
	"sFilterInput": "",

	// Page length
	"sLengthSelect": "",

	// Scrolling
	"sScrollWrapper": "dataTables_scroll",
	"sScrollHead": "dataTables_scrollHead",
	"sScrollHeadInner": "dataTables_scrollHeadInner",
	"sScrollBody": "dataTables_scrollBody",
	"sScrollFoot": "dataTables_scrollFoot",
	"sScrollFootInner": "dataTables_scrollFootInner",

	// Misc
	"sHeaderTH": "",
	"sFooterTH": "",
} );
*/
