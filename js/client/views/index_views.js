function setDefaultPseudo(pseudo) {
    const name = document.getElementById('name')
    name.setAttribute('value', pseudo);
}

module.exports = {
    setDefaultPseudo
}