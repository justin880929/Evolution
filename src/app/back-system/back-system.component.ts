import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-back-system',
  templateUrl: './back-system.component.html',
  styleUrls: ['./back-system.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BackSystemComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadScript('assets/BackSystem/js/config.js');
    this.loadScript('assets/BackSystem/js/helpers.js');
    this.loadScript('assets/BackSystem/js/jquery/jquery.js');
    this.loadScript('assets/BackSystem/js/popper/popper.js');
    this.loadScript('assets/BackSystem/js/bootstrap.js');
    this.loadScript('assets/BackSystem/libs/perfect-scrollbar/perfect-scrollbar.js');
    this.loadScript('assets/BackSystem/js/menu.js');
    this.loadScript('assets/BackSystem/libs/apex-charts/apexcharts.js');
    this.loadScript('assets/BackSystem/js/main.js');
    this.loadScript('assets/BackSystem/js/dashboards-analytics.js');
  }

  loadScript(src: string): void {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.defer = true;
    this.renderer.appendChild(document.body, script);
  }
}
