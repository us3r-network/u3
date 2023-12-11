module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: ['craco.config.js', '.eslintrc.js'],
  overrides: [
    {
      files: ['src/setupTests.ts'],
      rules: {
        // 允许某些文件导入的包在非dependencies中
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  rules: {
    /** js语法 **/
    // 允许使用console
    'no-console': 'off',
    // 不限制js的语法 （如：不禁止使用for of语法）
    'no-restricted-syntax': 'off',
    // 允许在for循环中使用一元运算符 ++,-- (其它位置仍给出警告)
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    // 允许对函数参数赋值
    'no-param-reassign': 'off',
    // 允许三元表达式
    'no-nested-ternary': 'off',

    /** import  **/
    // 当一个模块只有一个导出时，允许采用命名导出
    'import/prefer-default-export': 'off',

    /** typescript **/
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    //解决 styled 结构顺序问题
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        //  不检查promises函数返回void类型的调用方式
        checksVoidReturn: false,
      },
    ],
    // 停止使用 void 运算符使用的规则报告承诺
    // 对于promise在某些情况下允许使用未等待的方式运行 ( 如: redux的dispatch() )
    '@typescript-eslint/no-floating-promises': 'off',

    /* react */
    //旧版本的 React 验证
    'react/react-in-jsx-scope': 'off',
    //设置可以直接展开 props
    'react/jsx-props-no-spreading': 'off',
    //检查 JSX 属性和子元素中是否缺少必要的花括号(0 = off, 1 = warn, 2 = error)
    'react/jsx-curly-brace-presence': 0,
    // 组件的可选参数不强制要求设置默认值，函数组件直接忽略此规则
    'react/require-default-props': [
      1,
      {
        functions: 'ignore',
      },
    ],

    //无障碍验证
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    //浏览器对 media 已有良好的支持
    'jsx-a11y/media-has-caption': 'off',
    'import/extensions': 0,
  },
};
