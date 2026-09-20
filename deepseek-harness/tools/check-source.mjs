#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const baselinePath = fileURLToPath(new URL('../SOURCE_BASELINE.json', import.meta.url));

function relativePath(value) {
  if (typeof value !== 'string' || !value || value.includes('\0')) {
    throw new Error('基线中的文件路径必须是非空字符串。');
  }
  const normalized = value.replaceAll('\\', '/').replace(/\/$/, '');
  if (path.posix.isAbsolute(normalized) || /^[A-Za-z]:/.test(normalized)
    || normalized.split('/').some(part => !part || part === '..' || part === '.')) {
    throw new Error(`基线中存在不安全的相对路径：${value}`);
  }
  return normalized;
}

function readBaseline() {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  if (typeof baseline.repositoryPath !== 'string' || !/^[a-f\d]{40,64}$/i.test(baseline.commit)
    || !Array.isArray(baseline.watchedAreas) || !Array.isArray(baseline.files)) {
    throw new Error('SOURCE_BASELINE.json 缺少 repositoryPath、完整 commit、watchedAreas 或 files。');
  }
  baseline.watchedAreas = baseline.watchedAreas.map(area => {
    if (typeof area.name !== 'string' || !Array.isArray(area.paths)
      || typeof area.learningImpact !== 'string') {
      throw new Error('每个 watchedAreas 条目必须包含 name、paths 和 learningImpact。');
    }
    return { ...area, paths: area.paths.map(relativePath) };
  });
  baseline.files = baseline.files.map(file => {
    if (!/^[a-f\d]{64}$/i.test(file.sha256)) throw new Error(`无效的 SHA-256：${file.path}`);
    return { path: relativePath(file.path), sha256: file.sha256.toLowerCase() };
  });
  return baseline;
}

function isPrivatePath(file) {
  return file.split('/').some(part => /^(\.git|\.ssh|\.aws|\.azure)$/i.test(part))
    || /^(\.env(?:\..*)?|\.npmrc|\.pypirc|\.netrc|\.gitconfig|\.git-credentials|(?:credentials|secrets)\.json|id_rsa|id_ed25519)$/i.test(path.posix.basename(file))
    || /\.(?:pem|key|p12|pfx)$/i.test(file);
}

function readSourceFile(source, file) {
  if (isPrivatePath(file)) throw new Error(`拒绝读取可能包含私密配置的文件：${file}`);
  const target = path.resolve(source, file);
  const stat = lstatSync(target);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`基线文件不是普通文件：${file}`);
  const relative = path.relative(source, realpathSync(target));
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`文件解析后位于源仓库之外：${file}`);
  }
  return readFileSync(target);
}

function parseChanges(output) {
  const fields = output.split('\0');
  if (fields.at(-1) === '') fields.pop();
  const changes = [];
  for (let i = 0; i < fields.length;) {
    const status = fields[i++];
    const count = /^[RC]/.test(status) ? 2 : 1;
    const paths = fields.slice(i, i + count);
    if (!/^[ACDMRTUXB][0-9]*$/.test(status) || paths.length !== count) {
      throw new Error('无法解析 Git 的 name-status 输出。');
    }
    i += count;
    changes.push({ status, paths });
  }
  return changes;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log('用法：node check-source.mjs [--source <源仓库目录>]');
    return;
  }
  if (args.length && (args.length !== 2 || args[0] !== '--source' || !args[1])) {
    throw new Error('用法：node check-source.mjs [--source <源仓库目录>]');
  }
  const baseline = readBaseline();
  const source = realpathSync(path.resolve(args[1] ?? baseline.repositoryPath));
  const git = gitArgs => execFileSync('git', ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-c', `safe.directory=${source}`, '-C', source, ...gitArgs], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_NO_LAZY_FETCH: '1' },
  });
  const gitRoot = realpathSync(git(['rev-parse', '--show-toplevel']).trim());
  if (gitRoot !== source) throw new Error('--source 必须指向 Git 仓库根目录。');
  const head = git(['rev-parse', 'HEAD']).trim();
  const version = JSON.parse(readSourceFile(source, 'package.json').toString('utf8')).version;
  if (typeof version !== 'string') throw new Error('源仓库 package.json 缺少 version。');

  console.log(`源仓库：${source}`);
  console.log(`基线：${baseline.commit}（版本 ${baseline.version ?? '未记录'}；采集 ${baseline.capturedAt ?? '未记录'}）`);
  console.log(`当前：${head}（工作区版本 ${version}）`);

  const errors = [];
  let baselineExists = true;
  try {
    git(['cat-file', '-e', `${baseline.commit}^{commit}`]);
  } catch (error) {
    if (error.status !== 128 && error.status !== 1) throw error;
    baselineExists = false;
    errors.push('本地 Git 对象库中找不到基线提交，无法比较已提交变化；可能是浅克隆、历史重写或选错仓库。');
  }
  let ancestry = 'unknown';
  if (baselineExists) {
    try {
      git(['merge-base', '--is-ancestor', baseline.commit, head]);
      ancestry = 'ancestor';
      console.log('历史关系：基线是当前 HEAD 的祖先（也包括二者相同）。');
    } catch (error) {
      if (error.status !== 1) throw error;
      ancestry = 'diverged';
      console.log('历史关系：基线不是当前 HEAD 的祖先；存在分叉、回退或无共同历史，不能按普通增量更新理解。');
    }
  } else {
    console.log('历史关系：基线提交在本地缺失，无法判定。');
  }

  const touches = (file, area) => area.paths.some(prefix => file === prefix || file.startsWith(`${prefix}/`));
  const watched = file => baseline.watchedAreas.some(area => touches(file, area));
  const changedPaths = new Set();
  const record = paths => paths.forEach(file => changedPaths.add(file));
  const displayChanges = (title, changes) => {
    const relevant = changes.filter(change => change.paths.some(watched));
    console.log(`\n${title}：${relevant.length} 项`);
    for (const change of relevant) {
      console.log(`  ${change.status}  ${change.paths.map(file => JSON.stringify(file)).join(' → ')}`);
      record(change.paths);
    }
  };
  const diff = revisions => parseChanges(git([
    'diff', '--no-ext-diff', '--no-textconv', '--name-status', '-z', '-M', ...revisions, '--',
  ]));
  if (baselineExists) displayChanges('已提交变化（基线 → HEAD，关注区域）', diff([baseline.commit, head]));
  else console.log('\n已提交变化：未检查（基线缺失）。');
  displayChanges('工作区变化（相对 HEAD，含暂存和未暂存，关注区域）', diff(['HEAD']));
  const untracked = git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(file => file && watched(file));
  console.log(`\n未跟踪文件（关注区域，仅路径）：${untracked.length} 项`);
  untracked.forEach(file => console.log(`  ?  ${JSON.stringify(file)}`));
  record(untracked);

  let hashChanges = 0;
  console.log(`\n基线文件 SHA-256 校验（当前工作区字节，共 ${baseline.files.length} 个）：`);
  for (const file of baseline.files) {
    try {
      const digest = createHash('sha256').update(readSourceFile(source, file.path)).digest('hex');
      if (digest !== file.sha256) {
        hashChanges++;
        record([file.path]);
        console.log(`  CHANGED  ${JSON.stringify(file.path)}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
        hashChanges++;
        record([file.path]);
        console.log(`  MISSING  ${JSON.stringify(file.path)}`);
      } else {
        errors.push(`${file.path}：${error.message}`);
      }
    }
  }
  if (!hashChanges && !errors.length) console.log('  所有基线文件哈希一致。');

  console.log('\n需要复核的学习主题：');
  const impacted = baseline.watchedAreas.filter(area => [...changedPaths].some(file => touches(file, area)));
  impacted.forEach(area => console.log(`  - ${area.name}：${area.learningImpact}`));
  const unclassified = [...changedPaths].filter(file => !watched(file));
  if (unclassified.length) console.log(`  - 关注区域之外的相关文件：${unclassified.map(file => JSON.stringify(file)).join('、')}`);
  if (ancestry !== 'ancestor') console.log('  - 先核对仓库与分支历史，再判断课程基线是否适用。');
  if (!impacted.length && !unclassified.length && ancestry === 'ancestor' && !errors.length) {
    console.log('  本次未检测到所选区域和基线文件的变化。');
  }
  console.log('\n范围说明：仅检查指定区域、基线文件与可见 Git 历史；结果不保证全项目或插件 API 兼容。');
  console.log('只读检查：没有 fetch、pull、更新基线或读取未跟踪文件内容。');
  if (errors.length) {
    errors.forEach(message => console.error(`检查未完成：${message}`));
    process.exitCode = 2;
  }
}

try {
  main();
} catch (error) {
  const detail = error.stderr?.toString().trim() || error.message;
  console.error(`检查失败：${detail}`);
  process.exitCode = 2;
}
