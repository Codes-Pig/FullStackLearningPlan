type Constructor<T> = new(zt: any) => T;
class Container{
    private Registration = new Map<Constructor<any>, any>();

    register<T>(constructor: Constructor<T>, dependencies: Constructor<any>[]): void {
        this.Registration.set(constructor, {constructor, dependencies});
    }

    resolve<T>(constructor: Constructor<T>): T {
        return this.createInstance(constructor);
    }

    private createInstance<T>(constructor: Constructor<T>): T {
        const registration = this.Registration.get(constructor);
        if (!registration) {
            //这地方貌似理论上应该return出去好一些
            console.log('朱涛你怎么没有没有没有注册啊！');
        }
        //拿到registration对象中的dependencies属性，前面我的注册函数里已经注册进去相关的依赖了
        const { dependencies } = registration;
        //遍历依赖项，并创建每个依赖项的实例，放到zpf数组中
        const zpf = dependencies.map(dependency => this.resolve(dependency));
        //根据zpf数组里的依赖创建实例
        return new (registration.constructor as any)(...zpf);
      }
}

class ServiceA {
    constructor(public value: string) {}
  }
   
  class ServiceB {
    constructor(public serviceA: ServiceA) {}
  }
   
  const container = new Container();
  container.register(ServiceA, []);
  container.register(ServiceB, [ServiceA]); // ServiceB 依赖于 ServiceA
   
  const serviceB = container.resolve(ServiceB);
  console.log(serviceB.serviceA.value); 