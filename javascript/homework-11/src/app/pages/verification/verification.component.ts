import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { fromEvent, from, interval } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { LanguageService } from '../../language.service'
import { ContextService } from '../../context.service'


@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  languages: Record<string, string>[] = []
  dictionary: any[] = []
  sysLanguage: string = 'eng'
  userLanguage: string = 'rus'
  sysText: string = ''
  userText: string = ''
  userTextCorrectly: boolean|undefined|null
  remainingTime: number|null = null
  verificationStartTime: number|null = null
  verificationPercent: number|null = null
  verificationTextIndex: number = 0
  verificationTextCount = this.ctx.verificationTextCount
  verificationTime = this.ctx.verificationTime
  loading = true
  @ViewChild('translateBtn') translateBtn!: ElementRef<HTMLElement>

  constructor(private service: LanguageService, private ctx: ContextService) { }

  ngOnInit(): void {
    const me = this
    me.loadLanguages()
    me.loadDictionary()
  }

  ngAfterViewInit(){
    // Отслеживаем поток кликов по кнопке "Проверить"
    // Получить результат последнего нажатия
    const me = this
    fromEvent(me.translateBtn.nativeElement, 'click').pipe(
      switchMap(function() {
        return from(me.service.checkText(me.sysLanguage, me.sysText, me.userLanguage, me.userText))
      })
    )
    .subscribe(function(result) {
      me.userTextCorrectly = result
      me.verificationTextIndex = result? me.verificationTextIndex + 1: me.verificationTextIndex
      me.refreshSysText()
    })
  }

  // Загрузка доступных языков
  async loadLanguages(): Promise<void> {
    const result = this.ctx.languages && this.ctx.languages.length > 0 ? this.ctx.languages : await this.service.getLanguages()
    this.languages = result
    this.ctx.languages = result
  }

  // Загрузка полного словаря всех слов (для проверки)
  async loadDictionary(): Promise<void> {
    const result = await this.service.getDictionary()
    this.dictionary = result
    this.loading = false
  }

  // Обновить проверяемое словов на новое
  refreshSysText(): void {
    let result = this.sysText
    while (this.sysText === result) {
      let index  = Math.floor(Math.random()*this.dictionary.length)
      result = this.dictionary[index][this.sysLanguage]
    }
    this.sysText = result
  }

  changeUserText(event: Event): void {
    this.userText = (event.target as HTMLInputElement).value
  }

  // Запуск проверки слов на время
  runVerification(): void {
    const me = this
    me.refreshSysText()
    const limit = me.verificationTime/1000
    const stream$ = interval(1000)
    .subscribe(function(sec) {
      if (sec+1>=limit || me.verificationTextIndex >= me.verificationTextCount) {
        stream$.unsubscribe()
        me.remainingTime = null
        me.verificationStartTime = null
        me.sysText = ''
        me.userText = ''
        me.userTextCorrectly = null
        me.verificationTextIndex = 0
        return
      }
      me.verificationStartTime = me.verificationStartTime? me.verificationStartTime: Date.now()
      me.remainingTime = Date.now() - me.verificationStartTime
      me.verificationPercent = Math.trunc((me.remainingTime/me.verificationTime)*100)
    })
  }

}
