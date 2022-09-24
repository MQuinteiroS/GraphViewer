let pos = [];
let currentPosMin = [];
let currentPosMax = [];
let axis = 0;
var c = document.getElementById('myCanvas');
var img = new Image();
var ctx = c.getContext('2d');
let magicNumb = document.getElementById('inputFile').offsetHeight + document.getElementById('navBar').offsetHeight + 20;

var languageObj = {
    'Português':{
        'navbarTitle': '<i class="fa fa-line-chart" aria-hidden="true"></i> Visualizador de Gráficos',
        'buttonNewAxis': 'Adicionar Eixo',
        'axisModalLabel': 'Adicionar Eixo',
        'titleAxisLabel': 'Nome',
        'valMinLabel': 'Valor Min',
        'valMinBtnLabel': 'Posição Min',
        'valMaxLabel': 'Valor Max',
        'valMaxBtnLabel': 'Posição Max',
        'close': 'Fechar',
        'save': 'Salvar',
        'languageSelect': 'Selecionar Idioma',
        'tooltipName': 'Nome do eixo selecionado',
        'tooltipValMin': 'Valor minimo',
        'tooltipValMinBtn': 'Posição do valor minimo.\nAperta com o mouse no local desejado',
        'tooltipValMax': 'Valor máximo',
        'tooltipValMaxBtn': 'Posição do valor máximo.\nAperta com o mouse no local desejado'
    },
    'English':{
        'navbarTitle': '<i class="fa fa-line-chart" aria-hidden="true"></i> Graph Viewer',
        'buttonNewAxis': 'Add Axis',
        'axisModalLabel': 'Add Axis',
        'titleAxisLabel': 'Name',
        'valMinLabel': 'Min Value',
        'valMinBtnLabel': 'Min Position',
        'valMaxLabel': 'Max Value',
        'valMaxBtnLabel': 'Max Position',
        'close': 'Close',
        'save': 'Save',
        'languageSelect': 'Language Select',
        'tooltipName': 'Name of the axis',
        'tooltipValMin': 'Minimal value of the axis',
        'tooltipValMinBtn': 'Position of the minimal value.\nClick with the mouse on the desired position',
        'tooltipValMax': 'Maximum value of the axis',
        'tooltipValMaxBtn': 'Position of the maximum value.\nClick with the mouse on the desired position'
    }
}

'use strict';

window.addEventListener('load', function() {
	document.querySelector('input[type="file"]').addEventListener('change', function() {
		if (this.files && this.files[0]) {
			img.onload = () => {
				URL.revokeObjectURL(img.src);  // no longer needed, free memory
				ctx.canvas.width = document.getElementById('columns1').offsetWidth;
				ctx.canvas.height = document.querySelector('body').offsetHeight - magicNumb - 10;
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.height*img.width/img.height, ctx.canvas.height);
			}

			img.src = URL.createObjectURL(this.files[0]); // set src to blob url
		}
	});
});

document.getElementById('valMinBtn').addEventListener('click', async function(){
	var img = document.getElementById('')
	$('#axisModal').modal('hide');
	await new Promise(r => setTimeout(r, 500));
	document.addEventListener('click', function(event){
		currentPosMin = [event.clientX, event.clientY - magicNumb];
		$('#axisModal').modal('show');
		document.getElementById('valMinVal').textContent = JSON.stringify(currentPosMin);
		this.removeEventListener('click', arguments.callee);
	});
});

document.getElementById('valMaxBtn').addEventListener('click', async function(){
	$('#axisModal').modal('hide');
	await new Promise(r => setTimeout(r, 500));
	document.addEventListener('click', function(event){
        currentPosMax = [event.clientX, event.clientY - magicNumb];
		$('#axisModal').modal('show');
		document.getElementById('valMaxVal').textContent = JSON.stringify(currentPosMax);
		this.removeEventListener('click', arguments.callee);
	});
});

document.getElementById('save').addEventListener('click', async function(){
	let name = document.getElementById('titleAxis').value;
	let color = (axis == 0) ? 'blue' : 'purple';
	let minValue = document.getElementById('valMin').value;
	let maxValue = document.getElementById('valMax').value;
	pos[axis] = {
		name: name,
		color: color,
		minValue: minValue.replace(',','.'),
		maxValue: maxValue.replace(',','.'),
		posMin: currentPosMin,
		posMax: currentPosMax
	}
	createAxis(currentPosMax[0], currentPosMax[1], color, 5);
	createAxis(currentPosMin[0], currentPosMin[1], color, 5);
	document.getElementById('titleAxis').value = '';
	document.getElementById('valMin').value = '';
	document.getElementById('valMax').value = '';
	document.getElementById('valMinVal').textContent = '';
	document.getElementById('valMaxVal').textContent = '';
	$('#axisModal').modal('hide');
	createInput();
	axis += 1;
});

document.addEventListener('click', function(event){
	let element = event.target;
	if(element.id == 'submitLine' && axis === 2){
		drawLine();
	}
});

function createAxis(posX, posY, color, size){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(posX, posY, size, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
}

function createInput(){
	let buttonSubmit = document.getElementById('buttonNewAxis').outerHTML;
	let outerDiv
	if(axis == 1){
		outerDiv = document.getElementById('form');
	}
	else{
		outerDiv = document.createElement('div');
	}
	let div = document.createElement('div');
	let label = document.createElement('label');
	let input = document.createElement('input');
	label.textContent = pos[axis].name;
	label.style['font-weight'] = 'bold';
	label.style['font-size'] = '25px';
	input.min = pos[axis].minValue;
	input.max = pos[axis].maxValue;
	input.value = pos[axis].minValue;
	input.style['margin-bottom'] = '15px';
	input.id = pos[axis].name + 'InputLabel';
	div.innerHTML = label.outerHTML;
	div.innerHTML += '<br>' + input.outerHTML;
	if(axis == 1){
		outerDiv.innerHTML = outerDiv.innerHTML.replace(buttonSubmit, '');
		outerDiv.innerHTML += div.outerHTML;
		outerDiv.innerHTML += `<button type="button" class="btn btn-primary" data-toggle="modal" id="submitLine" style="margin: 10px;">
		Plotar
		</button>`;
	}
	else{
		outerDiv.innerHTML = div.outerHTML;
		outerDiv.innerHTML += buttonSubmit;
	}
	document.getElementById('form').innerHTML = outerDiv.innerHTML;
}

function drawLine(){
	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.height*img.width/img.height, ctx.canvas.height);
	let currentPoss = []
	pos.forEach(x => {
		let value = document.getElementById(x.name + 'InputLabel').value;
		let constantX = (x.posMin[0] - x.posMax[0])/(x.minValue - x.maxValue)
		let constantY = (x.posMin[1] - x.posMax[1])/(x.minValue - x.maxValue)
        createAxis(x.posMax[0], x.posMax[1], x.color, 5);
        createAxis(x.posMin[0], x.posMin[1], x.color, 5);
		let currnetPosX = constantX*value + x.posMax[0] - x.maxValue*constantX
		let currnetPosY = constantY*value + x.posMax[1] - x.maxValue*constantY
		currentPoss.push([currnetPosX, currnetPosY]);
	})
	ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
	ctx.beginPath();
    ctx.moveTo(currentPoss[0][0], currentPoss[0][1]);
    ctx.lineTo(currentPoss[1][0], currentPoss[1][1]);
    ctx.stroke();
	createAxis(currentPoss[0][0], currentPoss[0][1], pos[0].color, 7)
	createAxis(currentPoss[1][0], currentPoss[1][1], pos[1].color, 7)
}


document.querySelector('.form-control').addEventListener('click', function(event){
    let element = event.target
    let currentLanguage = languageObj[element.value]
    Object.keys(currentLanguage).forEach(x => {
        let el = document.getElementById(x)
        if (x === 'navbarTitle'){
            el.innerHTML = currentLanguage[x]
        }
        else if(x.startsWith('tooltip')){
            console.log(x)
            el.title = currentLanguage[x]
        }
        else{
            el.textContent = currentLanguage[x]
        }
    })
});
