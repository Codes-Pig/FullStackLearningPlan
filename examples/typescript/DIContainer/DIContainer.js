var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Container = /** @class */ (function () {
    function Container() {
        this.Registration = new Map();
    }
    Container.prototype.register = function (constructor, dependencies) {
        this.Registration.set(constructor, { constructor: constructor, dependencies: dependencies });
    };
    Container.prototype.resolve = function (constructor) {
        return this.createInstance(constructor);
    };
    Container.prototype.createInstance = function (constructor) {
        var _a;
        var _this = this;
        var registration = this.Registration.get(constructor);
        if (!registration) {
            //这地方貌似理论上应该return出去好一些
            console.log('朱涛你怎么没有没有没有注册啊！');
        }
        //拿到registration对象中的dependencies属性，前面我的注册函数里已经注册进去相关的依赖了
        var dependencies = registration.dependencies;
        //遍历依赖项，并创建每个依赖项的实例，放到zpf数组中
        var zpf = dependencies.map(function (dependency) { return _this.resolve(dependency); });
        //根据zpf数组里的依赖创建实例
        return new ((_a = registration.constructor).bind.apply(_a, __spreadArray([void 0], zpf, false)))();
    };
    return Container;
}());
var ServiceA = /** @class */ (function () {
    function ServiceA(value) {
        this.value = value;
    }
    return ServiceA;
}());
var ServiceB = /** @class */ (function () {
    function ServiceB(serviceA) {
        this.serviceA = serviceA;
    }
    return ServiceB;
}());
var container = new Container();
container.register(ServiceA, []);
container.register(ServiceB, [ServiceA]); // ServiceB 依赖于 ServiceA
var serviceB = container.resolve(ServiceB);
console.log(serviceB.serviceA.value);
