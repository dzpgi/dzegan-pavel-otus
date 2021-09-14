import { Component, OnInit } from '@angular/core';

import { ContextService } from '../../context.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  verificationTimes: Record<string, string>[] = [
    { code: '30000',  name: '30 сек.' },
    { code: '60000',  name: '1 мин.'  },
    { code: '120000', name: '2 мин.'  },
  ]
  verificationTime = this.ctx.verificationTime
  verificationTextCount = this.ctx.verificationTextCount

  constructor(private ctx: ContextService) { }

  ngOnInit(): void { }

  setVerificationTextCount(): void {
    this.ctx.verificationTextCount = this.verificationTextCount ? this.verificationTextCount: 1
  }

  setVerificationTime(value: string): void {
    value = value? value: '0'
    this.verificationTime = +value
    this.ctx.verificationTime = +value
  }
}
