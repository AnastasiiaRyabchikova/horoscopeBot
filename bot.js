require('dotenv').config();
const https = require('https');
const xmlParser = require('xml2json');
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN);

const signs = {
  aries: 'aries',
  taurus: 'taurus',
  gemini: 'gemini',
  cancer: 'cancer',
  leo: 'leo',
  virgo: 'virgo',
  libra: 'libra',
  scorpio: 'scorpio',
  sagittarius: 'sagittarius',
  capricorn: 'capricorn',
  aquarius: 'aquarius',
  pisces: 'pisces',
};

const signsTitles = {
  [signs.aries]: 'Овен',
  [signs.taurus]: 'Телец',
  [signs.gemini]: 'Близнецы',
  [signs.cancer]: 'Рак',
  [signs.leo]: 'Лев',
  [signs.virgo]: 'Дева',
  [signs.libra]: 'Весы',
  [signs.scorpio]: 'Скорпион',
  [signs.sagittarius]: 'Стрелец',
  [signs.capricorn]: 'Козерог',
  [signs.aquarius]: 'Водолей',
  [signs.pisces]: 'Рыбы',
};

const signsByTitles = {
  [signsTitles.aries]: signs.aries,
  [signsTitles.taurus]: signs.taurus,
  [signsTitles.gemini]: signs.gemini,
  [signsTitles.cancer]: signs.cancer,
  [signsTitles.leo]: signs.leo,
  [signsTitles.virgo]: signs.virgo,
  [signsTitles.libra]: signs.libra,
  [signsTitles.scorpio]: signs.scorpio,
  [signsTitles.sagittarius]: signs.sagittarius,
  [signsTitles.capricorn]: signs.capricorn,
  [signsTitles.aquarius]: signs.aquarius,
  [signsTitles.pisces]: signs.pisces,
};

// const signsTitlesPossessive = {
//   [signs.aries]: 'Овнов',
//   [signs.taurus]: 'Тельцов',
//   [signs.gemini]: 'Близнецов',
//   [signs.cancer]: 'Раков',
//   [signs.leo]: 'Львов',
//   [signs.virgo]: 'Дев',
//   [signs.libra]: 'Весов',
//   [signs.scorpio]: 'Скорпионов',
//   [signs.sagittarius]: 'Стрельцов',
//   [signs.capricorn]: 'Козерогов',
//   [signs.aquarius]: 'Водолеев',
//   [signs.pisces]: 'Рыб',
// };

const signsEmoji = {
  [signs.aries]: '♈',
  [signs.taurus]: '♉',
  [signs.gemini]: '♊',
  [signs.cancer]: '♋',
  [signs.leo]: '♌',
  [signs.virgo]: '♍',
  [signs.libra]: '♎',
  [signs.scorpio]: '♏',
  [signs.sagittarius]: '♐',
  [signs.capricorn]: '♑',
  [signs.aquarius]: '♒',
  [signs.pisces]: '♓',
};

const welcomeText = `
Выбери свой знак задиака и получи гороскоп на сегодня!

${Object.keys(signsTitles)
  .map((item) => `${signsEmoji[item]} ${signsTitles[item]}`)
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
  return ctx.reply(data.horo[signsByTitles[text]].today);
});
bot.launch();
