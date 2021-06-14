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

module.exports = {
    setColor
}