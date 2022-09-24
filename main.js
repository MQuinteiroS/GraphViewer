let pos = [];
let currentPosMin = [];
let currentPosMax = [];
let axes = 0;
var c = document.getElementById('myCanvas');
var img = new Image();
var ctx = c.getContext('2d');
let magicNumb = document.getElementById('inputFile').offsetHeight + document.getElementById('navBar').offsetHeight + 20;

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
	$('#exampleModal').modal('hide');
	await new Promise(r => setTimeout(r, 500));
	document.addEventListener('click', function(event){
		currentPosMin = [event.clientX, event.clientY - magicNumb];
		$('#exampleModal').modal('show');
		document.getElementById('valMinVal').textContent = JSON.stringify(currentPosMin);
		this.removeEventListener('click', arguments.callee);
	});
});

document.getElementById('valMaxBtn').addEventListener('click', async function(){
	$('#exampleModal').modal('hide');
	await new Promise(r => setTimeout(r, 500));
	document.addEventListener('click', function(event){
		currentPosMax = [event.clientX, event.clientY - magicNumb];
		$('#exampleModal').modal('show');
		document.getElementById('valMaxVal').textContent = JSON.stringify(currentPosMax);
		this.removeEventListener('click', arguments.callee);
	});
});

document.getElementById('save').addEventListener('click', async function(){
	let name = document.getElementById('titleAxis').value;
	let color = (axes == 0) ? 'blue' : 'purple';
	// let color = document.getElementById('colorAxis').value;
	let minValue = document.getElementById('valMin').value;
	let maxValue = document.getElementById('valMax').value;
	pos[axes] = {
		name: name,
		color: color,
		minValue: minValue,
		maxValue: maxValue,
		posMin: currentPosMin,
		posMax: currentPosMax
	}
	createAxis(currentPosMax[0], currentPosMax[1], color, 5)
	createAxis(currentPosMin[0], currentPosMin[1], color, 5)
	document.getElementById('titleAxis').value = '';
	// document.getElementById('colorAxis').value = '';
	document.getElementById('valMin').value = '';
	document.getElementById('valMax').value = '';
	document.getElementById('valMinVal').textContent = '';
	document.getElementById('valMaxVal').textContent = '';
	$('#exampleModal').modal('hide');
	createInput();
	axes += 1;
});

document.addEventListener('click', function(event){
	let element = event.target;
	if(element.id == 'submitLine' && axes === 2){
		drawLine();
	}
})

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
	if(axes == 1){
		outerDiv = document.getElementById('form');
	}
	else{
		outerDiv = document.createElement('div');
	}
	let div = document.createElement('div');
	let label = document.createElement('label');
	let input = document.createElement('input');
	label.textContent = pos[axes].name;
	label.style['font-weight'] = 'bold';
	label.style['font-size'] = '25px';
	input.min = pos[axes].minValue;
	input.max = pos[axes].maxValue;
	input.value = pos[axes].minValue;
	input.style['margin-bottom'] = '15px';
	input.id = pos[axes].name + 'InputLabel';
	div.innerHTML = label.outerHTML;
	div.innerHTML += '<br>' + input.outerHTML;
	if(axes == 1){
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
	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1000*img.width/img.height, 1000);
	let currentPoss = []
	pos.forEach(x => {
		let value = document.getElementById(x.name + 'InputLabel').value;
		let constantX = (x.posMin[0] - x.posMax[0])/(x.minValue - x.maxValue)
		let constantY = (x.posMin[1] - x.posMax[1])/(x.minValue - x.maxValue)
		let currnetPosX = constantX*value + x.posMax[0] - x.maxValue*constantX
		let currnetPosY = constantY*value + x.posMax[1] - x.maxValue*constantY
		currentPoss.push([currnetPosX, currnetPosY]);
	})
	ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
	ctx.beginPath();
    ctx.moveTo(currentPoss[0][0], currentPoss[0][1]);
    ctx.lineTo(currentPoss[1][0], currentPoss[1][1]);
	createAxis(currentPoss[0][0], currentPoss[0][1], pos[0].color, 7)
	createAxis(currentPoss[1][0], currentPoss[1][1], pos[1].color, 7)
    ctx.stroke();
}