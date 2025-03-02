#!/usr/bin/env node

/**
 * 自动生成 fonts.js 配置文件
 *
 * 此脚本会扫描 node_modules/webfont-lxgw-bright/fonts 目录下的所有字体文件，
 * 并为每种字重生成完整的 Next.js localFont 配置。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置项
const config = {
  fontDir: path.resolve(__dirname, '../node_modules/webfont-lxgw-bright/fonts'),
  outputFile: path.resolve(__dirname, '../app/fonts.js'),
  fontWeights: ['Regular', 'Light', 'Medium'],
  fontExportNames: {
    'Regular': 'lxgwBright',
    'Light': 'lxgwBrightLight',
    'Medium': 'lxgwBrightMedium'
  },
  fontWeightValues: {
    'Regular': '400',
    'Light': '300',
    'Medium': '500'
  },
  // 范围编号组，方便添加注释
  rangeGroups: {
    '0-3': '基本拉丁字符和扩展拉丁字符集',
    '4-5': 'CJK符号和标点',
    '20-29': '中日韩统一表意文字(CJK Unified Ideographs) 第一组',
    '30-39': '中日韩统一表意文字 第二组',
    '40-49': '中日韩统一表意文字 第三组',
    '50-57': '中日韩统一表意文字 第四组'
  }
};

/**
 * 获取指定字重的所有字体文件
 * @param {string} weight 字重名称 (Regular|Light|Medium)
 * @returns {string[]} 字体文件列表
 */
function getFontFiles(weight) {
  try {
    // 使用命令行查找所有匹配的.woff2文件并按数字排序
    const command = `find ${config.fontDir} -name "LXGWBright-${weight}.*.woff2" | sort -V`;
    const output = execSync(command).toString().trim();
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`无法获取${weight}字重的字体文件:`, error);
    return [];
  }
}

/**
 * 从文件路径中提取序号
 * @param {string} filePath 文件路径
 * @returns {string} 序号
 */
function extractNumberFromPath(filePath) {
  const fileName = path.basename(filePath);
  const match = fileName.match(/\.(\d+)\.woff2$/);
  return match ? match[1] : '';
}

/**
 * 生成单个字体的配置代码
 * @param {string} weight 字重名称
 * @param {string[]} files 字体文件列表
 * @returns {string} 配置代码
 */
function generateFontConfig(weight, files) {
  const exportName = config.fontExportNames[weight];
  const fontWeight = config.fontWeightValues[weight];

  let lastGroupComment = '';
  let srcItems = files.map(file => {
    const relativePath = `../node_modules/webfont-lxgw-bright/fonts/${path.basename(file)}`;
    const number = extractNumberFromPath(file);

    // 检查是否需要添加分组注释
    let commentLine = '';
    for (const [range, comment] of Object.entries(config.rangeGroups)) {
      const [start, end] = range.split('-').map(Number);
      const num = parseInt(number, 10);
      if (num >= start && num <= end) {
        const groupComment = `// ${comment}`;
        if (groupComment !== lastGroupComment) {
          lastGroupComment = groupComment;
          commentLine = groupComment;
        }
        break;
      }
    }

    return [
      commentLine ? `    ${commentLine}` : null,
      `    {`,
      `      path: '${relativePath}',`,
      `      weight: '${fontWeight}',`,
      `      style: 'normal',`,
      `    }`
    ].filter(Boolean).join('\n');
  });

  return `export const ${exportName} = localFont({
  src: [
${srcItems.join(',\n')}
  ],
  variable: '--font-${exportName.replace('lxgw', 'lxgw-')}',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});`;
}

// 主函数
function main() {
  console.log('开始生成fonts.js文件...');

  // 收集所有字重的文件
  const fontsByWeight = {};
  for (const weight of config.fontWeights) {
    const files = getFontFiles(weight);
    if (files.length === 0) {
      console.warn(`警告: 未找到${weight}字重的字体文件`);
      continue;
    }
    fontsByWeight[weight] = files;
    console.log(`找到${weight}字重的字体文件: ${files.length}个`);
  }

  // 生成配置代码
  let configCode = `/**
 * 自动生成的 Next.js 字体配置文件
 * 由 scripts/generate-fonts.js 脚本生成
 * 生成时间: ${new Date().toISOString()}
 *
 * 包含以下字重:
 * ${config.fontWeights.map(w => `- ${w} (${config.fontWeightValues[w]})`).join('\n * ')}
 */
import localFont from 'next/font/local';

`;

  // 为每个字重生成配置
  for (const weight of config.fontWeights) {
    if (fontsByWeight[weight]) {
      configCode += generateFontConfig(weight, fontsByWeight[weight]) + '\n\n';
    }
  }

  // 写入文件
  fs.writeFileSync(config.outputFile, configCode);
  console.log(`字体配置已成功写入: ${config.outputFile}`);
}

// 执行主函数
main();