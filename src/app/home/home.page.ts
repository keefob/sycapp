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

    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const centity = params['centity'];
      localStorage.setItem("centity", centity);
      console.log("se setea centity = "+centity);
    });

  }

}
