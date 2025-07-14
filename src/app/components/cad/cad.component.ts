import { Component, ElementRef, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import * as THREE from 'three';
// import { PyscriptLoaderService } from '../../shared/services/pyscript-loader.service';

@Component({
  selector: 'app-cad',
  standalone: true,
  imports: [],
  templateUrl: './cad.component.html',
  styleUrl: './cad.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CadComponent implements OnInit {
  @ViewChild('canvasContainer', { static: true }) canvasRef!: ElementRef;
  
  // py = inject(PyscriptLoaderService)
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private points: THREE.Vector3[] = [];

  async ngOnInit() {
    // await this.py.loadPyScript();
    this.initThree();
    this.animate();
    this.listenForSquare();
  }

  initThree() {
    const width = 600;
    const height = 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener('click', (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5).unproject(this.camera);

      this.points.push(vector);

      if (this.points.length === 2) {
        this.drawLine(this.points[0], this.points[1]);

        // Send points to PyScript
        const coords = JSON.stringify([
          { x: this.points[0].x, y: this.points[0].y },
          { x: this.points[1].x, y: this.points[1].y },
        ]);
        (document.getElementById('input-coords') as any).value = coords;
        console.log("Click>>");
        (document.getElementById('generate-square') as any).click();
        this.points = [];
      }
    });
  }

  drawLine(p1: THREE.Vector3, p2: THREE.Vector3) {
    const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  listenForSquare(){
    document.addEventListener('squareGenerated', (ev: any) => {
      const { x, y, side } = ev.detail;

      const p1 = new THREE.Vector3(x, y, 0);
      const p2 = new THREE.Vector3(x + side, y, 0);
      const p3 = new THREE.Vector3(x + side, y - side, 0);
      const p4 = new THREE.Vector3(x, y - side, 0);

      const squarePoints = [p1, p2, p3, p4, p1];
      const squareGeometry = new THREE.BufferGeometry().setFromPoints(squarePoints);
      const squareMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const square = new THREE.Line(squareGeometry, squareMaterial);
      this.scene.add(square);
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };  

  xxx(){
    console.log("lalalla");
  }
}
