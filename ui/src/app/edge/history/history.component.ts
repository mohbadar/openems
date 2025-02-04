import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Edge, Service, Widgets } from '../../shared/shared';

@Component({
  selector: 'history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

  // is a Timedata service available, i.e. can historic data be queried.
  public isTimedataAvailable: boolean = true;

  // sets the height for a chart. This is recalculated on every window resize.
  public socChartHeight: string = "250px";
  public energyChartHeight: string = "250px";

  // holds the Widgets
  public widgets: Widgets = null;

  // holds the current Edge
  protected edge: Edge = null;

  constructor(
    public service: Service,
    public translate: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.service.setCurrentComponent('', this.route).then(edge => {
      this.edge = edge;
    });
    this.service.getConfig().then(config => {
      this.widgets = config.widgets;
      // Are we connected to OpenEMS Edge and is a timedata service available?
      if (environment.backend == 'OpenEMS Edge'
        && config.getComponentsImplementingNature('io.openems.edge.timedata.api.Timedata').filter(c => c.isEnabled).length == 0) {
        this.isTimedataAvailable = false;
      }
    });
  }

  updateOnWindowResize() {
    let ref = /* fix proportions */ Math.min(window.innerHeight - 150,
      /* handle grid breakpoints */(window.innerWidth < 768 ? window.innerWidth - 150 : window.innerWidth - 400));
    this.socChartHeight =
      /* minimum size */ Math.max(150,
      /* maximium size */ Math.min(200, ref)
    ) + "px";
    this.energyChartHeight =
      /* minimum size */ Math.max(300,
      /* maximium size */ Math.min(600, ref)
    ) + "px";
  }
}
