! function(t, e) {
	"object" == typeof exports && "object" == typeof module ? module.exports = e(require("jQuery"), require("CodeMirror")) : "function" == typeof define && define.amd ? define("mergely", ["jQuery", "CodeMirror"], e) : "object" == typeof exports ? exports.mergely = e(require("jQuery"), require("CodeMirror")) : t.mergely = e(t.jQuery, t.CodeMirror)
}(window, (function(t, e) {
	return function(t) {
		var e = {};

		function i(s) {
			if (e[s]) return e[s].exports;
			var r = e[s] = {
				i: s,
				l: !1,
				exports: {}
			};
			return t[s].call(r.exports, r, r.exports, i), r.l = !0, r.exports
		}
		return i.m = t, i.c = e, i.d = function(t, e, s) {
			i.o(t, e) || Object.defineProperty(t, e, {
				enumerable: !0,
				get: s
			})
		}, i.r = function(t) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
				value: "Module"
			}), Object.defineProperty(t, "__esModule", {
				value: !0
			})
		}, i.t = function(t, e) {
			if (1 & e && (t = i(t)), 8 & e) return t;
			if (4 & e && "object" == typeof t && t && t.__esModule) return t;
			var s = Object.create(null);
			if (i.r(s), Object.defineProperty(s, "default", {
				enumerable: !0,
				value: t
			}), 2 & e && "string" != typeof t)
				for (var r in t) i.d(s, r, function(e) {
					return t[e]
				}.bind(null, r));
			return s
		}, i.n = function(t) {
			var e = t && t.__esModule ? function() {
				return t.default
			} : function() {
				return t
			};
			return i.d(e, "a", e), e
		}, i.o = function(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e)
		}, i.p = "", i(i.s = 3)
	}([function(t, e) {
		function i(t, e) {
			var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
				r = i.ignorews,
				n = void 0 !== r && r,
				o = i.ignoreaccents,
				h = void 0 !== o && o,
				l = i.ignorecase,
				a = void 0 !== l && l;
			this.codeify = new s(t, e, {
				ignorews: n,
				ignoreaccents: h,
				ignorecase: a
			});
			var c = {
					codes: this.codeify.getCodes("lhs"),
					modified: {}
				},
				d = {
					codes: this.codeify.getCodes("rhs"),
					modified: {}
				},
				g = [],
				f = [];
			this._lcs(c, 0, c.codes.length, d, 0, d.codes.length, f, g), this._optimize(c), this._optimize(d), this.items = this._create_diffs(c, d)
		}

		function s(t, e, i) {
			this._max_code = 0, this._diff_codes = {}, this.ctxs = {}, this.options = i, this.lhs = "string" == typeof t ? t.split("\n") : t, this.rhs = "string" == typeof e ? e.split("\n") : e
		}
		i.prototype.changes = function() {
			return this.items
		}, i.prototype.getLines = function(t) {
			return this.codeify.getLines(t)
		}, i.prototype.normal_form = function() {
			for (var t = "", e = 0; e < this.items.length; ++e) {
				var i = this.items[e],
					s = "c";
				0 == i.lhs_deleted_count && i.rhs_inserted_count > 0 ? s = "a" : i.lhs_deleted_count > 0 && 0 == i.rhs_inserted_count && (s = "d"), t += (1 == i.lhs_deleted_count ? i.lhs_start + 1 : 0 == i.lhs_deleted_count ? i.lhs_start : i.lhs_start + 1 + "," + (i.lhs_start + i.lhs_deleted_count)) + s + (1 == i.rhs_inserted_count ? i.rhs_start + 1 : 0 == i.rhs_inserted_count ? i.rhs_start : i.rhs_start + 1 + "," + (i.rhs_start + i.rhs_inserted_count)) + "\n";
				var r = this.getLines("lhs"),
					n = this.getLines("rhs");
				if (n && r) {
					var o = void 0;
					for (o = i.lhs_start; o < i.lhs_start + i.lhs_deleted_count; ++o) t += "< " + r[o] + "\n";
					for (i.rhs_inserted_count && i.lhs_deleted_count && (t += "---\n"), o = i.rhs_start; o < i.rhs_start + i.rhs_inserted_count; ++o) t += "> " + n[o] + "\n"
				}
			}
			return t
		}, i.prototype._lcs = function(t, e, i, s, r, n, o, h) {
			for (; e < i && r < n && t.codes[e] == s.codes[r];) ++e, ++r;
			for (; e < i && r < n && t.codes[i - 1] == s.codes[n - 1];) --i, --n;
			if (e == i)
				for (; r < n;) s.modified[r++] = !0;
			else if (r == n)
				for (; e < i;) t.modified[e++] = !0;
			else {
				var l = this._sms(t, e, i, s, r, n, o, h);
				this._lcs(t, e, l.x, s, r, l.y, o, h), this._lcs(t, l.x, i, s, l.y, n, o, h)
			}
		}, i.prototype._sms = function(t, e, i, s, r, n, o, h) {
			var l = t.codes.length + s.codes.length + 1,
				a = e - r,
				c = i - n,
				d = 0 != (1 & i - e - (n - r)),
				g = l - a,
				f = l - c,
				p = (i - e + n - r) / 2 + 1;
			h[g + a + 1] = e, o[f + c - 1] = i;
			for (var u, m, _ = {
				x: 0,
				y: 0
			}, y = 0; y <= p; ++y) {
				for (var v = a - y; v <= a + y; v += 2) {
					for (v == a - y ? u = h[g + v + 1] : (u = h[g + v - 1] + 1, v < a + y && h[g + v + 1] >= u && (u = h[g + v + 1])), m = u - v; u < i && m < n && t.codes[u] == s.codes[m];) u++, m++;
					if (h[g + v] = u, d && c - y < v && v < c + y && o[f + v] <= h[g + v]) return _.x = h[g + v], _.y = h[g + v] - v, _
				}
				for (k = c - y; k <= c + y; k += 2) {
					for (k == c + y ? u = o[f + k - 1] : (u = o[f + k + 1] - 1, k > c - y && o[f + k - 1] < u && (u = o[f + k - 1])), m = u - k; u > e && m > r && t.codes[u - 1] == s.codes[m - 1];) u--, m--;
					if (o[f + k] = u, !d && a - y <= k && k <= a + y && o[f + k] <= h[g + k]) return _.x = h[g + k], _.y = h[g + k] - k, _
				}
			}
			throw "the algorithm should never come here."
		}, i.prototype._optimize = function(t) {
			for (var e = 0, i = 0; e < t.codes.length;) {
				for (; e < t.codes.length && (null == t.modified[e] || 0 == t.modified[e]);) e++;
				for (i = e; i < t.codes.length && 1 == t.modified[i];) i++;
				i < t.codes.length && t.codes[e] == t.codes[i] ? (t.modified[e] = !1, t.modified[i] = !0) : e = i
			}
		}, i.prototype._create_diffs = function(t, e) {
			for (var i = [], s = 0, r = 0, n = 0, o = 0; n < t.codes.length || o < e.codes.length;)
				if (n < t.codes.length && !t.modified[n] && o < e.codes.length && !e.modified[o]) n++, o++;
				else {
					for (s = n, r = o; n < t.codes.length && (o >= e.codes.length || t.modified[n]);) n++;
					for (; o < e.codes.length && (n >= t.codes.length || e.modified[o]);) o++;
					(s < n || r < o) && i.push({
						lhs_start: s,
						rhs_start: r,
						lhs_deleted_count: n - s,
						rhs_inserted_count: o - r
					})
				} return i
		}, s.prototype.getCodes = function(t) {
			if (!this.ctxs.hasOwnProperty(t)) {
				var e = this._diff_ctx(this[t]);
				this.ctxs[t] = e, e.codes.length = Object.keys(e.codes)
					.length
			}
			return this.ctxs[t].codes
		}, s.prototype.getLines = function(t) {
			return this.ctxs[t].lines
		}, s.prototype._diff_ctx = function(t) {
			var e = {
				i: 0,
				codes: {},
				lines: t
			};
			return this._codeify(t, e), e
		}, s.prototype._codeify = function(t, e) {
			this._max_code;
			for (var i = 0; i < t.length; ++i) {
				var s = t[i];
				this.options.ignorews && (s = s.replace(/\s+/g, "")), this.options.ignorecase && (s = s.toLowerCase()), this.options.ignoreaccents && (s = s.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, ""));
				var r = this._diff_codes[s];
				null != r ? e.codes[i] = r : (this._max_code++, this._diff_codes[s] = this._max_code, e.codes[i] = this._max_code)
			}
		}, t.exports = i
	}, function(t, e, i) {
		var s = i(0),
			r = i(2);

		function n(t, e, i) {
			function s(t, e) {
				for (var i, s, r, n = new RegExp(/[^\s]/g), o = {}, h = 0, l = 0; i = n.exec(t);) !e.ignorews && r && r <= i.index - 1 && (o[h++] = {
					p0: r,
					p1: i.index - 1,
					ws0: r,
					word: t.slice(r, i.index)
				}), r = (s = (l = i.index) + i[0].length - 1) + 2, o[h++] = {
					p0: l,
					p1: s,
					ws0: r,
					word: t.slice(l, s + 1)
				};
				return o
			}
			if (this.options = i, i.ignorews) {
				this.xmap = s(t, this.options), this.ymap = s(e, this.options);
				var r = this.xmap;
				this.x = Object.keys(r)
					.map((function(t) {
						return r[t].word
					}));
				var n = this.ymap;
				this.y = Object.keys(n)
					.map((function(t) {
						return n[t].word
					}))
			} else this.x = t.split(""), this.y = e.split("")
		}
		n.prototype.clear = function() {
			this.ready = 0
		}, n.prototype.diff = function(t, e) {
			for (var i = new s(this.x, this.y, {
				ignorews: !!this.options.ignorews,
				ignoreaccents: !!this.options.ignoreaccents
			}), n = r(i.normal_form()), o = 0; o < n.length; ++o) {
				var h = n[o];
				if (this.options.ignorews) {
					if ("a" != h.op) e(this.xmap[h["lhs-line-from"]].p0, this.xmap[h["lhs-line-to"]].p1 + 1);
					if ("d" !== h.op) t(this.ymap[h["rhs-line-from"]].p0, this.ymap[h["rhs-line-to"]].p1 + 1)
				} else {
					if ("a" != h.op) e(h["lhs-line-from"], h["lhs-line-to"] + 1);
					if ("d" !== h.op) t(h["rhs-line-from"], h["rhs-line-to"] + 1)
				}
			}
		}, t.exports = n
	}, function(t, e) {
		var i = new RegExp(/(^(?![><\-])*\d+(?:,\d+)?)([acd])(\d+(?:,\d+)?)/);
		t.exports = function(t) {
			for (var e = [], s = 0, r = t.split(/\n/), n = 0; n < r.length; ++n)
				if (0 != r[n].length) {
					var o = {},
						h = i.exec(r[n]);
					if (null != h) {
						var l = h[1].split(",");
						o["lhs-line-from"] = l[0] - 1, 1 == l.length ? o["lhs-line-to"] = l[0] - 1 : o["lhs-line-to"] = l[1] - 1;
						var a = h[3].split(",");
						o["rhs-line-from"] = a[0] - 1, 1 == a.length ? o["rhs-line-to"] = a[0] - 1 : o["rhs-line-to"] = a[1] - 1, o.op = h[2], e[s++] = o
					}
				} return e
		}
	}, function(t, e, i) {
		"use strict";
		var s, r, n, o, h, l;
		s = i(6), r = i(7), n = i(0), o = i(1), h = i(4), (l = {})
			.diff = n, l.LCS = o, l.CodeMirrorDiffView = h, l.sizeOf = function(t) {
				var e, i = 0;
				for (e in t) t.hasOwnProperty(e) && i++;
				return i
			}, l.mergely = function(t, e) {
				t && this.init(t, e)
			}, l.mergely.prototype.name = "mergely", l.mergely.prototype.init = function(t, e) {
				this.diffView = new l.CodeMirrorDiffView(t, e, {
					jQuery: s,
					CodeMirror: r
				}), this.bind(t)
			}, l.mergely.prototype.bind = function(t) {
				this.diffView.bind(t)
			}, s.pluginMaker = function(t) {
				s.fn[t.prototype.name] = function(e) {
					var i, r = s.makeArray(arguments),
						n = r.slice(1);
					if (this.each((function() {
						var o = this,
							h = s.data(this, t.prototype.name);
						if (h) {
							if ("string" == typeof e) i = h[e].apply(h, n);
							else if (h.update) return h.update.apply(h, r)
						} else new t(this, e), s.fn["".concat(t.prototype.name, "Unregister")] = function() {
							s.data(o, t.prototype.name, null)
						}
					})), null != i) return i
				}
			}, s.pluginMaker(l.mergely)
	}, function(t, e, i) {
		function s(t, e) {
			var i = Object.keys(t);
			if (Object.getOwnPropertySymbols) {
				var s = Object.getOwnPropertySymbols(t);
				e && (s = s.filter((function(e) {
					return Object.getOwnPropertyDescriptor(t, e)
						.enumerable
				}))), i.push.apply(i, s)
			}
			return i
		}

		function r(t) {
			for (var e = 1; e < arguments.length; e++) {
				var i = null != arguments[e] ? arguments[e] : {};
				e % 2 ? s(Object(i), !0)
					.forEach((function(e) {
						n(t, e, i[e])
					})) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : s(Object(i))
					.forEach((function(e) {
						Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
					}))
			}
			return t
		}

		function n(t, e, i) {
			return e in t ? Object.defineProperty(t, e, {
				value: i,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : t[e] = i, t
		}
		var o = i(5),
			h = i(0),
			l = i(2),
			a = i(1);

		function c(t, e, i) {
			var s = i.jQuery,
				r = i.CodeMirror;
			r.defineExtension("centerOnCursor", (function() {
				var t = this.cursorCoords(null, "local");
				this.scrollTo(null, (t.top + t.bottom) / 2 - this.getScrollerElement()
					.clientHeight / 2)
			})), this.jQuery = s, this.CodeMirror = r, this.init(t, e)
		}
		c.prototype.init = function(t, e) {
			var i = this.jQuery;
			this.settings = r({
				autoupdate: !0,
				autoresize: !0,
				rhs_margin: "right",
				wrap_lines: !1,
				line_numbers: !0,
				lcs: !0,
				sidebar: !0,
				viewport: !1,
				ignorews: !1,
				ignorecase: !1,
				ignoreaccents: !1,
				fadein: "fast",
				resize_timeout: 500,
				change_timeout: 150,
				fgcolor: {
					a: "#4ba3fa",
					c: "#a3a3a3",
					d: "#ff7f7f",
					ca: "#4b73ff",
					cc: "#434343",
					cd: "#ff4f4f"
				},
				bgcolor: "#eee",
				vpcolor: "rgba(0, 0, 200, 0.5)",
				license: "",
				width: "auto",
				height: "auto",
				cmsettings: {
					styleSelectedText: !0
				},
				lhs_cmsettings: {},
				rhs_cmsettings: {},
				lhs: function(t) {},
				rhs: function(t) {},
				loaded: function() {},
				resize: function(e) {
					var s, r, n = i(t)
						.parent(),
						o = (s = "auto" == this.width ? n.width() : this.width) / 2 - 16 - 8,
						h = r = "auto" == this.height ? n.height() - 2 : this.height,
						l = i(t);
					l.find(".mergely-column")
						.css({
							width: o + "px"
						}), l.find(".mergely-column, .mergely-canvas, .mergely-margin, .mergely-column textarea, .CodeMirror-scroll, .cm-s-default")
						.css({
							height: h + "px"
						}), l.find(".mergely-canvas")
						.css({
							height: h + "px"
						}), l.find(".mergely-column textarea")
						.css({
							width: o + "px"
						}), l.css({
							width: s,
							height: r,
							clear: "both"
						}), "none" === l.css("display") && (0 != this.fadein ? l.fadeIn(this.fadein) : l.show()), this.resized && this.resized()
				},
				_debug: "",
				resized: function() {}
			}, e), this.element = i(t), this.lhs_cmsettings = r(r(r({}, this.settings.cmsettings), this.settings.lhs_cmsettings), {}, {
				lineWrapping: this.settings.wrap_lines,
				lineNumbers: this.settings.line_numbers,
				gutters: this.settings.line_numbers && ["merge", "CodeMirror-linenumbers"] || []
			}), this.rhs_cmsettings = r(r(r({}, this.settings.cmsettings), this.settings.rhs_cmsettings), {}, {
				lineWrapping: this.settings.wrap_lines,
				lineNumbers: this.settings.line_numbers,
				gutters: this.settings.line_numbers && ["merge", "CodeMirror-linenumbers"] || []
			}), this.element.bind("destroyed", i.proxy(this.teardown, this)), i.data(t, "mergely", this), this._setOptions(e)
		}, c.prototype.unbind = function() {
			var t = this.jQuery;
			null != this.changed_timeout && clearTimeout(this.changed_timeout), this.editor[this.id + "-lhs"].toTextArea(), this.editor[this.id + "-rhs"].toTextArea(), t(window)
				.off(".mergely")
		}, c.prototype.destroy = function() {
			this.element.unbind("destroyed", this.teardown), this.teardown()
		}, c.prototype.teardown = function() {
			this.unbind()
		}, c.prototype.lhs = function(t) {
			this.changes = [], delete this._current_diff, this.editor[this.id + "-lhs"].setValue(t)
		}, c.prototype.rhs = function(t) {
			this.changes = [], delete this._current_diff, this.editor[this.id + "-rhs"].setValue(t)
		}, c.prototype.update = function() {
			this._changing(this.id + "-lhs", this.id + "-rhs")
		}, c.prototype.unmarkup = function() {
			this._clear()
		}, c.prototype.scrollToDiff = function(t) {
			this.changes.length && ("next" == t ? this._current_diff == this.changes.length - 1 ? this._current_diff = 0 : this._current_diff = Math.min(++this._current_diff, this.changes.length - 1) : "prev" == t && (0 == this._current_diff ? this._current_diff = this.changes.length - 1 : this._current_diff = Math.max(--this._current_diff, 0)), this._scroll_to_change(this.changes[this._current_diff]), this._changed(this.id + "-lhs", this.id + "-rhs"))
		}, c.prototype.mergeCurrentChange = function(t) {
			this.changes.length && ("lhs" != t || this.lhs_cmsettings.readOnly ? "rhs" != t || this.rhs_cmsettings.readOnly || this._merge_change(this.changes[this._current_diff], "lhs", "rhs") : this._merge_change(this.changes[this._current_diff], "rhs", "lhs"))
		}, c.prototype.scrollTo = function(t, e) {
			var i = this.editor[this.id + "-lhs"],
				s = this.editor[this.id + "-rhs"];
			"lhs" == t ? (i.setCursor(e), i.centerOnCursor()) : (s.setCursor(e), s.centerOnCursor())
		}, c.prototype._setOptions = function(t) {
			var e, i;
			this.jQuery;
			if (this.settings = r(r({}, this.settings), t), this.settings.hasOwnProperty("rhs_margin"))
				if ("left" == this.settings.rhs_margin) this.element.find(".mergely-margin:last-child")
					.insertAfter(this.element.find(".mergely-canvas"));
				else {
					var s = this.element.find(".mergely-margin")
						.last();
					s.appendTo(s.parent())
				} this.settings.hasOwnProperty("sidebar") && (this.settings.sidebar ? this.element.find(".mergely-margin")
				.css({
					display: "block"
				}) : this.element.find(".mergely-margin")
				.css({
					display: "none"
				})), this.settings.hasOwnProperty("wrap_lines") && this.editor && (e = this.editor[this.id + "-lhs"], i = this.editor[this.id + "-rhs"], e.setOption("lineWrapping", this.settings.wrap_lines), i.setOption("lineWrapping", this.settings.wrap_lines)), this.settings.hasOwnProperty("line_numbers") && this.editor && (e = this.editor[this.id + "-lhs"], i = this.editor[this.id + "-rhs"], e.setOption("lineNumbers", this.settings.line_numbers), i.setOption("lineNumbers", this.settings.line_numbers))
		}, c.prototype.options = function(t) {
			if (!t) return this.settings;
			this._setOptions(t), this.settings.autoresize && this.resize(), this.settings.autoupdate && this.update()
		}, c.prototype.swap = function() {
			if (!this.lhs_cmsettings.readOnly && !this.rhs_cmsettings.readOnly) {
				var t = this.editor[this.id + "-lhs"],
					e = this.editor[this.id + "-rhs"],
					i = e.getValue();
				e.setValue(t.getValue()), t.setValue(i)
			}
		}, c.prototype.merge = function(t) {
			var e = this.editor[this.id + "-lhs"],
				i = this.editor[this.id + "-rhs"];
			"lhs" != t || this.lhs_cmsettings.readOnly ? this.rhs_cmsettings.readOnly || i.setValue(e.getValue()) : e.setValue(i.getValue())
		}, c.prototype.summary = function() {
			return {
				numChanges: this.changes.length,
				lhsLength: this.editor[this.id + "-lhs"].getValue()
					.length,
				rhsLength: this.editor[this.id + "-rhs"].getValue()
					.length,
				c: this.changes.filter((function(t) {
						return "c" === t.op
					}))
					.length,
				a: this.changes.filter((function(t) {
						return "a" === t.op
					}))
					.length,
				d: this.changes.filter((function(t) {
						return "d" === t.op
					}))
					.length
			}
		}, c.prototype.get = function(t) {
			var e = this.editor[this.id + "-" + t].getValue();
			return null == e ? "" : e
		}, c.prototype.clear = function(t) {
			"lhs" == t && this.lhs_cmsettings.readOnly || ("rhs" == t && this.rhs_cmsettings.readOnly || (this.editor[this.id + "-" + t].setValue(""), delete this._current_diff))
		}, c.prototype.cm = function(t) {
			return this.editor[this.id + "-" + t]
		}, c.prototype.search = function(t, e, i) {
			var s, r = this.editor[this.id + "-lhs"],
				n = this.editor[this.id + "-rhs"];
			i = "prev" == i ? "findPrevious" : "findNext", 0 != (s = "lhs" == t ? r : n)
				.getSelection()
				.length && this.prev_query[t] == e || (this.cursor[this.id] = s.getSearchCursor(e, {
					line: 0,
					ch: 0
				}, !1), this.prev_query[t] = e);
			var o = this.cursor[this.id];
			o[i]() ? s.setSelection(o.from(), o.to()) : o = s.getSearchCursor(e, {
				line: 0,
				ch: 0
			}, !1)
		}, c.prototype.resize = function() {
			this.em_height = null, this.settings.resize(), this._changing(this.id + "-lhs", this.id + "-rhs"), this._set_top_offset(this.id + "-lhs")
		}, c.prototype.diff = function() {
			var t = this.editor[this.id + "-lhs"].getValue(),
				e = this.editor[this.id + "-rhs"].getValue();
			return new h(t, e, this.settings)
				.normal_form()
		}, c.prototype.bind = function(t) {
			var e, i, s = this,
				r = this.jQuery,
				n = this.CodeMirror;
			this.trace("init", "bind"), this.element.hide(), this.id = r(t)
				.attr("id");
			try {
				r("#".concat(this.id))
			} catch (t) {
				return void console.error("jQuery failed to find mergely: #".concat(this.id))
			}
			if (this.changed_timeout = null, this.chfns = {}, this.chfns[this.id + "-lhs"] = [], this.chfns[this.id + "-rhs"] = [], this.prev_query = [], this.cursor = [], this._skipscroll = {}, this.change_exp = new RegExp(/(\d+(?:,\d+)?)([acd])(\d+(?:,\d+)?)/), null != r.button) e = '<button title="Merge left"></button>', i = '<button title="Merge right"></button>';
			else {
				var o = "opacity:0.6;height:16px;background-color:#bfbfbf;cursor:pointer;text-align:center;color:#eee;border:1px solid #848484;margin-right:-15px;margin-top:-2px;";
				e = '<div style="' + o + '" title="Merge left">&lt;</div>', i = '<div style="' + o + '" title="Merge right">&gt;</div>'
			}
			this.merge_rhs_button = r(i), this.merge_lhs_button = r(e);
			var h = r(''),
				l = r('<div class="mergely-margin" style="height: \''.concat("10px", '\'"><canvas id="lhs-margin" width="8px" height="\'')
					.concat("10px", "'\"></canvas></div>"));
			l.find("#lhs-margin")
				.attr("id", "".concat(this.id, "-lhs-margin"));
			var a = r("<div style=\"position:relative;width:'".concat("10px", "'; height:'")
				.concat("10px", '\'" id="editor-lhs" class="mergely-column"><textarea id="text-lhs"></textarea></div>'));
			a.eq(0)
				.attr("id", "".concat(this.id, "-editor-lhs")), a.find("#text-lhs")
				.attr("id", "".concat(this.id, "-lhs"));
			var c = r('<div class="mergely-canvas" style="height: \''.concat("10px", '\'"><canvas id="lhs-rhs-canvas" style="width:28px" width="28px" height="\'')
				.concat("10px", "'\"></canvas></div>"));
			c.find("#mergely-canvas")
				.attr("id", "".concat(this.id, "-mergely-canvas")), c.find("#lhs-rhs-canvas")
				.attr("id", "".concat(this.id, "-lhs-")
					.concat(this.id, "-rhs-canvas")), this.element.append(h), this.element.append(l), this.element.append(a), this.element.append(c);
			var d = r('<div class="mergely-margin" style="height: \''.concat("10px", '\'"><canvas id="rhs-margin" width="8px" height="\'')
				.concat("10px", "'\"></canvas></div>"));
			d.find("#rhs-margin")
				.attr("id", "".concat(this.id, "-rhs-margin")), "left" == this.settings.rhs_margin && this.element.append(d);
			var g, f = r("<div style=\"width:'".concat("10px", "'; height:'")
				.concat("10px", '\'" id="editor-rhs" class="mergely-column"><textarea id="text-rhs"></textarea></div>'));
			if (f.eq(0)
				.attr("id", "".concat(this.id, "-editor-rhs")), f.find("#text-rhs")
				.attr("id", "".concat(this.id, "-rhs")), this.element.append(f), "left" != this.settings.rhs_margin && this.element.append(d), this.settings.sidebar || this.element.find(".mergely-margin")
				.css({
					display: "none"
				}), ["lgpl-separate-notice", "gpl-separate-notice", "mpl-separate-notice", "commercial"].indexOf(this.settings.license) < 0) {
				var p = {
						lgpl: "GNU LGPL v3.0",
						gpl: "GNU GPL v3.0",
						mpl: "MPL 1.1"
					},
					u = p[this.settings.license];
				u || (u = p.lgpl);
				this.element.parent()
					.height();
				var m = this.element.parent()
					.width();
				
			}
			try {
				g = this.element.find("#".concat(this.id, "-rhs"))
					.get(0)
			} catch (t) {}
			if (g) {
				var _;
				try {
					_ = this.element.find("#".concat(this.id, "-lhs"))
						.get(0)
				} catch (t) {}
				if (_) {
					var y = r('<div style="display:none" class="mergely current start" />')
						.appendTo("body")
						.css("border-top-color");
					this.current_diff_color = y;
					var v = "#".concat(this.id, " .CodeMirror-gutter-text { padding: 5px 0 0 0; }\n\t\t'#")
						.concat(this.id, " .CodeMirror-lines pre, #")
						.concat(this.id, " .CodeMirror-gutter-text pre { line-height: 18px; }\n\t\t'.CodeMirror-linewidget { overflow: hidden; };");
					this.settings.autoresize && (v += "".concat(this.id, " .CodeMirror-scroll { height: 100%; overflow: auto; }")), r('<style type="text/css">'.concat(v += "\n.CodeMirror { line-height: 18px; }", "</style>"))
						.appendTo("head");
					var w = this;
					if (w.trace("init", "binding event listeners"), this.editor = [], this.editor[this.id + "-lhs"] = n.fromTextArea(_, this.lhs_cmsettings), this.editor[this.id + "-rhs"] = n.fromTextArea(g, this.rhs_cmsettings), this.editor[this.id + "-lhs"].on("change", (function() {
						w.settings.autoupdate && w._changing(w.id + "-lhs", w.id + "-rhs")
					})), this.editor[this.id + "-lhs"].on("scroll", (function() {
						w._scrolling(w.id + "-lhs")
					})), this.editor[this.id + "-rhs"].on("change", (function() {
						w.settings.autoupdate && w._changing(w.id + "-lhs", w.id + "-rhs")
					})), this.editor[this.id + "-rhs"].on("scroll", (function() {
						w._scrolling(w.id + "-rhs")
					})), this.settings.autoresize) {
						var b = null,
							x = function(t) {
								w.settings.resize && w.settings.resize(t), w.resize(), w.editor[w.id + "-lhs"].refresh(), w.editor[w.id + "-rhs"].refresh()
							};
						r(window)
							.on("resize.mergely", (function() {
								b && clearTimeout(b), b = setTimeout(x, w.settings.resize_timeout)
							})), x(!0)
					}
					this.editor[this.id + "-lhs"].on("gutterClick", function(t, e, i, s) {
						C.call(this, "lhs", e, s)
					}.bind(this)), this.editor[this.id + "-rhs"].on("gutterClick", function(t, e, i, s) {
						C.call(this, "rhs", e, s)
					}.bind(this)), this.settings.lhs && (w.trace("init", "setting lhs value"), this.settings.lhs(function(t) {
						this._initializing = !0, delete this._current_diff, this.editor[this.id + "-lhs"].getDoc()
							.setValue(t)
					}.bind(this))), this.settings.rhs && (w.trace("init", "setting rhs value"), this.settings.rhs(function(t) {
						this._initializing = !0, delete this._current_diff, this.editor[this.id + "-rhs"].getDoc()
							.setValue(t)
					}.bind(this))), this.element.one("updated", (function() {
						s._initializing = !1, w.settings.loaded && w.settings.loaded()
					})), this.trace("init", "bound"), this.editor[this.id + "-lhs"].focus()
				} else console.error("lhs textarea not defined - Mergely not initialized properly")
			} else console.error("rhs textarea not defined - Mergely not initialized properly");

			function C(t, e, i) {
				var s, n;
				if (!(i.target && r(i.target)
					.closest(".merge-button")
					.length > 0))
					for (s = 0; s < this.changes.length; s++)
						if (e >= (n = this.changes[s])[t + "-line-from"] && e <= n[t + "-line-to"]) {
							this._current_diff = s, setTimeout(function() {
								this.scrollToDiff()
							}.bind(this), 10);
							break
						}
			}
		}, c.prototype._scroll_to_change = function(t) {
			if (t) {
				var e = this.editor[this.id + "-lhs"],
					i = this.editor[this.id + "-rhs"];
				e.setCursor(Math.max(t["lhs-line-from"], 0), 0), i.setCursor(Math.max(t["rhs-line-from"], 0), 0), t["lhs-line-to"] >= 0 && e.scrollIntoView({
					line: t["lhs-line-to"]
				}), e.focus()
			}
		}, c.prototype._scrolling = function(t) {
			var e = this.jQuery;
			if (!0 !== this._skipscroll[t]) {
				if (this.changes) {
					var i = e(this.editor[t].getScrollerElement());
					null == this.midway && (this.midway = (i.height() / 2 + i.offset()
							.top)
						.toFixed(2));
					var s = this.editor[t].coordsChar({
							left: 0,
							top: this.midway
						}),
						r = i.scrollTop(),
						n = i.scrollLeft();
					this.trace("scroll", "side", t), this.trace("scroll", "midway", this.midway), this.trace("scroll", "midline", s), this.trace("scroll", "top_to", r), this.trace("scroll", "left_to", n);
					var h = this.id + "-lhs",
						l = this.id + "-rhs";
					for (var a in this.editor)
						if (this.editor.hasOwnProperty(a) && t != a) {
							for (var c = t.replace(this.id + "-", ""), d = a.replace(this.id + "-", ""), g = 0, f = null, p = !1, u = 0; u < this.changes.length; ++u) {
								var m = this.changes[u];
								s.line >= m[c + "-line-from"] && (f = m, s.line >= f[c + "-line-to"] && (m.hasOwnProperty(c + "-y-start") && m.hasOwnProperty(c + "-y-end") && m.hasOwnProperty(d + "-y-start") && m.hasOwnProperty(d + "-y-end") ? g += m[c + "-y-end"] - m[c + "-y-start"] - (m[d + "-y-end"] - m[d + "-y-start"]) : p = !0))
							}
							var _ = this.editor[a].getViewport(),
								y = !0;
							f && (this.trace("scroll", "last change before midline", f), s.line >= _.from && s <= _.to && (y = !1)), this.trace("scroll", "scroll", y), y || p ? (this.trace("scroll", "scrolling other side", r - g), this._skipscroll[a] = !0, this.editor[a].scrollTo(n, r - g)) : this.trace("scroll", "not scrolling other side"), this.settings.autoupdate && (o.start(), this._calculate_offsets(h, l, this.changes), this.trace("change", "offsets time", o.stop()), this._markup_changes(h, l, this.changes), this.trace("change", "markup time", o.stop()), this._draw_diff(h, l, this.changes), this.trace("change", "draw time", o.stop())), this.trace("scroll", "scrolled")
						}
				}
			} else this._skipscroll[t] = !1
		}, c.prototype._changing = function(t, e) {
			this.trace("change", "changing-timeout", this.changed_timeout);
			var i = this;
			null != this.changed_timeout && clearTimeout(this.changed_timeout), this.changed_timeout = setTimeout((function() {
				o.start(), i._changed(t, e), i.trace("change", "total time", o.stop())
			}), this.settings.change_timeout)
		}, c.prototype._changed = function(t, e) {
			this._clear(), this._diff(t, e)
		}, c.prototype._clear = function() {
			var t, e, i, s, r, n, h = this,
				l = function() {
					for (o.start(), s = 0, n = e.lineCount(); s < n; ++s) e.removeLineClass(s, "background");
					for (s = 0; s < i.length; ++s)(r = i[s])
						.lines.length && h.trace("change", "clear text", r.lines[0].text), r.clear();
					e.clearGutter("merge"), h.trace("change", "clear time", o.stop())
				};
			for (t in this.editor) this.editor.hasOwnProperty(t) && (e = this.editor[t], i = h.chfns[t], e.operation(l));
			h.chfns[t] = [];
			var a = this._draw_info(this.id + "-lhs", this.id + "-rhs"),
				c = a.clhs.get(0)
				.getContext("2d"),
				d = a.crhs.get(0)
				.getContext("2d"),
				g = a.dcanvas.getContext("2d");
			c.beginPath(), c.fillStyle = this.settings.bgcolor, c.strokeStyle = "#888", c.fillRect(0, 0, 6.5, a.visible_page_height), c.strokeRect(0, 0, 6.5, a.visible_page_height), d.beginPath(), d.fillStyle = this.settings.bgcolor, d.strokeStyle = "#888", d.fillRect(0, 0, 6.5, a.visible_page_height), d.strokeRect(0, 0, 6.5, a.visible_page_height), g.beginPath(), g.fillStyle = "#fff", g.fillRect(0, 0, this.draw_mid_width, a.visible_page_height)
		}, c.prototype._diff = function(t, e) {
			var i = this.editor[t].getValue(),
				s = this.editor[e].getValue();
			o.start();
			var r = new h(i, s, this.settings);
			this.trace("change", "diff time", o.stop()), this.changes = l(r.normal_form()), this.trace("change", "parse time", o.stop()), void 0 === this._current_diff && this.changes.length && (this._current_diff = 0, this._initializing && this._scroll_to_change(this.changes[0])), this.trace("change", "scroll_to_change time", o.stop()), this._calculate_offsets(t, e, this.changes), this.trace("change", "offsets time", o.stop()), this._markup_changes(t, e, this.changes), this.trace("change", "markup time", o.stop()), this._draw_diff(t, e, this.changes), this.trace("change", "draw time", o.stop()), this.element.trigger("updated")
		}, c.prototype._parse_diff = function(t, e, i) {
			this.trace("diff", "diff results:\n", i);
			for (var s = [], r = 0, n = i.split(/\n/), o = 0; o < n.length; ++o)
				if (0 != n[o].length) {
					var h = {},
						l = this.change_exp.exec(n[o]);
					if (null != l) {
						var a = l[1].split(",");
						h["lhs-line-from"] = a[0] - 1, 1 == a.length ? h["lhs-line-to"] = a[0] - 1 : h["lhs-line-to"] = a[1] - 1;
						var c = l[3].split(",");
						h["rhs-line-from"] = c[0] - 1, 1 == c.length ? h["rhs-line-to"] = c[0] - 1 : h["rhs-line-to"] = c[1] - 1, h["lhs-line-from"] < 0 && (h["lhs-line-from"] = 0), h["lhs-line-to"] < 0 && (h["lhs-line-to"] = 0), h["rhs-line-from"] < 0 && (h["rhs-line-from"] = 0), h["rhs-line-to"] < 0 && (h["rhs-line-to"] = 0), h.op = l[2], s[r++] = h, this.trace("diff", "change", h)
					}
				} return s
		}, c.prototype._get_viewport_side = function(t) {
			return this.editor[t].getViewport()
		}, c.prototype._is_change_in_view = function(t, e, i) {
			return i["".concat(t, "-line-from")] >= e.from && i["".concat(t, "-line-from")] <= e.to || i["".concat(t, "-line-to")] >= e.from && i["".concat(t, "-line-to")] <= e.to || e.from >= i["".concat(t, "-line-from")] && e.to <= i["".concat(t, "-line-to")]
		}, c.prototype._set_top_offset = function(t) {
			var e = this.editor[t].getScrollInfo()
				.top;
			this.editor[t].scrollTo(null, 0);
			var i = this.element.find(".CodeMirror-measure")
				.first()
				.offset()
				.top - 4;
			return !!i && (this.editor[t].scrollTo(null, e), this.draw_top_offset = .5 - i, !0)
		}, c.prototype._calculate_offsets = function(t, e, i) {
			var s = this.jQuery;
			if (null == this.em_height) {
				if (!this._set_top_offset(t)) return;
				this.em_height = this.editor[t].defaultTextHeight(), this.em_height || (console.warn("Failed to calculate offsets, using 18 by default"), this.em_height = 18), this.draw_lhs_min = .5;
				var r = s("#" + t + "-" + e + "-canvas");
				if (r.length || console.error("failed to find canvas", "#" + t + "-" + e + "-canvas"), !r.width()) return void console.error("canvas width is 0");
				this.draw_mid_width = s("#" + t + "-" + e + "-canvas")
					.width(), this.draw_rhs_max = this.draw_mid_width - .5, this.draw_lhs_width = 5, this.draw_rhs_width = 5, this.trace("calc", "change offsets calculated", {
						top_offset: this.draw_top_offset,
						lhs_min: this.draw_lhs_min,
						rhs_max: this.draw_rhs_max,
						lhs_width: this.draw_lhs_width,
						rhs_width: this.draw_rhs_width
					})
			}
			for (var n = this.editor[t].charCoords({
				line: 0
			}), o = this.editor[e].charCoords({
				line: 0
			}), h = this._get_viewport_side(t), l = (this._get_viewport_side(e), 0); l < i.length; ++l) {
				var a = i[l];
				if (!this.settings.viewport || this._is_change_in_view(h, "lhs", a) || this._is_change_in_view(h, "rhs", a)) {
					var c, d, g, f, p, u, m, _, y, v, w = a["lhs-line-from"] >= 0 ? a["lhs-line-from"] : 0,
						b = a["lhs-line-to"] >= 0 ? a["lhs-line-to"] : 0,
						x = a["rhs-line-from"] >= 0 ? a["rhs-line-from"] : 0,
						C = a["rhs-line-to"] >= 0 ? a["rhs-line-to"] : 0;
					this.editor[t].getOption("lineWrapping") || this.editor[e].getOption("lineWrapping") ? (p = this.editor[t].cursorCoords({
						line: w,
						ch: 0
					}, "page"), _ = this.editor[t].getLineHandle(w), c = {
						top: p.top,
						bottom: p.top + _.height
					}, u = this.editor[t].cursorCoords({
						line: b,
						ch: 0
					}, "page"), m = this.editor[t].getLineHandle(b), d = {
						top: u.top,
						bottom: u.top + m.height
					}, p = this.editor[e].cursorCoords({
						line: x,
						ch: 0
					}, "page"), y = this.editor[e].getLineHandle(x), g = {
						top: p.top,
						bottom: p.top + y.height
					}, u = this.editor[e].cursorCoords({
						line: C,
						ch: 0
					}, "page"), v = this.editor[e].getLineHandle(C), f = {
						top: u.top,
						bottom: u.top + v.height
					}) : (c = {
						top: n.top + w * this.em_height,
						bottom: n.bottom + w * this.em_height + 2
					}, d = {
						top: n.top + b * this.em_height,
						bottom: n.bottom + b * this.em_height + 2
					}, g = {
						top: o.top + x * this.em_height,
						bottom: o.bottom + x * this.em_height + 2
					}, f = {
						top: o.top + C * this.em_height,
						bottom: o.bottom + C * this.em_height + 2
					}), "a" == a.op ? x > 0 && (c.top = c.bottom, c.bottom += this.em_height, d = c) : "d" == a.op && w > 0 && (g.top = g.bottom, g.bottom += this.em_height, f = g), a["lhs-y-start"] = this.draw_top_offset + c.top, "c" == a.op || "d" == a.op ? a["lhs-y-end"] = this.draw_top_offset + d.bottom : a["lhs-y-end"] = this.draw_top_offset + d.top, a["rhs-y-start"] = this.draw_top_offset + g.top, "c" == a.op || "a" == a.op ? a["rhs-y-end"] = this.draw_top_offset + f.bottom : a["rhs-y-end"] = this.draw_top_offset + f.top, this.trace("calc", "change calculated", l, a)
				} else delete a["lhs-y-start"], delete a["lhs-y-end"], delete a["rhs-y-start"], delete a["rhs-y-end"]
			}
			return i
		}, c.prototype._markup_changes = function(t, e, i) {
			var s = this.jQuery;
			this.element.find(".merge-button")
				.remove();
			var r = this,
				n = this.editor[t],
				h = this.editor[e],
				l = this._current_diff,
				c = this._get_viewport_side(t),
				d = this._get_viewport_side(e);
			o.start(), n.operation(function() {
				for (var t = 0; t < i.length; ++t) {
					var e = i[t];
					if (this._is_change_in_view("lhs", c, e)) {
						var s = e["lhs-line-from"] >= 0 ? e["lhs-line-from"] : 0,
							o = e["lhs-line-to"] >= 0 ? e["lhs-line-to"] : 0,
							a = e["rhs-line-from"] >= 0 ? e["rhs-line-from"] : 0,
							d = (e["rhs-line-to"] >= 0 && e["rhs-line-to"], ["mergely", "lhs", e.op, "cid-" + t]);
						if (n.addLineClass(s, "background", "start"), n.addLineClass(o, "background", "end"), e["lhs-line-from"] < 0 && d.push("empty"), l == t && (s != o && n.addLineClass(s, "background", "current"), n.addLineClass(o, "background", "current")), 0 == s && 0 == o && 0 == a) n.addLineClass(s, "background", d.join(" ")), n.addLineClass(s, "background", "first");
						else
							for (var g = s; g <= o; ++g) n.addLineClass(g, "background", d.join(" ")), n.addLineClass(g, "background", d.join(" "));
						if (!h.getOption("readOnly")) {
							var f = r.merge_rhs_button.clone();
							f.button && f.button({
								icons: {
									primary: "ui-icon-triangle-1-e"
								},
								text: !1
							}), f.addClass("merge-button"), f.attr("id", "merge-rhs-" + t), n.setGutterMarker(s, "merge", f.get(0))
						}
					}
				}
			}.bind(this)), this.trace("change", "markup lhs-editor time", o.stop()), h.operation(function() {
				for (var t = 0; t < i.length; ++t) {
					var e = i[t];
					if (this._is_change_in_view("rhs", d, e)) {
						var s = e["lhs-line-from"] >= 0 ? e["lhs-line-from"] : 0,
							o = (e["lhs-line-to"] >= 0 && e["lhs-line-to"], e["rhs-line-from"] >= 0 ? e["rhs-line-from"] : 0),
							a = e["rhs-line-to"] >= 0 ? e["rhs-line-to"] : 0,
							c = ["mergely", "rhs", e.op, "cid-" + t];
						if (h.addLineClass(o, "background", "start"), h.addLineClass(a, "background", "end"), e["rhs-line-from"] < 0 && c.push("empty"), l == t && (o != a && h.addLineClass(o, "background", "current"), h.addLineClass(a, "background", "current")), 0 == o && 0 == a && 0 == s) h.addLineClass(o, "background", c.join(" ")), h.addLineClass(o, "background", "first");
						else
							for (var g = o; g <= a; ++g) h.addLineClass(g, "background", c.join(" ")), h.addLineClass(g, "background", c.join(" "));
						if (!n.getOption("readOnly")) {
							var f = r.merge_lhs_button.clone();
							f.button && f.button({
								icons: {
									primary: "ui-icon-triangle-1-w"
								},
								text: !1
							}), f.addClass("merge-button"), f.attr("id", "merge-lhs-" + t), h.setGutterMarker(o, "merge", f.get(0))
						}
					}
				}
			}.bind(this)), this.trace("change", "markup rhs-editor time", o.stop());
			var g, f = [];
			for (M = 0; this.settings.lcs && M < i.length; ++M) {
				var p = i[M],
					u = p["lhs-line-from"] >= 0 ? p["lhs-line-from"] : 0,
					m = p["lhs-line-to"] >= 0 ? p["lhs-line-to"] : 0,
					_ = p["rhs-line-from"] >= 0 ? p["rhs-line-from"] : 0,
					y = p["rhs-line-to"] >= 0 ? p["rhs-line-to"] : 0;
				if ("d" == p.op) {
					var v = u,
						w = m;
					if (this._is_change_in_view("lhs", c, p)) {
						var b = n.lineInfo(w);
						b && f.push([n, {
							line: v,
							ch: 0
						}, {
							line: w,
							ch: b.text.length
						}, {
							className: "mergely ch d lhs"
						}])
					}
				} else if ("c" == p.op)
					for (P = u, g = _; P >= 0 && P <= m || g >= 0 && g <= y; ++P, ++g) {
						var x, C;
						if (g > y) x = n.getLine(P), f.push([n, {
							line: P,
							ch: 0
						}, {
							line: P,
							ch: x.length
						}, {
							className: "mergely ch d lhs"
						}]);
						else if (P > m) C = h.getLine(g), f.push([h, {
							line: g,
							ch: 0
						}, {
							line: g,
							ch: C.length
						}, {
							className: "mergely ch a rhs"
						}]);
						else x = n.getLine(P), C = h.getLine(g), new a(x, C, {
								ignoreaccents: !!this.settings.ignoreaccents,
								ignorews: !!this.settings.ignorews
							})
							.diff((function(t, e) {
								r._is_change_in_view("rhs", d, p) && f.push([h, {
									line: g,
									ch: t
								}, {
									line: g,
									ch: e
								}, {
									className: "mergely ch a rhs"
								}])
							}), (function(t, e) {
								r._is_change_in_view("lhs", c, p) && f.push([n, {
									line: P,
									ch: t
								}, {
									line: P,
									ch: e
								}, {
									className: "mergely ch d lhs"
								}])
							}))
					}
			}
			this.trace("change", "LCS marktext time", o.stop()), n.operation((function() {
				for (var t = 0; t < f.length; ++t) {
					var e = f[t];
					e[0].doc.id == n.getDoc()
						.id && r.chfns[r.id + "-lhs"].push(e[0].markText(e[1], e[2], e[3]))
				}
			})), h.operation((function() {
				for (var t = 0; t < f.length; ++t) {
					var e = f[t];
					e[0].doc.id == h.getDoc()
						.id && r.chfns[r.id + "-rhs"].push(e[0].markText(e[1], e[2], e[3]))
				}
			})), this.trace("change", "LCS markup time", o.stop());
			var O = {
				lhs: n,
				rhs: h
			};
			this.element.find(".merge-button")
				.on("click", (function(t) {
					var e = "rhs",
						i = "lhs";
					s(this)
						.parents("#" + r.id + "-editor-lhs")
						.length && (e = "lhs", i = "rhs");
					var n = O[e].coordsChar({
							left: t.pageX,
							top: t.pageY
						}),
						o = null,
						h = O[e].lineInfo(n.line);
					s.each(h.bgClass.split(" "), (function(t, e) {
						if (0 == e.indexOf("cid-")) return o = parseInt(e.split("-")[1], 10), !1
					}));
					var l = r.changes[o];
					return r._merge_change(l, e, i), !1
				}));
			var A, k, M, P, L = s("#" + this.id + "-lhs ~ .CodeMirror .CodeMirror-code .CodeMirror-linenumber.CodeMirror-gutter-elt"),
				j = s("#" + this.id + "-rhs ~ .CodeMirror .CodeMirror-code .CodeMirror-linenumber.CodeMirror-gutter-elt");
			j.removeClass("mergely current"), L.removeClass("mergely current");
			var S = parseInt(L.eq(0)
					.text(), 10) - 1,
				T = parseInt(L.eq(L.length - 1)
					.text(), 10),
				E = parseInt(j.eq(0)
					.text(), 10) - 1,
				V = parseInt(j.eq(j.length - 1)
					.text(), 10);
			for (M = 0; M < i.length; ++M) {
				if (p = i[M], l == M && "a" !== p.op)
					for (A = p["lhs-line-from"], k = p["lhs-line-to"] + 1, P = A; P < k; ++P) P >= S && P <= T && L.eq(P - S)
						.addClass("mergely current");
				if (l == M && "d" !== p.op)
					for (A = p["rhs-line-from"], k = p["rhs-line-to"] + 1, P = A; P < k; ++P) P >= E && P <= V && j.eq(P - E)
						.addClass("mergely current")
			}
			this.trace("change", "markup buttons time", o.stop())
		}, c.prototype._merge_change = function(t, e, i) {
			if (t) {
				var s, r = this.CodeMirror,
					n = {
						lhs: this.editor[this.id + "-lhs"],
						rhs: this.editor[this.id + "-rhs"]
					},
					o = t[e + "-line-from"],
					h = t[e + "-line-to"],
					l = t[i + "-line-from"],
					a = t[i + "-line-to"],
					c = n[e].getDoc(),
					d = n[i].getDoc(),
					g = o >= 0 ? c.getLine(o)
					.length + 1 : 0,
					f = h >= 0 ? c.getLine(h)
					.length + 1 : 0,
					p = a >= 0 ? d.getLine(a)
					.length + 1 : 0,
					u = l >= 0 ? d.getLine(l)
					.length + 1 : 0;
				"c" === t.op ? (s = c.getRange(r.Pos(o, 0), r.Pos(h, f)), d.replaceRange(s, r.Pos(l, 0), r.Pos(a, p))) : "lhs" === i && "d" === t.op || "rhs" === i && "a" === t.op ? (o > 0 ? (s = c.getRange(r.Pos(o, g), r.Pos(h, f)), l += 1) : s = c.getRange(r.Pos(0, 0), r.Pos(h + 1, 0)), d.replaceRange(s, r.Pos(l - 1, 0), r.Pos(a + 1, 0))) : ("rhs" === i && "d" === t.op || "lhs" === i && "a" === t.op) && (o > 0 ? (g = c.getLine(o - 1)
					.length + 1, s = c.getRange(r.Pos(o - 1, g), r.Pos(h, f))) : s = c.getRange(r.Pos(0, 0), r.Pos(h + 1, 0)), l < 0 && (l = 0), d.replaceRange(s, r.Pos(l, u))), this._scroll_to_change(t)
			}
		}, c.prototype._draw_info = function(t, e) {
			var i = this.jQuery,
				s = i(this.editor[t].getScrollerElement())
				.height() + 17,
				r = i(this.editor[t].getScrollerElement())
				.children(":first-child")
				.height(),
				n = document.getElementById(t + "-" + e + "-canvas");
			if (null == n) throw "Failed to find: " + t + "-" + e + "-canvas";
			var o = this.element.find("#" + this.id + "-lhs-margin"),
				h = this.element.find("#" + this.id + "-rhs-margin");
			return {
				visible_page_height: s,
				gutter_height: r,
				visible_page_ratio: s / r,
				margin_ratio: s / r,
				lhs_scroller: i(this.editor[t].getScrollerElement()),
				rhs_scroller: i(this.editor[e].getScrollerElement()),
				lhs_lines: this.editor[t].lineCount(),
				rhs_lines: this.editor[e].lineCount(),
				dcanvas: n,
				clhs: o,
				crhs: h,
				lhs_xyoffset: i(o)
					.offset(),
				rhs_xyoffset: i(h)
					.offset()
			}
		}, c.prototype._draw_diff = function(t, e, i) {
			var s = this.jQuery,
				r = this._draw_info(t, e),
				n = r.clhs.get(0),
				o = r.crhs.get(0),
				h = r.dcanvas.getContext("2d"),
				l = n.getContext("2d"),
				a = o.getContext("2d");
			this.trace("draw", "visible_page_height", r.visible_page_height), this.trace("draw", "gutter_height", r.gutter_height), this.trace("draw", "visible_page_ratio", r.visible_page_ratio), this.trace("draw", "lhs-scroller-top", r.lhs_scroller.scrollTop()), this.trace("draw", "rhs-scroller-top", r.rhs_scroller.scrollTop()), s.each(this.element.find("canvas"), (function() {
				s(this)
					.get(0)
					.height = r.visible_page_height
			})), r.clhs.unbind("click"), r.crhs.unbind("click"), l.beginPath(), l.fillStyle = this.settings.bgcolor, l.strokeStyle = "#888", l.fillRect(0, 0, 6.5, r.visible_page_height), l.strokeRect(0, 0, 6.5, r.visible_page_height), a.beginPath(), a.fillStyle = this.settings.bgcolor, a.strokeStyle = "#888", a.fillRect(0, 0, 6.5, r.visible_page_height), a.strokeRect(0, 0, 6.5, r.visible_page_height);
			for (var c = this._get_viewport_side(t), d = this._get_viewport_side(e), g = 0; g < i.length; ++g) {
				var f = i[g],
					p = this.settings.fgcolor[f.op];
				this._current_diff === g && (p = this.current_diff_color), this.trace("draw", f);
				var u = (f["lhs-y-start"] + r.lhs_scroller.scrollTop()) * r.visible_page_ratio,
					m = (f["lhs-y-end"] + r.lhs_scroller.scrollTop()) * r.visible_page_ratio + 1,
					_ = (f["rhs-y-start"] + r.rhs_scroller.scrollTop()) * r.visible_page_ratio,
					y = (f["rhs-y-end"] + r.rhs_scroller.scrollTop()) * r.visible_page_ratio + 1;
				if (this.trace("draw", "marker calculated", u, m, _, y), l.beginPath(), l.fillStyle = p, l.strokeStyle = "#000", l.lineWidth = .5, l.fillRect(1.5, u, 4.5, Math.max(m - u, 5)), l.strokeRect(1.5, u, 4.5, Math.max(m - u, 5)), a.beginPath(), a.fillStyle = p, a.strokeStyle = "#000", a.lineWidth = .5, a.fillRect(1.5, _, 4.5, Math.max(y - _, 5)), a.strokeRect(1.5, _, 4.5, Math.max(y - _, 5)), this._is_change_in_view("lhs", c, f) || this._is_change_in_view("rhs", d, f)) {
					u = f["lhs-y-start"], m = f["lhs-y-end"], _ = f["rhs-y-start"], y = f["rhs-y-end"];
					h.beginPath(), h.strokeStyle = p, h.lineWidth = this._current_diff == g ? 1.5 : 1;
					var v = this.draw_lhs_width,
						w = m - u - 1,
						b = this.draw_lhs_min,
						x = u;
					h.moveTo(b, x), "Microsoft Internet Explorer" == navigator.appName ? (h.lineTo(this.draw_lhs_min + this.draw_lhs_width, u), h.lineTo(this.draw_lhs_min + this.draw_lhs_width, m + 1), h.lineTo(this.draw_lhs_min, m + 1)) : (w <= 0 ? h.lineTo(b + v, x) : (h.arcTo(b + v, x, b + v, x + 3, 3), h.arcTo(b + v, x + w, b + v - 3, x + w, 3)), h.lineTo(b, x + w)), h.stroke(), v = this.draw_rhs_width, w = y - _ - 1, b = this.draw_rhs_max, x = _, h.moveTo(b, x), "Microsoft Internet Explorer" == navigator.appName ? (h.lineTo(this.draw_rhs_max - this.draw_rhs_width, _), h.lineTo(this.draw_rhs_max - this.draw_rhs_width, y + 1), h.lineTo(this.draw_rhs_max, y + 1)) : (w <= 0 ? h.lineTo(b - v, x) : (h.arcTo(b - v, x, b - v, x + 3, 3), h.arcTo(b - v, x + w, b - 3, x + w, 3)), h.lineTo(b, x + w)), h.stroke();
					var C = this.draw_lhs_min + this.draw_lhs_width,
						O = u + (m + 1 - u) / 2,
						A = this.draw_rhs_max - this.draw_rhs_width,
						k = _ + (y + 1 - _) / 2;
					h.moveTo(C, O), O == k ? h.lineTo(A, k) : h.bezierCurveTo(C + 12, O - 3, A - 12, k - 3, A, k), h.stroke()
				}
			}
			l.fillStyle = this.settings.vpcolor, a.fillStyle = this.settings.vpcolor;
			var M = r.clhs.height() * r.visible_page_ratio,
				P = r.lhs_scroller.scrollTop() / r.gutter_height * r.clhs.height(),
				L = r.crhs.height() * r.visible_page_ratio,
				j = r.rhs_scroller.scrollTop() / r.gutter_height * r.crhs.height();
			this.trace("draw", "cls.height", r.clhs.height()), this.trace("draw", "lhs_scroller.scrollTop()", r.lhs_scroller.scrollTop()), this.trace("draw", "gutter_height", r.gutter_height), this.trace("draw", "visible_page_ratio", r.visible_page_ratio), this.trace("draw", "lhs from", P, "lhs to", M), this.trace("draw", "rhs from", j, "rhs to", L), l.fillRect(1.5, P, 4.5, M), a.fillRect(1.5, j, 4.5, L), r.clhs.click((function(t) {
				var e = t.pageY - r.lhs_xyoffset.top - M / 2,
					i = Math.max(0, e / n.height * r.lhs_scroller.get(0)
						.scrollHeight);
				r.lhs_scroller.scrollTop(i)
			})), r.crhs.click((function(t) {
				var e = t.pageY - r.rhs_xyoffset.top - L / 2,
					i = Math.max(0, e / o.height * r.rhs_scroller.get(0)
						.scrollHeight);
				r.rhs_scroller.scrollTop(i)
			}))
		}, c.prototype.trace = function(t) {
			this.settings._debug.indexOf(t) >= 0 && (arguments[0] = t + ":", console.log([].slice.apply(arguments)))
		}, t.exports = c
	}, function(t, e) {
		function i(t, e) {
			for (var i = 0; i < e.length; i++) {
				var s = e[i];
				s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
			}
		}
		var s = function() {
			function t() {
				! function(t, e) {
					if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
				}(this, t)
			}
			var e, s, r;
			return e = t, r = [{
				key: "start",
				value: function() {
					t.t0 = Date.now()
				}
			}, {
				key: "stop",
				value: function() {
					var e = Date.now(),
						i = e - t.t0;
					return t.t0 = e, i
				}
			}], (s = null) && i(e.prototype, s), r && i(e, r), Object.defineProperty(e, "prototype", {
				writable: !1
			}), t
		}();
		s.t0 = 0, t.exports = s
	}, function(e, i) {
		e.exports = t
	}, function(t, i) {
		t.exports = e
	}])
}));