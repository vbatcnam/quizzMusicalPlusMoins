'use strict';
/**
	Auteur : Véronique Lion
	Date création : 8/10/2019
	Copyright : © Véronique Lion 2019
	
	En projet : A la fin de la partie, proposer un quitte ou double en ne jouant que les fausses réponses et les "passe".
	Il faut aussi contrôler les volumes car les notes hautes sont plus fortes.
*/

/**Indispensable pour le webAudioAPI.*/
var contexteAudio = new AudioContext();

/** C'est le module de traitement audio génère une tonalité.*/
var oscillateur;

function createNote(hertz){
	oscillateur = contexteAudio.createOscillator();
	oscillateur.frequency.value = hertz;

	/** oscillateur.type :
		Indique la forme de l'onde.  Les valeurs sont "sine" (par défaut), "square", "sawtooth", "triangle".
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
		console.log('monte', hertz1, hertz2);
		return 'monte';
	}else if(hertz1 > hertz2){
		console.log('descend', hertz1, hertz2);
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

var notes; 
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
		showReponse();
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
	alert("Bravo ! Tu gagnes 2 points");
}

function retire2Points(){
	score -= 1;
	console.log('Score : ' + score);
	alert("Dommage ! Tu perds 1 point");
}

function showReponse(){
	alert("La réponse était : " + resultat);
	//donner la possibilité de réécouter les 2 notes.
}

//partie de quiz
//==============
function createQuiz(nbrePartieRestante){
	if(nbrePartieRestante > 0 ){
		//mise à jour des éléments
		notes = [];
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
				point.innerText = score;
				createQuiz(nbrePartieRestante);
			});
		}
	}else{
		zoneMusicale.innerHTML = "";
		zoneAction.innerHTML = "";
		let p = document.createElement('p');
		const texte = document.createTextNode("Bien joué !")
		p.appendChild(texte)
		zoneMusicale.appendChild(p);
		let reponse = confirm("Bien joué ! Veux tu refaire une parie ?");
		if(reponse){
			numPartieEnCours = 1;
			nbrePartieRestante = 10;
			score = 0;
			createQuiz(nbrePartieRestante);
		}
	}

}

createQuiz(nbrePartieRestante);
