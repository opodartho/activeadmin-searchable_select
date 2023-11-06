(function() {
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }

  function addSelectAll(matches) {
    if (matches.length > 0) {
      // Insert a special "Select all matches" item at the start of the 
      // list of matched items.
      return [{
        id: 'selectAll',
        text: 'Select all matches',
        matchIds: matches.map(function(match) {
            return match.id;
        })
      }].concat(_toConsumableArray(matches));
    }
  };

  function addClearAll(matches) {
    if (matches.length > 0) {
      // Insert a special "Select all matches" item at the start of the 
      // list of matched items.
      return [{
        id: 'clearAll',
        text: 'Clear all selects',
        matchIds: []
      }].concat(_toConsumableArray(matches));
    }
  };

  function addSelectAndClearAll(matches) {
    if (matches.length > 0) {
      // Insert a special "Select all matches" item at the start of the 
      // list of matched items.
      return [{
        id: 'selectAll',
        text: 'Select all matches',
        matchIds: matches.map(function(match) {
            return match.id;
        })
      },
      {
        id: 'clearAll',
        text: 'Clear all selects',
        matchIds: []
      }].concat(_toConsumableArray(matches));
    }
  };

  function handleSelection(event) {
    if (event.params.data.id === 'selectAll' || event.params.data.id === 'clearAll') {
      $(event.currentTarget).val(event.params.data.matchIds);
      $(event.currentTarget).trigger('change');
    }
  };

  function initSearchableSelects(inputs, extra) {
    inputs.each(function() {
      var item = $(this);

      // reading from data allows <input data-searchable_select='{"tags": ['some']}'>
      // to be passed to select2
      var options = $.extend(extra || {}, item.data('searchableSelect'));
      var url = item.data('ajaxUrl');
      var selectAll = item.data('selectAll');
      var clearAll = item.data('selectAll');

      if (url) {
        $.extend(options, {
          ajax: {
            url: url,
            dataType: 'json',

            data: function (params) {
              return {
                term: params.term,
                page: pageParamWithBaseZero(params)
              };
            }
          }
        });
      }

      var sorter = null;

      if (selectAll && clearAll) {
        sorter = addSelectAndClearAll
      } else if (selectAll) {
        sorter = addSelectAll
      } else if (clearAll) {
        sorter = addClearAll
      }

      if (selectAll || clearAll) {
        $.extend(options, {sorter: sorter});
      }

      console.log(selectAll);
      item.select2(options);
      item.on('select2:select', handleSelection);
    });
  }

  function pageParamWithBaseZero(params) {
    return params.page ? params.page - 1 : undefined;
  }

  $(document).on('has_many_add:after', '.has_many_container', function(e, fieldset) {
    initSearchableSelects(fieldset.find('.searchable-select-input'));
  });

  $(document).on('page:load turbolinks:load', function() {
    initSearchableSelects($(".searchable-select-input"), {placeholder: ""});
  });

  $(function() {
    initSearchableSelects($(".searchable-select-input"));
  });
}());
