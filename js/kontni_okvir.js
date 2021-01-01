var osnovna_sredstva = `
Neuplaćeni upisani kapital
Pantenti
Zemljište
Investicije u toku
IVOS
Oprema
Građevinski objekti
Motorna vozila
Investicione nekretnine
Ostali dugoročni finansijski plasmani
Osnovna sredstva u pripremi 
Avansi za osnovna sredstva
Otpaci osnovnih sredstva
`;


var obrtna_sredstva = `
Tekući račun
Devizni račun
Blagajna
Prelazni racun
Kupci
Kupci u zemlji
Kupci u inostranstvu
Potraživanja od zaposlenih
Potraživanja od osiguravajućih društva
Mjenična potraživanja
I.V. mjeničnih potraživanja
Ostala potraživanja
Obračun nabavke materijala
Materijal
Materijal na doradi i obradi
Materijal na putu
Nedovršena proizvodnja
Gotovi proizvodi
Obračun nabavke robe
Ukalkulisana RUC
Roba
Roba u magacinu
Roba u prometu na veliko
Roba u prometu na malo
Roba na putu
Kratkoroćni finansijski plasmani
Primljeni avansi
Aktivna vremenska razgraničenja-AVR
Ulazni PDV
`;

var kapital = `
Neuplaćeni upisani kapital(pasiva)
Osnovni kapital
Ulozi 
Udijeli
Akcijski kapital - obicne akcije 
Akcijski kapital - prioritetne akcije
Otkupljene sopstvene akcije
Rezerve
Emisiona premija
Neraspoređena dobit prošlih godina
Gubitak prethodnog perioda
`;

var obaveze = `
Dugoročni krediti
Kratkoroćni krediti
Ino. dobavljaći
Dobavljači
Dobavljači za nefakturisani materijal
Dobavljači za nefakturisanu robu
Obaveze prema zaposlenih
Dugoročna rezervisanja
Obaveze za zarade
Obaveze za troškove kamate
Obaveze za dividende
Obaveze za poreze na dobit
Obaveze po osnovu obveznica
Obaveze po osnovu neto zarada
Obaveze prema državi
Obaveze prema carinskoj dekleraciji
Mjenične obaveze
I.V. mjeničnih obaveza
Ostale obaveze
Avansi-uzeti
Pasivna vremenska razgraničenja-PVR
Izlazni PDV
`;

var prihodi  = `
Prihodi od kamata
Prihodi od prodaje robe
Prihodi od usluga 
Dobitak od prodaje imovine
Prihodi od aktiviranja sopstvenih ucinaka
Pozitivne kursne razlike
`;

var rashodi  = `
Troškovi proizvodnih usluga
Trošak električne energije
Gubici od prodaje imovine
Gubici po osnovu rashodovanja
Rashod kamata
Finansiski rashodi
Trošakovi materijala
NVRR
Negativne kursne razlike
Trošakovi zarada
Nematerijalni troškovi
Trošakovi amortizacije
Trošak rezervisanja
Ostali neposlovni rashodi
`;

var klasa0_niz = osnovna_sredstva.split('\n').filter((e)=>e != '');
var klasa1_niz = obrtna_sredstva.split('\n').filter((e)=>e != '');
var klasa2_niz = kapital.split('\n').filter((e)=>e != '');
var klasa3_niz = obaveze.split('\n').filter((e)=>e != '');
var klasa4_niz = prihodi.split('\n').filter((e)=>e != '');
var klasa5_niz = rashodi.split('\n').filter((e)=>e != '');

var osnovna_sredstva_niz = klasa0_niz;
var obrtna_sredstva_niz = klasa1_niz;
var kapital_niz = klasa2_niz;
var obaveze_niz = klasa3_niz;

function setDatalist(niz){
	var niz = niz.slice();
	
	$('#datalist').empty();
	for(var i in niz){		
			var str = niz[i];
			niz[i] = str.trim();
			
			$('#datalist').append(`<option>${niz[i]}</option>`);
		
	}
	
}

var knjig_dokumenta = `
izvod
faktura
odluka organa upravljanja
prijemnica
komisijski zapisnik
obračunska situacija
otpremnica
radni nalog
trebovanje
kursna lista
racun
predracun amortizacije
za raspored troškova
rešenje
odluka o rashodovanju
odluka o prodaji
devizni izvod
izlazna faktura
knjižno pismo
carinska dekleracija
profaktura         
`

var dokum_niz = knjig_dokumenta.split('\n');
dokum_niz.forEach((e) => {
	if(e != '')
	$('#knjig_dokumenta').append(`<option>${e}</option>`);
});


var aktiva_niz = klasa0_niz.concat(klasa1_niz);
var pasiva_niz = klasa2_niz.concat(klasa3_niz);
var rashodi_niz = klasa5_niz;
var prihodi_niz = klasa4_niz

var svi = aktiva_niz.concat(pasiva_niz,rashodi_niz,prihodi_niz);
svi_racuni(svi);

function svi_racuni(niz){
	var niz = niz.slice();
	
	for(var i in niz){
		
			var str = niz[i];
			niz[i] = str.trim();
			
			$('#svi_racuni').append(`<option>${niz[i]}</option>`);	
	}
	
}
