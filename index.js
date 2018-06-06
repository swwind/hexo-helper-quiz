const fs = require('hexo-fs')
const log = require('hexo-log')({debug: false, silent: false});

const marked = (text) =>
  hexo.render.renderSync({text: text, engine: 'markdown'})

hexo.extend.tag.register('quiz', (args, content) => {
  const problems = content.trim().split(/\n{2,}/g).map((prob) => {
    const [title, opts] = prob.trim().split(/\n-{3,}\n/);
    const type = /^\[(?:x| )\]/i.test(opts) ? 'checkbox' : 'radio';
    const options = opts.trim().split('\n').map((item) => {
      const desc = marked(item.slice(4).trim());
      const choose = item.charAt(1) !== ' ';
      return {
        choose: choose,
        desc: desc
      }
    })
    return {
      title: marked(title),
      type: type,
      options: options
    }
  })
  const html = problems.map(({title, type, options}) => {
    const name = Math.random().toString().slice(2)
      .split([]).map(x => "abcdefghij"[~~x]).join([]);
    const opts = options.map(({choose, desc}) => {
      return `<label><input type="${type}" name="${name}" data-ans="${choose}">${desc}</label>`;
    }).join([]);
    return `<div class="__quiz_prob__"><div class="__quiz_title__">${title}</div>${opts}</div>`;
  }).join([]);
  return `<div class="__quiz__"><div class="__quiz_head__">${args.join(' ')}</div>${html}` + 
         `<button class="__quiz_btn__">✔ Submit</button><div class="__quiz_sol__"></div></div>`;
}, { ends: true });

hexo.extend.generator.register('quiz-script', (locals) => {
  return {
    path: 'js/quiz.min.js',
    data: () => {
      return fs.createReadStream('./node_modules/hexo-helper-quiz/dist/quiz.min.js')
    }
  };
});

hexo.extend.filter.register('after_post_render', (data) => {
  if (data.content.indexOf('__quiz__') > -1) {
    data.content += '<script src="/js/quiz.min.js"></script>';
  }
  return data;
});

