var SCREEN_WIDTH  = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mouseX        = 0
var mouseY        = 0;
var windowHalfX   = window.innerWidth / 2;
var windowHalfY   = window.innerHeight / 2;
var SEPARATION    = 200;
var AMOUNTX       = 10;
var AMOUNTY       = 10;
var camera, scene, renderer;
var stats = new Stats();

init();
animate();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

function init() {
	var container, separation = 100, amountX = 50, amountY = 50,
	particles, particle;
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 1000;
	scene = new THREE.Scene();
	renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );
	// particles
	var PI2 = Math.PI * 2;
	var material = new THREE.SpriteCanvasMaterial( {
		color: 0xffffff,
		program: function ( context ) {
			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();
		}
	} );
	for ( var i = 0; i < 1000; i ++ ) {
		particle = new THREE.Sprite( material );
		particle.position.x = Math.random() * 2 - 1;
		particle.position.y = Math.random() * 2 - 1;
		particle.position.z = Math.random() * 2 - 1;
		particle.position.normalize();
		particle.position.multiplyScalar( Math.random() * 10 + 450 );
		particle.scale.multiplyScalar( 2 );
		scene.add( particle );
	}
	// lines
	for (var i = 0; i < 300; i++) {
		var geometry = new THREE.Geometry();
		var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
		vertex.normalize();
		vertex.multiplyScalar( 450 );
		geometry.vertices.push( vertex );
		var vertex2 = vertex.clone();
		vertex2.multiplyScalar( Math.random() * 0.3 + 1 );
		geometry.vertices.push( vertex2 );
		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
		scene.add( line );
	}
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'sumsubmit', onWindowSubmit, false);
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart( event ) {
	if ( event.touches.length > 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}
function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}
