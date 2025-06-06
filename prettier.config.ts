module.exports = {
  printWidth: 120, // 超过最大值换行
  tabWidth: 2, // 缩进字节数
  useTabs: false, // 缩进不使用tab，使用空格
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  proseWrap: 'preserve', // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行 never always
  arrowParens: 'avoid', //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：能省略括号的时候就省略 always：总是省略
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  // disableLanguages: ['vue'], // 不格式化vue文件，vue文件的格式化单独设置
  endOfLine: 'auto', // 结尾是 \n \r \n\r auto
  eslintIntegration: true, //不让prettier使用eslint的代码格式进行校验
  htmlWhitespaceSensitivity: 'strict', // strict 所有空格都将认定为是有意义的
  ignorePath: '.prettierignore', // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  jsxBracketSameLine: false, // 在jsx中把'> ' 是否单独放一行
  jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
  // parser: 'babylon', // 格式化的解析器，默认是babylon
  requireConfig: true, // Require a 'prettierconfig' to format prettier
  stylelintIntegration: true, //不让prettier使用stylelint的代码格式进行校验
  trailingComma: 'es5', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  tslintIntegration: true, // 不让prettier使用tslint的代码格式进行校验
  vueIndentScriptAndStyle: true, // 是否在Vue文件中对代码和标签进行缩进，script和style部分
};

