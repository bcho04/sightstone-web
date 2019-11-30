import React from "react";
import * as THREE from "three";

var mouseX = 0
var mouseY = 0;
var camera, scene, renderer;

class Background extends React.Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentTouchStart = this.onDocumentTouchStart.bind(this);
        this.onDocumentTouchMove = this.onDocumentTouchMove.bind(this);
        this.renderCamera = this.renderCamera.bind(this);
    }

    componentDidMount() {
        this.init();
        this.animate();
    }

    init() {
        var particle;
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("background").appendChild( renderer.domElement );
        // background
        scene.background = new THREE.Color( 0xffffff )
        // particles
        var PI2 = Math.PI * 2;
        var material = new THREE.SpriteMaterial( {
            color: 0x000000,
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
            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: Math.random() } ) );
            scene.add( line );
        }
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );

        window.addEventListener( 'resize', this.onWindowResize, false ); 
    }

    onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    //
    onDocumentMouseMove(event) {
        mouseX = event.clientX - window.innerWidth/2;
        mouseY = event.clientY - window.innerHeight/2;
    }
    onDocumentTouchStart( event ) {
        if ( event.touches.length > 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - window.innerWidth/2;
            mouseY = event.touches[ 0 ].pageY - window.innerHeight/2;
        }
    }
    onDocumentTouchMove( event ) {
        if ( event.touches.length == 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - window.innerWidth/2;
            mouseY = event.touches[ 0 ].pageY - window.innerHeight/2;
        }
    }

    animate() {
        requestAnimationFrame( this.animate );
	    this.renderCamera();
    }

    renderCamera() {
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }

    render() {
        return (
            <div ref={ref => (this.el = ref)} />
        );
    }
}

export default Background;