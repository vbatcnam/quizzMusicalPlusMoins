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

var tabFrequences =[32.703,65.406,130.81,261.63,523.25,1046.5,2093,4186,8372,16744,
	34.648,69.296,138.59,277.18,554.37,1108.7,2217.5,4434.9,8869.8,17740,
	36.708,73.416,146.83,293.66,587.33,1174.7,2349.3,4698.6,9397.3,18795,
	38.891,77.782,155.56,311.13,622.25,1244.5,2489,4978,9956.1,19912,
	41.203,82.407,164.81,329.63,659.26,1318.5,2637,5274.10548,21096,
	43.654,87.307,174.61,349.23,698.46,1396.9,2793.8,5587.7,11175,22351,
	46.249,92.499,185,369.99,739.99,1480,2960,5919.9,11840,23680,
	48.999,97.999,196,392,783.99,1568,3136,6271.9,12544,25088,
	51.913,103.83,207.65,415.3,830.61,1661.2,3322.4,6644.9,13290,26580,
	55,110,220,440,880,1760,3520,7040,14080,28160,
	58.27,116.54,233.08,466.16,932.33,1864.7,3729.3,7458.6,14917,29834,
	61.735,123.47,246.94,493.88,987.77,1975.5,3951.1,7902.1,15804,31609];

//récupère les boutons. 
var boutonsNotes = [
	document.getElementById('note1'),
	document.getElementById('note2')
];

var boutonsReponses = [
	document.getElementById('monte'),
	document.getElementById('descend'),
	document.getElementById('equal'),
	document.getElementById('passe')
]

//attribueFreqence et joue la note
var notes = [];
for(let boutonNote of boutonsNotes){
	let hertz = piocheUneFreqence();
	notes.push(hertz);
	boutonNote.addEventListener('mousedown',function(){createNote(hertz);});
	boutonNote.addEventListener('mouseup',function(){oscillateur.stop();});
}

var resultat = getReponse(notes[0],notes[1]);
console.log('resultat' + resultat);

//récupère la réponse du joueur
var score = 0;
for(let boutonReponse of boutonsReponses){
	boutonReponse.addEventListener('click',function(){
		let reponseJoueur = boutonReponse.id;
		console.log( ' reponse du joueur : '+ reponseJoueur);
		if(reponseJoueur === resultat){
			score ++;
			console.log('Score : ' + score);
			alert("Bravo !")
		}else{alert("Essaye encore !")}
	});
}

