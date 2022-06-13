import {
  SIGNS_TITLES,
  SIGNS_BY_TITLES,
  SIGNS_EMOJI,
} from '@/constants/signs';
require('dotenv').config();
const https = require('https');
const xmlParser = require('xml2json');
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN);

const welcomeText = `
Выбери свой знак задиака и получи гороскоп на сегодня!

${Object.keys(SIGNS_TITLES)
  .map((item) => `${SIGNS_EMOJI[item]} ${SIGNS_TITLES[item]}`)
  .join('\n\n')
}
`;

const loadHoroscope = () => new Promise((resolve, reject) => {
  const options = {
    hostname: 'ignio.com',
    port: 443,
    path: '/r/export/utf/xml/daily/com.xml',
    method: 'GET',
  };
  
  const req = https.request(options, res => {
  
    let chunk = '';
  
    res.on('data', d => {
      chunk += d;
    });
  
    res.on('end', () => {
      resolve(JSON.parse(xmlParser.toJson(chunk)));
    });
  });
  
  req.on('error', error => {
    console.error('--------------------------error--------------------------');
    reject(error);
  });
  req.end();
});

bot.start((ctx) => ctx.reply(welcomeText));
bot.help((ctx) => ctx.reply(welcomeText));
bot.on('text', async (ctx) => {
  const { text } = ctx.update.message;
  const data = await loadHoroscope();
  return ctx.reply(data.horo[SIGNS_BY_TITLES[text]].today);
});
bot.launch();
