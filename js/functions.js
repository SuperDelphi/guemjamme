const fs = require('fs');

const roomCode = () => {
    let code = "";
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

const codeExists = (code) => {
    for (const key in global.rooms) {
        if (key === code) return true;
    }
    return false;
}

const capitalize = (str) => {
    return str.replace(/^\w/, c => {return c.toUpperCase()});
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const genRandomAvatar = () => {
    const rand = Math.floor(Math.random()*(18-1)+1)
    return `avatar_${rand}.png`
}

const randomPseudo = () => {
    const nouns = ['pigs','vein','thought','vessel','branch','pets','jump','note','statement','rate','pen','iron','corn','increase','plantation','force','shame','silver','spark','division','bat','growth','rose','society','calculator','bird','picture','girl','pot','toy','produce','stone','flesh']
    const adverbs = ['weakly','intensely','highly','mortally','mysteriously','too','justly','well','wisely','hourly','coolly','instead','acidly','fast','mockingly','sleepily','devotedly','gladly','angrily','coaxingly','tediously','totally','powerfully','greatly','sometimes','bashfully','generally','evenly','below','seemingly','ever','sadly','knowingly']

    return `${capitalize(nouns[Math.floor(Math.random() * nouns.length)])}${capitalize(adverbs[Math.floor(Math.random() * adverbs.length)])}`;
}

module.exports = { roomCode, codeExists, setCookie, getCookie, genRandomAvatar, capitalize, randomPseudo };