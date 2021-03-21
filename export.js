function generateAnkiCards() {

  const DEBUG = false;

  if (!DEBUG) {
    console.log = function (a) { };
  }


  let currentCard = undefined;
  var cards = [];
  let cardStatus = 0;
  let content = document.getElementsByClassName('thecontent');

  function isChildValid(child) {
    return child != undefined &&
      child.nodeType == 1 &&
      child.innerHTML != '' &&
      !child.classList.contains('announce') && ['p', 'ul', 'div'].includes(child.nodeName.toLowerCase());
  }

  function addCard(card) {
    console.log('neue Karte fertig!');
    console.log(currentCard);

    (cards.length == 0) ?
      cards.push(currentCard) : cards.push("\n" + currentCard);
  }

  if (content.length > 0) {
    content = content[0];
    console.log(content);
  } else {
    console.error('no content found!');
    return false;
  }

  for (let i = 0; i < content.childNodes.length; i++) {
    child = content.childNodes[i];
    console.log('child:');
    console.log(child);

    //check child
    if (!isChildValid(child)) {
      console.log('skip child');
      continue;
    }

    let nodeName = child.nodeName.toLocaleLowerCase();

    switch (nodeName) {
      case 'p':
        //question
        if (currentCard != undefined) {
          addCard(currentCard);
        }

        if (child.querySelector('img')) {
          console.warn('Frage enthält ein Bild und wird übersprungen! Frage: "' + child.innerText.substring(0, 30) + '..."');
          currentCard = undefined;
          do {
            i++;
          }
          while (
            content.childNodes[i] &&
            !isChildValid(content.childNodes[i]) &&  
            content.childNodes[i].nodeName.toLowerCase() != 'p'
          )


        } else
          currentCard = child.innerHTML.replaceAll('\t', ' ') + "<br>";
        cardStatus = 1;
        //currentCard += '<<<questionEND>>>';
        break;
      case 'ul':
        //options and answer
        currentCard += child.innerText.replaceAll('\n', '<br>');
        //currentCard += '<<<optionsEND>>>';
        currentCard += "\t";
        child.querySelectorAll('strong').forEach(answer => {
          console.log('answer: ' + answer.innerText);
          console.log(answer);
          currentCard += '<br>' + answer.innerHTML.replaceAll('\t', ' ');
        })
        //currentCard += '<<<answerEND>>>';
        cardStatus = 2;

        break;
      case 'div':
        //hint
        if (cardStatus != 2) {
          console.warn("skip card! failed to parse! card: '" + currentCard.substring(0, 30) + '..."')
          currentCard = undefined;
          break;
        }


        currentCard += '<br><br>' + child.innerHTML.replaceAll('\t', ' ');
        cardStatus = 3;
        break;
      default:
        console.log('skip child');
        break;
    }

  }

  if (currentCard != undefined) {
    // add the last one
    addCard(currentCard);
  }

  if (cards.length > 0) {
    console.info("Karten sind fertig!");
    ankiCards = '';
    cards.forEach(card => ankiCards += card);
    console.info(ankiCards);
  } else {
    console.info("Karten konnten nicht generiert werden! :-/")
  }

}

generateAnkiCards();