import {_creaDataTableOnDemand} from './creaDataTable-bs5-jq-ondemand';
import autoDT from './src/autoDataTable-src';
import { jquery_loader } from '@massimo-cassandro/js-utilities';

export  function _autoDataTableOnDemand( $container = '.dt-container', cdt_options = {}, jquery_url='https://code.jquery.com/jquery-3.6.3.min.js' ) {
  return jquery_loader(jquery_url, () => {
    return autoDT( $container, cdt_options, _creaDataTableOnDemand );
  });
}
