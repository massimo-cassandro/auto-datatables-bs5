import dt_bs from 'datatables.net-bs5/js/dataTables.bootstrap5';
import dt_config_bs from './src/config-bs5';

import cdt from './src/creaDataTable-src';

import { jquery_loader } from '@massimo-cassandro/js-utilities';


export function _creaDataTableOnDemand( $container, options = {}, jquery_url='https://code.jquery.com/jquery-3.6.3.min.js') {

  return jquery_loader(jquery_url, () => {
    return cdt($container, options, dt_bs, dt_config_bs);
  });
}
