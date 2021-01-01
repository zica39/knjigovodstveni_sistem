var preduzece = null;
var trenutna_godina = (new Date()).getFullYear();
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');


$(document).ready(function() {

    if (json) {
        var data = JSON.parse(json);
        preduzece = data;
    }

    if (!preduzece) {
        $('#prijavna_forma').click();
    } else {

        popuni_godine();
        postavi_trenutnu_godinu();
        popuni_informacije_preduzecu();
        $('#naziv_preduzeca').html(preduzece.naziv);
        popuni_sve();

    }
    $('#registracija_preduzeca').submit(e => {

        event.preventDefault();

        var naziv = document.forms['registracija']['naziv'].value;
        var adresa = document.forms['registracija']['adresa'].value;
        var sjediste = document.forms['registracija']['sjediste'].value;
        var logo = document.forms['registracija']['logo'].files[0];
        var djelatnost = document.forms['registracija']['djelatnost'].value;

        $('#registracija_preduzeca').find('button').attr('disabled', 'disabled');

        kreiraj_preduzece(naziv, adresa, sjediste, logo, djelatnost);



    });


});

/* $('#dropdownYear').change(e => {
	
	$('#v-pills-check-tab').addClass('disabled');
	$('#v-pills-result-tab').addClass('disabled');
	$('#v-pills-settings-tab').addClass('disabled');
	$('#v-pills-messages-tab').addClass('disabled');
	
	popuni_sve();
	
	$('#v-pills-profile-tab').click();
	
}); */

$('#dropdownYear').change(e => {

    var selected = $('#dropdownYear option:selected').val();
    window.location.search = "year=" + selected;

});

function popuni_sve() {

    var g = $('#dropdownYear').val();

    if (preduzece[g].pocetni_bilans) {

        $('#osnovna_sredstva').html('');
        $('#obrtna_sredstva').html('');
        $('#kapital').html('');
        $('#obaveze').html('');

        popuni_pocetni_bilans();

    } else {

        if (preduzece[parseInt(g) - 1].bilans_stanja) {

            var obj = preduzece[parseInt(g) - 1].bilans_stanja;
            obj = JSON.parse(JSON.stringify(obj));

            if (obj.kapital['Gubitak t-godine']) {

                if (obj.kapital['Gubitak prethodnog perioda'])
                    obj.kapital['Gubitak prethodnog perioda'] += parseInt(obj.kapital['Gubitak t-godine']);
                else
                    obj.kapital['Gubitak prethodnog perioda'] = parseInt(obj.kapital['Gubitak t-godine']);
            }

            if (obj.kapital['Nerasporedjena dobit t-godine']) {

                if (obj.kapital['Neraspoređena dobit prošlih godina'])
                    obj.kapital['Neraspoređena dobit prošlih godina'] += parseInt(obj.kapital['Nerasporedjena dobit t-godine']);
                else
                    obj.kapital['Neraspoređena dobit prošlih godina'] = parseInt(obj.kapital['Nerasporedjena dobit t-godine']);
            }

            delete obj.kapital['Nerasporedjena dobit t-godine'];
            delete obj.kapital['Gubitak t-godine'];

            $('#osnovna_sredstva').html('');
            $('#obrtna_sredstva').html('');
            $('#kapital').html('');
            $('#obaveze').html('');

            preduzece[g].pocetni_bilans = obj;
            otvori_racune(g);
            otvaranje_racuna_glavne_knige();

            update_db();
            popuni_pocetni_bilans();

        } else
            $('#pocetni_bilans_godina').html(g);

    }


    if (preduzece[g].dnevnik) {

        popuni_dnevnik();
        popuni_glavnu_knjigu();
    }

    if (preduzece[g].zakljuceno) {

        $('#v-pills-check-tab').addClass('disabled');
        $('#v-pills-result-tab').removeClass('disabled');
        popuni_finansijske_iskaze();
    }

}

function kreiraj_preduzece(naziv, adresa, sjediste, logo, djelatnost) {

    var obj = {}
    obj.naziv = naziv;
    obj.adresa = adresa;
    obj.sjediste = sjediste;
    obj.logo = logo
    obj.djelatnost = djelatnost;

    uploaduj_fotografiju(obj);
}

function uploaduj_fotografiju(obj) {

    var fr = new FileReader();
    fr.onload = function() {
        obj.logo = fr.result;
        upisi_preduzece(obj);
    }

    fr.readAsDataURL(obj.logo);

}

function upisi_preduzece(obj) {

    dodaj_godine(obj);
    /* var txt = JSON.stringify(obj,null,'\n');
    localStorage.setItem('preduzece',txt); */
    preduzece = obj;
    $('#zatvori_formu').click();

    postavi_trenutnu_godinu();
    popuni_informacije_preduzecu();

    update_db();
}

function popuni_informacije_preduzecu() {

    var sufix = (preduzece.djelatnost == 'prodaja') ? '🛒' : '🏭';
    $('#naziv').html(preduzece.naziv + sufix);
    $('#naziv_preduzeca').html(preduzece.naziv);

    $('#adresa').html(preduzece.adresa);
    $('#sjediste').html(preduzece.sjediste);
    $('#logo').attr('src', preduzece.logo);

    $('#mejl').html(email);

    postavi_statistiku();

}

function popuni_pocetni_bilans() {
    var godina = $('#dropdownYear').val();
    var obj = preduzece[godina].pocetni_bilans;

    $('#pocetni_bilans_godina').html(godina);

    $('#osnovna_sredstva').html('');
    $('#obrtna_sredstva').html('');
    $('#kapital').html('');
    $('#obaveze').html('');

    for (var i in obj.osnovna_sredstva) {
        if ((i == 'ukupno') || (i == undefined) || (obj.osnovna_sredstva[i] == undefined)) continue;

        var val = obj.osnovna_sredstva[i];
        if (i.includes('IVOS')) val = '( ' + val + ' )';

        $('#osnovna_sredstva').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.obrtna_sredstva) {
        if ((i == 'ukupno') || (i == undefined) || (obj.obrtna_sredstva[i] == undefined)) continue;

        var val = obj.obrtna_sredstva[i];
        if (i.includes('I.V. mjeničnih potraživanja')) val = '( ' + val + ' )';

        $('#obrtna_sredstva').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.kapital) {
        if ((i == 'ukupno') || (i == undefined) || (obj.kapital[i] == undefined)) continue;

        var val = obj.kapital[i];
        if (i.includes('Gubitak prethodnog perioda')) val = '( ' + val + ' )';

        $('#kapital').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.obaveze) {
        if ((i == 'ukupno') || (i == undefined) || (obj.obaveze[i] == undefined)) continue;

        var val = obj.obaveze[i];
        if (i.includes('I.V. mjeničnih obaveza')) val = '( ' + val + ' )';

        $('#obaveze').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    $('#pocetni_bilans').append(`<tr><th>Σ:${obj.aktiva}</th><th class = 'text-right'>Σ:${obj.pasiva}</th></tr>`);

    $('#sacuvaj_pocetni_bilans').addClass('d-none');
    $('#stampaj_pocetni_bilans').removeAttr('hidden');

    $('#v-pills-messages-tab').removeClass('disabled');
    $('#v-pills-settings-tab').removeClass('disabled');
    $('#v-pills-check-tab').removeClass('disabled');

    $('#pocetni_bilans').removeClass('a');
    $('#pocetni_bilans').addClass('b');

}

function popuni_glavnu_knjigu() {

    var godina = $('#dropdownYear').val();
    var racuni = preduzece[godina].racuni;
    $('#glavna_knjiga').children().slice(1).remove();

    var konto = $('#konto').clone();
    konto.removeAttr('hidden');
    konto.children().find('#naziv').html('Otvaranje racuna glavne knjige');
    konto.children().find('#naziv').attr('title', 'Otvaranje racuna glavne knjige');

    konto.children().find('#p').html(preduzece[godina].pocetni_bilans.akt + ' (0');
    konto.children().find('#d').html('0a) ' + preduzece[godina].pocetni_bilans.pas);
    $('#glavna_knjiga').append(konto);

    for (var i in racuni) {
        var konto = $('#konto').clone();
        konto.removeAttr('hidden');
        konto.children().find('#naziv').html(i);
        konto.children().find('#naziv').attr('title', i);

        $('#glavna_knjiga').append(konto);
        if (racuni[i].ps) {
            if (racuni[i].ra)
                konto.children().find('#d').html('0) ' + racuni[i].ps + '<br>');
            else
                konto.children().find('#p').html(racuni[i].ps + ' (0a' + '<br>');
        }

        for (var x in racuni[i].d)
            konto.children().find('#d').append(`${x}) ` + racuni[i].d[x] + '<br>');

        for (var y in racuni[i].p)
            konto.children().find('#p').append(racuni[i].p[y] + ` (${y}` + '<br>');
    }

    var konto = $('#konto').clone();
    konto.removeAttr('hidden');
    var input = `<input style = 'float:left;width:70%' list = 'svi_racuni' onchange = 'proveri_ispravnost1(this)' onblur1 = 'this.nextElementSibling.disabled = true;' oninput = 'this.nextElementSibling.disabled = true;' type=text placeholder = 'Dodaj racun' >
	<button disabled style='float:left;' onclick='dodaj_konto(this)'>➕</button><br>`;
    konto.children().find('#naziv').html(input);
    $('#glavna_knjiga').append(konto);

    if (preduzece[godina].zakljuceno) {
        konto.hide();
        $('#glavna_knjiga').children().addClass('zakljucen_racun');
    }

}

function popuni_dnevnik() {
    var godina = $('#dropdownYear').val();
    $('#dnevnik tbody').children().slice(3).remove();
    $('#popunjeni_dnevnik tbody').children().slice(3).remove();
    var html = '';

    var obj = preduzece[godina].dnevnik;
    obj.forEach((e, i) => {

        var index = e.rb;
        var nextRow = `<tr><td>${index} )</td><td colspan=3>`;
        var nextRow1 = '<td>';
        var nextRow2 = '<td>';

        for (var i in e.akt) {
            nextRow += `<p>${i}</p>`;
            nextRow1 += `<p>${e.akt[i]}</p>`;
            nextRow2 += `<p>-</p>`;
        }

        for (var i in e.pas) {
            nextRow += `<p style='text-indent:50px;'>${i}</p>`;
            nextRow1 += `<p>-</p>`;
            nextRow2 += `<p>${e.pas[i]}</p>`;
        }
        nextRow += `<p> - ${e.dok}</p></td>`
        nextRow1 += `<p>&#8203;</p></td>`;
        nextRow2 += `<p>&#8203;</p></td></tr>`;

        html += nextRow.concat(nextRow1, nextRow2);
    });
    $('#popunjeni_dnevnik').removeAttr('hidden');
    $('#dnevnik tr:first-child').attr('hidden', '');
    $('#popunjeni_dnevnik tbody').append(html);

    if (preduzece[godina].zakljuceno) {
        $('#dnevnik_forma').hide();
        $('#popunjeni_dnevnik').unwrap();
    }
}

//$('#sacuvaj_pocetni_bilans').click((e)=>{
$('#pocetni_bilans_forma').submit((e) => {

    event.preventDefault();

    var pocetni_bilans = {};

    var osn = $('#pocetni_bilans #osnovna_sredstva tr');
    pocetni_bilans.osnovna_sredstva = {};
    osn.each(function(i) {
        if ($(osn[i]).find('input[type=text]').val())
            pocetni_bilans.osnovna_sredstva[$(osn[i]).find('input[type=text]').val()] = $(osn[i]).find('input[type=number]').val();
    });


    var obr = $('#pocetni_bilans #obrtna_sredstva tr');
    pocetni_bilans.obrtna_sredstva = {};
    obr.each(function(i) {
        if ($(obr[i]).find('input[type=text]').val())
            pocetni_bilans.obrtna_sredstva[$(obr[i]).find('input[type=text]').val()] = $(obr[i]).find('input[type=number]').val();
    });

    var kapital = $('#pocetni_bilans #kapital tr');
    pocetni_bilans.kapital = {};
    kapital.each(function(i) {
        if ($(kapital[i]).find('input[type=text]').val())
            pocetni_bilans.kapital[$(kapital[i]).find('input[type=text]').val()] = $(kapital[i]).find('input[type=number]').val();
    });

    var obaveze = $('#pocetni_bilans #obaveze tr');
    pocetni_bilans.obaveze = {};
    obaveze.each(function(i) {
        if ($(obaveze[i]).find('input[type=text]').val())
            pocetni_bilans.obaveze[$(obaveze[i]).find('input[type=text]').val()] = $(obaveze[i]).find('input[type=number]').val();
    });


    var akt = 0;
    var pas = 0;

    var ukupno = 0;
    for (var i in pocetni_bilans.osnovna_sredstva) {
        if (i.includes('IVOS')) {
            ukupno -= parseInt(pocetni_bilans.osnovna_sredstva[i]);
            pas += parseInt(pocetni_bilans.osnovna_sredstva[i]);
        } else {
            akt += parseInt(pocetni_bilans.osnovna_sredstva[i]);
            ukupno += parseInt(pocetni_bilans.osnovna_sredstva[i]);
        }
    }
    pocetni_bilans.osnovna_sredstva.ukupno = ukupno ? ukupno : 0;

    var ukupno = 0;
    for (var i in pocetni_bilans.obrtna_sredstva) {
        if (i.includes('I.V. mjeničnih potraživanja')) {
            ukupno -= parseInt(pocetni_bilans.obrtna_sredstva[i]);
            pas += parseInt(pocetni_bilans.obrtna_sredstva[i]);
        } else {
            akt += parseInt(pocetni_bilans.obrtna_sredstva[i]);
            ukupno += parseInt(pocetni_bilans.obrtna_sredstva[i]);
        }
    }
    pocetni_bilans.obrtna_sredstva.ukupno = ukupno ? ukupno : 0;

    var ukupno = 0;
    for (var i in pocetni_bilans.kapital) {
        if (i.includes('Gubitak prethodnog perioda')) {
            akt += parseInt(pocetni_bilans.kapital[i]);
            ukupno -= parseInt(pocetni_bilans.kapital[i]);
        } else {
            pas += parseInt(pocetni_bilans.kapital[i]);
            ukupno += parseInt(pocetni_bilans.kapital[i]);
        }
    }
    pocetni_bilans.kapital.ukupno = ukupno ? ukupno : 0;

    var ukupno = 0;
    for (var i in pocetni_bilans.obaveze) {
        if (i.includes('I.V. mjeničnih obaveza')) {
            akt += parseInt(pocetni_bilans.obaveze[i]);
            ukupno -= parseInt(pocetni_bilans.obaveze[i]);
        } else {
            pas += parseInt(pocetni_bilans.obaveze[i]);
            ukupno += parseInt(pocetni_bilans.obaveze[i]);
        }
    }
    pocetni_bilans.obaveze.ukupno = ukupno ? ukupno : 0;

    console.log(pocetni_bilans);

    pocetni_bilans.aktiva = 0;
    pocetni_bilans.pasiva = 0;

    pocetni_bilans.aktiva = pocetni_bilans.osnovna_sredstva.ukupno + pocetni_bilans.obrtna_sredstva.ukupno;
    pocetni_bilans.pasiva = pocetni_bilans.kapital.ukupno + pocetni_bilans.obaveze.ukupno;

    pocetni_bilans.akt = akt;
    pocetni_bilans.pas = pas;


    if (pocetni_bilans.aktiva != pocetni_bilans.pasiva) {
        alert('Neispravn bilans, proverite tacnost unetih podataka!');
        return false;
    }

    if (pocetni_bilans.aktiva == pocetni_bilans.pasiva && pocetni_bilans.aktiva == 0) {
        alert('Neispravn bilans, stavke nisu unesene!');
        return false;

    }

    preduzece[$('#dropdownYear').val()].pocetni_bilans = pocetni_bilans;

    otvori_racune($('#dropdownYear').val());
    otvaranje_racuna_glavne_knige();

    update_db();

    event.target.setAttribute('disabled', '');

    $('#pocetni_bilans input').attr('disabled', 'disabled');
    $('#sacuvaj_pocetni_bilans').addClass('d-none');
    $('#stampaj_pocetni_bilans').removeAttr('hidden');

    popuni_pocetni_bilans();
    popuni_dnevnik();
    popuni_glavnu_knjigu();

});


function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

function dodaj_godine(obj) {

    $('#dropdownYear').each(function() {

        var year = trenutna_godina;
        var current = year;

        year -= 5;
        for (var i = 0; i < 6; i++) {

            if ((year + i) == current)
                $(this).append('<option selected value="' + (year + i) + '">' + (year + i) + '</option>');
            else
                $(this).append('<option value="' + (year + i) + '">' + (year + i) + '</option>');

            obj[year + i] = {};
        }

    });

}

function popuni_godine() {
    for (var i in preduzece)
        if (isFinite(Number(i)))
            $('#dropdownYear').append(`<option value="${i}">${i}</option>`);

};

function postavi_trenutnu_godinu() {

    var n = parseInt(gup('year'));
    if (isNaN(n)) n = trenutna_godina;

    var god = n ? n : trenutna_godina;

    if (preduzece[god]) {
        $(`#dropdownYear > option[value=${god}]`).attr('selected', '');
    } else {
        if (!(n == trenutna_godina)) god = trenutna_godina;
        preduzece[god] = {};
        $('#dropdownYear > option[selected]').removeAttr('selected');
        $('#dropdownYear').append(`<option selected value = ${god}>${god}</option>`);

        update_db();
    }


}

//$('button.dodaj_racun').click(e=>dodaj_racun);

function dodaj_racun(e) {

    //e.target.style.position = 'absolute';

    var btn = $(e.target);
    var td = btn.parent();
    var tr = td.parent();
    var table = tr.parent().parent();
    var tableId = table.attr('id');
    var nextTr = "<tr><td><button  type = 'button' onclick = 'dodaj_racun(event)' class = 'mr-1'>➕</button></td></tr>";

    if (btn.html() == '🗑️') {

        var val = btn.next().val();
        val = 'I.V. ' + val;
        $('#pocetni_bilans input[required][type=text]').filter(function() {
            return this.value == val
        }).parent().parent().remove();

        tr.remove();

        if (!table.children().length)
            table.append(nextTr);
        return;
    }


    if (tableId == 'osnovna_sredstva') {

        td.append("<input required type = 'text' oninput = 'if(event.inputType)this.value=null' onchange = 'proveri_racun(this)' onfocus = 'setDatalist(osnovna_sredstva_niz);' list = 'datalist'>");
        tr.append("<td><input required type = 'number'></td>");
        btn.html('🗑️');

        table.append(nextTr);
    } else if (tableId == 'kapital') {

        td.append("<input required type = 'text' oninput = 'if(event.inputType)this.value=null' onchange = 'proveri_racun(this)' onfocus = 'setDatalist(kapital_niz);' list = 'datalist'>");
        tr.append("<td><input required type = 'number'></td>");
        btn.html('🗑️');

        table.append(nextTr);
    } else if (tableId == 'obrtna_sredstva') {

        td.append("<input required type = 'text' oninput = 'if(event.inputType)this.value=null' onchange = 'proveri_racun(this)' onfocus = 'setDatalist(obrtna_sredstva_niz);' list = 'datalist'>");
        tr.append("<td><input required type = 'number'></td>");
        btn.html('🗑️');

        table.append(nextTr);
    } else if (tableId == 'obaveze') {

        td.append("<input required type = 'text' oninput = 'if(event.inputType)this.value=null' onchange = 'proveri_racun(this)' onfocus = 'setDatalist(obaveze_niz);' list = 'datalist'>");
        tr.append("<td><input required type = 'number'></td>");
        btn.html('🗑️');

        table.append(nextTr);
    }

}

function proveri_racun(e) {

    $('#pocetni_bilans input[required][type=text]').each(i => {

        if ($('#pocetni_bilans input[required][type=text]')[i] != e) {
            var val = $('#pocetni_bilans input[required][type=text]')[i].value;

            if (val == e.value) {
                e.value = '';
                alert('racun vec postoji');
            }


        }

    });

    var val1 = String(e.value);
    if (val1.startsWith('I.V.')) {
        var rac = val1.substring(val1.indexOf('I.V.') + 5);

        if ($(`#pocetni_bilans input[required][type=text]`).filter(function() {
                return this.value == rac
            }).length == 0) {
            e.value = '';
            alert('Nije definisan osnovni reacun');
        }
    }

};

function proveri_ispravnost(e) {

    var p = $(e).parent();
    var val = e.value;

    p.children().filter('input[type=text]').each((i) => {

        if (p.children().filter('input[type=text]')[i] != e) {

            if (val == p.children().filter('input[type=text]')[i].value) {
                alert('Racun je vec unijet');
                e.value = '';

            }

        }
    });
}

function dodaj_vrstu(pod) {
    var dnevnik = $('#dnevnik');
    var index0 = $('#popunjeni_dnevnik tbody tr:last-child').children().first().html();
    index0 = parseInt(index0);
    var index;

    if (!pod) {

        if (dnevnik.find('tr').length == 3) index = index0 + 1;
        else {
            index = $('#dnevnik tbody').children('tr').last().children().first().html().replace(' )', '');
            index = parseInt(index) + 1;
        }

    } else {

        index = $('#dnevnik tbody').children('tr').last().children().first().html().replace(' )', '');

        if (Number.isNaN(Number(index))) {

            var no = parseInt(index);
            if (Number.isNaN(no)) no = index0 + 1;

            letter = index.replace(no, '');
            index = no + alphabet[alphabet.indexOf(letter) + 1]; //greska posle 26 ali u praksi ne postoji slucaj
        } else {

            index = $('#dnevnik tbody').children('tr').last().children().first().html().replace(' )', '');
            index = (parseInt(index) + 1) + alphabet[0];
        }
    }


    var godina = $('#dropdownYear').val();

    var nextRow = `<tr><td>${index} )</td>
	<td colspan=3>
	<input required style = 'float:left;clear:right;' list = 'lista_racuna' onchange = 'proveri_ispravnost(this)' oninput = 'if(event.inputType)this.value=null' onfocus='update_listu_racuna()' type=text placeholder = 'racun duguje' ><button style='float:left' type= 'button' onclick='dodaj_dugovni_racun(this)'>➕</button><br>
	<input required style = 'float:right;clear:left;' list = 'lista_racuna' onchange = 'proveri_ispravnost(this)' oninput = 'if(event.inputType)this.value=null' onfocus='update_listu_racuna()' type=text placeholder = 'racun potrazuje' ><button style='float:right;' type= 'button' onclick='dodaj_potrazni_racun(this)'>➕</button><br>
	<input required style = 'float:left;clear:right' type=text oninput = 'if(event.inputType)this.value=null' list = 'knjig_dokumenta' placeholder = 'knjigovostvena dokumetacija' >
	</td>
	<td><input required type='number'><br><input type='number' disabled></td>
	<td><input type='number' disabled><br><input required type='number'></td>
	</tr>`;

    dnevnik.append(nextRow);
};

function oduzmi_vrstu() {
    var dnevnik = $('#dnevnik');
    var index = dnevnik.find('tr').length - 3;

    if (index > 0)
        dnevnik.find('tr').last().remove();

};

function dodaj_dugovni_racun(el) {
    $(el).next().after(`<input required style = 'float:left;clear:left' list = 'lista_racuna' onchange = 'proveri_ispravnost(this)' oninput = 'if(event.inputType)this.value=null' onfocus='update_listu_racuna()' type=text placeholder = 'racun duguje' ><button style='float:left' onclick='oduzmi_racun(this)'>🗑️</button><br>`);

    $(el).parent().children().filter('button').each(function(i) {

        var inp = $(el).parent().children().filter('button')[i];

        if (inp == el) {
            var inpd = $(el).parent().next().find('input[type=number]')[i]
            $(inpd).next().after("<input required type='number'>");

            var inpp = $(el).parent().next().next().find('input[type=number]')[i]
            $(inpp).next().after("<input type='number' disabled>");
        }
    });

};

function dodaj_potrazni_racun(el) {
    $(el).next().after(`<input required style = 'float:right;clear:right' list = 'lista_racuna' onchange = 'proveri_ispravnost(this)' oninput = 'if(event.inputType)this.value=null' onfocus='update_listu_racuna()'  type=text placeholder = 'racun potrazuje' ><button style='float:right' onclick='oduzmi_racun(this)'>🗑️</button><br>`);

    $(el).parent().children().filter('button').each(function(i) {

        var inp = $(el).parent().children().filter('button')[i];

        if (inp == el) {

            var inpp = $(el).parent().next().next().find('input[type=number]')[i];
            $(inpp).after("<input required type='number'>");

            var inpd = $(el).parent().next().find('input[type=number]')[i]
            $(inpd).after("<input type='number' disabled>");
        }
    });

};

function oduzmi_racun(el) {

    $(el).parent().children().filter('button').each(function(i) {

        var inp = $(el).parent().children().filter('button')[i];

        if (inp == el) {

            var inpp = $(el).parent().next().next().find('input[type=number]')[i];
            $(inpp).siblings('br').remove();
            $(inpp).remove();


            var inpd = $(el).parent().next().find('input[type=number]')[i];
            $(inpd).siblings('br').remove();
            $(inpd).remove();
        }
    });

    $(el).next('br').remove();
    $(el).prev().remove();
    $(el).remove();
}

function sacuvaj_dodato() {

    var dnevnik = $('#dnevnik tbody').children('tr').slice(3);
    var promene = [];

    dnevnik.children().each(i => {

        var obj = {};
        obj.akt = {};
        obj.pas = {};

        var red = $(dnevnik[i]);
        var rb = red.children().first().html();
        if (rb == undefined) return;
        obj.rb = rb.replace(' )', '');
        obj.dok = red.children().first().next().children().filter('input:last-child').val();

        var akt = red.children().first().next().children().filter('input[placeholder*=duguje]');
        akt.each(m => {
            var name = akt[m].value;
            var value = red.children().get(2).children[m].value;
            obj.akt[name] = value;
        });

        var pas = red.children().first().next().children().filter('input[placeholder*=potrazuje]');
        pas.each(n => {
            var name = pas[n].value;
            var index = red.children().first().next().children().filter('input').index(pas[n]);
            var value = $(red.children().get(3)).children().filter('input').get(index).value;
            obj.pas[name] = value;
        });

        promene.push(obj);
    });
    return promene;
}

$('#dnevnik_forma').submit((e) => {

    event.preventDefault();

    var g = $('#dropdownYear').val();
    var arr = sacuvaj_dodato();

    if (arr.length)
        preduzece[g].dnevnik = preduzece[g].dnevnik.concat(arr);

    popuni_dnevnik();
    koriguj_racune();
    popuni_glavnu_knjigu();
    update_db();


});

function koriguj_racune() {
    var g = $('#dropdownYear').val();
    var dne = preduzece[g].dnevnik;

    for (var i in dne) {
        if (dne[i].dok == 'P.S.') continue;

        var rb = dne[i].rb;

        for (var x in dne[i].akt) {
            preduzece[g].racuni[x].d[rb] = dne[i].akt[x];
        }

        for (var y in dne[i].pas)
            preduzece[g].racuni[y].p[rb] = dne[i].pas[y];
    }
}

/* function update_db(){
	var txt = JSON.stringify(preduzece,null,'\n');
	localStorage.setItem('preduzece',txt);
} */

function update_db() {
    var txt = JSON.stringify(preduzece);
    $('#loading').modal('show');
    var request = new XMLHttpRequest();
    request.open("POST", "./insert_json.php?json=true&email=" + email);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(txt);
    request.onreadystatechange = function(e) {

        $('#loading').modal('hide');

        if (request.readyState == 4 && request.status == 200) {
            $('#loading').modal('hide');

        }
    }
    request.onerror = function(e) {
        alert('Greka pri slanju podataka, pokusaje ponovo');
        location.reload();
        $('#loading').modal('hide');
    }
}

function obrisi_podatke(e, sve) {
    var g = $('#dropdownYear').val();
    if (confirm('Da li ste sigurni?')) {

        if (sve) {
            for (var i in preduzece) {
                if (preduzece[i] instanceof Object)
                    preduzece[i] = {};
                update_db();
            }
        } else {
            preduzece[g] = {};
            update_db();
        }

        location.reload();
    }
}

function otvaranje_racuna_glavne_knige() {

    var g = $('#dropdownYear').val();

    var rac = preduzece[g].racuni;
    var akt = preduzece[g].pocetni_bilans.akt;
    var pas = preduzece[g].pocetni_bilans.pas;

    var a0 = {};
    a0.rb = '0';
    a0.dok = 'P.S.';
    a0.pas = {
        'Otvaranje racuna glavne knjige': pas
    };
    a0.akt = {};

    for (var i in rac) {
        if (rac[i].ra)
            a0.akt[i] = rac[i].ps;
    }

    var a1 = {};
    a1.rb = '0a';
    a1.dok = 'P.S.';
    a1.akt = {
        'Otvaranje racuna glavne knjige': akt
    };
    a1.pas = {};
    for (var i in rac) {
        if (!rac[i].ra)
            a1.pas[i] = rac[i].ps;
    }

    preduzece[g].dnevnik = [];
    preduzece[g].dnevnik.push(a0);
    preduzece[g].dnevnik.push(a1);

}

function otvori_racune(godina) {

    preduzece[godina].racuni = {};
    var obj = preduzece[godina].racuni;

    var os = preduzece[godina].pocetni_bilans.osnovna_sredstva;
    var obs = preduzece[godina].pocetni_bilans.obrtna_sredstva;
    var kap = preduzece[godina].pocetni_bilans.kapital;
    var obav = preduzece[godina].pocetni_bilans.obaveze;

    for (var i in os) {
        if (i == 'ukupno') continue;
        obj[i] = {
            d: {},
            p: {},
            ps: os[i],
            ru: false,
            ra: i.includes('IVOS') ? false : true

        }
    }

    for (var i in obs) {
        if (i == 'ukupno') continue;
        obj[i] = {
            d: {},
            p: {},
            ps: obs[i],
            ru: false,
            ra: i.includes('I.V. mjeničnih potraživanja') ? false : true
        }
    }

    for (var i in kap) {
        if (i == 'ukupno') continue;
        obj[i] = {
            d: {},
            p: {},
            ps: kap[i],
            ru: false,
            ra: i.includes('Gubitak prethodnog perioda') ? true : false
        }
    }

    for (var i in obav) {
        if (i == 'ukupno') continue;
        obj[i] = {
            d: {},
            p: {},
            ps: obav[i],
            ru: false,
            ra: i.includes('I.V. mjeničnih obaveza') ? true : false

        }
    }
}



function update_listu_racuna() {
    var godina = $('#dropdownYear').val();
    var e = $('#lista_racuna');
    e.empty();

    var racuni = preduzece[godina].racuni;
    for (var i in racuni)
        e.append(`<option>${i}</option>`);

}

function dodaj_konto(e) {

    var g = $('#dropdownYear').val();

    var naziv = e.previousElementSibling.value;
    var obj = preduzece[g].racuni;

    if (naziv in obj) {
        alert('Racun vec postoji');
        e.disabled = true;
    }

    var ra;
    var ru = false;

    var f1 = aktiva_niz.some(el => {
        return (el.includes(naziv));
    });
    var f2 = rashodi_niz.some(el => {
        return (el.includes(naziv));
    });
    var f3 = pasiva_niz.some(el => {
        return (el.includes(naziv));
    });
    var f4 = prihodi_niz.some(el => {
        return (el.includes(naziv));
    });

    ra = (f1 == true || f2 == true) ? true : false;
    ru = (f2 == true || f4 == true) ? true : false;

    console.log('ra:' + ra);
    console.log('ru:' + ru);

    var obj1 = {
        d: {},
        p: {},
        ru: ru,
        /* ra:ra */
        ra: (naziv == 'IVOS' || naziv == 'I.V. mjeničnih potraživanja' || naziv == 'I.V. mjeničnih obaveza' || naziv == 'Gubitak prethodnog perioda') ? ra : ra
    }

    obj[naziv] = obj1;

    popuni_glavnu_knjigu();
    update_db();

}

function proveri_ispravnost1(e) {
    var val = e.value;

    if ($('#svi_racuni option').filter(function() {
            return e.value.toUpperCase() === val.toUpperCase();
        }).length) {
        e.nextElementSibling.removeAttribute('disabled', 'disabled');
    }
}

function popuni_probni_list(e) {

    $('#probni_list').removeAttr('hidden');

    var pl = $('#probni_list tbody');
    pl.children().filter('tr').slice(3).remove();

    var g = $('#dropdownYear').val();
    var rac = preduzece[g].racuni;
    var index = 1;

    var firstRow = `<tr><td>${index}</td><td colspan=3>Otvaranje racun glavne knjige</td>
<td>${preduzece[g].pocetni_bilans.akt}</td><td>${preduzece[g].pocetni_bilans.pas}</td>
<td> - </td><td> - </td></tr>`

    pl.append(firstRow);

    for (var i in rac) {
        if (!rac[i].ru && rac[i].ra) {
            index++;
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = parseInt(ps) + sum(rac[i].d);
            var pp = sum(rac[i].p);
            var sd = pd - pp;
            var sp = ' - ';
            if (pp == 0) pp = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td></tr>`
            pl.append(row);
        }
    }

    for (var i in rac) {
        if (!rac[i].ru && !rac[i].ra) {
            index++;
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = sum(rac[i].d);
            var pp = parseInt(ps) + sum(rac[i].p);
            var sd = ' - ';
            var sp = pp - pd;
            if (pd == 0) pd = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td></tr>`
            pl.append(row);
        }
    }

    for (var i in rac) {
        if (rac[i].ru && rac[i].ra) {
            index++;
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = parseInt(ps) + sum(rac[i].d);
            var pp = sum(rac[i].p);
            var sd = pd - pp;
            var sp = ' - ';
            if (pp == 0) pp = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td></tr>`
            pl.append(row);
        }
    }

    for (var i in rac) {
        if (rac[i].ru && !rac[i].ra) {
            index++
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = sum(rac[i].d);
            var pp = parseInt(ps) + sum(rac[i].p);
            var sd = ' - ';
            var sp = pp - pd;
            if (pd == 0) pd = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td></tr>`
            pl.append(row);
        }
    }

    var pd = 0;
    var PD = $('#probni_list tbody tr td:nth-child(3)');
    PD.each(i => {
        var res = parseInt(PD[i].innerHTML);
        if (!isNaN(res)) pd += res
    });

    var pp = 0;
    var PP = $('#probni_list tbody tr td:nth-child(4)');
    PP.each(i => {
        var res = parseInt(PP[i].innerHTML);
        if (!isNaN(res)) pp += res
    });

    var sd = 0;
    var SD = $('#probni_list tbody tr td:nth-child(5)');
    SD.each(i => {
        var res = parseInt(SD[i].innerHTML);
        if (!isNaN(res)) sd += res
    });

    var sp = 0;
    var SP = $('#probni_list tbody tr td:nth-child(6)');
    SP.each(i => {
        var res = parseInt(SP[i].innerHTML);
        if (!isNaN(res)) sp += res
    });

    var lastRow = `<tr><td style = 'visibility:collapse;'></td><td style = 'visibility:collapse;' colspan=3></td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td></tr>`
    pl.append(lastRow);

    $('#probni_list_sum').attr('open', true);
    $('#probni_list_sum')[0].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if ((pd == pp) && (sp == sd)) {
        e.nextElementSibling.removeAttribute('disabled');
        $('#probni_list tbody tr:last-child td').css('background-color', '#90ee90');
        return true;
    } else {
        $('#probni_list tbody tr:last-child td').css('background-color', '#ff4d4d');
        return false;
    }
}

function popuni_zakljucni_list(e) {

    $('#zakljucni_list').removeAttr('hidden');

    var pl = $('#zakljucni_list tbody');
    pl.children().filter('tr').slice(3).remove();

    var g = $('#dropdownYear').val();
    var rac = preduzece[g].racuni;
    var index = 1;
    var index0 = $('#popunjeni_dnevnik tbody tr:last-child').children().first().html();
    index0 = parseInt(index0) + 1;

    var firstRow = `<tr><td>${index}</td><td colspan=3>Otvaranje racun glavne knjige</td>
<td>${preduzece[g].pocetni_bilans.akt}</td><td>${preduzece[g].pocetni_bilans.pas}</td>
<td> - </td><td> - </td><td> - </td><td> - </td><td> - </td><td> - </td></tr>`

    pl.append(firstRow);

    for (var i in rac) {
        if (!rac[i].ru && rac[i].ra) {
            index++;
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = parseInt(ps) + sum(rac[i].d);
            var pp = sum(rac[i].p);
            var sd = pd - pp;
            var sp = ' - ';
            if (pp == 0) pp = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td><td>${sd}</td><td>${sp}</td><td> - </td><td> - </td></tr>`
            pl.append(row);
        }
    }

    for (var i in rac) {
        if (!rac[i].ru && !rac[i].ra) {
            index++;
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = sum(rac[i].d);
            var pp = parseInt(ps) + sum(rac[i].p);
            var sd = ' - ';
            var sp = pp - pd;
            if (pd == 0) pd = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td><td>${sd}</td><td>${sp}</td><td> - </td><td> - </td></tr>`
            pl.append(row);
        }
    }

    //rashodi
    for (var i in rac) {
        if (rac[i].ru && rac[i].ra) {
            index++;
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = parseInt(ps) + sum(rac[i].d);
            var pp = sum(rac[i].p);
            var sd = Math.abs(pd - pp);
            var sp = ' - ';
            if (pp == 0) pp = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td><td> - </td><td> - </td><td>${sd}</td><td> - </td></tr>`
            pl.append(row);
        }
    }

    //prihodi
    for (var i in rac) {
        if (rac[i].ru && !rac[i].ra) {
            index++
            var ps = rac[i].ps;
            if (ps == undefined) ps = 0;
            var naziv = i;
            var pd = sum(rac[i].d);
            var pp = parseInt(ps) + sum(rac[i].p);
            var sd = ' - ';
            var sp = Math.abs(pp - pd);
            if (pd == 0) pd = ' - ';
            var row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td><td> - </td><td> - </td><td> - </td><td>${sp}</td</tr>`
            pl.append(row);
        }
    }

    var pd = 0;
    var PD = $('#zakljucni_list tbody tr td:nth-child(3)');
    PD.each(i => {
        var res = parseInt(PD[i].innerHTML);
        if (!isNaN(res)) pd += res
    });

    var pp = 0;
    var PP = $('#zakljucni_list tbody tr td:nth-child(4)');
    PP.each(i => {
        var res = parseInt(PP[i].innerHTML);
        if (!isNaN(res)) pp += res
    });

    var sd = 0;
    var SD = $('#zakljucni_list tbody tr td:nth-child(5)');
    SD.each(i => {
        var res = parseInt(SD[i].innerHTML);
        if (!isNaN(res)) sd += res
    });

    var sp = 0;
    var SP = $('#zakljucni_list tbody tr td:nth-child(6)');
    SP.each(i => {
        var res = parseInt(SP[i].innerHTML);
        if (!isNaN(res)) sp += res
    });

    var zak_aktiva = {};
    var bsd = 0;
    var BSD = $('#zakljucni_list tbody tr td:nth-child(7)');
    BSD.each(i => {
        var res = parseInt(BSD[i].innerHTML);
        if (!isNaN(res)) {
            bsd += res;
            var naz = BSD[i].parentElement.children[1].innerHTML;
            zak_aktiva[naz] = res;
        }
    });

    var zak_pasiva = {};
    var bsp = 0;
    var BSP = $('#zakljucni_list tbody tr td:nth-child(8)');
    BSP.each(i => {
        var res = parseInt(BSP[i].innerHTML);
        if (!isNaN(res)) {
            bsp += res;
            var naz = BSP[i].parentElement.children[1].innerHTML;
            zak_pasiva[naz] = res;
        }
    });
    //////////////////////////////////////////////////////////////////////	
    var zakljuni_racuni = [];
    zakljuni_racuni.push({
        naziv: 'Rashodi i prihodi',
        osb: {
            d: {},
            p: {},
            ra: true,
            ru: false
        }
    });
    zakljuni_racuni.push({
        naziv: 'Dobitak/Gubitak',
        osb: {
            d: {},
            p: {},
            ra: true,
            ru: false
        }
    });


    var _1a = {
        rb: index0 + 'a',
        dok: 'zakljucak'
    };
    var o = {};

    var bud = 0;
    var BUD = $('#zakljucni_list tbody tr td:nth-child(9)');
    BUD.each(i => {
        var res = parseInt(BUD[i].innerHTML);
        if (!isNaN(res)) {
            bud += res
            var naz = BUD[i].parentElement.children[1].innerHTML;
            o[naziv] = res;
        }
    });
    _1a.pas = o;
    _1a.akt = {
        'Rashodi i prihodi': bud
    };
    /////////////////////////////////////////////////////////////////////	
    var _1b = {
        rb: index0 + 'b',
        dok: 'zakljucak'
    };
    var o = {};
    var bup = 0;
    var BUP = $('#zakljucni_list tbody tr td:nth-child(10)');
    BUP.each(i => {
        var res = parseInt(BUP[i].innerHTML);
        if (!isNaN(res)) {
            bup += res;
            var naz = BUP[i].parentElement.children[1].innerHTML;
            o[naziv] = res;
        }
    });
    _1b.akt = o;
    _1b.pas = {
        'Rashodi i prihodi': bup
    };
    ///////////////////////////////////////////////////////////////////////	
    var lastRow = `<tr><td style = 'visibility:collapse;'></td><td style = 'visibility:collapse;' colspan=3></td><td>${pd}</td><td>${pp}</td><td>${sd}</td><td>${sp}</td> <td>${bsd}</td><td>${bsp}</td> <td>${bud}</td><td>${bup}</td></tr>`
    pl.append(lastRow);

    var dob, gub, naziv;
    index++;

    var _1c = {
        rb: index0 + 'c',
        dok: 'zakljucak'
    };
    var _1d = {
        rb: index0 + 'd',
        dok: 'zakljucak'
    };
    var rez = bup - bud;

    if (rez > 0) {
        _1c.akt = {
            'Rashodi i prihodi': rez
        };
        _1c.pas = {
            'Dobitak/Gubitak': rez
        };

        _1d.akt = {
            'Dobitak/Gubitak': rez
        };
        _1d.pas = {
            'Nerasporedjena dobit t-godine': rez
        };

        zak_pasiva['Nerasporedjena dobit t-godine'] = rez;
        zakljuni_racuni.push({
            naziv: 'Nerasporedjena dobit t-godine',
            osb: {
                d: {},
                p: {},
                ra: false,
                ru: false
            }
        });

        dob = rez;
        gub = '';
        naziv = 'Dobitak';
    } else if (rez == 0) {
        _1c.akt = {
            'Rashodi i prihodi': rez
        };
        _1c.pas = {
            'Dobitak/Gubitak': rez
        };

        _1d.akt = {
            'Dobitak/Gubitak': rez
        };
        _1d.pas = {
            'Nerasporedjena dobit t-godine': rez
        };

        zak_pasiva['Nerasporedjena dobit t-godine'] = rez;
        zakljuni_racuni.push({
            naziv: 'Nerasporedjena dobit t-godine',
            osb: {
                d: {},
                p: {},
                ra: false,
                ru: false
            }
        });

        dob = 0;
        gub = 0;
        naziv = 'Dobitak';
    } else {
        dob = '';
        gub = Math.abs(rez);
        naziv = 'Gubitak';
        _1c.pas = {
            'Rashodi i prihodi': gub
        };
        _1c.akt = {
            'Dobitak/Gubitak': gub
        };

        _1d.pas = {
            'Dobitak/Gubitak': rez
        };
        _1d.akt = {
            'Gubitak t-godine': rez
        };

        zak_pasiva['Gubitak t-godine'] = rez;

        zakljuni_racuni.push({
            naziv: 'Gubitak t-godine',
            osb: {
                d: {},
                p: {},
                ra: false,
                ru: false
            }
        });
    }

    var dob_gub_Row = `<tr><td>${index}</td><td colspan=3>${naziv}</td><td> </td><td> </td><td> </td><td> </td> <td>${gub}</td><td>${dob}</td> <td>${dob}</td><td>${gub}</td></tr>`
    pl.append(dob_gub_Row);

    var bsd1 = bsd + gub;
    var bsp1 = bsp + dob;
    var bud1 = bud + dob;
    var bup1 = bup + gub;

    var lastRowFinal = `<tr><td style = 'visibility:collapse;'></td><td style = 'visibility:collapse;' colspan=3></td><td></td><td></td><td></td><td></td> <td>${bsd1}</td><td>${bsp1}</td> <td>${bud1}</td><td>${bup1}</td></tr>`
    pl.append(lastRowFinal);

    index0++;

    var _2a = {
        rb: index0 + 'a',
        dok: 'zakljucak'
    };
    _2a.akt = {
        'Racun izravnanja': bsd1
    }
    _2a.pas = zak_aktiva;

    var _2b = {
        rb: index0 + 'b',
        dok: 'zakljucak'
    };
    _2b.pas = {
        'Racun izravnanja': bsp1
    }
    _2b.akt = zak_pasiva;

    zakljuni_racuni.push({
        naziv: 'Racun izravnanja',
        osb: {
            d: {},
            p: {},
            ra: true,
            ru: false
        }
    });

    $('#zakljucni_list_sum')[0].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    $('#zakljucni_list_sum').attr('open', true);
    if ((pd == pp) && (sp == sd)) {
        if (e)
            e.nextElementSibling.removeAttribute('disabled');

        return [_1a, _1b, _1c, _1d, _2a, _2b, zakljuni_racuni];
    } else {
        return null;
    }
}

function sum(obj) {
    if (Object.keys(obj).length === 0) return 0;

    var result = 0;
    for (var i in obj)
        result += parseInt(obj[i]);

    return result;
}

function zakljuci_poslovne_knjige() {
    var g = $('#dropdownYear').val();

    var arr = popuni_zakljucni_list();
    if (!arr.length) return;

    var arr1 = arr.pop();

    if (arr1.length) dodaj_zakljucne_racune(arr1);

    if (arr.length)
        preduzece[g].dnevnik = preduzece[g].dnevnik.concat(arr);

    preduzece[g].zakljuceno = true;

    popuni_dnevnik();
    koriguj_racune();
    popuni_glavnu_knjigu();

    pripremi_bu(arr.slice(0, 3));
    pripremi_bs(arr.slice(3, 6));

    $('#v-pills-check-tab').addClass('disabled');
    $('#v-pills-result-tab').removeClass('disabled');

    popuni_finansijske_iskaze();

    $('#v-pills-result-tab').click();
    update_db();

}

function dodaj_zakljucne_racune(a) {

    //{naziv:'Racun izravnanja',osb:{d:{},p:{},ra:true,ru:false}});

    var g = $('#dropdownYear').val();

    for (var i in a) {
        var naz = a[i].naziv;
        var osb = a[i].osb;
        preduzece[g].racuni[naz] = osb;
    }

}

function pripremi_bu(arr) {
    var g = $('#dropdownYear').val();
    var bu = {};

    bu.prihodi = {};
    bu.rashodi = {};

    bu.rashodi.ukupno = 0;
    bu.prihodi.ukupno = 0;

    var ras = arr[0];
    bu.rashodi = ras.pas;
    bu.rashodi.ukupno = ras.akt['Rashodi i prihodi'];

    var prih = arr[1];
    bu.prihodi = prih.akt;
    bu.prihodi.ukupno = prih.pas['Rashodi i prihodi'];

    var dob_gub = arr[2];

    if ('Dobitak/Gubitak' in dob_gub.akt) {
        bu.prihodi['Finansijski rezultat (gubtiak)'] = dob_gub.akt['Dobitak/Gubitak'];
        bu.prihodi.ukupno += parseInt(dob_gub.akt['Dobitak/Gubitak']);
    } else {

        bu.rashodi['Finansijski rezultat (dobitak)'] = dob_gub.pas['Dobitak/Gubitak'];
        bu.rashodi.ukupno += parseInt(dob_gub.pas['Dobitak/Gubitak']);

    }

    preduzece[g].bilans_uspjeha = bu;

};

function pripremi_bs(arr) {
    var g = $('#dropdownYear').val();
    var bs = {};

    var o = arr[0];
    var akt = arr[1];

    bs.akt = arr[1].akt['Racun izravnanja'];
    bs.aktiva = 0;
    bs._aktiva = arr[1].pas;

    bs.pas = arr[2].pas['Racun izravnanja'];
    bs.pasiva = 0;
    bs._pasiva = arr[2].akt;

    if ("Nerasporedjena dobit t-godine" in o.akt) {
        bs._pasiva["Nerasporedjena dobit t-godine"] = o.akt["Nerasporedjena dobit t-godine"];
    } else if ("Nerasporedjena dobit t-godine" in o.pas) {
        bs._pasiva["Nerasporedjena dobit t-godine"] = o.pas["Nerasporedjena dobit t-godine"];
    } else if ('Gubitak t-godine' in o.akt) {
        bs._pasiva["Gubitak t-godine"] = o.akt["Gubitak t-godine"];
    } else {
        bs._pasiva["Gubitak t-godine"] = o.pas["Gubitak t-godine"];
    }

    console.log(bs);

    if ('Gubitak prethodnog perioda' in bs._aktiva) {
        bs._pasiva['Gubitak prethodnog perioda'] = bs._aktiva['Gubitak prethodnog perioda'];
        delete bs._aktiva['Gubitak prethodnog perioda'];
    }

    bs.osnovna_sredstva = {};
    bs.osnovna_sredstva.ukupno = 0;
    for (var i in bs._aktiva) {
        if (osnovna_sredstva_niz.includes(i)) {
            bs.osnovna_sredstva.ukupno += (i == 'IVOS') ? -parseInt(bs._aktiva[i]) : parseInt(bs._aktiva[i]);
            bs.osnovna_sredstva[i] = bs._aktiva[i];
        }
    }

    bs.obrtna_sredstva = {};
    bs.obrtna_sredstva.ukupno = 0;
    for (var i in bs._aktiva) {
        if (obrtna_sredstva_niz.includes(i)) {
            bs.obrtna_sredstva.ukupno += (i == 'I.V. mjeničnih potraživanja') ? -parseInt(bs._aktiva[i]) : parseInt(bs._aktiva[i]);
            bs.obrtna_sredstva[i] = bs._aktiva[i];
        }
    }

    bs.kapital = {};
    bs.kapital.ukupno = 0;
    for (var i in bs._pasiva) {
        if (kapital_niz.includes(i) || i == 'Nerasporedjena dobit t-godine') {
            bs.kapital.ukupno += (i == 'Gubitak t-godine' || i == 'Gubitak prethodnog perioda') ? -parseInt(bs._pasiva[i]) : parseInt(bs._pasiva[i]);
            bs.kapital[i] = bs._pasiva[i];
        }
    }

    bs.obaveze = {};
    bs.obaveze.ukupno = 0;
    for (var i in bs._pasiva) {
        if (obaveze_niz.includes(i)) {
            bs.obaveze.ukupno += (i == 'I.V. mjeničnih obaveza') ? -parseInt(bs._pasiva[i]) : parseInt(bs._pasiva[i]);
            bs.obaveze[i] = bs._pasiva[i];
        }
    }

    bs.aktiva = bs.osnovna_sredstva.ukupno + bs.obrtna_sredstva.ukupno;
    bs.pasiva = bs.kapital.ukupno + bs.obaveze.ukupno;

    preduzece[g].bilans_stanja = bs;

}

function popuni_finansijske_iskaze() {
    popuni_bilans_stanja();
    popuni_bilans_uspjeha();

}

function popuni_bilans_stanja() {
    var godina = $('#dropdownYear').val();
    var obj = preduzece[godina].bilans_stanja;

    $('#bilans_stanja_godina').html(godina);

    $('#bilans_stanja #osnovna_sredstva').html('');
    $('#bilans_stanja #obrtna_sredstva').html('');
    $('#bilans_stanja #kapital').html('');
    $('#bilans_stanja #obaveze').html('');

    for (var i in obj.osnovna_sredstva) {
        if ((i == 'ukupno') || (i == undefined) || (obj.osnovna_sredstva[i] == undefined)) continue;

        var val = obj.osnovna_sredstva[i];
        if (i.includes('IVOS')) val = '( ' + val + ' )';

        $('#bilans_stanja #osnovna_sredstva').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.obrtna_sredstva) {
        if ((i == 'ukupno') || (i == undefined) || (obj.obrtna_sredstva[i] == undefined)) continue;

        var val = obj.obrtna_sredstva[i];
        if (i.includes('I.V. mjeničnih potraživanja')) val = '( ' + val + ' )';

        $('#bilans_stanja #obrtna_sredstva').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.kapital) {
        if ((i == 'ukupno') || (i == undefined) || (obj.kapital[i] == undefined)) continue;

        var val = obj.kapital[i];
        if (i.includes('Gubitak prethodnog perioda')) val = '( ' + val + ' )';

        $('#bilans_stanja #kapital').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.obaveze) {
        if ((i == 'ukupno') || (i == undefined) || (obj.obaveze[i] == undefined)) continue;

        var val = obj.obaveze[i];
        if (i.includes('I.V. mjeničnih obaveza')) val = '( ' + val + ' )';

        $('#bilans_stanja #obaveze').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    $('#bilans_stanja').append(`<tr><th>Σ:${obj.aktiva}</th><th class = 'text-right'>Σ:${obj.pasiva}</th></tr>`);

    $('#sacuvaj_bilans_stanja').addClass('d-none');
    $('#stampaj_bilans_stanja').removeAttr('hidden');

    $('#bilans_stanja').removeClass('a');
    $('#bilans_stanja').addClass('b');

}

function popuni_bilans_uspjeha() {

    var godina = $('#dropdownYear').val();
    var obj = preduzece[godina].bilans_uspjeha;

    $('#bilans_uspjeha_godina').html(godina);

    $('#bilans_uspjeha').removeClass('a');
    $('#bilans_uspjeha').addClass('b');

    $('#bilans_uspjeha #rashodi').html('');
    $('#bilans_uspjeha #prihodi').html('');

    for (var i in obj.rashodi) {
        if ((i == 'ukupno') || (i == undefined) || (obj.rashodi[i] == undefined)) continue;

        var val = obj.rashodi[i];

        $('#bilans_uspjeha #rashodi').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }

    for (var i in obj.prihodi) {
        if ((i == 'ukupno') || (i == undefined) || (obj.prihodi[i] == undefined)) continue;

        var val = obj.prihodi[i];

        $('#bilans_uspjeha #prihodi').append(`<tr><td>${i}</td><td>${val}</td></tr>`);
    }


    $('#bilans_uspjeha').append(`<tr><th>Σ:${obj.rashodi.ukupno}</th><th class = 'text-right'>Σ:${obj.prihodi.ukupno}</th></tr>`);

    $('#stampaj_bilans_uspjeha').removeAttr('hidden');

}


function search() {

    var g = $('#dropdownYear').val();
    var list = $('#glavna_knjiga #naziv').toArray();
    list = list.slice(1, list.length);

    var userinput = document.getElementById("pretraga").value;

    if (!userinput.replace(/\s+/g, '')) {
        alert('Nepravilan unos!');
        return;
    }

    userinput = userinput.toLowerCase();
    var count = list.length,
        html, flag = false,
        matches = [],
        stringMatches = [];

    while (count--) {
        html = list[count].innerHTML.toLowerCase();

        if (-1 < html.indexOf(userinput)) {
            flag = true;
            matches.push(list[count]);
            stringMatches.push(list[count].innerHTML.toLowerCase());
        }
    }

    userinput.value = '';

    if (!flag) {
        alert('Nema pronadjenih rezultata !');
    } else {
        $('#v-pills-settings-tab').click();
        var prvi = matches[0];

        prvi.scrollIntoView(true);
        console.log(prvi);

    }

}



function PrintElem(elem, title) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    /* mywindow.document.write('<link rel="stylesheet" media="print" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css">');
    mywindow.document.write('<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>');
	mywindow.document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>');
	mywindow.document.write('<link media="print" rel="stylesheet" href="./css/style.css">'); */
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus();

    mywindow.print();
    mywindow.close();

    return true;
}


function postavi_statistiku() {

    ispuni_pitu_pocetni_bilans();
    ispuni_imovina_line();
    ispuni_bilans_line();
}

function ispuni_pitu_pocetni_bilans() {

    var g = $('#dropdownYear').val();
    var canvas = document.getElementById('pocetni_bilans_pita');
    var ctx = canvas.getContext('2d');

    var obj;
    if (preduzece[g].bilans_stanja) obj = preduzece[g].bilans_stanja;
    else obj = preduzece[g].pocetni_bilans;

    //if(!obj)return;

    var os = obj ? obj.osnovna_sredstva.ukupno : 0;
    var obs = obj ? obj.obrtna_sredstva.ukupno : 0;
    var kap = obj ? obj.kapital.ukupno : 0;
    var obav = obj ? obj.obaveze.ukupno : 0;

    var data = {
        datasets: [{
            data: [os, obs, kap, obav],
            backgroundColor: [
                'blue',
                'yellow',
                'green',
                'red'
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Osnovna sredstva',
            'Obrtna sredstva',
            'Kapital',
            'Obaveze'
        ]

    };

    var options = {
        responsive: true,
        title: {
            display: true,
            text: 'Struktura pasive ' + g
        }
    };

    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    })

}

function vrati_godine() {
    var god = [];
    for (var i in preduzece)
        if (!isNaN(parseInt(i))) god.push(parseInt(i));

    return god;
}


function ispuni_imovina_line() {

    var g = $('#dropdownYear').val();
    var canvas = document.getElementById('imovina_line');
    var ctx = canvas.getContext('2d');

    var godine = vrati_godine();

    var kapital = godine.map((e, i) => {
        return preduzece[e].pocetni_bilans ? preduzece[e].pocetni_bilans.kapital.ukupno : 0;
    });

    var obaveze = godine.map((e, i) => {
        return preduzece[e].pocetni_bilans ? preduzece[e].pocetni_bilans.obaveze.ukupno : 0;
    });

    var imovina = godine.map((e, i) => {
        return preduzece[e].pocetni_bilans ? preduzece[e].pocetni_bilans.aktiva : 0;
    });

    var config = {
        type: 'line',
        data: {
            labels: godine,
            datasets: [{
                label: 'Kapital',
                backgroundColor: 'green',
                borderColor: 'green',
                data: kapital,
                fill: false,
                lineTension: 0.5
            }, {
                label: 'Obaveze',
                fill: false,
                backgroundColor: 'red',
                borderColor: 'red',
                data: obaveze
            }, {
                label: 'Imovina',
                fill: false,
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: imovina
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Imovina preduzeca'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                x: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Godina'
                    }
                },
                y: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Vrijednost'
                    }
                }
            }
        }
    };

    var line = new Chart(ctx, config);
}

function ispuni_bilans_line() {

    var g = $('#dropdownYear').val();
    var canvas = document.getElementById('bilans_line');
    var ctx = canvas.getContext('2d');

    var godine = vrati_godine();

    var prihodi = godine.map((e, i) => {
        return preduzece[e].bilans_uspjeha ? preduzece[e].bilans_uspjeha.prihodi.ukupno : 0;
    });

    var rashodi = godine.map((e, i) => {
        return preduzece[e].bilans_uspjeha ? preduzece[e].bilans_uspjeha.rashodi.ukupno : 0;
    });

    var rezultat = godine.map((e, i) => {
        return preduzece[e].bilans_uspjeha ? (preduzece[e].bilans_uspjeha.prihodi.ukupno - preduzece[e].bilans_uspjeha.rashodi.ukupno) : 0;
    });

    var config = {
        type: 'line',
        data: {
            labels: godine,
            datasets: [{
                label: 'Prihodi',
                backgroundColor: 'blue',
                borderColor: 'blue',
                data: prihodi,
                fill: false,
                lineTension: 0
            }, {
                label: 'Rashodi',
                fill: false,
                backgroundColor: 'red',
                borderColor: 'red',
                data: rashodi,
                lineTension: 0
            }, {
                label: 'Finansijski rezultat',
                fill: false,
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: rezultat,
                lineTension: 0
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Bilans preduzeca'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                x: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Godina'
                    }
                },
                y: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Vrijednost'
                    }
                }
            }
        }
    };

    var line = new Chart(ctx, config);
}