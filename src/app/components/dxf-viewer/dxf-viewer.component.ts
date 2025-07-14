import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import DxfParser from 'dxf-parser';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { DxfviewerService } from '../../shared/services/dxfviewer.service';

@Component({
  selector: 'app-dxf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './dxf-viewer.component.html',
  styleUrl: './dxf-viewer.component.css'
})
export class DxfViewerComponent {
    @ViewChild('viewerCanvas', { static: true }) viewerCanvas!: ElementRef<HTMLCanvasElement>;

    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    
    dxfService = inject(DxfviewerService)
 
    constructor() {
        this.scene = new THREE.Scene();
    }
 
    // ngOnInit(): void {
    //     this.dxfService.getDxfFile().subscribe({
    //         next: (data) =>{
    //             this.initThree();
    //             this.parseAndRenderDXF(data);
    //         },
    //         error: (err) => {
    //             console.error('Error loading DXF file:', err);
    //         },
    //     })
    // }
  
    
    ngAfterViewInit(): void {
      this.initThree();
    }
  
    private initThree(): void {
        const canvas = this.viewerCanvas.nativeElement;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    
           // Set scene background color to light grey
        this.scene.background = new THREE.Color(0xd3d3d3)

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.camera.position.set(0, 0, 10);
        this.camera.position.z = 5;
        this.camera.position.set(0, 0, 100); // Adjust as needed
        
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.update();
    
        // Add light
        // const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        const light = new THREE.AmbientLight(0x404040); 
        this.scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
  
    onFileSelected(): void {
    //   const input = event.target as HTMLInputElement;
    //   if (!input.files || input.files.length === 0) return;
  
    //   const file = input.files[0];
    //   const reader = new FileReader();
  
    //   reader.onload = () => {
    //     const dxfContent = reader.result as string;
    //     this.parseAndRenderDXF(dxfContent);
    //   };
  
    //   reader.readAsText(file);
        this.dxfService.getDxfFile().subscribe({
            next: (data) =>{
                this.parseAndRenderDXF(data);
            },
            error: (err) => {
                console.error('Error loading DXF file:', err);
            },
        })
    }
  
    private parseAndRenderDXF(dxfContent: string): void {
        try {
            const dxfParser = new DxfParser();
            const parsedDXF = dxfParser.parseSync(dxfContent);
    
            // Convert DXF to Three.js objects
            const dxfScene = this.createThreeSceneFromDXF(parsedDXF);
            console.log(dxfScene);
            // Add the parsed DXF scene to the main scene
            this.scene.add(dxfScene);
            this.adjustCamera(dxfScene);
            // Render the scene
            this.animate();
    
            // Export as glTF
            // this.exportToGLTF(dxfScene);
        } catch (error) {
            console.error('Error parsing DXF:', error);
        }
    }
  
    private createThreeSceneFromDXF(parsedDXF: any): THREE.Group {
        const dxfGroup = new THREE.Group();

        for (const entity of parsedDXF.entities) {
            if (entity.type === 'LINE' && entity.vertices.length >= 2) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(entity.vertices[0].x, entity.vertices[0].y, 0),
                    new THREE.Vector3(entity.vertices[1].x, entity.vertices[1].y, 0),
                ]);

                const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
                const line = new THREE.Line(geometry, material);
                dxfGroup.add(line);
            } else {
                console.warn(`Unsupported entity type: ${entity.type}`);
            }
        }
        // // Compute the bounding box
        // const boundingBox = new THREE.Box3().setFromObject(dxfGroup);
        // const center = new THREE.Vector3();
        // boundingBox.getCenter(center);

        // Center the group
        // dxfGroup.position.set(-center.x, -center.y, -center.z);

        // Optional: Scale the group if needed

        dxfGroup.scale.set(0.1, 0.1, 0.1); // Scale down large DXF files
        return dxfGroup;


        
    }
    
    private adjustCamera(dxfGroup: THREE.Group): void {
        const boundingBox = new THREE.Box3().setFromObject(dxfGroup);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
    
        // Position the camera to fit the content
        const maxDimension = Math.max(size.x, size.y, size.z);
        this.camera.position.z = maxDimension * 2; // Adjust distance based on size
        this.camera.lookAt(0, 0, 0);
    
        // Update camera and controls (if using OrbitControls)
        this.camera.updateProjectionMatrix();
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
  
    private exportToGLTF(dxfScene: THREE.Group): void {
        const exporter = new GLTFExporter();
      
        // Create a new scene to hold the dxfScene
        const scene = new THREE.Scene();
        scene.add(dxfScene);
      
        exporter.parse(
          scene,
          (gltf) => {
            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
      
            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'model.gltf';
            a.click();
            URL.revokeObjectURL(url);
          },
          (error) => {
            console.error('Error exporting to glTF:', error);
          }
        );
      }
}
