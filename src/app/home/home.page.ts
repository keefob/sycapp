import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {

    let centity = "6";
      localStorage.setItem("centity", centity);
      console.log("se setea centity = "+centity);
      
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      //const centity = params['centity'];
      
    });

    this.activatedRoute.queryParams.subscribe(params => {
        if(params['centity']){
          localStorage.setItem("centity", params['centity']);
        }        
        console.log("recibió parámetro",localStorage.getItem("centity"));
    });

  }

}
