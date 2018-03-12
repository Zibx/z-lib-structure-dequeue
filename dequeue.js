/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 2/22/2016
module.exports = (function () {
    'use strict';

    var slice = Array.prototype.slice;
    var Item = function (item) {
        this.data = item;
    };
    Item.prototype = {
        next: null,
        prev: null
    };
    var dequeue = function () {

    };

    var Cursor = function (item, pos) {
        this.item = item;
        this.pos = pos;
    };
    Cursor.prototype = {
        item: null,
        pos: null
    };

    dequeue.prototype = {
        lastUsedItem: null,
        first: null,
        last: null,
        cursor: null,
        Item: Item,
        length: 0,
        push: function (item) {
            this.lastUsed = item = new this.Item(item);
            if (this.first === null) {
                this.first = item;
            }
            if (this.last !== null) {
                this.last.next = item;
                item.prev = this.last;
            }
            this.last = item;
            return ++this.length;
        },
        unshift: function (item) {
            this.lastUsed = item = new this.Item(item);
            if (this.first !== null) {
                this.first.prev = item;
                item.next = this.first;
            }
            if (this.last === null) {
                this.last = item;
            }
            this.first = item;
            this.cursor && this.cursor.pos++;
            return ++this.length;
        },
        pop: function () {
            var last;
            if (last = this.last) {
                this.length--;
                if (this.last.prev) {
                    this.last.prev.next = null;
                    this.last = this.last.prev;
                } else {
                    this.last = null;
                    this.first = null;
                    this.cursor = null;
                }
                this.lastUsed = last;
                return last.data;
            }
            this.lastUsed = null;
            return void 0;

        },
        shift: function () {
            var first;
            if (first = this.first) {
                this.length--;
                if (this.first.next) {
                    this.first.next.prev = null;
                    this.first = this.first.next;
                } else {
                    this.last = null;
                    this.first = null;
                }
                this.cursor && this.cursor.pos--;
                this.lastUsed = first;
                return first.data;
            }
            this.lastUsed = null;
            return void 0;
        },
        get: function (index) {
            var pointer, min = this.length, tmp, i;
            if (index < 0 || index >= min) {
                this.cursor = this.lastUsed = null;
                return;
            }
            if ((tmp = Math.abs(0 - index)) < min) {
                min = tmp;
                pointer = this.first;
                i = 0;
            }
            if ((tmp = Math.abs(this.length - index - 1)) < min) {
                min = -tmp;
                pointer = this.last;
                i = this.length - 1;
            }
            if (this.cursor && this.cursor.item && (Math.abs(tmp = index - this.cursor.pos)) < min) {
                min = tmp;
                pointer = this.cursor.item;
                i = 0;
            }
            //console.log(min)
            if (min > 0) {
                while (min-- > 0)
                    pointer = pointer.next;
            } else if (min < 0) {
                while (min++ < 0)
                    pointer = pointer.prev;
            }
            this.cursor = new Cursor(pointer, index);
            this.lastUsed = pointer;
            return pointer.data;
            //console.log(pointer.data)
        },

        splice: function (pos, count) {
            if (pos < 0) pos = this.length + pos;
            if(pos < this.length)
                count = Math.min(count, this.length - pos);

            var items,
                subSeq = new dequeue(), i, _i, pointer, last,
                sub;

            if (arguments.length > 2) {
                items = slice.call(arguments, 2);

                _i = items.length;
                for (i = 0; i < _i; i++) {
                    subSeq.push(items[i]);
                }
                sub = {first: subSeq.first, last: subSeq.last, length: _i}

            }
            this.get(pos);// move cursor
            if(this.cursor === null){ // no elements
                if(pos>=this.length){
                    if(this.first){
                        this.last.next = subSeq.first;
                        subSeq.first.prev = this.last;
                        this.last = subSeq.last
                    }else{
                        this.first = subSeq.first;
                        this.last = subSeq.last
                    }


                    this.length += subSeq.length;
                }

                this.cursor = null;
                return [];
            }
            pointer = this.cursor.item;

            subSeq.length = count;
            subSeq.first = pointer;
            last = pointer;
            for (i = 1; i < count; i++) {
                last = last.next;
            }
            subSeq.last = last;
            this.length -= count;

            if (sub) { // if insert
                this.length += sub.length;

                if (pointer.prev) {
                    pointer.prev.next = sub.first;
                    sub.first.prev = pointer.prev;
                } else
                    this.first = sub.first;

                if (last) {
                    last.prev = sub.last;
                    sub.last.next = last;
                } else
                    this.last = sub.last;

                //pointer.next = subSeq.first;
                //subSeq.first.prev = pointer;

            } else {
                if (pointer.prev)
                    pointer.prev.next = last.next;
                else
                    this.first = last.next;

                if (last.next)
                    last.next.prev = pointer.prev;
                else
                    this.last = last.prev;
            }
            //console.log(last, pointer.data, subSeq.toArray())
            //console.log(last, pointer.data, subSeq.toArray())
            this.cursor = null; // TODO logic to remove this dirty hack
            this.lastUsed = subSeq;
            return subSeq.toArray();
        },

        slice: function (begin, end) {
            if(!begin) begin = 0;
            var bg = begin;
            for ( ; begin < 0; ) {
                begin = this.length + begin;
            }
            if (end && end < 0) end = this.length + end;
            end = !end ? this.length : end > this.length ? this.length: end;

            var items,
                subSeq = new dequeue(), pointer;

            if(begin >= end) {
                return subSeq;
            } else {
                pointer = this.get(begin);
                for( ;begin < end; ++begin) {
                    pointer = this.get(begin);
                    subSeq.push(pointer);
                }
            }
            subSeq.cursor = null; // TODO logic to remove this dirty hack
            subSeq.lastUsed = subSeq.last;
            return subSeq;
        },

        indexOf: function (item) {
            var first = this.first, i = 0;
            if (!first)
                return -1;

            while (first)
                if (first.data === item)
                    return i;
                else {
                    i++;
                    first = first.next;
                }
            return -1;
        },
        toArray: function () {
            var out = new Array(this.length),
                cursor = this.first,
                i = 0, _i = this.length;
            for (; i < _i; i) {
                out[i++] = cursor.data;
                cursor = cursor.next;
            }
            return out;
        },
        map: function (fn) {
            var item = this.first,
                out = [], i = 0;
            while(item){
                out.push(fn.call(item.data,item.data, i++));
                item = item.next;
            }
            return out;
        },
        filter: function (fn) {
            var item = this.first,
                out = [], i = 0, res;
            while(item){
                res = fn.call(item.data, item.data, i++);
                res && out.push(item.data);
                item = item.next;
            }
            return out;
        },
        reduce: function (fn, first) {
            var item = this.first, i = 0, lastVal;
            if(!item)
                return;

            if(first)
                lastVal = first;
            else {
                lastVal = item.data;
                item = item.next;
            }

            while(item){
                lastVal = fn.call(item.data, lastVal, item.data, i++);
                item = item.next;
            }
            return lastVal;
        },
        each: function (fn) {
            var item = this.first, i = 0;
            while(item){
                fn.call(item.data,item.data, i++);
                item = item.next;
            }
        }
    };
    dequeue.prototype.forEach = dequeue.prototype.each;
    return dequeue;
})();