const prefix = 'com.totaljerkface.game.sound.';
const audioClassName = 'AudioList';

const fs = require('fs');
const folder = __dirname;
const files = fs.readdirSync(folder);

for (const file of files) {
    const fullPath = folder + '/' + file;
    fs.renameSync(fullPath, fullPath.replace(prefix, ''));
}

const audios = files
    .filter((file) => /\.(mp3|wav)$/.test(file))
    .map((file) => file.replace(prefix, ''));

fs.writeFileSync(folder + '/audios.json', JSON.stringify({ prefix, audios }, undefined, 4));

// fs.writeFileSync(`${folder}/${audioClassName}.ts`, `
// export default class ${audioClassName} {
//     public static names = ${JSON.stringify(audios, undefined, 4)};
// }    
// `.trim());