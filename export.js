function generateAnkiCards() {

  const DEBUG = false;


  if (!DEBUG) {
    var oldConsoleLog = console.log;
    console.log = function (a) { };
  }

  let numOfExportedCards = 0;
  let skippedCardsDueToImg = 0;
  

  let currentCard = undefined;
  var cards = [];
  let cardStatus = 0;
  let content = document.getElementsByClassName('thecontent');

  function isChildValid(child) {
    valid = child != undefined &&
    child.nodeType == 1 &&
    child.innerHTML != '' &&
    !child.classList.contains('announce') && ['p', 'ul', 'div'].includes(child.nodeName.toLowerCase());
    
    if (!valid && child){
      console.warn(child.nodeName);
    }


    return valid;
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
    if (!DEBUG)
      console.log = oldConsoleLog;
    return false;
  }

  for (let i = 0; i < content.childNodes.length; i++) {
    child = content.childNodes[i];
    console.log('child:');
    console.log(child);

    //check child
    if (!isChildValid(child)) {
      console.log('skip child:');
      continue;
    }

    let nodeName = child.nodeName.toLocaleLowerCase();

    switch (nodeName) {
      case 'p':
        //question
        if (currentCard != undefined) {
          console.error(currentCard);
          addCard(currentCard);
          numOfExportedCards++;
        }

        currentCard = "";

        // if (child.querySelector('img')) {
        //   console.warn('Frage enthält ein Bild und wird übersprungen! Frage: "' + child.innerText.substring(0, 30) + '..."');
        //   currentCard += "###HIER SOLLTE EIGENTLICH EIN BILD SEIN###";
        //   skippedCardsDueToImg++;


        // }

        currentCard += child.innerHTML.replaceAll('\t', ' ').replaceAll('\n', '<br>') + "<br>";
        console.log('question:');
        console.log(currentCard);
        cardStatus = 1;
        
        //currentCard += '<<<questionEND>>>';
        break;
      case 'ul':
        //options and answer
        if (cardStatus != 1) {
          cardStatus = 0;
          currentCard = undefined;
          break;
        }

        currentCard += child.innerText.replaceAll('\n', '<br><br>');
        //currentCard += '<<<optionsEND>>>';
        currentCard += "\t";
        answers = child.querySelectorAll('strong');
        if (answers.length > 1)
          currentCard += '<ul>';
        answers.forEach(answer => {
          console.log('answer: ' + answer.innerText);
          console.log(answer);
          if (answers.length > 1)
            currentCard += '<li>' + answer.innerHTML.replaceAll('\t', ' ').replaceAll('\n', '<br>') + '</li>';
          else
            currentCard += answer.innerHTML.replaceAll('\t', ' ').replaceAll('\n', '<br>');

        });
        if (answers.length > 1)
          currentCard += '</ul>';
        //currentCard += '<<<answerEND>>>';
        cardStatus = 2;

        break;
      case 'div':
        //hint
        if (cardStatus != 2) {
          cardContent = currentCard == undefined ? '###no card###' : currentCard.substring(0, 30);
          console.warn("skip card! failed to parse! card: '" + cardContent + '..."')
          currentCard = undefined;
          break;
        }

        currentCard += '<br><br>' + child.innerText.replaceAll('\t', ' ').replaceAll('\n', '<br>');
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
    console.info(`Es wurden ${numOfExportedCards} Karten erstellt.`);
    console.info(`Es wurden ${skippedCardsDueToImg} Karten übersprungen weil sie ein Bild enthalten!`);
    let ankiCards = '';
    cards.forEach(card => ankiCards += card);
    console.info(ankiCards);
  } else {
    console.info("Karten konnten nicht generiert werden! :-/")
  }

  if (!DEBUG)
    console.log = oldConsoleLog;

}

generateAnkiCards();