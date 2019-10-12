'use strict';

/**
L'interface AudioContext représente un graphe de traitement audio. 
Un contexte audio contrôle à la fois la création des nœuds qu'il contient et l'exécution du traitement audio, ou du décodage. On commence toujours par créer un contexte audio, et tout ce qui va se passer ensuite se situera dans ce contexte.
*/
var contexteAudio = new AudioContext();

/**
L'interface OscillatorNode représente un signal périodique. 
C'est un module de traitement audio AudioNode qui crée un signal sinusoïdal à une fréquence donnée — c'est-à-dire génère une tonalité constante.
*/
var oscillateur;

function createNote(hertz){
	oscillateur = contexteAudio.createOscillator();
	oscillateur.frequency.value = hertz;

	/** oscillateur.type :
	Indique la forme de l'onde générée.  Les valeurs sont "sine" (valeur par défault), "square", "sawtooth", "triangle".
	*/
	oscillateur.type = "triangle";
	oscillateur.connect(contexteAudio.destination);
	oscillateur.start();
}

function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
	
function piocheUneFreqence(){
	let pioche = tabFrequences[getRandomInt(12)]
	return pioche;
}

function getReponse(hertz1, hertz2){
	if(hertz1 < hertz2){
		console.log('monte');
		return 'monte';
	}else if(hertz1 > hertz2){
		console.log('descend');
		return 'descend';
	}else{
		console.log('equal');
		return 'equal';
	}
}

var tabFrequences =[130.81,261.63,523.25,
	138.59,277.18,554.37,
	146.83,293.66,587.33,
	155.56,311.13,622.25,
	164.81,329.63,659.26,
	174.61,349.23,698.46,
	185,369.99,739.99,
	196,392,783.99,1568,
	207.65,415.3,830.61,
	440,880,1760,3520,
	233.08,466.16,932.33,
	246.94,493.88,987.77];

//récupère les zones. 
var zoneMusicale =  document.getElementById('zoneMusicale');
var zoneAction =  document.getElementById('action');

//initialisation des variables
//=============================
var boutonsNotes, boutonsReponses;

//gestion de la partie
var QuestionNum = document.getElementById('QuestionNum');
var totalQuestions = document.getElementById('totalQuestions');
var point = document.getElementById('point');
var total = document.getElementById('total');

var notes = [];
var resultat;
var score = 0;
var reponseJoueur;
var numPartieEnCours = 1;
var nbrePartieRestante = 10;

//fonctions
//==========
function createBouton(parent, id,contenu ){
	let bouton = document.createElement('button');
	bouton.id = id;
	const texte = document.createTextNode(contenu)
	bouton.appendChild(texte)
	parent.appendChild(bouton);
	return bouton;
}

function rendBoutonsInteractifs(){
	for(let boutonNote of boutonsNotes){
		let hertz = piocheUneFreqence();
		notes.push(hertz);
		boutonNote.addEventListener('mousedown',function(){createNote(hertz);});
		boutonNote.addEventListener('mouseup',function(){oscillateur.stop();});
	}
}

function verifieReponse(){
	if(reponseJoueur === "passe"){
		return;
	}else if(reponseJoueur === resultat){
		ajoute1Point();
		return;
	}else{
		retire2Points();
		return;
	}
}

function ajoute1Point(){
	score += 2;
	console.log('Score : ' + score);
	alert("Bravo ! Tu gagnes 2 points")
}
function retire2Points(){
	score -= 1;
	console.log('Score : ' + score);
	alert("Dommage ! Tu perds 1 point")
}

//partie de quiz
//==============
function createQuiz(nbrePartieRestante){
	if(nbrePartieRestante > 0 ){
		//mise à jour des éléments
		zoneMusicale.innerHTML = "";
		zoneAction.innerHTML = "";
		QuestionNum.innerText = numPartieEnCours;
		totalQuestions.innerText = 10;
		point.innerText = score;
		total.innerText = 20;
		
		//création des boutons
		boutonsNotes = [
			createBouton(zoneMusicale,'note1', 'note 1'),
			createBouton(zoneMusicale, 'note2', 'note 2')
		];
		
		boutonsReponses = [
			createBouton(zoneAction,'monte', 'monte'),
			createBouton(zoneAction,'descend', 'descend'),
			createBouton(zoneAction,'equal', 'equal'),
			createBouton(zoneAction,'passe', 'passe'),
		];
		
		rendBoutonsInteractifs();
		
		resultat = getReponse(notes[0],notes[1]);
		console.log('resultat' + resultat);
		
		for(let boutonReponse of boutonsReponses){
			boutonReponse.addEventListener('click', function(evt){
				reponseJoueur = boutonReponse.id;
				verifieReponse();
				nbrePartieRestante -= 1;
				numPartieEnCours ++;
				createQuiz(nbrePartieRestante);
			});
		}
	}
}

createQuiz(nbrePartieRestante);
