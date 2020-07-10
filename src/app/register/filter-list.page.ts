import { Component, Input, OnInit } from '@angular/core';

import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'filter-list-page',
  templateUrl: './filter-list.page.html',
})
export class FilterListPage  implements OnInit{

   //option: number;

   @Input() filterList: any = [];

   //Input() cunit_entityEl: any;
  
   //itemSelected : any;

  constructor(private popover:PopoverController) {}

  async closePopover(itemSelected) {
    //const onClosedData: string = "Wrapped Up!";
    await this.popover.dismiss(itemSelected);

    //this.popover.dismiss();

  }

  public ngOnInit(): void {

    //this.cunit_entityEl.setFocus();

    console.log("filterList popover",this.filterList);
   
  }

  selectItemObj(itemObj){
    console.log("itemObj popover",itemObj);
    this.closePopover(itemObj);
  }


}