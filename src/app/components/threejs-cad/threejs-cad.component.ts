import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs-cad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './threejs-cad.component.html',
  styleUrl: './threejs-cad.component.css'
})
export class ThreejsCadComponent implements AfterViewInit {

  @ViewChild('rendererCanvas', { static: true }) rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private nodes: THREE.Mesh[] = [];

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
    this.renderer.domElement.addEventListener('click', this.onCanvasClick.bind(this));
  }

  private initScene(): void {
    const width = this.rendererCanvas.nativeElement.clientWidth;
    const height = this.rendererCanvas.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.rendererCanvas.nativeElement, antialias: true });
    this.renderer.setSize(width, height);

    this.scene.add(new THREE.AmbientLight(0xffffff));

    const grid = new THREE.GridHelper(20, 20);
    this.scene.add(grid);
  }

  private onCanvasClick(event: MouseEvent): void {
    const rect = this.rendererCanvas.nativeElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.mouse.set(x, y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.nodes);
    if (intersects.length > 0) {
      const selected = intersects[0].object as THREE.Mesh;
      selected.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      console.log('Selected node at:', selected.position);
      return;
    }

    const point = new THREE.Vector3();
    this.raycaster.ray.at(5, point);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    sphere.position.copy(point);
    this.scene.add(sphere);
    this.nodes.push(sphere);

    console.log('Added node at:', point);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
