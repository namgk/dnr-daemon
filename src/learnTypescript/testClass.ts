import TestImport from './testInterface';

interface TestI {
    [a: string]: TestImport;
}

export default class TestClass {
    public static STATIC_VAR = 1;
    private static PRIV_STATIC_VAR: TestI = {};

    public static aStaticMethod(a: string): TestImport {
        return {a:a,b:2};
    }

    public promiseTest(): Promise<number> {
        const p = new Promise(function(f,r){
            f(1)
        });
        return p
    }
}