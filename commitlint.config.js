module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式（不影响代码运行的变动）
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建相关
        'ci',       // 持续集成
        'chore',    // 其他改动
        'revert',   // 回退
        'wip',      // 开发中
        'init'      // 初始化
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100]
  }
};
