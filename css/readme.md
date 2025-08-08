**NB versione patch per utilizzo senza sass, in attesa di alternativa a datatable**

# auto-datatables / css

Questa versione non richiede Bootstrap.

## proprieta css

Le proprietà sono assegnate alla classe `m-datatable` (vedi [`crea-datatable.css`](crea-datatable.css)), per sovrascriverle, assegnarle alla classe `datatable-wrapper` (elemento contenuto in `m-datatable`):


## STRUTTURA del markup costruito da datatable e creaDatatable

```html
<!-- 
container creaDatatable. 
  * La classe `dt-container` deve essere presente nel markup, il nome può essere modificato 
    tramite l'opzione `container_class`  di creaDatatable
  * La classe `m-datatable` viene assegnata dallo script 
  * La classe `w-arrow` è assegnata solo se l'opzione `use_sorting_arrow` di creaDatatable è `true`
-->
<div class="dt-container m-datatable w-arrow">  

  <!-- parametro dataTable.defaults.dom in _datatables_config_bs4.js : -->
  <div class="datatable-wrapper">

    <div class="row">
      <div class="col-sm-6">
        <div class="dataTables_length"> [Select record per pagina] </div>
      </div>
      <div class="col-sm-6">
        <div class="datatables-filter"> [Input filtro] </div>
      </div>
    </div>

    <table class="..."> </table>
    <div class="dataTables_processing"></div>

    <div class="row">
      <div class="col-sm-5">
        <div class="dataTables_info">
          <small>Stai visualizzando le righe da 1 a 10 su un totale di 10 record trovati</small>
          <small>(filtrati da 167 record)</small>
        </div>
      </div>
      <div class="col-sm-7">
        <div class="dataTables_paginate paging_simple_numbers">
          <ul class="pagination">
            <li class="paginate_button page-item active"><a href="#" class="page-link">1</a></li>
          </ul>
        </div>
      </div>
    </div>

  </div> <!-- end dataTables_wrapper -->

</div> <!-- fine container creaDatatable -->
```
