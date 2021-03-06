/**
 * @license FuzzySearch.js
 * Autocomplete suggestion engine using approximate string matching
 * https://github.com/jeancroy/FuzzySearch
 *
 * Copyright (c) 2015, Jean Christophe Roy
 * Licensed under The MIT License.
 * http://opensource.org/licenses/MIT
 */
!function () {
    "use strict";
    function a(b) {
        return void 0 === b && (b = {}), this instanceof a ? void a.setOptions(this, b, a.defaultOptions, w, !0, this._optionsHook) : new a(b)
    }

    function b(a, b) {
        for (var c in a)a.hasOwnProperty(c) && (this[c] = b.hasOwnProperty(c) && void 0 !== b[c] ? b[c] : a[c])
    }

    function c(a, b) {
        for (var c in b)b.hasOwnProperty(c) && (a[c] = b[c])
    }

    function d(a, b) {
        for (var c = b.length, d = 0, e = -1; ++e < c;) {
            var f = b[e], g = f.length;
            a.substr(d, g) === f && (d += g)
        }
        return d > 0 ? a.substr(d) : a
    }

    function e(a) {
        var b = a.length;
        if (!b)return null;
        for (var c = g(a[0]), d = 0; ++d < b;)c += "|" + g(a[d]);
        return new RegExp("(?:^|\\s)\\s*(" + c + "):\\s*", "g")
    }

    function f(a) {
        var b = a.length;
        if (!b)return null;
        var c = g(a);
        return new RegExp("(?:^|[" + c + "])+([^" + c + "])[^" + c + "]*", "g")
    }

    function g(a) {
        var b = /[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g;
        return a.replace(b, "\\$&")
    }

    function h(a, b, c, d, e, f) {
        this.item = a, this.fields = b, this.score = c, this.matchIndex = d, this.subIndex = e, this.sortKey = f
    }

    function i(a, b) {
        var c = b.score - a.score;
        if (0 !== c)return c;
        var d = a.sortKey, e = b.sortKey;
        return d > e ? 1 : e > d ? -1 : 0
    }

    function j(a, b, c, d, e, f) {
        this.normalized = a, this.tokens_groups = b, this.fused_str = c, this.fused_map = d, this.fused_score = 0, this.has_children = e, this.children = f
    }

    function k(a, b, c) {
        this.tokens = a, this.map = b, this.gate = c;
        for (var d = a.length, e = -1, f = new Array(d); ++e < d;)f[e] = 0;
        this.score_item = f.slice(), this.score_field = f.slice(), this.field_pos = f
    }

    function l(a, b) {
        this.start = a, this.end = b
    }

    function m(a, b) {
        this.item = a, this.fields = b
    }

    function n(a, b, c, d) {
        for (var e, f, g, h = b.length; h > d && (e = b[d++], "*" !== e && "" !== e);) {
            if (!(e in a))return c;
            a = a[e]
        }
        var i = Object.prototype.toString.call(a), j = "[object Array]" === i, k = "[object Object]" === i;
        if (d === h)if (j)for (f = -1, g = a.length; ++f < g;)c.push(a[f].toString()); else if (k)for (e in a)a.hasOwnProperty(e) && c.push(a[e].toString()); else c.push(a.toString()); else if ("*" === e)if (j)for (f = -1, g = a.length; ++f < g;)n(a[f], b, c, d); else if (k)for (e in a)a.hasOwnProperty(e) && n(a[e], b, c, d);
        return c
    }

    function o(a) {
        return a ? a.toLowerCase().replace(/[^\u0000-\u007E]/g, function (a) {
            return y[a] || a
        }) : ""
    }

    function p() {
        for (var a = "\xe3\xe0\xe1\xe4\xe2\xe6\u1ebd\xe8\xe9\xeb\xea\xec\xed\xef\xee\xf5\xf2\xf3\xf6\xf4\u0153\xf9\xfa\xfc\xfb\xf1\xe7", b = "aaaaaaeeeeeiiiioooooouuuunc", c = {}, d = 0; d < a.length; d++)c[a[d]] = b[d];
        return c
    }

    function q(a, b, c, d) {
        var e = c.length, f = b.exec(a);
        if (null === f)return c[e] = a, void(d[e] = "");
        for (var g, h, i = 0; null !== f;)g = f.index, h = f[0].length, c[e] = a.substring(i, g), d[e] = a.substr(g, h), i = g + h, e++, f = b.exec(a);
        c[e] = a.substring(i), d[e] = ""
    }

    function r(a, b, c, d) {
        var e, f, g = a.length, h = [];
        for (e = 0; g > e; e++)h[e] = {};
        var i, j = new u(a, h, c, d), k = s(j, 0, 0).score, l = 0;
        for (e = 0; g > e && (i = h[e][l], i); e++)b[e] = f = i.index, f > -1 && (l |= 1 << f);
        return k
    }

    function s(a, b, c) {
        var d = a.score_grid, e = a.cache_tree, f = a.score_thresholds, g = a.order_bonus, h = d.length, i = d[c].length;
        i > x && (i = x);
        var j, k, l, m = f[c], n = 0, o = -1, p = h - 1 > c, q = e[c + 1];
        for (j = 0; i > j; j++) {
            var r = 1 << j;
            if (!(b & r || (k = d[c][j], m > k))) {
                if (p) {
                    l = b | r;
                    var u = l in q ? q[l] : s(a, l, c + 1);
                    k += u.score, j < u.index && (k += g)
                }
                k >= n && (n = k, o = j)
            }
        }
        p && (l = b, k = l in q ? q[l].score : s(a, l, c + 1).score, k > n && (n = k, o = -1));
        var v = new t(n, o);
        return e[c][b] = v, v
    }

    function t(a, b) {
        this.score = a, this.index = b
    }

    function u(a, b, c, d) {
        this.score_grid = a, this.cache_tree = b, this.score_thresholds = c, this.order_bonus = d
    }

    function v(a, b) {
        var c, d, e = a.slice();
        for (a.length = b, c = 0; b > c; c++)a[c] = -1;
        for (c = 0; c < e.length; c++)d = e[c], d > -1 && b > d && (a[d] = c)
    }

    a.defaultOptions = {
        minimum_match: 1,
        thresh_include: 2,
        thresh_relative_to_best: .5,
        field_good_enough: 20,
        bonus_match_start: .5,
        bonus_token_order: 2,
        bonus_position_decay: .7,
        score_per_token: !0,
        score_test_fused: !1,
        score_acronym: !1,
        token_sep: " .,-:",
        score_round: .1,
        output_limit: 0,
        sorter: i,
        normalize: o,
        filter: null,
        output_map: "item",
        join_str: ", ",
        token_query_min_length: 2,
        token_field_min_length: 3,
        token_query_max_length: 64,
        token_field_max_length: 64,
        token_fused_max_length: 64,
        token_min_rel_size: .6,
        token_max_rel_size: 10,
        interactive_debounce: 150,
        interactive_mult: 1.2,
        interactive_burst: 3,
        source: [],
        keys: [],
        lazy: !1,
        token_re: /\s+/g
    };
    var w = {
        tags: [],
        index: [],
        tags_re: null,
        acro_re: null,
        token_re: null,
        options: null,
        dirty: !1,
        query: null,
        results: [],
        start_time: 0,
        search_time: 0
    }, x = 32;
    b.update = function (a, b, c) {
        for (var d in c)c.hasOwnProperty(d) && b.hasOwnProperty(d) && (a[d] = void 0 === c[d] ? b[d] : c[d])
    }, a.setOptions = function (a, d, e, f, g, h) {
        g ? (c(a, f), a.options = new b(e, d)) : b.update(a.options, e, d), h.call(a, d)
    }, c(a.prototype, {
        setOptions: function (b, c) {
            void 0 === c && (c = b.reset || !1), a.setOptions(this, b, a.defaultOptions, w, c, this._optionsHook)
        }, _optionsHook: function (a) {
            var b = this.options;
            "output_map"in a && "string" == typeof a.output_map && ("alias" === b.output_map ? b.output_map = this.aliasResult : b.output_map = d(b.output_map, ["root", "."])), this.source = b.source;
            var c;
            if ("keys"in a && void 0 !== (c = a.keys)) {
                var h, i, j = Object.prototype.toString.call(c);
                if (this.tags = null, "[object String]" === j)this.keys = c.length ? [c] : []; else if ("[object Object]" === j) {
                    this.keys = [], this.tags = [], h = 0;
                    for (var k in c)c.hasOwnProperty(k) && (this.tags[h] = k, this.keys[h] = c[k], h++)
                } else this.keys = c;
                for (c = this.keys, i = c.length, h = -1; ++h < i;)c[h] = d(c[h], ["item", "."]);
                this.tags || (this.tags = c), this.tags_re = e(this.tags)
            }
            (null === this.acro_re || "acronym_tok"in a) && (this.acro_re = f(b.token_sep)), (null === this.token_re || "token_sep"in a) && (this.token_re = b.token_re = new RegExp("[" + g(b.token_sep) + "]+", "g")), (a.dirty || "source"in a || "keys"in a) && (b.lazy ? this.dirty = !0 : (this._prepSource(this.source, this.keys, !0), this.dirty = !1))
        }
    }), c(a.prototype, {
        getMatchingField: function (b) {
            var c = a.generateFields(b.item, [this.keys[b.matchIndex]]);
            return c[0][b.subIndex]
        }, aliasResult: function (b) {
            for (var c = this.options, d = a.generateFields(b.item, this.keys), e = {}, f = this.tags, g = c.join_str, h = -1, i = d.length; ++h < i;)e[f[h]] = d[h].join(g);
            return e._item = b.item, e._score = b.score, e._match = d[b.matchIndex][b.subIndex], e
        }
    }), a.map = function (a, b, c, d) {
        var e = a.length;
        if (d > 0 && e > d && (e = d), "function" != typeof b)return a.slice(0, e);
        for (var f = new Array(e), g = -1; ++g < e;)f[g] = b.call(c, a[g], g, a);
        return f
    }, a.mapField = function (a, b, c) {
        var d = a.length;
        if (c > 0 && d > c && (d = c), "" === b)return a.slice(0, d);
        var e, f, g = new Array(d);
        if (-1 === b.indexOf("."))for (f = -1; ++f < d;)e = a[f], b in e && (g[f] = e[b]); else {
            var h = b.split("."), i = h.length;
            for (f = -1; ++f < d;) {
                e = a[f];
                for (var j = -1; ++j < i;) {
                    var k = h[j];
                    if (!(k in e))break;
                    e = e[k]
                }
                g[f] = e
            }
        }
        return g
    }, a.filterGTE = function (a, b, c) {
        for (var d, e = -1, f = -1, g = a.length, h = []; ++e < g;)d = a[e], d[b] >= c && (h[++f] = d);
        return h
    }, c(a.prototype, {
        _prepQuery: function (b) {
            var c, d, e, f, g, h, i = this.options, k = i.score_per_token, l = i.score_test_fused, m = i.token_fused_max_length, n = i.token_field_min_length, o = i.token_field_max_length, p = this.tags, q = this.tags_re, r = p.length, s = this.token_re;
            if (k && r && q) {
                var t, u = 0, v = 0, w = new Array(r + 1), x = q.exec(b);
                for (g = null !== x; null !== x;)t = x.index, w[v] = b.substring(u, t), u = t + x[0].length, v = p.indexOf(x[1]) + 1, x = q.exec(b);
                w[v] = b.substring(u), f = new Array(r);
                for (var y = -1; ++y < r;) {
                    var z = w[y + 1];
                    z && z.length && (c = i.normalize(z), d = c.substring(0, m), e = l || !k ? a.alphabet(d) : {}, h = a.pack_tokens(a.filterSize(c.split(s), n, o)), f[y] = new j(c, h, d, e, !1, []))
                }
                c = i.normalize(w[0]), h = a.pack_tokens(a.filterSize(c.split(s), n, o))
            } else c = i.normalize(b), h = k ? a.pack_tokens(a.filterSize(c.split(s), n, o)) : [], g = !1, f = new Array(r);
            return d = c.substring(0, m), e = l || !k ? a.alphabet(d) : {}, new j(c, h, d, e, g, f)
        }
    }), j.prototype.resetItem = function () {
        for (var a = this.tokens_groups, b = -1, c = a.length; ++b < c;)for (var d = a[b].score_item, e = -1, f = d.length; ++e < f;)d[e] = 0;
        if (this.fused_score = 0, this.has_children)for (var g = this.children, h = -1, i = g.length; ++h < i;) {
            var j = g[h];
            j && j.resetItem()
        }
    }, j.prototype.scoreItem = function () {
        for (var a = 0, b = this.tokens_groups, c = -1, d = b.length; ++c < d;)for (var e = b[c].score_item, f = -1, g = e.length; ++f < g;)a += e[f];
        if (this.fused_score > a && (a = this.fused_score), this.has_children)for (var h = this.children, i = -1, j = h.length; ++i < j;) {
            var k = h[i];
            k && (a += k.scoreItem())
        }
        return a
    }, a.alphabet = function (b) {
        var c = b.length;
        return c > x ? a.posVector(b) : a.bitVector(b, {}, 0)
    }, a.mapAlphabet = function (b) {
        for (var c = b.length, d = new Array(c), e = -1; ++e < c;) {
            var f = b[e];
            f.length > x ? d[e] = a.posVector(f) : d[e] = a.bitVector(f, {}, 0)
        }
        return d
    }, a.bitVector = function (a, b, c) {
        for (var d, e = a.length, f = -1, g = c; ++f < e;)d = a[f], d in b ? b[d] |= 1 << g++ : b[d] = 1 << g++;
        return b
    }, a.posVector = function (a) {
        for (var b, c = {}, d = a.length, e = -1; ++e < d;)b = a[e], b in c ? c[b].push(e) : c[b] = [e];
        for (b in c)c.hasOwnProperty(b) && c[b].push(1 / 0);
        return c
    }, a.pack_tokens = function (b) {
        for (var c, d = -1, e = b.length, f = []; e > d;) {
            for (var g = [], h = {}, i = 0, j = 0; ++d < e;) {
                var l = b[d], m = l.length;
                if (m >= x) {
                    c = new k([l], a.posVector(l), 4294967295);
                    break
                }
                if (m + i >= x) {
                    d--;
                    break
                }
                g.push(l), a.bitVector(l, h, i), j |= (1 << l.length - 1) - 1 << i, i += m
            }
            g.length > 0 && f.push(new k(g, h, j)), c && (f.push(c), c = null)
        }
        return f
    }, a.prototype.score = function (b, c) {
        var d = a.alphabet(b);
        return a.score_map(b, c, d, this.options)
    }, a.score_map = function (b, c, d, e) {
        var f, g, h = b.length, i = c.length, j = e.bonus_match_start, k = i > h ? h : i;
        if (0 === k)return 0;
        var l = (h + i) / (2 * h * i), m = 0;
        if (b === c)m = k; else for (; b[m] === c[m] && ++m < k;);
        if (m === k)return g = m, l * g * g + j * m;
        if (h > x)return g = a.llcs_large(b, c, d, m), l * g * g + j * m;
        var n, o, p = (1 << h) - 1, q = p;
        for (f = m - 1; ++f < i;)o = c[f], o in d && (n = q & d[o], q = q + n | q - n);
        return p &= ~((1 << m) - 1), q = ~q & p, q -= q >> 1 & 1431655765, q = (858993459 & q) + (q >> 2 & 858993459), g = 16843009 * (q + (q >> 4) & 252645135) >> 24, g += m, l * g * g + j * m
    }, a.score_single = function (b, c, d) {
        var e = b.tokens[0], f = e.length, g = c.length;
        return g < d.token_min_rel_size * f || g > d.token_max_rel_size * f ? [0] : [a.score_map(e, c, b.map, d)]
    }, a.score_pack = function (b, c, d) {
        var e = b.tokens, f = e.length;
        if (1 == f)return a.score_single(b, c, d);
        for (var g, h, i = 4294967295, j = 0 | b.gate, k = b.map, l = -1, m = c.length; ++l < m;)h = c[l], h in k && (g = i & k[h], i = (i & j) + (g & j) | i - g);
        i = ~i;
        for (var n = d.bonus_match_start, o = d.token_min_rel_size, p = d.token_max_rel_size, q = new Array(f), r = 0, s = -1; ++s < f;) {
            var t, u, v = e[s], w = v.length;
            if (o * w > m || m > p * w)q[s] = 0, r += w; else {
                if (v === c)u = t = w; else {
                    var x = m > w ? w : m;
                    for (u = 0; v[u] === c[u] && ++u < x;);
                    t = u;
                    for (var y = (i >>> r & (1 << w) - 1) >>> u; y;)y &= y - 1, t++
                }
                r += w;
                var z = (w + m) / (2 * w * m);
                q[s] = z * t * t + n * u
            }
        }
        return q
    }, a.llcs_large = function (a, b, c, d) {
        var e, f, g, h, i, j;
        void 0 === d && (d = 0), g = d ? [new l(0, d), new l(1 / 0, 1 / 0)] : [new l(1 / 0, 1 / 0)];
        var k, m, n, o, p, q, r = d, s = g.length, t = b.length;
        for (q = d; t > q; q++) {
            var u = b[q];
            if (u in c) {
                k = c[u];
                var v = new Array(Math.min(2 * s, r + 2));
                for (h = -1, m = 0, f = k[0], j = -1, o = -1; ++o < s;) {
                    for (i = j, n = g[o], e = n.start, j = n.end, p = j - e; i > f;)f = k[++m];
                    f >= e ? v[++h] = n : (f === i ? v[h].end++ : 1 === p ? (n.start = f, n.end = f + 1, v[++h] = n) : v[++h] = new l(f, f + 1), p > 1 && (n.start++, v[++h] = n))
                }
                e > f && (v[++h] = n, r++), g = v, s = ++h
            }
        }
        return r
    }, c(a.prototype, {
        search: function (b) {
            var c = window.performance && window.performance.now ? window.performance : Date, d = c.now();
            this.start_time = d;
            var e = this.options;
            this.dirty && (this._prepSource(this.source, this.keys, !0), this.dirty = !1);
            var f = this.query = this._prepQuery(b), g = this.index, h = [];
            e.filter && (g = e.filter.call(this, g));
            var i = this._searchIndex(f, g, h);
            h = a.filterGTE(h, "score", i), "function" == typeof e.sorter && (h = h.sort(e.sorter)), (e.output_map || e.output_limit > 0) && (h = "function" == typeof e.output_map ? a.map(h, e.output_map, this, e.output_limit) : a.mapField(h, e.output_map, e.output_limit));
            var j = c.now();
            return this.search_time = j - d, this.results = h, h
        }, _searchIndex: function (b, c, d) {
            for (var e = this.options, f = e.bonus_position_decay, g = e.field_good_enough, i = e.thresh_relative_to_best, j = e.score_per_token, k = e.score_round, l = e.thresh_include, m = 0, n = b.children, o = -1, p = c.length; ++o < p;) {
                var q = c[o], r = q.fields;
                b.resetItem();
                for (var s = 0, t = -1, u = -1, v = 1, w = -1, x = r.length; ++w < x;) {
                    for (var y = 0, z = -1, A = r[w], B = n[w], C = !!B, D = -1, E = A.length; ++D < E;) {
                        var F, G = A[D];
                        j ? (F = this._scoreField(G, b), C && (F += this._scoreField(G, B))) : F = a.score_map(b.fused_str, G.join(" "), b.fused_map, e), F > y && (y = F, z = D)
                    }
                    if (y *= 1 + v, v *= f, y > s && (s = y, t = w, u = z, y > g))break
                }
                if (j) {
                    var H = b.scoreItem();
                    s = .5 * s + .5 * H
                }
                if (s > m) {
                    m = s;
                    var I = s * i;
                    I > l && (l = I)
                }
                s > l && (s = Math.round(s / k) * k, d.push(new h(q.item, r, s, t, u, r[0][0].join(" "))))
            }
            return l
        }, _scoreField: function (b, c) {
            var d = c.tokens_groups, e = d.length, f = b.length;
            if (!e || !f)return 0;
            for (var g, h, i, j, k, l = 0, m = -1, n = this.options, o = n.bonus_token_order, p = n.minimum_match, q = -1; ++q < e;) {
                var r = d[q], s = r.tokens.length, t = r.score_field;
                for (k = -1; ++k < s;)t[k] = 0;
                var u = r.field_pos;
                for (k = -1; ++k < s;)u[k] = 0;
                for (var v = -1; ++v < f;)for (i = b[v], j = a.score_pack(r, i, n), k = -1; ++k < s;)g = j[k], h = t[k], (g > h || o > h - g && k > 0 && u[k] <= u[k - 1]) && (t[k] = g, u[k] = v);
                var w = r.score_item;
                for (k = -1; ++k < s;) {
                    if (g = t[k], l += g, g > p) {
                        var x = u[k], y = x - m, z = o * (1 / (1 + Math.abs(y)));
                        y > 0 && (z *= 2), l += z, g += z, m = x
                    }
                    g > w[k] && (w[k] = g)
                }
            }
            if (n.score_test_fused) {
                for (var A = n.score_acronym ? f - 1 : f, B = b[0], C = 0; ++C < A;)B += " " + b[C];
                var D = a.score_map(c.fused_str, B, c.fused_map, n);
                D += o, l = D > l ? D : l, D > c.fused_score && (c.fused_score = D)
            }
            return l
        }
    }), c(a.prototype, {
        _prepSource: function (b, c, d) {
            var e, f = b.length;
            d ? (this.index = new Array(f), e = 0) : e = f;
            for (var g = this.index, h = this.options, i = h.token_field_min_length, j = h.token_field_max_length, k = h.score_acronym, l = this.acro_re, n = this.token_re, o = -1; ++o < f;) {
                for (var p = b[o], q = a.generateFields(p, c), r = q.length, s = -1; ++s < r;)for (var t = q[s], u = -1, v = t.length; ++u < v;) {
                    var w = h.normalize(t[u]), x = w.split(n);
                    w.length > 2 * i && (x = a.filterSize(x, i, j)), k && x.push(w.replace(l, "$1")), t[u] = x
                }
                g[e++] = new m(p, q)
            }
        }
    }), a.generateFields = function (a, b) {
        if (!b.length)return [[a.toString()]];
        for (var c = b.length, d = new Array(c), e = -1; ++e < c;)d[e] = n(a, b[e].split("."), [], 0);
        return d
    };
    var y = p();
    return a.filterSize = function (a, b, c) {
        for (var d, e, f = -1, g = -1, h = a.length, i = []; ++f < h;)d = a[f], e = d.length, e >= b && (i[++g] = c > e ? d : d.substr(0, c));
        return i
    }, c(a.defaultOptions, {
        highlight_prefix: !1,
        highlight_bridge_gap: 2,
        highlight_before: '<strong class="highlight">',
        highlight_after: "</strong>"
    }), a.prototype.highlight = function (b, c) {
        var d, e, f = this.query.normalized;
        return c && c.length && (d = this.tags.indexOf(c)) > -1 && (e = this.query.children[d]) && (f += (f.length ? " " : "") + e.normalized), a.highlight(f, b, this.options)
    }, a.highlight = function (b, c, d) {
        if (void 0 === d && (d = a.defaultOptions), !c)return "";
        var e = d.highlight_before, f = d.highlight_after, g = d.score_per_token, h = d.score_test_fused, i = d.score_acronym, j = d.token_re, k = d.normalize(b), l = d.normalize(c), m = k.split(j), n = l.split(j), o = [], p = [];
        q(c, j, o, p);
        var r = [], s = [], t = 0, u = 0;
        if (g && (u = a.matchTokens(n, m, s, d, !1)), (h || !g || i) && (t = a.score_map(k, l, a.alphabet(k), d) + d.bonus_token_order), 0 === u && 0 === t)return c;
        (!g || t > u) && (m = [k], n = [l], o = [c], s = [0]);
        for (var v = o.length, w = -1; ++w < v;) {
            var x = s[w];
            if (-1 !== x) {
                var y = m[x], z = n[w], A = o[w], B = 0, C = [], D = [];
                a.align(y, z, C, D);
                for (var E = C.length, F = -1; ++F < E;) {
                    var G = C[F], H = D[F];
                    G > B && r.push(A.substring(B, G)), r.push(e + A.substring(G, H) + f), B = H
                }
                r.push(A.substring(B) + p[w])
            } else r.push(o[w] + p[w])
        }
        return r.join("")
    }, a.align = function (b, c, d, e, f) {
        void 0 === f && (f = a.defaultOptions);
        var g, h, i = 100, j = -10, k = -1, l = 0, m = 1, n = 2, o = 3, p = f.score_acronym, q = f.token_sep, r = Math.min(b.length + 1, f.token_query_max_length), s = Math.min(c.length + 1, f.token_field_max_length), t = s > r ? r : s, u = 0;
        if (b === c)u = r, r = 0; else if (f.highlight_prefix) {
            for (g = 0; t > g && b[g] === c[g]; g++)u++;
            u && (b = b.substring(u), c = c.substring(u), r -= u, s -= u)
        }
        var v = 0, w = 0, x = 0, y = new Array(r * s), z = s - 1;
        if (r > 1 && s > 1) {
            var A, B, C, D, E = new Array(s), F = new Array(s), G = 0;
            for (h = 0; s > h; h++)F[h] = 0, E[h] = 0, y[h] = l;
            for (g = 1; r > g; g++)for (G = 0, A = E[0], z++, y[z] = l, h = 1; s > h; h++)switch (D = F[h] = Math.max(F[h] + k, E[h] + j), G = Math.max(G + k, E[h - 1] + j), C = p ? b[g - 1] !== c[h - 1] ? -(1 / 0) : A + i + (2 > g || q.indexOf(b[g - 2]) > -1 ? i : 0) + (2 > h || q.indexOf(c[h - 2]) > -1 ? i : 0) : b[g - 1] === c[h - 1] ? A + i : -(1 / 0), A = E[h], B = E[h] = Math.max(C, D, G, 0), z++, B) {
                case G:
                    y[z] = n;
                    break;
                case C:
                    y[z] = o, B > v && (v = B, w = g, x = h);
                    break;
                case D:
                    y[z] = m;
                    break;
                default:
                    y[z] = l
            }
        }
        var H = f.highlight_bridge_gap, I = 0;
        if (v > 0) {
            g = w, h = x, z = g * s + h, I = x, e.push(x + u);
            for (var J = !0; J;)switch (y[z]) {
                case m:
                    g--, z -= s;
                    break;
                case n:
                    h--, z--;
                    break;
                case o:
                    I - h > H && (d.push(I + u), e.push(h + u)), h--, g--, I = h, z -= s + 1;
                    break;
                case l:
                default:
                    J = !1
            }
            d.push(I + u)
        }
        return u && (I > 0 && H >= I ? d[d.length - 1] = 0 : (d.push(0), e.push(u))), d.reverse(), e.reverse(), v + u
    }, a.matchTokens = function (b, c, d, e, f) {
        void 0 === e && (e = a.defaultOptions), void 0 === f && (f = !1);
        var g, h, i, j, k, l, m, n = e.minimum_match, o = e.thresh_relative_to_best, p = [], q = b.length, s = c.length, t = a.mapAlphabet(b), u = n, w = -1, x = -1, y = 0, z = [];
        for (g = 0; q > g; g++)if (i = [], d[g] = -1, u = n, j = b[g], j.length) {
            for (l = t[g], h = 0; s > h; h++)k = c[h], k.length ? (m = a.score_map(j, k, l, e), i[h] = m, m > n && y++, m > u && (u = m, w = g, x = h)) : i[h] = 0;
            z[g] = u, p[g] = i
        } else {
            for (h = 0; s > h; h++)i[h] = 0;
            p[g] = i
        }
        if (0 === y)return 0;
        if (1 === y)return d[w] = x, f && v(d, s), u;
        for (g = 0; g < b.length; g++)z[g] = Math.max(o * z[g], n);
        var A = r(p, d, z, e.bonus_token_order);
        return f && v(d, s), A
    }, c(a.prototype, {
        getInteractive: function () {
            var a = this, b = this.options, c = b.interactive_debounce, d = b.interactive_mult, e = b.interactive_burst;
            if (0 === c)return function (b, c, d, e) {
                return c(a.search(b))
            };
            var f, g, h = window.performance && window.performance.now ? window.performance : Date, i = 0, j = !1;
            return function (b, k, l, m) {
                var n = function () {
                    f = null, j && (g = a.search(b), m(g)), i = 0, j = !1
                };
                if (clearTimeout(f), f = setTimeout(n, c), ++i < e) {
                    j = !1;
                    var o = h.now();
                    g = a.search(b);
                    var p = k(g), q = h.now();
                    return c = .5 * c + .5 * d * (q - o), p
                }
                return j = !0, l(g)
            }
        }, __ttAdapter: function () {
            var a = this.getInteractive(), b = function (a) {
            };
            return function (c, d, e) {
                a(c, d, b, e)
            }
        }, $uiSource: function () {
            var a = this.getInteractive(), b = function (a) {
            };
            return function (c, d) {
                a(c.term, d, b, d)
            }
        }
    }), "function" == typeof require && "undefined" != typeof module && module.exports ? module.exports = a : "function" == typeof define && define.amd ? define(function () {
        return a
    }) : window.FuzzySearch = a, a
}();