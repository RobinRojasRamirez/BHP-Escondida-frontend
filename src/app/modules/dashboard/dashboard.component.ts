import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  safeUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) {
  }


  async ngOnInit(): Promise<void> {

    console.log("DashboardComponent");


    const url = 'https://www.genesys-global.com/?gad_source=1&gclid=Cj0KCQiA_Yq-BhC9ARIsAA6fbAiG90sJOpMoNycFlKnondqucs06C4vAjsRXsvB00ubCk2XlLG5U5H4aArNWEALw_wcB';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  

}
