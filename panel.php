<?php

session_start();

require 'database.php';

if( isset($_SESSION['user_id']) ){

	$records = $conn->prepare('SELECT id,email,password,json FROM users WHERE id = :id');
	$records->bindParam(':id', $_SESSION['user_id']);
	$records->execute();
	$results = $records->fetch(PDO::FETCH_ASSOC);

	if( count($results) > 0){
		$json = $results['json'];
		$email = $results['email'];
		
		if(!isset($json))$json = null;
	}
	
}else{
	
	header('Location: /');
}

?>

<html>
<head>
	<title>Knjigovodstveni sistem</title>
	
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css">
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="./css/style.css">
  <link rel="icon" href="./data/icon.svg">
  
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>

</head>
<body>
	<script>
	var json = '<?php echo $json;  ?>';
	var email = '<?php echo $email;  ?>';
	</script>
	<nav class="navbar navbar-expand-lg navbar-light bg-light" >
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <a class="navbar-brand" href="#">
  <img style="max-width:30px; margin-top: -7px;" src="./data/icon.svg">
  Knjigovodstveni sistem
  </a>

  <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <li class="nav-item active">
        <a class="nav-link" id = 'naziv_preduzeca' href="#"></a>
      </li>
	  
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Poslova godina</a>
      </li>
	   <form class="form-inline my-2 my-lg-0">
	   <select name="select" class="form-control custom-select mr-sm-2" id="dropdownYear" style="width: 120px;" ></select>
		<button onclick = 'obrisi_podatke();' class="btn btn-primary my-2 my-sm-0" type="button"> <i class="fa fa-trash"></i></button>
		</form>
    </ul>
    <form  onsubmit = 'event.preventDefault();search();' class="form-inline my-2 my-lg-0">
      <input id = 'pretraga' class="form-control mr-sm-2" type="search" placeholder="Pretrazi racun" aria-label="Search">
      <button onclick = 'search' class="btn btn-outline-success my-2 my-sm-0" type="button">🔍</button>
    </form>
	
	<form name = 'logout' action = './logout.php' class="form-inline ml-2 my-lg-0 mx-1 nav-right">
      <button class="btn btn-primary my-2 my-sm-0" type="submit"> <i class="fa fa-sign-out"></i></button>
    </form>
  </div>
</nav>

    <div class="container-fluid py-4">

        <div class="row">
		
		  <div class="col-md-3">
                <!-- Tabs nav -->
                <div class="nav flex-column nav-pills nav-pills-custom" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link mb-3 p-3 shadow active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">
                        <i class="fa fa-user-circle-o mr-2"></i>
                        <span class="font-weight-bold small text-uppercase">Informacije o preduzecu</span></a>

                    <a class="nav-link mb-3 p-3 shadow" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                        <i class="fa fa-calendar-minus-o mr-2"></i>
                        <span class="font-weight-bold small text-uppercase">Pocetni bilans</span></a>

                    <a class="nav-link mb-3 p-3 shadow disabled " id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">
                        <i class="fa fa-list mr-2"></i>
                        <span class="font-weight-bold small text-uppercase">Dnevnik</span></a>

                    <a class="nav-link mb-3 p-3 shadow disabled" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                        <i class="fa fa-book mr-2"></i>
                        <span class="font-weight-bold small text-uppercase">Glavna Kniga</span></a>
                    
					<a class="nav-link mb-3 p-3 shadow disabled" id="v-pills-check-tab" data-toggle="pill" href="#v-pills-check" role="tab" aria-controls="v-pills-check" aria-selected="false">
                        <i class="fa fa-check mr-2"></i>
                        <span class="font-weight-bold small text-uppercase">Predzakljucna knjizenja</span></a>
						
						<a class="nav-link mb-3 p-3 shadow disabled" id="v-pills-result-tab" data-toggle="pill" href="#v-pills-result" role="tab" aria-controls="v-pills-result" aria-selected="false">
                        <i class="fa fa-balance-scale mr-2"></i>
                        <span class="font-weight-bold small text-uppercase">Finansijski iskazi</span></a>
					</div>
            </div>
	
	<div class="col-md-9">
                <!-- Tabs content -->
                <div class="tab-content" id="v-pills-tabContent">
                    
					<div class="tab-pane fade shadow rounded bg-white show active p-5" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                      		  
						<div class="container-fluid h-75">
						
						  <div class="row">
							<div class="col-md-2 img">
							  <img id = 'logo' src="./data/prazna_slika.svg"  style='width:100%;height:auto;' class="img-rounded">
							</div>
							<div class="col-md-5 details">
							  <blockquote>
								<h4 id = 'naziv'>Fiona Gallagher</h4>
								<small><cite id = 'adresa' ></cite>, <cite id = 'sjediste' ></cite> 🗺️</small>
							  </blockquote>
							 <p class='my-1'><b>✉️</b><span id = 'mejl'></span></p>
							</div>
							<div class="col-md-5">
									<canvas id="pocetni_bilans_pita"></canvas>
							</div>
						  </div>
						  <div class="row my-5">
								
									
								  <div class="col-md-6">
									<canvas id="imovina_line"></canvas>
								  </div>
								  
								  <div class="col-md-6">
									<canvas id="bilans_line"></canvas>
								  </div>
							</div>
							 
						</div>	
					</div>
                 
                    <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                        <h4 class="font-italic mb-4 text-center">Pocetni bilans na dan 01-01-<time id = 'pocetni_bilans_godina' ><time></h4>                 
						<form id = 'pocetni_bilans_forma'>
						<table id = 'pocetni_bilans' class = 'table table-bordered a' >
							<tr><th>Aktiva</th><th class = 'text-right'>Pasiva</th></tr>						
							<tr><td>
							<em>Osnovna sredstva</em>
							<table id = 'osnovna_sredstva' class = ''>
							<tr><td><button  type = 'button' onclick = 'dodaj_racun(event)' class = 'btn-sm mr-1'>➕</button></td></tr>
							</table>
							</td>

							<td>
							<em>Kapital</em>
							<table id = 'kapital' class = ''>
							<tr><td><button type = 'button' onclick = 'dodaj_racun(event)' class = 'mr-1'>➕</button></td></tr>
							</table>
							</td>

							</tr>

							<tr><td>
							<em>Obrtna sredstva</em>
							<table id = 'obrtna_sredstva' class = ''>
							<tr><td><button type = 'button' onclick = 'dodaj_racun(event)' class = 'mr-1'>➕</button></td></tr>
							</table>
							</td>

							<td>
							<em>Obaveze</em>
							<table id = 'obaveze' class = ''>
							<tr><td><button type = 'button' onclick = 'dodaj_racun(event)' class = 'mr-1'>➕</button></td></tr>
							</table>
							</td>

							</tr>
						</table>
						
						<div>
                            <button id = 'sacuvaj_pocetni_bilans' type="submit" class="btn btn-success float-right">
                                Sacuvaj
                            </button>
							 <button hidden onclick = 'PrintElem("pocetni_bilans")' id = 'stampaj_pocetni_bilans' type="button" class="btn btn-outline-primary float-right">
                                🖨️
                            </button>
                        </div>
						</form>
                    </div>
                    
                    <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                        <h4 class="font-italic mb-4 text-center">Dnevnik I-stepena</h4>
                    
					<details>
					<summary>Istorija knizenja</summary>
					<table hidden class = 'mb-5 table table-bordered' id = 'popunjeni_dnevnik'>
					    <tr><th colspan=6>Dnevnik glavne knjige</th></tr>
					    <tr>
					    <th rowspan=2>Rb</th>
					    <th rowspan=2 colspan=3>Opis</th>
					    <th colspan=2>Promet</th>
					    </tr>
					    <tr>
					  
					    <th>Duguje</th>
					    <th>Potrazuje</th>
					    </tr>
					 </table>
					</details>
					
					<form id = 'dnevnik_forma'> 
					 
						<table id = 'dnevnik' class = 'table-bordered' >
					    <tr><th colspan=6>Dnevnik glavne knjige</th></tr>
					    <tr>
					    <th rowspan=2>Rb</th>
					    <th rowspan=2 colspan=3>Opis</th>
					    <th colspan=2>Promet</th>
					    </tr>
					    <tr>
					  
					    <th>Duguje</th>
					    <th>Potrazuje</th>
					    </tr>
					    </table>
					   
					   <button type = 'button' onclick = 'dodaj_vrstu(false)' class = 'm-1'>➕</button>
					   <button type = 'button' onclick = 'dodaj_vrstu(true)' class = 'm-1'>➗</button>
					   <button type = 'button' onclick = 'oduzmi_vrstu(event)' class = 'm-1'>🗑️</button>
					   <button type = 'submit' onclick = 'sacuvaj_dodato(event)' class = 'float-right m-1'>💾</button>
                    </form>
					</div>
                    
                    <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
						<h4 class="font-italic mb-4 text-center">Glavna kniga I-stepena</h4>
                       
						
						<div id = 'glavna_knjiga'>
						<div hidden id = 'konto'  style = 'flex-basis:250px;' class = 'container w-50 mx-1 my-5'>
							<div class = 'row border-bottom' >
								<div class = 'col-2 text-left'>D</div>
								<div id = 'naziv' class = 'col-8 text-center nowarp'>Racun</div>
								<div class = 'col-2 text-right'>P</div>
							</div>
							<div class = 'row' style = 'min-height:65px;'>
								<div id = 'd' class = 'col-6 border-right text-left'></div>
								<div id = 'p' class = 'col-6 border-left text-right'></div>
							</div>		 
						</div>
						
						</div>
					</div>
					
					
					
                    <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-check" role="tabpanel" aria-labelledby="v-pills-check-tab">
                       <h4 class="font-italic mb-4">Predzakljucna knjizenja</h4>
					   <button id = 'sacuvaj_pocetni_bilans' onclick = 'popuni_probni_list(this)' type="button" class="">
                            Probni list(bilans)
                        </button>
						<button id = 'sacuvaj_pocetni_bilans' onclick = 'popuni_zakljucni_list(this)' type="button" disabled>
                            Zakljucni list
                        </button>
						<button id = 'sacuvaj_pocetni_bilans' onclick = 'zakljuci_poslovne_knjige()' type="button" disabled >
                           Zakljenje poslovnih kniga
                        </button>
						
						<details id = 'probni_list_sum'>
							<summary>Probni list</summary>
							<table hidden  class = 'mb-5 table-bordered' id = 'probni_list'>
								<tr><th colspan=8>Probni list</th></tr>
								<tr>
								<th rowspan=2>Rb</th>
								<th rowspan=2 colspan=3>Naziv racuna</th>
								<th colspan=2>Promet</th>
								<th colspan=2>Saldo</th>
								</tr>
								<tr>
							  
								<th>Duguje</th>
								<th>Potrazuje</th>
								<th>Duguje</th>
								<th>Potrazuje</th>
								</tr>
							</table>
						</details>
						
						<details id = 'zakljucni_list_sum'>
							<summary>Zakljucni list</summary>
							<table hidden class = 'mb-5 table-bordered' id = 'zakljucni_list'>
								<tr><th colspan=12>Zakljucni list</th></tr>
								<tr>
								<th rowspan=2>Rb</th>
								<th rowspan=2 colspan=3>Naziv racuna</th>
								<th colspan=2>Promet</th>
								<th colspan=2>Saldo</th>
								<th colspan=2>BS</th>
								<th colspan=2>BU</th>
								</tr>
								<tr>
							  
								<th>D</th>
								<th>P</th>
								<th>D</th>
								<th>P</th>
								
								<th>A</th>
								<th>P</th>
								<th>R</th>
								<th>P</th>
								</tr>
							</table>
						</details>
					
                    </div>
					
					 <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-result" role="tabpanel" aria-labelledby="v-pills-result-tab">
                       <!--<h4 class="font-italic mb-4">Finansijski iskazi:</h4>-->
					   
					   <h4 class="font-italic mb-4 text-center">Bilans stanja na dan 31-12-<time id = 'bilans_stanja_godina' ><time></h4>
					   <table id = 'bilans_stanja' class = 'table table-bordered a' >
						<tr><th>Aktiva</th><th class = 'text-right'>Pasiva</th></tr>
						
						<tr><td>
						<em>Osnovna sredstva</em>
						<table id = 'osnovna_sredstva' class = ''>
						
						</table>
						</td>
						
						<td>
						<em>Kapital</em>
						<table id = 'kapital' class = ''>
						
						</table>
						</td>
						
						</tr>
						
						<tr><td>
						<em>Obrtna sredstva</em>
						<table id = 'obrtna_sredstva' class = ''>
						
						</table>
						</td>
						
						<td>
						<em>Obaveze</em>
						<table id = 'obaveze' class = ''>
						
						</table>
						</td>
						
						</tr>
						
						
						</table>
						
						<div>
                          
							 <button hidden onclick = 'PrintElem("bilans_stanja")' id = 'stampaj_bilans_stanja' type="button" class="btn btn-outline-primary float-right">
                                🖨️
                            </button>
                        </div>
						
						<br>
						
						<h4 class="font-italic my-5 text-center">Bilans uspjeha od 01.01 do 31.12-<time id = 'bilans_uspjeha_godina' ><time></h4>
					   <table id = 'bilans_uspjeha' class = 'table table-bordered a' >
						<tr><th>Rashodi</th><th class = 'text-right'>Prihodi</th></tr>
						
						<tr><td>
						<table id = 'rashodi' class = ''>
						
						</table>
						</td>
						
						<td>
						<table id = 'prihodi' class = '' >
						
						</table>
						</td>
						</tr>
						
						
						
						
						</table>
						
						<div>
                          
							 <button hidden onclick = 'PrintElem("bilans_uspjeha")' id = 'stampaj_bilans_uspjeha' type="button" class="btn btn-outline-primary float-right">
                                🖨️
                            </button>
                        </div>
                    </div>
					
            </div>
        </div>
    </div>
	
	
	<button id = 'prijavna_forma' hidden type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#prijavi_preduzece"></button>

	<!-- Modal HTML Markup -->
<div id="prijavi_preduzece" class="modal fade" data-keyboard="false" data-backdrop="static">
    <button id = 'zatvori_formu' hidden type="button"  data-dismiss="modal"></button>
	<div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Osnovni podaci</h2>
            </div>
            <div class="modal-body">            
                <form id = 'registracija_preduzeca' name = 'registracija' role="form" method="POST" action="">
                    <input type="hidden" name="_token" value="">
                    <div class="form-group">
                        <label class="control-label">Pun naziv</label>
                        <div>
                            <input type="text" class="form-control input-lg" placeholder = 'Naziv preduzeca' name="naziv" value="" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Adresa</label>
                        <div>
                            <input type="text" class="form-control input-lg" placeholder = 'Adresa' name="adresa" value="" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Sjediste</label>
                        <div>
                            <input type="text" class="form-control input-lg" name="sjediste" placeholder='Sjediste' required>
                        </div>
                    </div>
					
					 <div class="form-group">
					 <label class="control-label">Djelatnost</label>
                         <select name="djelatnost" class="form-control input-lg custom-select-sm">
							<option value="proizvodnja">Proizvodnja</option>
							<option value="prodaja">Prodaja</option>
						  </select>
                    </div>
					
                    <div class="form-group">
                        <label class="control-label">Logo</label>
                         <div class="custom-file">
							<input type="file" accept = 'Image/*' class="custom-file-input" name="logo" required>
							<label class="custom-file-label" for="customFile">Choose file</label>
						  </div>
                    </div>
					
					
                    <div class="form-group">
                        <div>
						 <button class="btn btn-primary float-right mx-1" type='button' onclick='document.forms["logout"].submit();'> Odustani</button>
                            <button type="submit" class="btn btn-success float-right">
                                Sacuvaj
                            </button>
							
                        </div>
                    </div>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
    
	
	<div  id = 'loading' class="modal fade bd-example-modal-lg" data-backdrop="static" data-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-sm">
        <div class="modal-content" style="width: 48px">
            <span class="fa fa-spinner fa-spin fa-3x"></span>
        </div>
    </div>
	</div>

<datalist id = 'datalist'></datalist>
<datalist id = 'knjig_dokumenta'></datalist>
<datalist id = 'lista_racuna'></datalist>
<datalist id = 'svi_racuni'></datalist>

	<script src="js/kontni_okvir.js"></script>
    <script src="js/app.js"></script>
</body>
</html>