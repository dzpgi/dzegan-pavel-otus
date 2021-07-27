import { Component, OnInit } from '@angular/core';
import {LanguageService} from './language.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private service: LanguageService) { }

    pageName: string = 'verification'
    toPage(name: string): void {
        this.pageName = name
    }


    // Страница проверки знаний
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

    ngOnInit(): void {
        this.loadLanguages()
        this.loadDictionary()
    }
    async loadLanguages(): Promise<void> {
        const result = await this.service.getLanguages()
        this.languages = result
    }
    async loadDictionary(): Promise<void> {
        const result = await this.service.getDictionary()
        this.dictionary = result
    }
    async checkTranslate(): Promise<void> {
        this.userTextCorrectly = null
        const result = await this.service.checkText(this.sysLanguage, this.sysText, this.userLanguage, this.userText)
        this.userTextCorrectly = result
        this.verificationTextIndex = result? this.verificationTextIndex + 1: this.verificationTextIndex
        this.refreshSysText()
    }
    setSysLanguage(value: string): void {
        value = value? value: ''
        this.sysLanguage = value
        this.refreshSysText()
    }
    setUserLanguage(value: string): void {
        value = value? value: ''
        this.userLanguage = value
    }
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
    runVerification(): void {
        this.refreshSysText()
        this.userText = ''
        this.timeOutAction(this)
    }
    timeOutAction(cmp: AppComponent): void {
        if ((cmp.remainingTime && cmp.remainingTime >= cmp.verificationTime) || (cmp.verificationTextIndex >= cmp.verificationTextCount)) {
            cmp.remainingTime = null
            cmp.verificationStartTime = null
            cmp.sysText = ''
            cmp.userText = ''
            cmp.userTextCorrectly = null
            cmp.verificationTextIndex = 0
            return
        }
        cmp.verificationStartTime = cmp.verificationStartTime? cmp.verificationStartTime: Date.now()
        cmp.remainingTime = Date.now() - cmp.verificationStartTime
        cmp.verificationPercent = Math.trunc((cmp.remainingTime/cmp.verificationTime)*100)
        setTimeout(cmp.timeOutAction, 1000, cmp);
    }

    // Страница добавления слов (история)
    newSysLanguage: string = 'eng'
    newUserLanguage: string = 'rus'
    newSysText: string = ''
    newUserText: string = ''

    setNewSysLanguage(value: string): void {
        value = value? value: ''
        this.newSysLanguage = value
    }
    setNewUserLanguage(value: string): void {
        value = value? value: ''
        this.newUserLanguage = value
    }
    changeNewSysText(event: Event): void {
        this.newSysText = (event.target as HTMLInputElement).value
    }
    changeNewUserText(event: Event): void {
        this.newUserText = (event.target as HTMLInputElement).value
    }
    async applyNewText(): Promise<void> {
        const result = await this.service.applyNewText(this.newSysLanguage, this.newSysText, this.newUserLanguage, this.newUserText)
        if (!result) alert('Не удалось сохранить слово в справочнике!')
        this.loadDictionary()
    }

    //Страница настроек
    verificationTimes: Record<string, string>[] = [
        { code: '30000',  name: '30 сек.' },
        { code: '60000',  name: '1 мин.'  },
        { code: '120000', name: '2 мин.'  },
    ]
    verificationTime: number = 60000
    verificationTextCount: number = 3
    verificationTextIndex: number = 0

    setVerificationTextCount(event: Event): void {
        this.verificationTextCount = +(event.target as HTMLInputElement).value
    }
    setVerificationTime(value: string): void {
        value = value? value: '0'
        this.verificationTime = +value
    }
}
