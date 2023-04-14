(function () {
  'use strict';

  const dt_default_options = {
    dom:
      // controlli
      '<\'row justify-content-between d-print-none\'<\'col-sm-auto flex-grow-1\'l><\'col-sm-auto\'f>>' +
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
          '<div>Mostra</div>' +
          '<div class="dt-control">_MENU_</div>' +
          '<div class="flex-grow-1">record per pagina</div>',
      loadingRecords                        : '<em class="small">Attendi&hellip;</em>',
      search :
          '<div class="mr-sm-2">Filtra risultati:</div>' +
          '<div class="dt-control">_INPUT_</div>',
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
  const dt_classes = {
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

  const cdt_default_options = {

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

    container_header: null, //'Risultato della ricerca', // se presente aggiunge un header prima della tabella
    container_class: 'dt-container', // classe che viene assegnata al div che contiene la tabella
    container_header_level: 2, // livello gerarchico dell'header (h2, h3, ecc...)
    table_id: 'table-result',
    table_class: 'table table-striped table-bordered table-hover',
    table_caption: '',
    table_footer: false, // se true aggiunge una riga tfoot alla tabella, da popolare con un callback
    extra_info:''

  };

  // test: test/date_utilities.html

  function isValidDate( date ) {

    // https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
    try {

      if(typeof date === 'string') {
        date = new Date (date);
      }

      if (Object.prototype.toString.call(date) === '[object Date]') {
        // it is a date
        if (isNaN(date.getTime())) {  // date.valueOf() could also work
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
      return false;
    }
  }

  function dateStringToISO(dateString = '', consider_time = false) {
    // restituisce la porzione della data da una stringa datetime ISO
    // aggiunge 'Z' alla stringa, se necessario, per evitare modifiche dovute alla timezone
    try {

      if(dateString && dateString.length > 10 && !/Z$/.test(dateString)) {
        dateString += 'Z';
      }

      if(!isValidDate( dateString )) {
        throw new Error( 'Invalid Date' );
      }

      let d = dateString? new Date(dateString) : new Date();
      return d.toISOString().substr(0, consider_time? 16 : 10); // i secondi sono sempre ignorati

    } catch (e) {
      console.error(e); // eslint-disable-line
      return false;
    }
  }


  function formatDate(d = '', format_options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) {
    try {
      if(typeof d === 'string') {
        d = d? new Date(d) : new Date();
      }
      if(!isValidDate( d )) {
        throw new Error( 'Invalid Date' );
      }
      return d.toLocaleDateString('it-IT', format_options);

    } catch (e) {
      console.error(e); // eslint-disable-line
      return false;
    }
  }

  function formatTime(d = '', format_options = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  }) {
    try {
      if(typeof d === 'string') {
        d = d? new Date(d) : new Date();
      }
      if(!isValidDate( d )) {
        throw new Error( 'Invalid Date' );
      }
      return d.toLocaleTimeString('it-IT', format_options);

    } catch (e) {
      console.error(e); // eslint-disable-line
      return false;
    }
  }

  function formatDateTime(d = '', format_options) {
    const default_options = {
      date: {
        year: 'numeric',
        month: 'long',
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
    };

    format_options = Object.assign({}, default_options, format_options);

    try {
      if(typeof d === 'string') {
        d = d? new Date(d) : new Date();
      }
      if(!isValidDate( d )) {
        throw new Error( 'Invalid Date' );
      }
      let str = '', w;

      if(format_options.date_wrapper) {
        w = document.createElement('div');
        w.innerHTML = format_options.date_wrapper;
        w.lastChild.innerHTML = formatDate(d, format_options.date);
        str += w.innerHTML;

      } else {
        str += formatDate(d, format_options.date);
      }

      str += format_options.separator;

      if(format_options.time_wrapper) {
        w = document.createElement('div');
        w.innerHTML = format_options.time_wrapper;
        w.lastChild.innerHTML = formatTime(d, format_options.time);
        str += w.innerHTML;

      } else {
        str += formatTime(d, format_options.time);
      }

      return str;

    } catch (e) {
      console.error(e); // eslint-disable-line
      return false;
    }
  }

  function jquery_loader(jquery_url='https://code.jquery.com/jquery-3.6.3.min.js', callback) {
    try {

      if(callback === undefined || typeof callback !== 'function') {
        throw 'Errore callback';
      }
      // if(!jquery_url || typeof jquery_url !== 'string') {
      //   throw 'Errore jQuery url';
      // }

      if(window.jQuery === undefined && !document.head.querySelector('.jq')) {

        let script = document.createElement('script');
        script.onload = function() {

          return callback();
        };
        script.src = jquery_url;
        script.async = false;
        script.className = 'jq';
        document.head.appendChild(script);

      } else if(window.jQuery === undefined) { // script presente ma jquery ancora in caricamento

        const intervalID = setInterval(() => {
          if(window.jQuery !== undefined ) {
            clearInterval(intervalID);
            return callback();
          }
        }, 200);

      } else {
        return callback();
      }

    } catch(e) { //throw error
      console.error( e ); // eslint-disable-line
    }
  }

  const mesi = {
    1:'Gennaio',
    2:'Febbraio',
    3:'Marzo',
    4:'Aprile',
    5:'Maggio',
    6:'Giugno',
    7:'Luglio',
    8:'Agosto',
    9:'Settembre',
    10:'Ottobre',
    11:'Novembre',
    12:'Dicembre'
  };

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.templateCache = {
      _cache: {},
      set: function set (key, value) {
        this._cache[key] = value;
      },
      get: function get (key) {
        return this._cache[key];
      },
      clear: function clear () {
        this._cache = {};
      }
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    if (typeof this.templateCache !== 'undefined') {
      this.templateCache.clear();
    }
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var isCacheEnabled = typeof cache !== 'undefined';
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `config` argument is given here, then it should be an
   * object with a `tags` attribute or an `escape` attribute or both.
   * If an array is passed, then it will be interpreted the same way as
   * a `tags` attribute on a `config` object.
   *
   * The `tags` attribute of a `config` object must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   *
   * The `escape` attribute of a `config` object must be a function which
   * accepts a string as input and outputs a safely escaped string.
   * If an `escape` function is not provided, then an HTML-safe string
   * escaping function is used as the default.
   */
  Writer.prototype.render = function render (template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, config);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context, config);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials, config);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate, config);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) {
    if (!partials) return;
    var tags = this.getConfigTags(config);

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context, config) {
    var escape = this.getConfigEscape(config) || mustache.escape;
    var value = context.lookup(token[1]);
    if (value != null)
      return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  Writer.prototype.getConfigTags = function getConfigTags (config) {
    if (isArray(config)) {
      return config;
    }
    else if (config && typeof config === 'object') {
      return config.tags;
    }
    else {
      return undefined;
    }
  };

  Writer.prototype.getConfigEscape = function getConfigEscape (config) {
    if (config && typeof config === 'object' && !isArray(config)) {
      return config.escape;
    }
    else {
      return undefined;
    }
  };

  var mustache = {
    name: 'mustache.js',
    version: '4.2.0',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache (cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache () {
      return defaultWriter.templateCache;
    }
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view`, `partials`, and `config`
   * using the default writer.
   */
  mustache.render = function render (template, view, partials, config) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, config);
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  function renderTpl(item, opts) {

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

  /*
    Legge gli attributi data di `container` e restituisce un oggetto con
    gli elementi `cdt_options` e `dt_options` da utilizzare in `_autoDataTable`

    `container` è un elemento jQuery
  */

  function parseElementData( container, cdt_options = {} ) {

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
      const dt_columns = [...(opts.dt_options.columns?? []), ...(data.dt_columns?? []), ...(data.dtColumns?? [])];


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


        } else {

          // datatable std items

          if(item.data && !item.name) {
            item.name = item.data;
          }
          if(item.name && !item.data) {
            item.data = item.name;
          }

          if( item.type === undefined) {
            item.type = 'string';
          }

        } // end if(item.dtRender !== undefined )

        // console.log(item);
        return item;

      }); // end dt_columns.map

    } // end if container.length

    return opts;

  }

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

  function creaDT( container, cdt_options = {}, dt_options = {}, dt_columns = []) {

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
    let form_ricerca = null;

    // collegamento a form con parametri di ricerca
    // cdt_options.dtRender.bindToForm corrisponde all'id del form
    if( cdt_options.dtRender && cdt_options.dtRender.bindToForm ) {

      form_ricerca = $('#' + cdt_options.dtRender.bindToForm );
      dt_options.ajax = {
        url: form_ricerca.attr('action') + '?' + form_ricerca.serialize(),
        // dataSrc: ''
      };
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

    const this_datatable = $('#' + cdt_options.table_id ).DataTable(dt_options);  // datatable istance NB DataTable e non dataTable!!!

    if(form_ricerca !== null ) {

      form_ricerca.on('submit', function (event) {
        event.preventDefault();

        this_datatable.ajax.url( form_ricerca.attr('action')+ '?' + form_ricerca.serialize() ).load();

      }); // end submit
    }

    return this_datatable;

  }

  // FIXME migliorare sequenza caricamento jquery e dt
  // TODO fare in modo che le funzione restituisca l'istanza datatable
  // FIXME rivedere ed eliminare variabile globale Window.dt_loaded

  Window.dt_loaded = false; // impedisce il ricaricamento defli scripty datatable in caso la funzione sia richiamata più volte

  function _autoDataTable( opts ) {

    try {
      opts = {...{
        // defaults
        container    : '.dt-container',
        cdt_options  : {},
        dt_options   : {},
        dt_columns   : [], // normalmente l'array `columns` è all'interno di `dt_options`, ma può essere gestito separatamente
        jquery_url   : 'https://code.jquery.com/jquery-3.6.3.min.js',
        dt_urls: [
          'https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js',
          'https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js'
        ]

      },...opts };

      opts.container = (opts.container && typeof opts.container === 'string')? document.querySelector(opts.container) : opts.container;

      if(!opts.container) {
        throw 'auto-datatable:`container` non presente o non definito';
      }

      // spinner
      opts.container.innerHTML =
        `<div class="d-flex justify-content-center">
        <div class="spinner-border spinner-border-sm my-1 text-muted" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`;

      jquery_loader(opts.jquery_url, () => {

        if(opts.dt_urls && opts.dt_urls.length && !Window.dt_loaded ) {

          return (async () => {

            const result = await Promise.all(
              opts.dt_urls.map((u, idx) =>
                new Promise(resolve => {
                  const script = document.createElement('script');
                  script.onload = function() {
                    resolve();
                  };
                  script.src = u;
                  script.async = false;
                  script.className = `dt${idx}`;
                  document.head.appendChild(script);
                })
              )
            )
              .then(() => {
                Window.dt_loaded = true;
                return creaDT(opts.container, opts.cdt_options, opts.dt_options, opts.dt_columns);
              });

            return result;

          })();

        } else {
          return creaDT(opts.container, opts.cdt_options, opts.dt_options, opts.dt_columns);
        }
      });

    } catch(e) {
      console.error( e ); // eslint-disable-line
    }


  }

  /* eslint-disable no-console */


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

})();
//# sourceMappingURL=demo-min.js.map
