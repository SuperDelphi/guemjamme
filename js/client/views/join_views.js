function setColor(color) {
    const avatarBorder = document.getElementById('avatar');
    avatarBorder.classList.forEach(c => {
        avatarBorder.classList.remove(c);
    });
    avatarBorder.classList.add('color-'+color);

    const avatarBtn = document.getElementById('random_avatar');
    avatarBorder.classList.forEach(c => {
       avatarBtn.classList.remove(c);
    });
    avatarBtn.classList.add('color-'+color);
}

function setDefaultPseudo(pseudo) {
    const name = document.getElementById('name')
    name.setAttribute('value', pseudo);
}

module.exports = {
    setColor,
    setDefaultPseudo
}