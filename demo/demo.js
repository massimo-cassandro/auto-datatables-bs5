/* eslint-disable no-console */

import {_autoDataTable} from '../src/auto-datatable-bs5';


/*
  {
      "id": 5,
      "firstName": "Airi",
      "lastName": "Satou",
      "position": "Accountant",
      "office": "Tokyo"
    },
*/
_autoDataTable({
  container: '#auto-datatable-1', // oppure $('#auto-datatable-1') oppure document.getElementById('auto-datatable-1')
  cdt_options: {},
  dt_options: {
    ajax             : './demo-data.json',
    stateSave        : false,
    order            : [[0,'asc']],
    columns          : [
      {
        title      : '#',
        data       : 'id',
        className  : 'text-right'
      },
      {
        title      : 'Cognome',
        data       : 'lastName'
      },
      {
        title      : 'Nome',
        data       : 'firstName'
      },
      {
        title      : 'Sede',
        data       : 'office'
      }
    ]
  },
  // jquery_url   :
  // dt_urls      :
});



_autoDataTable({
  container: '#auto-datatable-2',
});



