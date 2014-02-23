// Generated by CoffeeScript 1.7.1
(function() {
  (function($, window, document, undefined_) {
    var Plugin, defaults, pluginName;
    pluginName = "shapeshift";
    defaults = {
      state: null,
      states: {
        "default": {
          "class": 'default',
          grid: {
            columns: null,
            itemWidth: 30,
            maxHeight: null,
            align: "center",
            sort: {
              x: "left",
              y: "top"
            },
            gutter: {
              x: 10,
              y: 10
            },
            padding: {
              x: 20,
              y: 20
            }
          },
          responsive: {
            enabled: true,
            refreshRate: 50
          },
          resize: {
            handle: ".resizeToggle",
            enabled: true,
            refreshRate: 50,
            sizes: null,
            increment: {
              x: 40,
              y: 1
            },
            min: {
              h: 40,
              w: 30
            },
            renderOn: "mouseup"
          },
          draggable: {
            enabled: true
          }
        }
      }
    };
    Plugin = function(element, options) {
      this.options = $.extend({}, defaults, options);
      this.$container = $(element);
      this.init();
      return this;
    };
    Plugin.prototype = {
      init: function() {
        this.loaded = false;
        this._createGlobals();
        this._setState();
        this._addChildren();
        this._calculateGrid();
        this._toggleFeatures();
        this.render();
        return this.loaded = true;
      },
      _createGlobals: function() {
        this.idCount = 1;
        this.children = [];
        return this.state = this.grid = null;
      },
      render: function() {
        this._pack();
        return this._arrange();
      },
      reverse: function() {
        this.children.reverse();
        this.render();
        return this.children;
      },
      shuffle: function() {
        var a, i, j, t;
        a = this.children;
        i = a.length;
        while (--i > 0) {
          j = ~~(Math.random() * (i + 1));
          t = a[j];
          a[j] = a[i];
          a[i] = t;
        }
        this.children = a;
        this.render();
        return this.children;
      },
      _addChildren: function() {
        var $children, child, _i, _len, _results;
        $children = this.$container.children();
        _results = [];
        for (_i = 0, _len = $children.length; _i < _len; _i++) {
          child = $children[_i];
          _results.push(this._addChild(child));
        }
        return _results;
      },
      _addChild: function(child) {
        var $child, id;
        id = this.idCount++;
        $child = $(child);
        $child.attr('data-ssid', id);
        this.children.push({
          id: id,
          el: $child,
          x: 0,
          y: 0,
          dragging: false
        });
        return this._parseChild(id);
      },
      _arrange: function() {
        var $child, child, _i, _len, _ref, _results;
        this.$container.height(this.maxHeight);
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (!child.dragging) {
            $child = child.el;
            $child.addClass(this.state["class"]);
            _results.push(this._move(child));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      _calculateGrid: function() {
        var child, child_span, col_width, columns, inner_width, width, _i, _len, _ref;
        col_width = this.grid.colWidth;
        width = this.$container.width();
        inner_width = width - (this.grid.padding.x * 2);
        columns = this.state.grid.columns || Math.floor((inner_width + this.grid.gutter.x) / col_width);
        if (columns > this.children.length) {
          child_span = 0;
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            child_span += child.span;
          }
          if (columns > child_span) {
            columns = child_span;
          }
        }
        this.grid.columns = columns;
        this.grid.innerWidth = inner_width;
        this.grid.width = width;
        if (this.grid.align === "center") {
          return this.grid.whiteSpace = (this.grid.gutter.x / 2) + (inner_width - (columns * col_width)) / 2;
        }
      },
      _changePosition: function(id, index) {
        var child, new_index, prev_index;
        child = this._getChildById(id);
        prev_index = this.children.indexOf(child);
        new_index = index;
        return this.children.splice(new_index, 0, this.children.splice(prev_index, 1)[0]);
      },
      _fitMinArea: function(array, span) {
        var area, areas, col, columns, h, heights, max, max_heights, offset, positions, _i, _j, _len;
        columns = array.length;
        positions = array.length - span + 1;
        areas = [];
        max_heights = [];
        for (offset = _i = 0; 0 <= positions ? _i < positions : _i > positions; offset = 0 <= positions ? ++_i : --_i) {
          heights = array.slice(0).splice(offset, span);
          max = Math.max.apply(null, heights);
          area = max;
          for (_j = 0, _len = heights.length; _j < _len; _j++) {
            h = heights[_j];
            area += max - h;
          }
          areas.push(area);
          max_heights.push(max);
        }
        col = this._fitMinIndex(areas);
        return {
          col: col,
          height: max_heights[col]
        };
      },
      _fitMinIndex: function(array) {
        return array.indexOf(Math.min.apply(null, array));
      },
      _getChildById: function(id) {
        return this.children.filter(function(child) {
          return child.id === id;
        })[0];
      },
      _move: function(child) {
        return child.el.css({
          transform: 'translate(' + child.x + 'px, ' + child.y + 'px)'
        });
      },
      _pack: function(return_children) {
        var c, child, children, col, colHeights, col_width, columns, gutter_y, height, maxHeight, offset, padding_x, padding_y, position, span, x, y, _i, _j, _k, _l, _len, _len1, _ref, _results;
        children = return_children ? this.children.slice(0) : this.children;
        maxHeight = 0;
        padding_y = this.grid.padding.y;
        padding_x = this.grid.padding.x;
        gutter_y = this.grid.gutter.y;
        col_width = this.grid.colWidth;
        columns = this.grid.columns;
        colHeights = [];
        for (c = _i = 0; 0 <= columns ? _i < columns : _i > columns; c = 0 <= columns ? ++_i : --_i) {
          colHeights.push(padding_y);
        }
        for (_j = 0, _len = children.length; _j < _len; _j++) {
          child = children[_j];
          if (!(return_children && child.dragging)) {
            span = child.span;
            if (span > columns) {
              span = columns;
            }
            if (span > 1) {
              position = this._fitMinArea(colHeights, span);
              col = position.col;
              y = position.height;
            } else {
              col = this._fitMinIndex(colHeights);
              y = colHeights[col];
            }
            x = padding_x + (col * col_width);
            height = y + child.h + gutter_y;
            if (this.grid.align === "center") {
              x += this.grid.whiteSpace;
            }
            if (this.grid.sort.x === "right") {
              x = this.grid.width - x - child.w;
            }
            child.x = x;
            child.y = y;
            for (offset = _k = 0; 0 <= span ? _k < span : _k > span; offset = 0 <= span ? ++_k : --_k) {
              colHeights[col + offset] = height;
              if (height > maxHeight) {
                maxHeight = height;
              }
            }
          }
        }
        if (return_children) {
          return children;
        }
        this.maxHeight = this.state.grid.maxHeight || maxHeight - gutter_y + padding_y;
        if (this.grid.sort.y === "bottom") {
          _ref = this.children;
          _results = [];
          for (_l = 0, _len1 = _ref.length; _l < _len1; _l++) {
            child = _ref[_l];
            _results.push(child.y = this.maxHeight - child.y - child.h);
          }
          return _results;
        }
      },
      _parseChild: function(id) {
        var child, col_width, gutter_x, span, width;
        child = this._getChildById(id);
        col_width = this.grid.colWidth;
        gutter_x = this.grid.gutter.x;
        span = Math.ceil((child.el.outerWidth() + gutter_x) / col_width);
        width = (span * col_width) - gutter_x;
        child.h = child.el.outerHeight();
        child.w = width;
        return child.span = span;
      },
      _setGrid: function() {
        this.grid = $.extend({}, this.state.grid);
        return this.grid.colWidth = this.grid.itemWidth + this.grid.gutter.x;
      },
      _setState: function(name) {
        this.options.state = name || this.options.state || "default";
        this.state = this.options.states[this.options.state];
        this._setGrid();
        if (this.loaded) {
          return this._toggleFeatures();
        }
      },
      _toggleActive: function(id, active) {
        var child;
        child = this._getChildById(id);
        if (active) {
          return child.el.addClass("no-transitions").css({
            zIndex: this.idCount + 1
          });
        } else {
          return child.el.removeClass("no-transitions").css({
            zIndex: child.id
          });
        }
      },
      _toggleFeatures: function() {
        this._toggleDraggable();
        this._toggleResizing();
        return this._toggleResponsive();
      },
      _toggleDraggable: function(enabled) {
        var child, _i, _len, _ref, _results;
        this.drag = {
          child: null
        };
        if (this.state.draggable.enabled && enabled !== false) {
          _ref = this.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            _results.push(child.el.draggable({
              start: (function(_this) {
                return function(e, ui) {
                  var $child, id;
                  if ($(e.originalEvent.target).is(_this.state.resize.handle)) {
                    return false;
                  }
                  $child = ui.helper;
                  id = parseInt($child.attr("data-ssid"));
                  _this.drag.child = _this._getChildById(id);
                  _this.drag.child.dragging = true;
                  _this._toggleActive(id, true);
                  return _this.drag.child.el.css({
                    transform: "none"
                  });
                };
              })(this),
              drag: (function(_this) {
                return function(e, ui) {
                  var distance, dx, dy, i, min_distance, spot, x, y, _j, _len1, _ref1;
                  x = e.pageX + _this.$container.offset().left;
                  y = e.pageY + _this.$container.offset().top;
                  min_distance = 999999;
                  spot = null;
                  _ref1 = _this.children;
                  for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
                    child = _ref1[i];
                    dx = x - child.x;
                    dy = y - child.y;
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < min_distance) {
                      min_distance = distance;
                      spot = i;
                    }
                  }
                  console.log(_this.children[spot].dragging);
                  if (spot !== null && _this.children[spot].dragging !== true) {
                    _this._changePosition(_this.drag.child.id, spot);
                    return _this.render();
                  }
                };
              })(this),
              stop: (function(_this) {
                return function(e, ui) {
                  child = _this.drag.child;
                  child.dragging = false;
                  child.el.css({
                    left: 0,
                    top: 0
                  });
                  return _this._toggleActive(child.id, false);
                };
              })(this)
            }));
          }
          return _results;
        }
      },
      _toggleResizing: function(enabled) {
        var $el, has_snap_sizes, id, increment_sizes, increment_x, increment_y, min_height, min_width, mousedown, options, refresh_rate, render_on_move, resize, resizing, self, snap_sizes, start;
        if (this.state.resize.enabled && enabled !== false) {
          self = this;
          options = this.state.resize;
          start = {};
          $el = id = null;
          mousedown = resizing = false;
          min_width = options.min.w;
          min_height = options.min.h;
          refresh_rate = options.refreshRate;
          snap_sizes = options.sizes;
          has_snap_sizes = $.isArray(snap_sizes);
          increment_x = this.state.resize.increment.x;
          increment_y = this.state.resize.increment.y;
          increment_sizes = increment_x > 1 || increment_y > 1;
          render_on_move = options.renderOn === "mousemove";
          this.$container.off('.ss-resize').on("mousedown.ss-resize", options.handle, function(e) {
            $el = $(this).closest("*[data-ssid]");
            id = parseInt($el.attr('data-ssid'));
            mousedown = true;
            start = {
              h: $el.height(),
              w: $el.outerWidth(),
              x: e.pageX,
              y: e.pageY
            };
            return self._toggleActive(id, true);
          });
          $(window).off('.ss-resize').on("mousemove.ss-resize mouseup.ss-resize", (function(_this) {
            return function(e) {
              if (mousedown) {
                if (e.type === "mousemove" && !resizing) {
                  resize(e);
                  setTimeout(function() {
                    return resizing = false;
                  }, refresh_rate);
                }
                if (e.type === "mouseup") {
                  _this._toggleActive(id, false);
                  resize(e);
                  if (!render_on_move) {
                    _this.render();
                  }
                  mousedown = resizing = false;
                  return start = {};
                }
              }
            };
          })(this));
          return resize = (function(_this) {
            return function(e) {
              var closest, i, minDistance, new_height, new_width, offset_x, offset_y, size, _i, _len;
              resizing = true;
              offset_y = e.pageY - start.y;
              offset_x = e.pageX - start.x;
              if (has_snap_sizes) {
                new_height = start.h + offset_y;
                new_width = start.w + offset_x;
                closest = 0;
                minDistance = 9999999;
                for (i = _i = 0, _len = snap_sizes.length; _i < _len; i = ++_i) {
                  size = snap_sizes[i];
                  if (size[0] <= new_width || size[1] <= new_height) {
                    closest = i;
                  }
                }
                new_width = snap_sizes[closest][0];
                new_height = snap_sizes[closest][1];
              } else if (increment_sizes) {
                new_width = start.w + Math.ceil(offset_x / increment_x) * increment_x;
                new_height = start.h + Math.ceil(offset_y / increment_y) * increment_y;
              }
              if (new_width < min_width) {
                new_width = min_width;
              }
              if (new_height < min_height) {
                new_height = min_height;
              }
              $el.css({
                width: new_width,
                height: new_height
              });
              _this._parseChild(id);
              if (render_on_move) {
                return _this.render();
              }
            };
          })(this);
        } else {
          this.$container.off('.ss-resize');
          return $(window).off('.ss-resize');
        }
      },
      _toggleResponsive: function(enabled) {
        var refresh_rate, resizing, timeout;
        if (this.state.responsive.enabled && enabled !== false) {
          refresh_rate = this.state.responsive.refreshRate;
          resizing = false;
          timeout = null;
          return $(window).off('.ss-responsive').on('resize.ss-responsive', (function(_this) {
            return function() {
              if (!resizing) {
                resizing = true;
                clearTimeout(timeout);
                return timeout = setTimeout(function() {
                  _this._calculateGrid();
                  _this.render();
                  return resizing = false;
                }, refresh_rate);
              }
            };
          })(this));
        } else {
          return $(window).off('.ss-responsive');
        }
      }
    };
    return $.fn[pluginName] = function(options) {
      var args, returns, scoped_name;
      args = arguments;
      scoped_name = "plugin_" + pluginName;
      if (options === undefined || typeof options === "object") {
        return this.each(function() {
          if (!$.data(this, scoped_name)) {
            return $.data(this, scoped_name, new Plugin(this, options));
          }
        });
      } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
        returns = void 0;
        this.each(function() {
          var instance;
          instance = $.data(this, scoped_name);
          if (instance instanceof Plugin && typeof instance[options] === "function") {
            returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
          }
          if (options === "destroy") {
            return $.data(this, scoped_name, null);
          }
        });
        if (returns !== undefined) {
          return returns;
        } else {
          return this;
        }
      }
    };
  })(jQuery, window, document);

}).call(this);
