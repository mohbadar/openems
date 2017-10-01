import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractSection, SvgSquarePosition, SvgSquare, CircleDirection, Circle } from './abstractsection.component';
import { Observable } from "rxjs/Rx";


let pulsetime = 1000;
let pulsetimedown = 2000;

@Component({
    selector: '[storagesection]',
    templateUrl: './section.component.html',
    animations: [
        trigger('circle', [
            state('one', style({
                r: 7,
                fill: 'none',
                stroke: 'white'
            })),
            state('two', style({
                r: 7,
                fill: 'none',
                stroke: '#009846'
            })),
            state('three', style({
                r: 7,
                fill: 'none',
                stroke: 'none'
            })),
            transition('one => two', animate(pulsetime + 'ms')),
            transition('two => one', animate(pulsetime + 'ms'))
        ])
    ]
})
export class StorageSectionComponent extends AbstractSection implements OnInit {

    constructor(translate: TranslateService) {
        super('Device.Overview.Energymonitor.Storage', 136, 224, "#009846", translate);
    }

    ngOnInit() {
        Observable.interval(pulsetimedown)
            .subscribe(x => {
                if (this.lastValue.absolute > 0) {
                    for (let i = 0; i < this.circles.length; i++) {
                        setTimeout(() => {
                            this.circles[this.circles.length - i - 1].switchState();
                        }, pulsetime / 4 * i);
                    }
                } else if (this.lastValue.absolute == 0) {
                    for (let i = 0; i < this.circles.length; i++) {
                        this.circles[i].hide();
                    }
                } else {
                    for (let i = 0; i < this.circles.length; i++) {
                        setTimeout(() => {
                            this.circles[i].switchState();
                        })
                    }
                }
            })
    }

    public updateStorageValue(chargeAbsolute: number, dischargeAbsolute: number, ratio: number) {
        if (chargeAbsolute != null && chargeAbsolute > 0) {
            this.name = "Speicher-Beladung" //TODO translate
            super.updateValue(chargeAbsolute, ratio);
        } else {
            this.name = "Speicher-Entladung" //TODO translate
            super.updateValue(dischargeAbsolute, ratio);
        }
    }

    protected getCircleDirection(): CircleDirection {
        return new CircleDirection("down");
    }

    protected getSquarePosition(square: SvgSquare, innerRadius: number): SvgSquarePosition {
        let x = (square.length / 2) * (-1);
        let y = innerRadius - 5 - square.length;
        return new SvgSquarePosition(x, y);
    }

    protected getImagePath(): string {
        return "storage.png";
    }

    protected getValueText(value: number): string {
        if (value == null || Number.isNaN(value)) {
            return this.translate.instant('NoValue');
        }

        return this.lastValue.absolute + " W";
    }
}