import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    code: string = ''
    records: Record<string, string>[] = []

    @Input() set data(value: Record<string, string>[]) {
        if (value) this.records = value
    }
    @Input() set value(value: string) {
        if (value) this.code = value
    }

    @Output('changed') changeEmitter = new EventEmitter<string>()

    constructor() { }

    ngOnInit(): void { }

    onChangeValue(event: Event): void {
        if (!event || !event.target) return
        this.changeEmitter.emit((event.target as HTMLInputElement).value)
    }

}
