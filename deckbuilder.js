import { cards } from './fnaf_cards.js';
const cardgrid = document.getElementById('cardgrid');
const cardlist = document.getElementById('cardlist');
const cardtemplate = document.getElementById('card-template');
const cardlisttemplate = document.getElementById('cardlist-template');
const deckCounter = document.getElementById('deck-count');
const cardpreviewimage = document.getElementById('cardpreview');
document.getElementById('deck-download').onclick = function() {downloadDeck()};
loadCards();

var previewScale = 450;
document.addEventListener("keydown", callBack, false);
function callBack(e) {
    var keyCode = e.keyCode;
    if (keyCode == "187") {
        previewScale += 10;
        cardpreviewimage.setAttribute('style', 'width:' + parseInt(previewScale) + 'px');
    }

    if (keyCode == '189') {
        previewScale -= 10;
        cardpreviewimage.setAttribute('style', 'width:' + parseInt(previewScale) + 'px');
    }
  }

const searchinput = document.getElementById("searchinput");
searchinput.addEventListener('keydown', searchin, false);
function searchin(event) {
    setTimeout(() => { getSearchValue() }, 100);
}
function getSearchValue() {
    let matches = [];
    let term = searchinput.value.toString();
    Object.keys(cards).forEach(cardkey => {
        if (cards[cardkey].name.toLowerCase().match(term.toLowerCase()) != null) {
            matches.push(cardkey);
            //console.log(cards[cardkey].name);
            //console.log(term);
        }
    });
    if (term == "") {
        for (let x=0; x < cardgrid.children.length;x++) {
            cardgrid.children[x].classList.remove("hide");
        }
    } else {
        for (let z=0; z < cardgrid.children.length;z++) {
            cardgrid.children[z].classList.add("hide");
        }
        for (let m=0; m < matches.length;m++) {
            for (let c=0; c < cardgrid.children.length;c++) {
                //console.log(cardgrid.children[c].children[0].getAttribute('data-key'));
                if (cardgrid.children[c].children[0].getAttribute('data-key') == matches[m]) {
                    cardgrid.children[c].classList.remove("hide");
                }
            }
        }
    }
}

function loadCards() {
    Object.keys(cards).forEach(cardkey => {
        //console.log(cards[cardkey].image);
        let clone = cardtemplate.cloneNode(true);
        clone.children[0].children[0].setAttribute('src', cards[cardkey].image);
        let clonebutton = clone.children[0];
        clonebutton.setAttribute('data-name', cards[cardkey].name);
        clonebutton.setAttribute('data-key', cardkey);
        clonebutton.onclick = function() {togglecard(clonebutton)};
        clone.removeAttribute('id');
        clone.addEventListener(
            "mouseenter",
            (event) => {
                cardpreviewimage.classList.remove('hide');
                cardpreviewimage.setAttribute('src', cards[cardkey].image);
            },
        );
        clone.addEventListener(
            "mouseleave",
            (event) => {
                cardpreviewimage.classList.add('hide');
            },
        );
        cardgrid.appendChild(clone);
    });
}

function togglecard(target) {
    let toggle = target.getAttribute('data-selected');
    //console.log(toggle);
    if (toggle == 'true') {
        target.children[0].classList.remove("card-highlight");
        target.setAttribute('data-selected', 'false');
    } else {
        target.children[0].classList.add("card-highlight");
        target.setAttribute('data-selected', 'true');
    }
    //getSelection();
    createCardList();
}



function getSelection() {
    for (let i=0; i < cardgrid.children.length;i++) {
        if (cardgrid.children[i].children[0].getAttribute('data-selected') == 'true') {
            console.log(cardgrid.children[i].children[0].getAttribute('data-name'))
        }
        //if (cardgrid.children[i].getAttribute('data-selected') == "true") {
        //    console.log(cardgrid.children[i]);
        //}
    }

}

var jsonExport = "";
function createCardList() {
    cardlist.innerHTML = "";
    var count = 0;
    for (let i=0; i < cardgrid.children.length;i++) {
        if (cardgrid.children[i].children[0].getAttribute('data-selected') == 'true') {
            count += 1;
            let cardName = cardgrid.children[i].children[0].getAttribute('data-key');
            let clone = cardlisttemplate.cloneNode(true);
            clone.children[0].innerHTML = cards[cardName].name;
            cardlist.appendChild(clone);
        }
    }
    deckCounter.innerHTML = count + "/30";
}

function downloadDeck() {
    var deckExport = "";
    var deckJSON = [];
    for (let i=0; i < cardgrid.children.length;i++) {
        if (cardgrid.children[i].children[0].getAttribute('data-selected') == 'true') {
            let cardName = cardgrid.children[i].children[0].getAttribute('data-key');
            //deckExport += '{Name="' + cards[cardName].name + '",';
            //deckExport += 'FaceURL = "' + cards[cardName].url + '",';
            //deckExport += 'BackURL = "https://ulia.dev/tts/fdeck/dl/0001%20fnafcardback.jpg"},\n';
            var newCard = {
                Name: cards[cardName].name,
                FaceURL: cards[cardName].url,
                BackURL: "https://ulia.dev/tts/fdeck/dl/0001%20fnafcardback.jpg",
                GMNote: cards[cardName].gmnote,
                Description: cards[cardName].description
            }
            deckJSON.push(newCard);
        }
    }
    var deckJSONExport = JSON.stringify(deckJSON, null, 2);
    navigator.clipboard.writeText(deckJSONExport);
    alert('Deck Code copied to clipboard');
}