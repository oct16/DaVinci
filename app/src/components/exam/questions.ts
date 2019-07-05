export interface QuestionType {
    question: string
    type?: string
    code?: string
}

export const questions: QuestionType[] = [
    {
        question: '什么是CSS中的BFC，你是怎么利用它的'
    },
    {
        question: '你遇到过哪些浏览器兼容性问题，请举例你是怎么解决的'
    },
    {
        question: '什么是JSONP，请简述如何在服务端返回一个JSONP接口'
    },
    {
        question: '请简述HTTPS请求的握手过程'
    },
    {
        question: '哪些方式可以造成JavaScript的内存泄漏，并简述你的优化策略'
    },
    {
        question: '请简述在大型项目中，你的开发与部署策略'
    },
    {
        question: '列举你常用的设计模式，并解释它们的作用与用法'
    },
    {
        question: '实现一个防抖函数',
        type: 'code',
        code: ['function debounce() {', '  // please implement your code here...', '}'].join('\n')
    },
    {
        question: '分别实现两个以下方法，返回如下结果，并考虑如何使代码易于拓展与维护',
        type: 'code',
        code: [
            "// 'abcde'.toStr();  // => 'e-d-c-b-a'",
            "// 'abcde'.toObj();  // => {e: {d: {c: {b: {a: 'a'}}}}}",
            '',
            '// please implement your code below...',
            ''
        ].join('\n')
    },
    {
        question: '实现一个Curry函数，使之可求出如下结果',
        type: 'code',
        code: [
            'function curry(fn) {',
            '  // please implement your code here...',
            '}',
            'function sumFn(a, b, c) {',
            '    return a + b + c',
            '}',
            'var sum = curry(sumFn)',
            '',
            '// console.log(sum(2)(3)(10)) //15',
            '// console.log(sum(2, 3, 10)) //15',
            '// console.log(sum(2)(3, 10)) //15',
            '// console.log(sum(2, 3)(10)) //15'
        ].join('\n')
    }
]
