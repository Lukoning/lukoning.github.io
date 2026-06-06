#!/usr/bin/env python3
"""
专门为 GenSenRounded2TW 字体定制的子集化脚本。
功能：
1. 扫描指定目录（如 docs）中的所有文本文件，提取所有使用的字符。
2. 对 R 字重：字符集 = 实际字符 + GB2312 一级汉字（3755字）
3. 对 M、B 字重：字符集 = 实际字符
4. 调用 pyftsubset 生成子集化的 woff2 文件，输出到字体原目录。

使用前请安装依赖：
    pip install fonttools brotli
"""

import os
import subprocess
import sys
from pathlib import Path
from collections import OrderedDict

# ==================== 配置区域（请根据你的项目调整） ====================
# 需要扫描的目录（会递归查找符合条件的文本文件）
SOURCE_DIR = "./docs"
# 字体源文件所在目录
FONT_DIR = "./fonts/GenSenRounded2TW-otf"
# 字体各字重的文件名（不含扩展名，扩展名为 .otf）
FONT_WEIGHTS = {
    "R": "400",   # Regular 字重数值为 400
    "M": "500",   # Medium
    "B": "700",   # Bold
}
# 字体输出目录
OUTPUT_DIR = "./docs/public/fonts/GenSenRounded2TW"
# 输出文件名后缀（自动添加 -subset.woff2）
OUTPUT_SUFFIX = "-subset.woff2"
# ========================================================================

def generate_gb2312_level1():
    """
    在运行时生成 GB2312 一级汉字（无外部文件依赖）
    一级汉字：16区 ~ 55区，每区94字，共 40*94 = 3760 个位置，
    实际有效字符为 3755 个（少数空位自动跳过）。
    区码范围：0xB0 ~ 0xD7 (176 ~ 215)
    位码范围：0xA1 ~ 0xFE (161 ~ 254)
    """
    level1_chars = []
    for qu in range(0xB0, 0xD8):          # 16区～55区
        for wei in range(0xA1, 0xFF):     # 每个区94个字符
            try:
                # GB2312 编码：区码在第一个字节，位码在第二个字节
                char = bytes([qu, wei]).decode('gb2312')
                level1_chars.append(char)
            except UnicodeDecodeError:
                # 空位（极少数）直接跳过
                continue
    return level1_chars

def get_gb2312_level1():
    """获取 GB2312 一级汉字，并直接连成一个长字符串"""
    return ''.join(generate_gb2312_level1())

def collect_chars_from_dir(root_dir):
    """扫描 root_dir 下符合条件的文本文件，提取所有字符（包括换行、空格），返回去重后的字符串。"""
    # 需要扫描的文件扩展名
    extensions = {'.md', '.scss', 'css', '.ts', '.mts', '.vue'}
    # 需要跳过的目录名（不区分大小写，若需精确匹配可去掉 .lower()）
    skip_dirs = {'cache', 'dist', 'Standalone'}
    # 需要跳过的文件名（不区分大小写）
    skip_files = {''}

    char_set = set()
    file_count = 0
    root_path = Path(root_dir)
    if not root_path.exists():
        print(f"错误：目录不存在 - {root_dir}")
        sys.exit(1)

    for file_path in root_path.rglob('*'):
        if not file_path.is_file():
            continue

        # 检查文件路径中的任何一部分是否在 skip_dirs 中
        # 例如：docs/.vitepress/cache/xxx 会命中 cache
        path_parts = file_path.parts
        if any(part.lower() in skip_dirs for part in path_parts):
            continue

        # 检查文件名是否在 skip_files 中
        if file_path.name.lower() in skip_files:
            continue

        # 检查扩展名
        if file_path.suffix.lower() in extensions:
            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')
                if content:
                    char_set.update(content)
                    file_count += 1
                    # 可选：打印扫描的文件名（调试时可取消注释）
                    # print(f"已扫描: {file_path}")
            except Exception as e:
                print(f"警告：无法读取文件 {file_path}: {e}")

    print(f"扫描完成：共处理 {file_count} 个文件，发现 {len(char_set)} 个不同字符。")
    # 排序后返回字符串
    sorted_chars = ''.join(sorted(char_set))
    return sorted_chars

def run_pyftsubset(font_path, chars_string, output_path, no_hinting=True):
    """调用 pyftsubset 生成子集化 woff2 字体"""
    if not os.path.exists(font_path):
        raise FileNotFoundError(f"字体文件不存在: {font_path}")

    # 创建临时字符文件
    temp_chars = Path(output_path).parent / f"temp_chars_{os.getpid()}.txt"
    temp_chars.write_text(chars_string, encoding='utf-8')

    cmd = [
        'pyftsubset',
        font_path,
        f'--text-file={temp_chars}',
        f'--output-file={output_path}',
        '--flavor=woff2'
    ]
    if no_hinting:
        cmd.append('--no-hinting')

    print(f"执行命令: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    temp_chars.unlink(missing_ok=True)

    if result.returncode != 0:
        print("子集化失败：")
        print(result.stderr)
        sys.exit(1)
    else:
        size_kb = os.path.getsize(output_path) / 1024
        print(f"成功生成: {output_path} ({size_kb:.2f} KB)")

def main():
    # 1. 扫描目录获取实际字符
    print(f"开始扫描目录: {SOURCE_DIR}")
    actual_chars = collect_chars_from_dir(SOURCE_DIR)
    if not actual_chars:
        print("错误：未提取到任何字符，请检查 SOURCE_DIR 配置或文件扩展名。")
        sys.exit(1)

    # 2. 准备 GB2312 一级汉字（仅 R 字重需要）
    gb2312_chars = get_gb2312_level1()
    # 合并 R 字重的字符集（去重，保持原顺序）
    r_chars = actual_chars + gb2312_chars
    # 去重并保持顺序（使用 OrderedDict）
    r_chars = ''.join(OrderedDict.fromkeys(r_chars))
    print(f"R 字重最终字符数: {len(r_chars)} (实际 {len(actual_chars)} + GB2312 {len(gb2312_chars)})")
    print(f"M/B 字重最终字符数: {len(actual_chars)}")

    
    # 3. 确保输入/输出目录存在
    font_dir = Path(FONT_DIR)
    if not font_dir.exists():
        print(f"错误：字体目录不存在 - {FONT_DIR}")
        sys.exit(1)
    output_root = Path(OUTPUT_DIR)
    output_root.mkdir(parents=True, exist_ok=True)

    # 4. 对每个字重进行子集化
    for weight_code, weight_num in FONT_WEIGHTS.items():
        src_font = font_dir / f"GenSenRounded2TW-{weight_code}.otf"
        out_font = output_root / f"GenSenRounded2TW-{weight_code}{OUTPUT_SUFFIX}"   # 输出到指定目录
        if not src_font.exists():
            print(f"警告：源字体不存在 {src_font}，跳过该字重")
            continue

        print(f"\n处理字重: {weight_code} (font-weight: {weight_num})")
        if weight_code == "R":
            chars_to_use = r_chars
        else:
            chars_to_use = actual_chars

        run_pyftsubset(str(src_font), chars_to_use, str(out_font), no_hinting=True)

    print("\n所有字重处理完成！")

if __name__ == "__main__":
    main()