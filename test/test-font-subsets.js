/**
 * LXGW Bright 字体子集测试脚本
 *
 * 此脚本用于分析字体子集文件的大小分布和字符覆盖情况
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 字体文件目录
const FONTS_DIR = path.join(__dirname, '..', 'fonts');

// 字体族名
const FONT_FAMILIES = ['LXGWBright', 'LXGWBrightMedium', 'LXGWBrightLight'];

/**
 * 分析字体子集文件大小分布
 */
async function analyzeFontSizes() {
  console.log('=== LXGW Bright 字体子集大小分析 ===\n');

  try {
    // 获取所有字体文件
    const files = await readdir(FONTS_DIR);
    const fontFiles = files.filter(file => file.endsWith('.woff2'));

    if (fontFiles.length === 0) {
      console.log('没有找到字体文件。请先运行字体构建脚本。');
      return;
    }

    console.log(`总共找到 ${fontFiles.length} 个字体子集文件\n`);

    // 按字体族分组
    const fontGroups = {};

    for (const family of FONT_FAMILIES) {
      fontGroups[family] = {
        regular: [],
        italic: []
      };
    }

    // 收集文件大小信息
    for (const file of fontFiles) {
      const filePath = path.join(FONTS_DIR, file);
      const fileStat = await stat(filePath);
      const fileSizeKB = (fileStat.size / 1024).toFixed(2);

      // 解析文件名以确定字体族和样式
      for (const family of FONT_FAMILIES) {
        const isItalic = file.includes(`${family}-Italic`);
        const isRegular = file.includes(family) && !isItalic;

        if (isItalic) {
          fontGroups[family].italic.push({ file, sizeKB: fileSizeKB });
        } else if (isRegular) {
          fontGroups[family].regular.push({ file, sizeKB: fileSizeKB });
        }
      }
    }

    // 输出分析结果
    for (const family of FONT_FAMILIES) {
      console.log(`\n=== ${family} ===`);

      // 常规样式
      const regularFiles = fontGroups[family].regular;
      if (regularFiles.length > 0) {
        console.log(`\n常规样式 (${regularFiles.length} 个子集):`);

        // 按大小排序
        regularFiles.sort((a, b) => parseFloat(b.sizeKB) - parseFloat(a.sizeKB));

        // 输出前10个最大的子集
        console.log('最大的10个子集:');
        for (let i = 0; i < Math.min(10, regularFiles.length); i++) {
          const { file, sizeKB } = regularFiles[i];
          console.log(`${file}: ${sizeKB} KB`);
        }

        // 计算总大小
        const totalSize = regularFiles.reduce((sum, f) => sum + parseFloat(f.sizeKB), 0).toFixed(2);
        console.log(`总大小: ${totalSize} KB`);
      } else {
        console.log('没有找到常规样式子集文件');
      }

      // 斜体样式
      const italicFiles = fontGroups[family].italic;
      if (italicFiles.length > 0) {
        console.log(`\n斜体样式 (${italicFiles.length} 个子集):`);

        // 按大小排序
        italicFiles.sort((a, b) => parseFloat(b.sizeKB) - parseFloat(a.sizeKB));

        // 输出前10个最大的子集
        console.log('最大的10个子集:');
        for (let i = 0; i < Math.min(10, italicFiles.length); i++) {
          const { file, sizeKB } = italicFiles[i];
          console.log(`${file}: ${sizeKB} KB`);
        }

        // 计算总大小
        const totalSize = italicFiles.reduce((sum, f) => sum + parseFloat(f.sizeKB), 0).toFixed(2);
        console.log(`总大小: ${totalSize} KB`);
      } else {
        console.log('没有找到斜体样式子集文件');
      }
    }

    // 整体统计
    console.log('\n=== 整体统计 ===');
    const allSizes = fontFiles.map(async file => {
      const filePath = path.join(FONTS_DIR, file);
      const fileStat = await stat(filePath);
      return fileStat.size / 1024; // KB
    });

    const sizes = await Promise.all(allSizes);
    const totalSize = sizes.reduce((a, b) => a + b, 0).toFixed(2);
    const avgSize = (totalSize / sizes.length).toFixed(2);
    const maxSize = Math.max(...sizes).toFixed(2);
    const minSize = Math.min(...sizes).toFixed(2);

    console.log(`总文件数: ${fontFiles.length}`);
    console.log(`总大小: ${totalSize} KB`);
    console.log(`平均大小: ${avgSize} KB`);
    console.log(`最大子集: ${maxSize} KB`);
    console.log(`最小子集: ${minSize} KB`);

    // 大小分布
    const sizeRanges = {
      '0-10KB': 0,
      '10-50KB': 0,
      '50-100KB': 0,
      '100-200KB': 0,
      '200KB+': 0
    };

    for (const size of sizes) {
      if (size < 10) sizeRanges['0-10KB']++;
      else if (size < 50) sizeRanges['10-50KB']++;
      else if (size < 100) sizeRanges['50-100KB']++;
      else if (size < 200) sizeRanges['100-200KB']++;
      else sizeRanges['200KB+']++;
    }

    console.log('\n大小分布:');
    for (const [range, count] of Object.entries(sizeRanges)) {
      const percentage = ((count / sizes.length) * 100).toFixed(2);
      console.log(`${range}: ${count} 个文件 (${percentage}%)`);
    }

  } catch (error) {
    console.error('分析过程中出错:', error);
  }
}

// 执行分析
analyzeFontSizes().catch(console.error);