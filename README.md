### Summer@Vincit2015-koodiharjoitus: Node.js -palvelinsovellus ja web-käli
### Tekijä: Sami Jokela (ipismai@gmail.com)

##Ennen ajoa suoritettavat määritykset:
1.  Asenna riippuvuudet käyttäen node package manageria (npm install)
2.  Muokkaa tiedoston server/config/index.js asetuksissa tietokannan
    osoite, portti ja nimi vastaamaan halutun mongodb-instanssin osoitetta.

##Ohjelman ajaminen:
1.  Käynnistä mongodb
2.  Suorita komento 'npm start' samassa kansiossa missä package.json sijaitsee

##Testien ajaminen:
HUOM: Testien suorittaminen poistaa käytettävän tietokannnan PersonData-scheman kaikki tiedot.
1.  Käynnistä palvelinsovellus
2.  Suorita komento 'npm test' samassa kansiossa missä package.json sijaitsee

## API-Dokumentaatio

## Palautuvat koodit:
200: Pyyntö suoritettiin onnistuneesti
400: Pyynnön parametrit olivat virheelliset.
404: Kohderesurssia ei löytynyt.
500: Palvelimen sisäinen virhe.

### GET /person
Palauttaa listan henkilöistä.

### GET /person/id
Palauttaa id:tä vastaavan henkilön tiedot.

### POST /person
Luo uuden henkilön.

### PUT /person/id
Päivittää id:tä vastaavan henkilön tiedot.

### PATCH /person/id
Päivittää id:tä vastaavan henkilön tiedot.

### DELETE /person
Tyhjentää koko tietorakenteen.

### DELETE /person/id
Poistaa yksittäistä id:tä vastaavan henkilön tiedot.