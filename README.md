# Auto Datatable BS5

Generazione automatica di datatable a partire da un flusso JSON.

Richiede [DataTable](https://datatables.net/), e [jQuery](https://jquery.com/).

Dalla versione 2.x sia jQuery che datatable non vengoino inclusi nello script, ma caricati tramite file esterni.

## Utilizzo
```html
<div class="dt-container"></div>
```

```js
import {_autoDataTable} from '@massimo-cassandro/auto-datatables-bs5';

// i valori indicati sono quelli di default
_autoDataTable({
  container    : '.dt-container',
  cdt_options  : {},
  dt_options   : {},
  dt_columns   : [],
  jquery_url   : 'https://code.jquery.com/jquery-3.6.3.min.js',
  dt_urls : [
    'https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js', 
    'https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js'
  ]
})
```
> NB: normalmente l'array `columns` di datatable è all'interno di `dt_options`, ma può essere gestito separatamente con `dt_columns`

L'elemento `container` può essere un selettore css (stringa) o un elemento DOM.

Per ridurre il numero di chiamate è possibile unificare gli url relativi a datatable creando localmente un file unico:

```bash
cat jquery.dataTables.min.js dataTables.bootstrap5.min.js > dt.js
```

È anche possibile unire il tutto con jquery, impostando poi l'elemento `dt_urls` a `null`:

```bash
cat jquery jquery.dataTables.min.js dataTables.bootstrap5.min.js > dt.js
```

```js
import {_autoDataTable} from '@massimo-cassandro/auto-datatables-bs5';

_autoDataTable({
  container    : '.dt-container',
  cdt_options  : {},
  dt_options   : {},
  jquery_url   : 'dt.js',
  dt_urls      : null
})
```


### Configurazione tramite attributi data

L'utilità di questa funzione è il poter configurare un datatable interamente con attributi data.

il contenitore deve avere gli attributi:

* `data-dt-columns`   definizione delle colonne datatable
* `data-dt-options`   opzioni datatable
* `data-cdt-options`  opzioni per la funzione `creaDT` di `_autoDataTable`

> NB: la definizione delle colonne, secondo le specifiche datatable, sono all'interno delle opzioni (`data-dt-options`). È quindi possibile inserile anche in questo elemento, ma, in caso di conflitti, i valori in `data-dt-columns` prevarranno sugli altri.

Il contenuto di ogni attributo data deve essere un JSON valido.

Per info su tipo e opzioni delle colonne: <https://datatables.net/reference/option/columns.type>

Utilizza [Mustache JS](https://github.com/janl/mustache.js/).


Per compatibilità con le versioni precedenti, gli attributi data possono essere anche nella forma:

* `data-dt_columns`  : corrisponde a `data-dt-columns`
* `data-cdt_options` : corrisponde a `data-cdt-options`
* l'elemento `datatable_options` all'interno di `data-cdt_options` : corrisponde a `data-dt-options`

In presenza di entrambe le forme, gli elementi legacy vengono ignorati.

***

`data-dt-columns` contiene l'elemento `dtRender` che imposta molte delle funzionalità di autoDatatable.

Tra gli altri, contiene

- `bindToForm` : (fac) id del form a cui collegare datatable per fornire strumenti di ricerca avanzati. Se si utilizza un form di ricerca, l'eventuale parametro `ajax` di `datatable_options` viene ignorato, e si utilizza l'attributo `action` del form
- `storageAllowedReferrers`: path degli url abilitati a conservare lo storage relativo allo stato datatable

Esempio di implementazione (twig):

```html
<div class="dt-container"
  data-cdt-options="{{ {
    dtRender: {
      bindToForm: 'dt-ricerca',
      storageAllowedReferrers: null || [path('__scheda__', { id: null })]
    }
  }|json_encode|e('html_attr') }}" 

  data-dt-options="{{ {
      stateSave: false | default true,
      ajax: path('__json__'), // non impostare se presente `bindToForm`
      order: [[1,'asc']]
      // pageLength: 10,      // fac
      // ordering: false,     // fac
      // searching: false     // fac
    }
  }|json_encode|e('html_attr') }}" 

  data-dt-columns="{{ [
    {
      dtRender  : { type: 'id' }
    },
    {
      title     : 'XXX',
      name      : 'XXX',
      dtRender  : {
        type        : 'tpl',
        sf_base_url : path('__scheda__', { id: null }),
        tpl         : '<a href="[[sf_base_url]][[id]]">[[XXX]]</a>'
      }
    },
  
  ]|json_encode|e('html_attr') }}"></div>
```

### Collegamento a form di ricerca:

```html
<form id="dt-search" action="..."> 
  <!-- form elements -->
</form>

<div id="datatable_container"
  data-cdt-options="{ 
    dtRender: {
        bindToForm: 'dt-search'
    }
  }"
  data-dt-options="{ ... }"
  data-dt-columns="[ ... ]"
></div>
```
