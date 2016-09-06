/**
 * Created by zibx on 31.05.16.
 */
var dq = require('../dequeue');
var assert = require('chai').assert;
describe('dequeue', function() {
    var q = new dq();
    it('push', function () {
        q.push({a:0});
        assert.deepEqual(q.get(0), {a:0});
    });
    it('push2', function () {
        for(var i = 1; i < 100; i++)
            q.push({a:i});

        for(var i = 0; i < 100; i++)
            assert.deepEqual(q.get(i), {a:i});

    });
    it('pop', function () {
        for(var i = 0; i < 10; i++){
            assert.deepEqual(q.pop(), {a:99-i});
        }
    });
    it('shift', function () {
        for(var i = 0; i < 10; i++){
            assert.deepEqual(q.shift(), {a:i});
        }
    });
    it('unshift', function () {
        for(var i = 9; i >= -10; i--){
            q.unshift({a:i})
        }
        for(var i = 0; i < 100; i++)
            assert.deepEqual(q.get(i), {a:i-10});

        assert.equal(q.get(100), undefined);
    });
    it('shift/unshift first', function () {
        var d = new dq();
        for(var i = 0; i <= 10; i++)
            d.unshift({a:i})

        for(var i = 10; i >= 0; i--)
            assert.deepEqual(d.shift(), {a:i});

        assert.equal(d.shift(), void 0);
    });
    it('push/pop first', function () {
        var d = new dq();
        for(var i = 0; i <= 10; i++)
            d.push({a:i})

        for(var i = 10; i >= 0; i--)
            assert.deepEqual(d.pop(), {a:i});

        assert.equal(d.pop(), void 0);
    });
    it('map', function () {
        var d = new dq();
        for(var i = 0; i < 5; i++)
            d.push(i);
        assert.deepEqual(d.map(function(el){return el*2}), [0,2,4,6,8]);
    });
    it('filter', function () {
        var d = new dq();
        for(var i = 0; i < 10; i++)
            d.push(i);
        assert.deepEqual(d.filter(function(el){return el%2===0}), [0,2,4,6,8]);
    });
    it('reduce', function () {
        var d = new dq(), arr = [];
        for(var i = 0; i < 10; i++) {
            d.push(i);
            arr.push(i)
        }
        var sum = function(a,b){return a+b};
        assert.deepEqual(d.reduce(sum), arr.reduce(sum));
    });
    it('each', function () {
        var d = new dq(), collector = [];
        for(var i = 0; i < 5; i++)
            d.push(i);
        assert.deepEqual(d.each(function(el,i){
            collector.push([el*2,i]);
        }), void 0);
        console.log(JSON.stringify(collector));
        assert.deepEqual(collector, [[0,0],[2,1],[4,2],[6,3],[8,4]]);
    });
    it('simple splice', function () {
        var d = new dq(), obj1 = {o:1}, obj2 = {o:2};
        d.push(obj1);
        assert.equal(d.first.data, obj1);
        assert.equal(d.last.data, obj1);
        d.splice(0,1);
        assert.equal(d.first, null);
        assert.equal(d.last, null);
        d.push(obj1);
        d.push(obj2);
        assert.equal(d.first.data, obj1);
        assert.equal(d.last.data, obj2);
        d.splice(0,1);
        d.splice(0,1);
        assert.equal(d.first, null);
        assert.equal(d.last, null);
    })

    it('splice to last', function () {
        var d = new dq(), obj1 = {o:1}, obj2 = {o:2}, obj3 = {o:3}, list = [obj1,obj2,obj3], obj4 = {o:4};
        d.splice(0,0,obj1);
        assert.equal(d.first.data, obj1);
        assert.equal(d.last.data, obj1);

        d.splice(1,0, obj2);
        assert.equal(d.first.data, obj1);
        assert.equal(d.last.data, obj2);
        d.splice(2,0, obj3);
        assert.equal(d.first.data, obj1);
        assert.equal(d.last.data, obj3);
        list.forEach(function(item, i){
            assert.equal(d.get(i), item);
        });
        d.splice(3,0, obj4);
        assert.equal(d.get(2), obj3);
        list.push(obj4)
        assert.equal(d.get(0), obj1);
        assert.equal(d.get(1), obj2);


    })
    it('splice to first', function () {
        var d = new dq(), obj1 = {o:1}, obj2 = {o:2}, obj3 = {o:3}, list = [obj1,obj2,obj3];
        d.splice(0,0,obj1);
        assert.equal(d.first.data, obj1);
        assert.equal(d.last.data, obj1);
        d.splice(0,0, obj2);
        assert.equal(d.first.data, obj2);
        assert.equal(d.last.data, obj1);
        d.splice(0,0, obj3);
        assert.equal(d.first.data, obj3);
        assert.equal(d.last.data, obj1);
        d.splice(1,1);
        assert.equal(d.first.data, obj3);
        assert.equal(d.last.data, obj1);

    })
});